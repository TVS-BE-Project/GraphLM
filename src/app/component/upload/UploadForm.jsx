"use client"
import { useState, useRef } from "react";

export default function UploadForm() {
  const [files, setFiles] = useState([]);
  const [texts, setTexts] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const addFiles = (newFiles) => {
    // merge and dedupe by name+size
    const incoming = Array.from(newFiles || []);
    const merged = [...files];
    for (const f of incoming) {
      if (!merged.some((m) => m.name === f.name && m.size === f.size)) merged.push(f);
    }
    setFiles(merged);
  };

  const onFileChange = (e) => addFiles(e.target.files);

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    addFiles(e.dataTransfer.files);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeFile = (idx) => setFiles((s) => s.filter((_, i) => i !== idx));

  const addText = () => setTexts((s) => [...s, ""]);
  const updateText = (idx, val) => setTexts((s) => s.map((t, i) => (i === idx ? val : t)));
  const removeText = (idx) => setTexts((s) => s.filter((_, i) => i !== idx));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append("files", f));
      texts.forEach((t) => fd.append("texts", t));

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      const json = await res.json();
      setResult(json);
    } catch (err) {
      setResult({ error: String(err) });
    } finally {
      setLoading(false);
    }
  };

  const humanFileSize = (size) => {
    if (size === 0) return "0 B";
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return `${(size / Math.pow(1024, i)).toFixed(1)} ${["B", "KB", "MB", "GB"][i]}`;
  };

  return (
    <form onSubmit={submit} className="upload-form max-w-3xl mt-6 p-6 bg-white rounded-xl shadow-md border">
      <h3 className="text-xl font-semibold mb-3">Upload PDFs & Inline Text</h3>
      <p className="text-sm text-gray-600 mb-4">Upload one or more PDF documents or paste text blocks to index into your vector store.</p>

      <div
        className={`upload-dropzone border-2 rounded-lg p-6 mb-4 flex flex-col items-center justify-center text-center transition-colors ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-dashed border-gray-200 bg-white'}`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') fileInputRef.current?.click(); }}
        aria-label="Upload PDF files"
      >
        <input
          ref={fileInputRef}
          type="file"
          name="files"
          multiple
          accept="application/pdf"
          onChange={onFileChange}
          className="sr-only"
        />

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
          </div>
          <div>
            <div className="text-sm font-medium">Drag & drop PDFs here or</div>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-1 text-sm text-blue-600 font-medium">choose files</button>
            <div className="text-xs text-gray-500 mt-2">Only PDF files are accepted. Max file size depends on server limits.</div>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="file-list mb-4">
          <h4 className="text-sm font-medium mb-2">Selected files</h4>
          <ul className="space-y-2">
            {files.map((f, i) => (
              <li key={`${f.name}-${f.size}`} className="file-item flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded text-sm font-medium">PDF</div>
                  <div>
                    <div className="text-sm font-medium">{f.name}</div>
                    <div className="text-xs text-gray-500">{humanFileSize(f.size)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => removeFile(i)} className="text-sm text-red-600">Remove</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Inline text blocks</h4>
        <div className="space-y-3">
          {texts.map((t, i) => (
            <div key={i} className="flex gap-2 items-start">
              <textarea
                value={t}
                onChange={(e) => updateText(i, e.target.value)}
                className="flex-1 border rounded p-3 text-sm min-h-[72px]"
                rows={3}
                placeholder="Paste text to index..."
              />
              <div className="flex flex-col gap-2">
                <button type="button" onClick={() => removeText(i)} className="text-sm text-red-600">Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2">
          <button type="button" onClick={addText} className="text-sm text-blue-600 font-medium">+ Add text block</button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button disabled={loading} className="primary-action inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 disabled:opacity-60">
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
              Indexing...
            </>
          ) : (
            <>Upload & Index</>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setFiles([]);
            setTexts([""]);
            setResult(null);
          }}
          className="secondary-action px-4 py-2 border rounded-full"
        >
          Reset
        </button>
      </div>

      {result && (
        <div className="mt-4 bg-gray-50 p-3 rounded text-sm">
          <div className="font-medium mb-2">Result</div>
          <pre className="text-xs overflow-auto">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </form>
  );
}
