import { useState } from 'react';
import './App.css';
import Checklist from './components/Checklist';
import DocumentUpload from './components/DocumentUpload';
import QuestionsConditions from './components/QuestionsConditions';

function App() {
  const [checklist, setChecklist] = useState(null);
  const [questions, setQuestions] = useState([
    'In welcher Form sind die Angebote/Teilnahmeanträge einzureichen?',
    'Wann ist die Frist für die Einreichung von Bieterfragen?',
  ]);
  const [conditions, setConditions] = useState([
    'Ist die Abgabefrist vor dem 31.12.2025?',
  ]);

  return (
    <div className="App">
      <h1>Document Checklist App</h1>
      <QuestionsConditions
        questions={questions}
        setQuestions={setQuestions}
        conditions={conditions}
        setConditions={setConditions}
      />
      <DocumentUpload
        questions={questions}
        conditions={conditions}
        setChecklist={setChecklist}
      />
      <Checklist checklist={checklist} />
    </div>
  );
}

export default App;

