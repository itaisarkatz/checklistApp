import React from 'react';

interface ChecklistProps {
  checklist: any;
}

const Checklist: React.FC<ChecklistProps> = ({ checklist }) => {
  if (!checklist || !Array.isArray(checklist.questions)) {
    return null;
  }

  const questions = checklist.questions;
  return (
    <div className="checklist-container">
      <h2>Checklist Results</h2>
      <div className="checklist-document">
        <h4>Questions & Conditions</h4>
        <ul>
          {questions.map((q: any, i: number) => (
            <li key={i}>
              <strong>{q.type === 'question' ? 'Q:' : 'Condition:'} {q.text}</strong>
              {q.type === 'question' && q.answer && <> — {q.answer}</>}
              {q.type === 'condition' && q.evaluation !== undefined && (
                <> — {q.evaluation ? 'Yes' : 'No'}</>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Checklist;
