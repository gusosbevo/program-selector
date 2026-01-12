'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getSections, getQuestions, getPrograms } from '@/lib/requests';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import axios from 'axios';
import { baseUrl } from '@/lib/api-config';

const SurveyPage = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({});
  const [userName, setUserName] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  const { data: sections } = useQuery({ queryKey: ['sections'], queryFn: getSections });
  const { data: questions } = useQuery({ queryKey: ['questions'], queryFn: getQuestions });
  const { data: programs } = useQuery({ queryKey: ['programs'], queryFn: getPrograms });

  const submitMutation = useMutation({
    mutationFn: (data) => axios.post(`${baseUrl}/surveys`, data).then((res) => res.data),
    onSuccess: (data) => {
      setResults(data);
      setShowResults(true);
    }
  });

  const sortedSections = sections?.sort((a, b) => a.order - b.order) || [];
  const currentSectionData = sortedSections[currentSection - 1];
  const sectionQuestions = questions?.filter((q) => q.question_section_id === currentSectionData?.id).sort((a, b) => a.order - b.order) || [];

  const isCurrentSectionComplete = () => sectionQuestions.every((q) => !q.required || answers[q.id]);

  const handleSubmit = () => {
    const formattedAnswers = Object.entries(answers).map(([questionId, answerId]) => ({
      question_id: parseInt(questionId),
      answer_id: parseInt(answerId)
    }));

    submitMutation.mutate({
      user_name: userName,
      answers: formattedAnswers
    });
  };

  if (showResults && results) {
    const rankedPrograms = results.results.map((r) => ({
      ...programs.find((p) => p.id === r.program_id),
      points: r.total_points
    }));

    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <h1 className="text-3xl font-bold mb-2">Dina resultat</h1>
            <p className="text-gray-600 mb-6">Baserat på dina svar rekommenderar vi följande program:</p>
            <div className="space-y-4">
              {rankedPrograms.map((program, index) => (
                <div key={program.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                      <h3 className="text-xl font-semibold">{program.name}</h3>
                    </div>
                    <span className="text-lg font-semibold text-blue-600">{program.points} poäng</span>
                  </div>
                  {program.description && <p className="text-gray-600 ml-10">{program.description}</p>}
                </div>
              ))}
            </div>
            <Button onClick={() => window.location.reload()} className="w-full mt-6">
              Gör om undersökningen
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Gymnasieval</h1>
          <p className="text-gray-600">Svara på frågorna för att få programrekommendationer</p>
        </div>

        {currentSection === 0 && (
          <Card className="p-8 mb-6">
            <h2 className="text-xl font-semibold mb-4">Välkommen!</h2>
            <div className="mb-6">
              <Label>Ditt namn (valfritt)</Label>
              <Input value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Skriv ditt namn" />
            </div>
            <Button onClick={() => setCurrentSection(1)} className="w-full">
              Börja undersökningen
            </Button>
          </Card>
        )}

        {currentSection > 0 && currentSectionData && (
          <>
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">{currentSectionData.title}</h2>
                {currentSectionData.description && <p className="text-gray-600 mt-1">{currentSectionData.description}</p>}
              </div>
              <span className="text-sm text-gray-600">
                Sektion {currentSection} av {sortedSections.length}
              </span>
            </div>

            <Card className="p-8 mb-6">
              <div className="space-y-8">
                {sectionQuestions.map((question) => (
                  <div key={question.id}>
                    <Label className="text-base font-medium mb-3 block">
                      {question.text}
                      {question.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    <RadioGroup value={answers[question.id]?.toString()} onValueChange={(value) => setAnswers({ ...answers, [question.id]: parseInt(value) })}>
                      {question.answers?.map((answer) => (
                        <div key={answer.id} className="flex items-center space-x-2 p-3 rounded hover:bg-gray-50">
                          <RadioGroupItem value={answer.id.toString()} id={`answer-${answer.id}`} />
                          <Label htmlFor={`answer-${answer.id}`} className="flex-1 cursor-pointer">
                            {answer.text}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </div>
            </Card>

            <div className="flex gap-4">
              <Button onClick={() => setCurrentSection(currentSection - 1)} variant="outline" className="flex-1">
                Föregående
              </Button>
              {currentSection < sortedSections.length ? (
                <Button onClick={() => setCurrentSection(currentSection + 1)} disabled={!isCurrentSectionComplete()} className="flex-1">
                  Nästa
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={!isCurrentSectionComplete() || submitMutation.isLoading} className="flex-1">
                  Skicka in
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SurveyPage;
