"use client"
import { useState, useRef } from "react";

export default function UploadForm() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [collectionName, setCollectionName] = useState('');
  const fileInputRef = useRef(null);

  const addFiles = (newFiles) => {
    const incoming = Array.from(newFiles || []);
    const merged = [...files];
    for (const f of incoming) {
      if (!merged.some((m) => m.name === f.name && m.size === f.size)) merged.push(f);
    }
    setFiles(merged);
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
    <form className="w-full h-full mt-0 bg-white rounded-lg shadow-sm  flex flex-col justify-between">
      <div className="p-4 space-y-4">
        <h3 className="text-xl font-semibold mb-0">Upload Research Paper</h3>
        <p className="text-sm text-gray-600">Select PDF(s) below, enter a collection name, then click Upload &amp; Index.</p>

        <div
          className={`upload-dropzone border-2 rounded-lg p-6 mb-2 flex flex-col items-center justify-center text-center transition-colors ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-dashed border-gray-200 bg-white'}`}
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

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
            </div>
            <div>
              <div className="text-sm font-medium">Click to upload PDF or drag and drop</div>
              <div className="text-xs text-gray-500 mt-2">Only PDF files are accepted. Selected files will be uploaded when you click Upload & Index.</div>
            </div>
          </div>
        </div>

        {files.length > 0 && (
          <div className="file-list mb-2">
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

        <div className="mb-2">
          <label className="block text-sm font-medium mb-2">Qdrant collection name</label>
          <div className="flex items-center gap-3">
            <input
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              className="flex-1 border rounded px-2 py-1 text-sm"
              placeholder="Collection name"
              aria-label="Qdrant collection name"
            />
            <button
              type="button"
              onClick={() => uploadFiles(files)}
              disabled={loading || !collectionName || files.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      </div>

      <div className="border-t p-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">{loading ? 'Uploading...' : 'Ready'}</div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setFiles([]);
                setCollectionName('');
                setResult(null);
              }}
              className="px-4 py-2 border rounded-full"
            >
              Reset
            </button>
          </div>
        </div>

        {result && (
          <div className="mt-4 bg-gray-50 p-3 rounded text-sm">
            <div className="font-medium mb-2">Result</div>
            <pre className="text-xs overflow-auto">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </form>
  );
}
