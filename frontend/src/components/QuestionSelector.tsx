import React, { useEffect, useState } from 'react';

interface Question {
  id: number;
  type: string;
  text: string;
}

interface QuestionSelectorProps {
  companyId: string;
  selectedIds: number[];
  setSelectedIds: (ids: number[]) => void;
}

const QuestionSelector: React.FC<QuestionSelectorProps> = ({ companyId, selectedIds, setSelectedIds }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newType, setNewType] = useState('question');

  useEffect(() => {
    if (!companyId) return;
    fetch(`http://localhost:3001/api/questions?companyId=${companyId}`)
      .then(res => res.json())
      .then(setQuestions);
  }, [companyId]);

  const handleToggle = (id: number) => {
    setSelectedIds(selectedIds.includes(id)
      ? selectedIds.filter(qid => qid !== id)
      : [...selectedIds, id]);
  };

  const handleAdd = async () => {
    if (!newQuestion.trim()) return;
    const res = await fetch('http://localhost:3001/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: newType, text: newQuestion, company_id: companyId }),
    });
    const created = await res.json();
    setQuestions(qs => [...qs, created]);
    setSelectedIds([...selectedIds, created.id]);
    setNewQuestion('');
  };

  return (
    <div className="form-container">
      <h2>Select or Add Questions/Conditions</h2>
      <ul>
        {questions.map(q => (
          <li key={q.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedIds.includes(q.id)}
                onChange={() => handleToggle(q.id)}
              />
              [{q.type}] {q.text}
            </label>
          </li>
        ))}
      </ul>
      <div>
        <select value={newType} onChange={e => setNewType(e.target.value)}>
          <option value="question">Question</option>
          <option value="condition">Condition</option>
        </select>
        <input
          type="text"
          value={newQuestion}
          onChange={e => setNewQuestion(e.target.value)}
          placeholder="Add new question or condition"
          style={{ width: '400px' }}
        />
        <button onClick={handleAdd}>Add</button>
      </div>
    </div>
  );
};

export default QuestionSelector;
