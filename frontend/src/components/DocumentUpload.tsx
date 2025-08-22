import React, { useState } from 'react';

interface DocumentUploadProps {
  setDocumentIds: (documentIds: number[]) => void;
  companyId: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ setDocumentIds, companyId }) => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<{ id: number; name: string }[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleUpload = async () => {
    setError(null);
    if (!files) {
      setError('Please select files to upload.');
      return;
    }
    if (!companyId) {
      setError('No company selected.');
      return;
    }
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('documents', files[i]);
      }
      formData.append('companyId', companyId);

      const response = await fetch('http://localhost:3001/api/documents', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const text = await response.text();
        setError(text || 'Upload failed.');
        return;
      }
      const data = await response.json();
      // Show uploaded files in a list (local only)
      const uploaded = Array.from(files).map((file, idx) => ({
        id: data.documentIds[idx],
        name: file.name,
      }));
      setUploadedDocs(prev => [...prev, ...uploaded]);
      setDocumentIds(data.documentIds);
      setFiles(null); // clear file input
    } catch (error) {
      setError('Error uploading documents.');
      console.error('Error uploading documents:', error);
    }
  };

  const handleRemove = (id: number) => {
    setUploadedDocs(docs => docs.filter(doc => doc.id !== id));
    setDocumentIds(uploadedDocs.filter(doc => doc.id !== id).map(doc => doc.id));
  };

  return (
    <div className="form-container">
      <h2>Upload Documents</h2>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      {uploadedDocs.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <strong>Uploaded Documents:</strong>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {uploadedDocs.map(doc => (
              <li key={doc.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ flex: 1 }}>{doc.name}</span>
                <button style={{ marginLeft: 8 }} onClick={() => handleRemove(doc.id)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;

