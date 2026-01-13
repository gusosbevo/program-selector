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

const ProgressBar = ({ current, total }) => {
  const progress = (current / total) * 100;
  const prevProgress = ((current - 1) / total) * 100;

  useEffect(() => {
    const progressRatio = current / total;
    if (current > 0 && progressRatio < 1 && [0.25, 0.5, 0.75].includes(progressRatio)) {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.3 }
      });
    }
  }, [current, total]);

  return (
    <div className="mb-4 md:mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          Fråga {current} av {total}
        </span>
        <span className="text-sm font-medium text-gray-500">{Math.round(progress)}%</span>
      </div>
      <div className="bg-white/50 backdrop-blur-sm rounded-full h-3 overflow-hidden shadow-inner">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-lg"
          initial={{ width: `${prevProgress}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

const SurveyPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
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
  const allQuestions =
    questions
      ?.sort((a, b) => {
        const sectionOrderA = sortedSections.findIndex((s) => s.id === a.question_section_id);
        const sectionOrderB = sortedSections.findIndex((s) => s.id === b.question_section_id);
        if (sectionOrderA !== sectionOrderB) return sectionOrderA - sectionOrderB;
        return a.order - b.order;
      })
      .map((q) => ({
        ...q,
        section: sortedSections.find((s) => s.id === q.question_section_id),
        tips: q.tips
      })) || [];

  const currentQuestion = currentQuestionIndex >= 0 ? allQuestions[currentQuestionIndex] : null;
  const totalQuestions = allQuestions.length;
  const isWelcome = currentQuestionIndex === -1;
  const canGoNext = !currentQuestion?.required || answers[currentQuestion?.id];

  const handleNext = () => {
    if (currentQuestionIndex === totalQuestions - 1) {
      const formattedAnswers = Object.entries(answers).map(([questionId, answerId]) => ({
        question_id: parseInt(questionId),
        answer_id: parseInt(answerId)
      }));

      submitMutation.mutate({
        user_name: userName,
        answers: formattedAnswers
      });
    } else setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex(Math.max(-1, currentQuestionIndex - 1));
  };

  const selectAnswer = (answerId) => {
    setAnswers({ ...answers, [currentQuestion.id]: answerId });
  };

  if (showResults && results) {
    const rankedPrograms = results.results.map((r) => ({
      ...programs.find((p) => p.id === r.program_id),
      points: r.total_points
    }));

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <Card className="p-6 md:p-8 shadow-2xl">
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Dina resultat</h1>
                <p className="text-gray-600 mb-6 md:mb-8">Baserat på dina svar rekommenderar vi följande program:</p>
              </motion.div>

              <div className="space-y-3 md:space-y-4">
                {rankedPrograms.map((program, index) => (
                  <motion.div key={program.id} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.15 }}>
                    <div className="p-4 md:p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 md:gap-4">
                          <motion.span
                            className="text-2xl md:text-3xl font-bold text-gray-300"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5 + index * 0.15, type: 'spring' }}
                          >
                            #{index + 1}
                          </motion.span>
                          <h3 className="text-xl md:text-2xl font-semibold">{program.name}</h3>
                        </div>
                        <motion.span
                          className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.6 + index * 0.15, type: 'spring' }}
                        >
                          <AnimatedScore target={program.points} delay={600 + index * 150} /> p
                        </motion.span>
                      </div>
                      {program.description && (
                        <motion.p className="text-sm md:text-base text-gray-600 ml-10 md:ml-14" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + index * 0.15 }}>
                          {program.description}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                <Button onClick={() => window.location.reload()} className="w-full mt-6 md:mt-8 py-5 md:py-6 text-base md:text-lg">
                  Gör om undersökningen
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-4 md:py-12 px-4 flex items-center">
      <div className="max-w-2xl mx-auto w-full">
        {!isWelcome && <ProgressBar current={currentQuestionIndex + 1} total={totalQuestions} />}

        <AnimatePresence mode="wait">
          {isWelcome && (
            <motion.div key="welcome" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.4 }}>
              <div className="mb-6 text-center">
                <motion.h1
                  className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Gymnasieval
                </motion.h1>
                <motion.p className="text-gray-600 text-base md:text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                  Svara på frågorna för att få programrekommendationer
                </motion.p>
              </div>

              <Card className="p-6 md:p-8 shadow-xl">
                <motion.h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                  Välkommen!
                </motion.h2>
                <motion.div className="mb-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                  <Label className="text-base mb-2">Ditt namn (valfritt)</Label>
                  <Input value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Skriv ditt namn" className="text-base md:text-lg py-5 md:py-6" />
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                  <Button onClick={() => setCurrentQuestionIndex(0)} className="w-full py-5 md:py-6 text-base md:text-lg">
                    Börja undersökningen
                  </Button>
                </motion.div>
              </Card>
            </motion.div>
          )}

          {currentQuestion && (
            <motion.div
              key={`question-${currentQuestion.id}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="min-h-[calc(100vh-8rem)] md:min-h-0 flex flex-col"
            >
              {currentQuestion.section && (
                <motion.div className="mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                  <span className="inline-block text-xs md:text-sm font-medium text-gray-600 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">{currentQuestion.section.title}</span>
                </motion.div>
              )}

              <Card className="p-6 md:p-8 shadow-xl bg-white/80 backdrop-blur-sm flex-1 md:flex-none flex flex-col justify-between md:block">
                <div>
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Label className="text-lg md:text-xl font-semibold mb-6 block leading-relaxed">
                      {currentQuestion.text}
                      {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                  </motion.div>

                  <RadioGroup value={answers[currentQuestion.id]?.toString()} onValueChange={(value) => selectAnswer(parseInt(value))}>
                    <div className="space-y-3">
                      {currentQuestion.answers?.map((answer, index) => (
                        <motion.div key={answer.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.08 }} whileTap={{ scale: 0.98 }}>
                          <div
                            onClick={() => selectAnswer(answer.id)}
                            className={`flex items-start space-x-3 p-4 md:p-5 rounded-xl transition-all duration-200 cursor-pointer ${
                              answers[currentQuestion.id] === answer.id
                                ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-400 shadow-md'
                                : 'hover:bg-gray-50 border-2 border-transparent bg-white'
                            }`}
                          >
                            <RadioGroupItem value={answer.id.toString()} id={`answer-${answer.id}`} className="mt-0.5" />
                            <Label htmlFor={`answer-${answer.id}`} className="flex-1 cursor-pointer text-base md:text-lg leading-relaxed">
                              {answer.text}
                            </Label>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </RadioGroup>

                  {currentQuestion.tips && (
                    <motion.div className="mt-6 p-4 bg-blue-50/50 border border-blue-100 rounded-lg" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                      <div className="flex items-start gap-3">
                        <span className="text-blue-600 mt-0.5">💡</span>
                        <p className="text-sm md:text-base text-gray-700 leading-relaxed">{currentQuestion.tips}</p>
                      </div>
                    </motion.div>
                  )}
                </div>

                <motion.div className="flex gap-3 mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                  <Button onClick={handlePrevious} variant="outline" className="flex-1 py-5 md:py-6 text-base md:text-lg">
                    Tillbaka
                  </Button>
                  <Button onClick={handleNext} disabled={!canGoNext || submitMutation.isPending} className="flex-1 py-5 md:py-6 text-base md:text-lg">
                    {submitMutation.isPending ? 'Beräknar...' : currentQuestionIndex === totalQuestions - 1 ? 'Skicka in' : 'Nästa'}
                  </Button>
                </motion.div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SurveyPage;
