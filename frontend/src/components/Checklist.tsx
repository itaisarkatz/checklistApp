import React from 'react';

interface ChecklistProps {
  checklist: any;
}

const Checklist: React.FC<ChecklistProps> = ({ checklist }) => {
  if (!checklist) {
    return null;
  }

  return (
    <div className="checklist-container">
      <h2>Checklist Results</h2>
      {checklist.map((docChecklist: any, index: number) => (
        <div key={index} className="checklist-document">
          <h3>Document {index + 1}</h3>
          <h4>Questions</h4>
          <ul>
            {docChecklist.questions.map((q: any, i: number) => (
              <li key={i}>
                <strong>{q.question}</strong>: {q.answer}
              </li>
            ))}
          </ul>
          <h4>Conditions</h4>
          <ul>
            {docChecklist.conditions.map((c: any, i: number) => (
              <li key={i}>
                <strong>{c.condition}</strong>: {c.evaluation.toString()}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Checklist;
