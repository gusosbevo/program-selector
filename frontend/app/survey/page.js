'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { getSections, getQuestions, getPrograms } from '@/lib/requests';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import axios from 'axios';
import { baseUrl } from '@/lib/api-config';

const sectionThemes = [
  { bg: 'bg-gradient-to-br from-blue-50 to-indigo-100', accent: 'blue', darkBg: 'from-blue-900/10 to-indigo-900/10' },
  { bg: 'bg-gradient-to-br from-purple-50 to-pink-100', accent: 'purple', darkBg: 'from-purple-900/10 to-pink-900/10' },
  { bg: 'bg-gradient-to-br from-green-50 to-emerald-100', accent: 'green', darkBg: 'from-green-900/10 to-emerald-900/10' },
  { bg: 'bg-gradient-to-br from-orange-50 to-red-100', accent: 'orange', darkBg: 'from-orange-900/10 to-red-900/10' },
  { bg: 'bg-gradient-to-br from-teal-50 to-cyan-100', accent: 'teal', darkBg: 'from-teal-900/10 to-cyan-900/10' }
];

const AnimatedScore = ({ target, delay = 0 }) => {
  const [score, setScore] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = target / steps;
    const stepDuration = duration / steps;

    const timer = setTimeout(() => {
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
          setScore(target);
          clearInterval(interval);
        } else setScore(Math.round(current * 10) / 10);
      }, stepDuration);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [target, delay]);

  return <span>{score}</span>;
};

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
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 250);
      setResults(data);
      setShowResults(true);
    }
  });

  const sortedSections = sections?.sort((a, b) => a.order - b.order) || [];
  const currentSectionData = sortedSections[currentSection - 1];
  const sectionQuestions = questions?.filter((q) => q.question_section_id === currentSectionData?.id).sort((a, b) => a.order - b.order) || [];
  const currentTheme = sectionThemes[(currentSection - 1) % sectionThemes.length];

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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <Card className="p-8 shadow-2xl">
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Dina resultat</h1>
                <p className="text-gray-600 mb-8">Baserat på dina svar rekommenderar vi följande program:</p>
              </motion.div>

              <div className="space-y-4">
                {rankedPrograms.map((program, index) => (
                  <motion.div key={program.id} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.15 }}>
                    <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <motion.span className="text-3xl font-bold text-gray-300" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + index * 0.15, type: 'spring' }}>
                            #{index + 1}
                          </motion.span>
                          <h3 className="text-2xl font-semibold">{program.name}</h3>
                        </div>
                        <motion.span
                          className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.6 + index * 0.15, type: 'spring' }}
                        >
                          <AnimatedScore target={program.points} delay={600 + index * 150} /> poäng
                        </motion.span>
                      </div>
                      {program.description && (
                        <motion.p className="text-gray-600 ml-14" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + index * 0.15 }}>
                          {program.description}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                <Button onClick={() => window.location.reload()} className="w-full mt-8 py-6 text-lg">
                  Gör om undersökningen
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  const progress = currentSection > 0 ? (currentSection / sortedSections.length) * 100 : 0;

  return (
    <div className={`min-h-screen transition-all duration-700 ${currentSection > 0 ? currentTheme.bg : 'bg-gradient-to-br from-slate-50 to-slate-100'} py-12 px-4`}>
      <div className="max-w-2xl mx-auto">
        {currentSection > 0 && (
          <motion.div className="mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-white/50 backdrop-blur-sm rounded-full h-3 overflow-hidden shadow-inner">
              <motion.div
                className={`h-full bg-gradient-to-r from-${currentTheme.accent}-500 to-${currentTheme.accent}-600 rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {currentSection === 0 && (
            <motion.div key="welcome" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.4 }}>
              <div className="mb-8 text-center">
                <motion.h1
                  className="text-5xl font-bold mb-3 bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Gymnasieval
                </motion.h1>
                <motion.p className="text-gray-600 text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                  Svara på frågorna för att få programrekommendationer
                </motion.p>
              </div>

              <Card className="p-8 shadow-xl">
                <motion.h2 className="text-2xl font-semibold mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                  Välkommen!
                </motion.h2>
                <motion.div className="mb-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                  <Label className="text-base mb-2">Ditt namn (valfritt)</Label>
                  <Input value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Skriv ditt namn" className="text-lg py-6" />
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                  <Button onClick={() => setCurrentSection(1)} className="w-full py-6 text-lg">
                    Börja undersökningen
                  </Button>
                </motion.div>
              </Card>
            </motion.div>
          )}

          {currentSection > 0 && currentSectionData && (
            <motion.div key={`section-${currentSection}`} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.4 }}>
              <motion.div className="mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{currentSectionData.title}</h2>
                    {currentSectionData.description && <p className="text-gray-600 text-lg">{currentSectionData.description}</p>}
                  </div>
                  <span className="text-sm text-gray-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                    {currentSection} / {sortedSections.length}
                  </span>
                </div>
              </motion.div>

              <Card className="p-8 mb-6 shadow-xl bg-white/80 backdrop-blur-sm">
                <div className="space-y-8">
                  {sectionQuestions.map((question, qIndex) => (
                    <motion.div key={question.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + qIndex * 0.1 }}>
                      <Label className="text-lg font-medium mb-4 block">
                        {question.text}
                        {question.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      <RadioGroup value={answers[question.id]?.toString()} onValueChange={(value) => setAnswers({ ...answers, [question.id]: parseInt(value) })}>
                        {question.answers?.map((answer, aIndex) => (
                          <motion.div
                            key={answer.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + qIndex * 0.1 + aIndex * 0.05 }}
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div
                              className={`flex items-center space-x-3 p-4 rounded-lg transition-all duration-200 cursor-pointer ${
                                answers[question.id] === answer.id
                                  ? `bg-${currentTheme.accent}-50 border-2 border-${currentTheme.accent}-400 shadow-md`
                                  : 'hover:bg-gray-50 border-2 border-transparent'
                              }`}
                            >
                              <RadioGroupItem value={answer.id.toString()} id={`answer-${answer.id}`} />
                              <Label htmlFor={`answer-${answer.id}`} className="flex-1 cursor-pointer text-base">
                                {answer.text}
                              </Label>
                            </div>
                          </motion.div>
                        ))}
                      </RadioGroup>
                    </motion.div>
                  ))}
                </div>
              </Card>

              <motion.div className="flex gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <Button onClick={() => setCurrentSection(currentSection - 1)} variant="outline" className="flex-1 py-6 text-lg">
                  Föregående
                </Button>
                {currentSection < sortedSections.length ? (
                  <Button onClick={() => setCurrentSection(currentSection + 1)} disabled={!isCurrentSectionComplete()} className="flex-1 py-6 text-lg">
                    Nästa
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={!isCurrentSectionComplete() || submitMutation.isPending} className="flex-1 py-6 text-lg">
                    {submitMutation.isPending ? 'Beräknar...' : 'Skicka in'}
                  </Button>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SurveyPage;
