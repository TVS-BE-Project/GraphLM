"use client"
import { useState, useRef } from "react";

export default function UploadForm() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [collectionName, setCollectionName] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);

  const addFiles = (newFiles) => {
    const incoming = Array.from(newFiles || []);
    const merged = [...files];
    for (const f of incoming) {
      if (!merged.some((m) => m.name === f.name && m.size === f.size)) merged.push(f);
    }
    setFiles(merged);
  };

  const previewFile = (file) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
  };

  const uploadFiles = async (fileList) => {
    const filesArr = Array.from(fileList || []);
    if (filesArr.length === 0) return;

    setLoading(true);
    setResult(null);
    try {
      const fd = new FormData();
      filesArr.forEach((f) => fd.append("files", f));
      if (collectionName) fd.append('collection', collectionName);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      setResult(json);
      // reflect uploaded files in UI
      addFiles(filesArr);
    } catch (err) {
      setResult({ error: String(err) });
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = (e) => {
    const fileList = e.target.files;
    // Just add files to the selected list; upload occurs when user clicks Upload
    addFiles(fileList);
  };

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

  const humanFileSize = (size) => {
    if (size === 0) return "0 B";
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return `${(size / Math.pow(1024, i)).toFixed(1)} ${["B", "KB", "MB", "GB"][i]}`;
  };

  return (
    <div className="w-full h-full flex flex-col">
      {showPreview ? (
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">PDF Preview</span>
            <button
              onClick={closePreview}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              Close Preview
            </button>
          </div>
          <iframe
            src={previewUrl}
            className="flex-1 w-full border border-gray-300 rounded"
            title="PDF Preview"
          />
        </div>
      ) : (
        <>
          <div
            className={`${result ? 'h-22' : 'h-48'} border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-white hover:border-gray-400'}`}
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
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center p-4">
          <div className="w-12 h-12 mb-2 text-gray-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <div className="text-gray-600">
            <div className="text-sm mb-1">Click to upload PDF or drag and drop</div>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="text-sm font-medium text-gray-700">Selected files:</div>
          {files.map((f, i) => (
            <div key={`${f.name}-${f.size}`} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
              <span className="flex-1 text-gray-700 truncate pr-2" title={f.name}>{f.name}</span>
              <button
                type="button"
                onClick={() => previewFile(f)}
                className="flex-shrink-0 text-blue-600 hover:text-blue-800 text-xs px-2 py-1 border border-blue-200 rounded mr-1"
              >
                Preview
              </button>
              <button 
                type="button" 
                onClick={() => removeFile(i)} 
                className="flex-shrink-0 text-red-500 hover:text-red-700 w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-4 space-y-3">
          <input
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            placeholder="Enter collection name"
            aria-label="Collection name"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => uploadFiles(files)}
              disabled={loading || !collectionName || files.length === 0}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {loading ? 'Uploading...' : 'Upload & Index'}
            </button>
            <button
              type="button"
              onClick={() => {
                setFiles([]);
                setCollectionName('');
                setResult(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-3 space-y-2">
          {result.qdrant && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded text-sm ${
              result.qdrant.status === 'ok' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                result.qdrant.status === 'ok' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="font-medium">Qdrant:</span> 
              <span>{result.qdrant.status === 'ok' ? `Added ${result.qdrant.added || 0} vectors` : 'Failed'}</span>
            </div>
          )}
          {result.neo4j && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded text-sm ${
              result.neo4j.status === 'ok' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                result.neo4j.status === 'ok' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="font-medium">Neo4j:</span> 
              <span>{result.neo4j.status === 'ok' ? `Added ${result.neo4j.nodesAdded || 0} nodes, ${result.neo4j.relationshipsAdded || 0} relationships` : 'Failed'}</span>
            </div>
          )}
          {result.error && (
            <div className="flex items-center gap-2 px-3 py-2 rounded text-sm bg-red-50 text-red-700 border border-red-200">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="font-medium">Error:</span> 
              <span>{result.error}</span>
            </div>
          )}
        </div>
      )}
        </>
      )}
    </div>
  );
}
