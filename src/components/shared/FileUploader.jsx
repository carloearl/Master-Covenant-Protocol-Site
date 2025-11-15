import React from "react";
import { Upload } from "lucide-react";

export default function FileUploader({ 
  onFileSelect, 
  acceptedTypes = "image/*", 
  maxSize = 10, 
  currentFile = null,
  label = "Click to upload or drag and drop",
  fileTypes = "PNG, JPG"
}) {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(acceptedTypes.replace('*', '.*'))) {
      alert(`Please upload a valid ${fileTypes} file`);
      return;
    }

    if (file.size > maxSize * 1024 * 1024) {
      alert(`File must be under ${maxSize}MB`);
      return;
    }

    onFileSelect(file);
  };

  return (
    <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-blue-500/50 transition-colors cursor-pointer">
      <input
        type="file"
        accept={acceptedTypes}
        onChange={handleFileChange}
        className="hidden"
        id="file-uploader"
      />
      <label htmlFor="file-uploader" className="cursor-pointer">
        <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <p className="text-white">
          {currentFile ? currentFile.name : label}
        </p>
        <p className="text-sm text-gray-500 mt-2">{fileTypes} up to {maxSize}MB</p>
      </label>
    </div>
  );
}