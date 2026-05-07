'use client';

import { useRef, useState } from "react";

export default function AiUploadZone({ onFileSelect, loading, fileName }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) onFileSelect(file);
  };

  return (
    <div
      onClick={() => !loading && inputRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className="rounded-xl p-10 text-center cursor-pointer transition-all mb-6"
      style={{
        border: `2px dashed ${dragging ? '#c9b479' : '#e2d5a0'}`,
        backgroundColor: dragging ? '#faf3e0' : 'white',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={handleChange}
        className="hidden"
      />

      {loading ? (
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2"
            style={{ borderColor: '#c9b479' }} />
          <p className="text-sm font-medium" style={{ color: '#c9b479' }}>
            Analyse en cours avec Gemini...
          </p>
          {fileName && (
            <p className="text-xs text-slate-400">{fileName}</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#f3edd6' }}>
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#c9b479" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">
              Upload your cahier des charges
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Drag & drop or click to browse
            </p>
          </div>
          <div className="flex gap-2 mt-1">
            {['PDF', 'DOCX', 'TXT'].map(f => (
              <span key={f} className="text-xs font-medium px-3 py-1 rounded-full"
                style={{ backgroundColor: '#f3edd6', color: '#a08c4a', border: '1px solid #e2d5a0' }}>
                {f}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}