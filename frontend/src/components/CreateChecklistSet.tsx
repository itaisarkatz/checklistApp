import React from 'react';

const CreateChecklistSet: React.FC = () => {
  const handleCreate = () => {
    // For now, we'll just log a message.
    // In the future, this will make an API call to the backend.
    console.log('Creating a new checklist set...');
  };

  return (
    <div className="create-checklist-set">
      <button onClick={handleCreate}>Create New Checklist Set</button>
    </div>
  );
};

export default CreateChecklistSet;
