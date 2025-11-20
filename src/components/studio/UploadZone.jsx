import React, { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export default function UploadZone({ onUpload, loading }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFile(file);
    }
  };

  const handleFile = async (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, etc.)');
      return;
    }

    setError(null);
    try {
      await onUpload(file);
    } catch (err) {
      setError(err.message || 'Failed to upload image');
    }
  };

  const handleFileInput = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await handleFile(file);
    }
  };

  return (
    <Card 
      className="glass-royal border-cyan-500/30 p-12"
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className={`
        border-2 border-dashed rounded-xl p-16 text-center transition-all
        ${dragActive ? 'border-cyan-400 bg-cyan-500/10' : 'border-cyan-500/50 bg-cyan-900/10'}
        ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}>
        <Upload className={`w-20 h-20 mx-auto mb-6 ${dragActive ? 'text-cyan-400' : 'text-cyan-400'}`} />
        
        <h3 className="text-2xl font-bold text-white mb-3">
          {loading ? 'Uploading...' : 'Upload Your Image'}
        </h3>
        
        <p className="text-white/60 mb-6">
          Drag & drop an image here, or
        </p>
        
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-black font-bold px-8 py-3 rounded-lg shadow-lg shadow-cyan-500/50"
        >
          Choose File
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />

        {error && (
          <p className="mt-4 text-red-400 text-sm">{error}</p>
        )}

        <p className="text-white/40 text-xs mt-6">
          Supported formats: PNG, JPG, JPEG
        </p>
      </div>
    </Card>
  );
}