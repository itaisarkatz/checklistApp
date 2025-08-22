import React, { useState } from 'react';

interface DocumentUploadProps {
  questions: string[];
  conditions: string[];
  setChecklist: (checklist: any) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ questions, conditions, setChecklist }) => {
  const [files, setFiles] = useState<FileList | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('documents', files[i]);
    }
    formData.append('data', JSON.stringify({ questions, conditions }));

    try {
      const response = await fetch('http://localhost:3001/api/checklist', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setChecklist(data);
    } catch (error) {
      console.error('Error uploading documents:', error);
    }
  };

  return (
    <div className="form-container">
      <h2>Upload Documents</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" multiple onChange={handleFileChange} />
        <button type="submit">Generate Checklist</button>
      </form>
    </div>
  );
};

export default DocumentUpload;
