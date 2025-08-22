import React from 'react';

interface QuestionsConditionsProps {
  questions: string[];
  setQuestions: (questions: string[]) => void;
  conditions: string[];
  setConditions: (conditions: string[]) => void;
}

const QuestionsConditions: React.FC<QuestionsConditionsProps> = ({
  questions,
  setQuestions,
  conditions,
  setConditions,
}) => {
  const handleQuestionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestions(e.target.value.split('\n'));
  };

  const handleConditionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setConditions(e.target.value.split('\n'));
  };

  return (
    <div className="form-container">
      <h2>Define Questions and Conditions</h2>
      <div>
        <label>
          Questions (one per line):
          <textarea value={questions.join('\n')} onChange={handleQuestionsChange} />
        </label>
      </div>
      <div>
        <label>
          Conditions (one per line):
          <textarea value={conditions.join('\n')} onChange={handleConditionsChange} />
        </label>
      </div>
    </div>
  );
};

export default QuestionsConditions;
