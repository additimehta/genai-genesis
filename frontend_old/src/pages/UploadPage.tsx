import React, { useState } from 'react';

function UploadPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
    }
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  // Handle drop event for drag and drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      setSelectedFiles(files);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setUploadStatus('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('files', file);
    });

    try {
      setUploadStatus('Uploading...');
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploadStatus('Files uploaded successfully!');
      } else {
        setUploadStatus('Upload failed. Try again.');
      }
    } catch (error) {
      setUploadStatus('Error uploading files.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50 relative overflow-hidden">
      {/* Your existing UI code */}
      <div className="max-w-4xl mx-auto pt-32 px-8 relative">
        <div className="bg-white/80 rounded-2xl p-12 shadow-lg shadow-sky-100/50 backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Upload Your Space Photos</h2>
          <p className="text-gray-600 mb-8">
            Take photos of the areas you'd like to assess for accessibility improvements. Include entrances, pathways, stairs, and any potential barriers.
          </p>

          {/* Drag and drop or file input */}
          <div
            className={`border-2 border-dashed ${isDragOver ? 'border-sky-400' : 'border-sky-200'} rounded-xl p-12 text-center`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <p className="text-gray-600 mb-4">Drag and drop your photos here, or click to select files</p>
            <button className="bg-sky-500 text-white px-8 py-3 rounded-full hover:bg-sky-600 transition-colors font-medium backdrop-blur-sm">
              <label htmlFor="file-input">Select Files</label>
            </button>
            <input
              id="file-input"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          {/* Preview selected files */}
          {selectedFiles.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Selected Photos:</h3>
              <div className="grid grid-cols-2 gap-4">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index}`}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <p className="text-center text-gray-600 text-sm mt-2">{file.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload status */}
          {uploadStatus && <p className="text-center mt-4 text-gray-800">{uploadStatus}</p>}

          {/* Done button */}
          {selectedFiles.length > 0 && (
            <div className="mt-8 text-center">
              <button
                className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors font-medium"
                onClick={handleUpload}
              >
                Upload
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadPage;
