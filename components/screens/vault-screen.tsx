"use client";

import React, { useState, useRef } from "react";
import { useStore } from "@/lib/storage";
import {
  FileText,
  Upload,
  Search,
  Trash2,
  FolderLock,
  X,
  FileCheck,
  Download,
  Eye,
} from "lucide-react";

// Local Type Definition to prevent any storage import mismatches
export interface VaultDoc {
  id: string;
  name: string;
  category: string;
  size: string;
}

export function VaultScreen() {
  const { documents, addDocument, deleteDocument } = useStore();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<VaultDoc | null>(null);

  // Store actual readable file URLs mapped by document name/id
  const [fileUrls, setFileUrls] = useState<Record<string, string>>({});

  // Form states for upload modal
  const [docName, setDocName] = useState("");
  const [docCategory, setDocCategory] = useState("Certificates");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setDocName(file.name);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    const formattedSize = selectedFile
      ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
      : "1.2 MB";

    const fileObjectURL = selectedFile ? URL.createObjectURL(selectedFile) : null;

    addDocument({
      name: docName,
      category: docCategory,
      size: formattedSize,
    });

    if (fileObjectURL) {
      setFileUrls((prev) => ({
        ...prev,
        [docName]: fileObjectURL,
      }));
    }

    setDocName("");
    setSelectedFile(null);
    setIsUploadModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full justify-between px-5 pt-12 pb-24 text-white bg-[#0D0B14] overflow-y-auto no-scrollbar">
      {/* Top Container Area */}
      <div className="flex flex-col flex-1 min-h-0 space-y-4">
        {/* Header */}
        <header className="flex items-center justify-between pb-3 pt-1 border-b border-gray-800/65 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 p-0.5 border border-purple-400/40 shadow-lg shadow-purple-900/40 flex items-center justify-center flex-shrink-0">
              <div className="w-full h-full rounded-[14px] bg-purple-950 flex items-center justify-center">
                <FolderLock className="w-5 h-5 text-purple-300" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Secure Vault</h1>
              <p className="text-xs text-gray-400">
                {documents.length} files securely stored
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white shadow-md shadow-purple-900/40 transition-all active:scale-95"
          >
            <Upload className="w-3.5 h-3.5" /> Upload
          </button>
        </header>

        {/* Search Bar */}
        <div className="relative flex-shrink-0">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#161322] border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-purple-500 transition-all"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 flex-shrink-0">
          {["All", "Certificates", "Resume", "Personal"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-[#181524] text-gray-400 border border-gray-800 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Document List */}
        <div className="flex-1 space-y-2.5 overflow-y-auto no-scrollbar py-1">
          {filteredDocs.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-xs">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-40 text-gray-400" />
              No documents found. Click Upload to add one!
            </div>
          ) : (
            filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#161322] border border-gray-800/80 shadow-sm hover:border-purple-500/40 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400 flex-shrink-0">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-white truncate">
                      {doc.name}
                    </h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {doc.category} · {doc.size}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setPreviewDoc(doc as VaultDoc)}
                    className="p-2 rounded-xl text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 transition-colors"
                    title="Preview file"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const url = fileUrls[doc.name] || fileUrls[doc.id];
                      if (url) {
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = doc.name;
                        a.click();
                      } else {
                        alert(`Downloading ${doc.name}...`);
                      }
                    }}
                    className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                    title="Download file"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteDocument(doc.id)}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- PREVIEW DOCUMENT MODAL --- */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[999] flex items-center justify-center p-4">
          <div className="bg-[#181524] border border-purple-900/50 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <div className="min-w-0">
                <h3 className="font-bold text-sm truncate">{previewDoc.name}</h3>
                <p className="text-[10px] text-gray-400">
                  Category: {previewDoc.category} · Size: {previewDoc.size}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="text-gray-400 hover:text-white flex-shrink-0 ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* In-App Live Reader / Viewer Window */}
            <div className="w-full h-72 rounded-xl bg-[#121019] border border-gray-800 flex flex-col items-center justify-center overflow-hidden relative">
              {fileUrls[previewDoc.name] || fileUrls[previewDoc.id] ? (
                previewDoc.name.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
                  <img
                    src={fileUrls[previewDoc.name] || fileUrls[previewDoc.id]}
                    alt={previewDoc.name}
                    className="w-full h-full object-contain bg-black/50"
                  />
                ) : (
                  <iframe
                    src={fileUrls[previewDoc.name] || fileUrls[previewDoc.id]}
                    title={previewDoc.name}
                    className="w-full h-full bg-white border-0"
                  />
                )
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <FileText className="w-12 h-12 text-purple-400 opacity-80" />
                  <div>
                    <p className="text-xs font-semibold text-white">
                      {previewDoc.name}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      Sample preview. Upload this file from your device to view its contents directly in-app.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="flex-1 bg-gray-800 text-gray-300 py-2.5 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const url = fileUrls[previewDoc.name] || fileUrls[previewDoc.id];
                  if (url) {
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = previewDoc.name;
                    a.click();
                  } else {
                    alert(`Downloading ${previewDoc.name}...`);
                  }
                  setPreviewDoc(null);
                }}
                className="flex-1 bg-purple-600 text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-purple-500 transition-colors shadow-md shadow-purple-900/40 flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- UPLOAD DOCUMENT MODAL --- */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[999] flex items-center justify-center p-4">
          <div className="bg-[#181524] border border-purple-900/50 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <h3 className="font-bold text-sm">Upload Document</h3>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-4 rounded-xl border-2 border-dashed border-purple-500/40 bg-[#0D0B14] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-purple-400 transition-all"
              >
                <Upload className="w-6 h-6 text-purple-400" />
                <span className="text-xs text-purple-300 font-medium text-center">
                  {selectedFile
                    ? `Selected: ${selectedFile.name}`
                    : "Tap to select file from device"}
                </span>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Document Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Certificate.pdf"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full bg-[#0D0B14] border border-gray-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Category
                </label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value)}
                  className="w-full bg-[#0D0B14] border border-gray-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="Certificates">Certificates</option>
                  <option value="Resume">Resume</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 bg-gray-800 text-gray-300 py-2.5 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-purple-500 transition-colors shadow-md shadow-purple-900/40"
                >
                  Upload File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}