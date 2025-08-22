import { useEffect, useState } from 'react';
import './App.css';
import Checklist from './components/Checklist';
import DocumentUpload from './components/DocumentUpload';
import QuestionSelector from './components/QuestionSelector';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';

function getOrCreateCompany(setCompanyId: (id: string) => void, setCompanyName: (name: string) => void) {
  useEffect(() => {
    const fetchOrCreate = async () => {
      let companyId = localStorage.getItem('companyId');
      let companyName = localStorage.getItem('companyName');
      let company;
      if (companyId) {
        try {
          const response = await fetch(`http://localhost:3001/api/companies/${companyId}`);
          if (response.ok) {
            company = await response.json();
            setCompanyName(company.name);
            localStorage.setItem('companyName', company.name);
            return setCompanyId(companyId);
          } else {
            localStorage.removeItem('companyId');
            localStorage.removeItem('companyName');
            companyId = null;
          }
        } catch {
          localStorage.removeItem('companyId');
          localStorage.removeItem('companyName');
          companyId = null;
        }
      }
      if (!companyId) {
        const response = await fetch('http://localhost:3001/api/companies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'New Company' }),
        });
        company = await response.json();
        setCompanyId(company.id);
        setCompanyName(company.name);
        localStorage.setItem('companyId', company.id);
        localStorage.setItem('companyName', company.name);
      }
    };
    fetchOrCreate();
  }, [setCompanyId, setCompanyName]);
}

function App() {
  const [companyId, setCompanyId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [checklist, setChecklist] = useState(null);
  const [documentIds, setDocumentIds] = useState<number[]>([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);
  const [selectedChecklistId, setSelectedChecklistId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [checklistError, setChecklistError] = useState<string | null>(null);

  const handleCreateChecklist = async () => {
    const name = prompt('Enter checklist name:');
    if (!name) return;
    console.log('Creating checklist with name:', name, 'and companyId:', companyId);
    const res = await fetch('http://localhost:3001/api/checklists/minimal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, company_id: companyId }),
    });
    const checklist = await res.json();
    setSelectedChecklistId(checklist.id);
    setRefreshKey(k => k + 1); // trigger sidebar refresh
  };

  const handleGenerateChecklist = async () => {
    setChecklistError(null);
    if (selectedQuestionIds.length === 0) {
      setChecklistError('Please select at least one question or condition.');
      return;
    }
    if (documentIds.length === 0) {
      setChecklistError('Please upload at least one document.');
      return;
    }
    try {
      const response = await fetch('http://localhost:3001/api/checklists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questionIds: selectedQuestionIds, documentIds }),
      });
      if (!response.ok) {
        const text = await response.text();
        setChecklistError(text || 'Failed to generate checklist.');
        return;
      }
      const data = await response.json();
      setChecklist(data);
    } catch (error) {
      setChecklistError('Error generating checklist.');
      console.error('Error generating checklist:', error);
    }
  };

  getOrCreateCompany(setCompanyId, setCompanyName);

  return (
    <div className="App">
      <TopBar companyName={companyName} />
      <div className="app-content">
        <Sidebar
          companyId={companyId}
          selectedChecklistId={selectedChecklistId}
          onSelect={setSelectedChecklistId}
          onCreate={handleCreateChecklist}
          refreshKey={refreshKey}
        />
        <div className="main-content">
          {/* Only show form if a checklist is selected */}
          {selectedChecklistId && (
            <>
              <QuestionSelector
                companyId={companyId}
                selectedIds={selectedQuestionIds}
                setSelectedIds={setSelectedQuestionIds}
              />
              <DocumentUpload setDocumentIds={setDocumentIds} companyId={companyId} />
              <button onClick={handleGenerateChecklist}>
                Generate Checklist
              </button>
              {checklistError && <div style={{ color: 'red', marginTop: 8 }}>{checklistError}</div>}
              <Checklist checklist={checklist} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
