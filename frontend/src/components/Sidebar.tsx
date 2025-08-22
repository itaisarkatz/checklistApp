import React, { useEffect, useState } from 'react';

interface Checklist {
  id: string;
  name: string;
  company_id: string;
}

interface SidebarProps {
  companyId: string;
  selectedChecklistId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
}

const Sidebar: React.FC<SidebarProps & { refreshKey?: number }> = ({ companyId, selectedChecklistId, onSelect, onCreate, refreshKey }) => {
  const [checklists, setChecklists] = useState<Checklist[]>([]);

  useEffect(() => {
    if (!companyId) return;
    console.log('Sidebar companyId:', companyId);
    fetch(`http://localhost:3001/api/company/${companyId}/checklists`)
      .then(res => res.json())
      .then(data => {
        setChecklists(data);
        console.log('Fetched checklists:', data);
      })
      .catch((err) => {
        setChecklists([]);
        console.error('Error fetching checklists:', err);
      });
  }, [companyId, refreshKey]);

  return (
    <div className="sidebar">
      <h3 style={{ marginTop: 0 }}>Checklists</h3>
      <button onClick={onCreate} className="create-btn">+ New Checklist</button>
      <ul>
        {checklists.length === 0 && <li style={{ color: '#888', fontStyle: 'italic' }}>No checklists yet</li>}
        {checklists.map(cl => (
          <li
            key={cl.id}
            className={cl.id === selectedChecklistId ? 'selected' : ''}
            onClick={() => onSelect(cl.id)}
          >
            {cl.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
