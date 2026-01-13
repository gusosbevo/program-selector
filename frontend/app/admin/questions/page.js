'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { getQuestions, getSections, deleteQuestion, deleteAnswer } from '@/lib/requests';
import QuestionModal from '@/components/admin/QuestionModal';
import AnswerModal from '@/components/admin/AnswerModal';

const QuestionsPage = () => {
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [answerModalOpen, setAnswerModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingAnswer, setEditingAnswer] = useState(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const queryClient = useQueryClient();

  const { data: sections = [] } = useQuery({
    queryKey: ['sections'],
    queryFn: getSections
  });

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ['questions'],
    queryFn: getQuestions
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: deleteQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries(['questions']);
    }
  });

  const deleteAnswerMutation = useMutation({
    mutationFn: ({ questionId, answerId }) => deleteAnswer(questionId, answerId),
    onSuccess: () => {
      queryClient.invalidateQueries(['questions']);
    }
  });

  const toggleQuestion = (id) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedQuestions(newExpanded);
  };

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setQuestionModalOpen(true);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setQuestionModalOpen(true);
  };

  const handleDeleteQuestion = (id) => {
    if (confirm('Är du säker på att du vill ta bort denna fråga?')) deleteQuestionMutation.mutate(id);
  };

  const handleAddAnswer = (questionId) => {
    setSelectedQuestionId(questionId);
    setEditingAnswer(null);
    setAnswerModalOpen(true);
  };

  const handleEditAnswer = (questionId, answer) => {
    setSelectedQuestionId(questionId);
    setEditingAnswer(answer);
    setAnswerModalOpen(true);
  };

  const handleDeleteAnswer = (questionId, answerId) => {
    if (confirm('Är du säker på att du vill ta bort detta svar?')) deleteAnswerMutation.mutate({ questionId, answerId });
  };

  const groupedQuestions = sections.map((section) => ({
    ...section,
    questions: questions.filter((q) => q.question_section_id === section.id).sort((a, b) => a.id - b.id)
  }));

  if (isLoading) return <div className="p-8">Laddar...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Frågor & Svar</h1>
        <Button onClick={handleAddQuestion} className="bg-black text-white hover:bg-gray-800">
          <Plus className="w-4 h-4 mr-2" />
          Ny fråga
        </Button>
      </div>

      <div className="space-y-6">
        {groupedQuestions.map((section) => (
          <div key={section.id}>
            <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
            <div className="space-y-2">
              {section.questions.map((question) => (
                <Card key={question.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <button onClick={() => toggleQuestion(question.id)} className="mt-1">
                        {expandedQuestions.has(question.id) ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium">{question.text}</p>
                              {question.required && <span className="text-xs text-red-600">Obligatorisk</span>}
                            </div>
                            {question.category && <span className="inline-block text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{question.category}</span>}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditQuestion(question)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteQuestion(question.id)}>
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </div>

                        {expandedQuestions.has(question.id) && (
                          <div className="mt-4 ml-4 space-y-2">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Svarsalternativ</span>
                              <Button variant="outline" size="sm" onClick={() => handleAddAnswer(question.id)}>
                                <Plus className="w-3 h-3 mr-1" />
                                Lägg till svar
                              </Button>
                            </div>
                            {question.answers
                              ?.sort((a, b) => a.id - b.id)
                              .map((answer) => (
                                <div key={answer.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <span className="text-sm">{answer.text}</span>
                                  <div className="flex gap-1">
                                    <Button variant="ghost" size="sm" onClick={() => handleEditAnswer(question.id, answer)}>
                                      <Pencil className="w-3 h-3" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteAnswer(question.id, answer.id)}>
                                      <Trash2 className="w-3 h-3 text-red-600" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {questionModalOpen && <QuestionModal question={editingQuestion} sections={sections} onClose={() => setQuestionModalOpen(false)} />}
      {answerModalOpen && <AnswerModal question_id={selectedQuestionId} answer={editingAnswer} onClose={() => setAnswerModalOpen(false)} />}
    </div>
  );
};

export default QuestionsPage;
