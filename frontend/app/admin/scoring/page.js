// app/admin/scoring/page.js
'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save } from 'lucide-react';
import { getPrograms, getQuestions, getAnswerScores, batchUpdateScores } from '@/lib/requests';

const ScoringPage = () => {
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [scoreChanges, setScoreChanges] = useState({});
  const queryClient = useQueryClient();

  const { data: programs = [] } = useQuery({
    queryKey: ['programs'],
    queryFn: getPrograms
  });

  const { data: questions = [] } = useQuery({
    queryKey: ['questions'],
    queryFn: getQuestions
  });

  const { data: answerScores = [] } = useQuery({
    queryKey: ['answerScores'],
    queryFn: getAnswerScores
  });

  const initialScores = useMemo(() => {
    const scoresMap = {};
    answerScores.forEach((score) => {
      const key = `${score.answer_id}-${score.program_id}`;
      scoresMap[key] = score.points;
    });
    return scoresMap;
  }, [answerScores]);

  const scores = { ...initialScores, ...scoreChanges };
  const hasChanges = Object.keys(scoreChanges).length > 0;

  const saveMutation = useMutation({
    mutationFn: batchUpdateScores,
    onSuccess: () => {
      queryClient.invalidateQueries(['answerScores']);
      setScoreChanges({});
    }
  });

  const selectedQuestion = questions.find((q) => q.id === selectedQuestionId);

  const handleScoreChange = (answerId, programId, value) => {
    const key = `${answerId}-${programId}`;
    setScoreChanges({ ...scoreChanges, [key]: value === '' ? '' : parseFloat(value) });
  };

  const handleSave = () => {
    const scoresArray = Object.entries(scoreChanges)
      .filter(([_, points]) => points !== '')
      .map(([key, points]) => {
        const [answerId, programId] = key.split('-');
        return {
          answer_id: parseInt(answerId),
          program_id: parseInt(programId),
          points: parseFloat(points)
        };
      });

    if (scoresArray.length === 0) return;
    saveMutation.mutate(scoresArray);
  };

  const groupedQuestions = questions.reduce((acc, q) => {
    const sectionTitle = q.section?.title || 'Övriga';
    if (!acc[sectionTitle]) acc[sectionTitle] = [];
    acc[sectionTitle].push(q);
    return acc;
  }, {});

  return (
    <div className="p-8 max-w-full mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Poängmatris</h1>
        {hasChanges && (
          <Button onClick={handleSave} disabled={saveMutation.isLoading} className="bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            Spara ändringar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3 bg-white rounded-lg border p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          <h2 className="font-semibold mb-4">Välj fråga</h2>
          {Object.entries(groupedQuestions).map(([sectionTitle, sectionQuestions]) => (
            <div key={sectionTitle} className="mb-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">{sectionTitle}</h3>
              <div className="space-y-1">
                {sectionQuestions.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => setSelectedQuestionId(q.id)}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${selectedQuestionId === q.id ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-50'}`}
                  >
                    {q.text}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="col-span-9 bg-white rounded-lg border p-6">
          {!selectedQuestion ? (
            <div className="text-center text-gray-500 py-12">Välj en fråga från listan till vänster</div>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-6">{selectedQuestion.text}</h2>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-3 bg-gray-50 text-left font-semibold w-64">Svarsalternativ</th>
                      {programs.map((program) => (
                        <th key={program.id} className="border p-3 bg-gray-50 text-center font-semibold min-w-32">
                          {program.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedQuestion.answers?.map((answer) => (
                      <tr key={answer.id}>
                        <td className="border p-3 font-medium">{answer.text}</td>
                        {programs.map((program) => {
                          const key = `${answer.id}-${program.id}`;
                          return (
                            <td key={program.id} className="border p-2">
                              <Input
                                type="number"
                                step="0.5"
                                value={scores[key] ?? ''}
                                onChange={(e) => handleScoreChange(answer.id, program.id, e.target.value)}
                                className="w-full text-center"
                                placeholder="0"
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-sm mb-2">Poängsättning</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Positiva poäng: Svaret stärker matchningen med programmet</li>
                  <li>• Negativa poäng: Svaret försvagar matchningen med programmet</li>
                  <li>• Tom ruta eller 0: Svaret påverkar inte programmet</li>
                  <li>• Rekommenderat intervall: -10 till +10</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScoringPage;
