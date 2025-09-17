export const runtime = 'nodejs';

import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { OpenAIEmbeddings } from '@langchain/openai';
import { QdrantVectorStore } from '@langchain/qdrant';

// POST /api/upload
// Accepts multipart/form-data with fields:
// - files: one or more file inputs (PDFs)
// - texts: one or more text fields (plain text JSON or form fields)
// Also accepts application/json body with { texts: string[] }

export async function POST(req) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // Collect documents as objects: { pageContent: string, metadata: { source } }
    const docs = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();

      // Handle uploaded files (expecting input name "files")
      const fileEntries = formData.getAll('files');
      for (const file of fileEntries) {
        if (!file || !file.arrayBuffer) continue;
        const buffer = Buffer.from(await file.arrayBuffer());

        // Save uploaded PDF to a temp file and load with PDFLoader
        const tmpName = `${crypto.randomUUID()}-${file.name || 'upload.pdf'}`;
        const tmpPath = path.join(os.tmpdir(), tmpName);
        await fs.promises.writeFile(tmpPath, buffer);

        const loader = new PDFLoader(tmpPath);
        const rawDocs = await loader.load();

        // Ensure metadata includes source file name and push to docs
        for (const d of rawDocs) {
          d.metadata = d.metadata || {};
          d.metadata.source = file.name || d.metadata.source || 'uploaded.pdf';
          docs.push(d);
        }

        // Cleanup temp file
        try { await fs.promises.unlink(tmpPath); } catch (e) { /* ignore */ }
      }

      // Handle plain text fields (can be repeated) under the name "texts"
      const textEntries = formData.getAll('texts');
      for (const t of textEntries) {
        if (!t) continue;
        if (typeof t === 'string') {
          docs.push({ pageContent: t, metadata: { source: 'inline-text' } });
        }
      }
    } else if (contentType.includes('application/json')) {
      const body = await req.json();
      if (Array.isArray(body.texts)) {
        for (const t of body.texts) {
          if (typeof t === 'string') docs.push({ pageContent: t, metadata: { source: 'json-text' } });
        }
      } else if (typeof body.text === 'string') {
        docs.push({ pageContent: body.text, metadata: { source: 'json-text' } });
      }
    } else {
      return new Response(JSON.stringify({ error: 'Unsupported content-type' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    if (docs.length === 0) {
      return new Response(JSON.stringify({ error: 'No documents found in request' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Split documents into chunks
    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
    const splitDocs = await splitter.splitDocuments(docs);

    // Create embeddings
    const embeddings = new OpenAIEmbeddings({
      model: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small',
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    // Connect to Qdrant vector store
    const qdrantUrl = process.env.QDRANT_URL || process.env.NEXT_PUBLIC_QDRANT_URL;
    const qdrantCollection = process.env.QDRANT_COLLECTION || 'langchainjs-testing';
    const qdrantApiKey = process.env.QDRANT_API_KEY;

    if (!qdrantUrl) {
      return new Response(JSON.stringify({ error: 'QDRANT_URL not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
      url: qdrantUrl,
      collectionName: qdrantCollection,
      apiKey: qdrantApiKey,
    });

    await vectorStore.addDocuments(splitDocs);

    return new Response(JSON.stringify({ status: 'ok', added: splitDocs.length, collection: qdrantCollection }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('Indexing error', err);
    return new Response(JSON.stringify({ error: 'internal_error', message: String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
