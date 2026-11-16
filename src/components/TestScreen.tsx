import React, { useState } from 'react';
import { ArrowLeft, Sparkles, X, Heart } from 'lucide-react';
import { TEST_QUESTIONS } from '../data/questions';
import { UserAnswer } from '../types';
import { QuestionBackgroundAnimation } from './QuestionBackgroundAnimation';

interface TestScreenProps {
  onComplete: (answers: UserAnswer[]) => void;
  onCancel: () => void;
}

export const TestScreen: React.FC<TestScreenProps> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentQuestion = TEST_QUESTIONS[currentStep];
  const totalQuestions = TEST_QUESTIONS.length;

  const handleSelectOption = (optionLabel: string) => {
    if (isTransitioning) return;

    const updatedAnswers = [
      ...answers.filter((a) => a.questionId !== currentQuestion.id),
      {
        questionId: currentQuestion.id,
        question: currentQuestion.title,
        selectedOption: optionLabel,
      },
    ];
    setAnswers(updatedAnswers);

    if (currentStep < totalQuestions - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
        setIsTransitioning(false);
      }, 160);
    } else {
      setIsTransitioning(true);
      setTimeout(() => {
        onComplete(updatedAnswers);
      }, 200);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      onCancel();
    }
  };

  const currentAnswer = answers.find((a) => a.questionId === currentQuestion.id);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[82vh] px-4 py-4 max-w-2xl mx-auto w-full select-none">
      {/* Continuous Theme Animation Layer for current question (stops only when an option is selected) */}
      <QuestionBackgroundAnimation
        questionId={currentQuestion.id}
        isActive={!isTransitioning}
      />

      {/* Top Bar with 94% Glassmorphic Navigation & Progress Pill */}
      <div className="relative z-10 w-full flex items-center justify-between mb-5 gap-3">
        <button
          onClick={handleBack}
          className="glass-pill-94 flex items-center justify-center w-11 h-11 rounded-full text-[#6B4226] hover:bg-white/70 hover:scale-105 transition-all active:scale-90 cursor-pointer"
          aria-label="Volver a la pregunta anterior"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Rounded Progress Pill with Gradient Indicator */}
        <div className="glass-pill-94 flex-1 max-w-xs px-4 py-2.5 rounded-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-1">
            {TEST_QUESTIONS.map((_, idx) => (
              <div
                key={idx}
                className={`h-2.5 flex-1 rounded-full transition-all duration-300 ${
                  idx === currentStep
                    ? 'bg-gradient-to-r from-[#C86A82] to-[#E07A5F] scale-y-125 shadow-xs'
                    : idx < currentStep
                    ? 'bg-[#52301A]'
                    : 'bg-white/60'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-black text-[#6B4226] whitespace-nowrap">
            {currentStep + 1}/{totalQuestions}
          </span>
        </div>

        <button
          onClick={onCancel}
          className="glass-pill-94 flex items-center justify-center w-11 h-11 rounded-full text-[#8C6B53] hover:bg-rose-50/80 hover:text-rose-600 hover:scale-105 transition-all active:scale-90 cursor-pointer"
          aria-label="Cancelar test"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main 94% Glassmorphic Card with 67px Ultra-Curved Radius */}
      <div
        className={`relative z-10 glass-94 w-full rounded-[67px] p-7 sm:p-10 ring-8 ring-white/25 transition-all duration-150 transform ${
          isTransitioning ? 'opacity-40 scale-[0.98]' : 'opacity-100 scale-100'
        }`}
      >
        {/* Step Badge */}
        <div className="text-center mb-3">
          <span className="glass-pill-94 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold text-[#7A4B29] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#C86A82] animate-spin" />
            Pregunta {currentStep + 1} de {totalQuestions}
          </span>
        </div>

        {/* Question Title & Subtitle */}
        <h2 className="text-2xl sm:text-3xl font-black text-[#4A2E18] text-center leading-snug mb-2 font-serif-title">
          {currentQuestion.title}
        </h2>
        <p className="text-sm sm:text-base text-[#7A543B] text-center mb-7 font-medium">
          {currentQuestion.subtitle}
        </p>

        {/* 4 Options in round pill buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = currentAnswer?.selectedOption === option.label;
            const optionNumber = idx + 1;

            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.label)}
                className={`group relative flex items-center justify-between px-5 py-4 rounded-full border-2 text-left transition-all duration-200 cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#52301A] to-[#3D2211] text-white border-white/60 shadow-lg shadow-[#52301A]/30 scale-[1.02]'
                    : 'glass-pill-94 hover:bg-white/65 text-[#4A2E18] border-white/75 hover:border-white hover:shadow-md hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {/* Option number pill */}
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
                      isSelected
                        ? 'bg-white/25 text-white'
                        : 'bg-gradient-to-br from-[#FDE2E4] to-[#FFF3BF] text-[#8C3A50] group-hover:from-[#C86A82] group-hover:to-[#E07A5F] group-hover:text-white'
                    }`}
                  >
                    {optionNumber}
                  </span>

                  <span className="text-2xl group-hover:scale-125 transition-transform duration-200">
                    {option.emoji}
                  </span>

                  <span className="text-sm sm:text-base font-bold tracking-wide">
                    {option.label}
                  </span>
                </div>

                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                    isSelected
                      ? 'bg-white border-white'
                      : 'border-[#C8A694] group-hover:border-[#C86A82]'
                  }`}
                >
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#52301A]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative z-10 glass-pill-94 mt-5 flex items-center gap-2 text-xs text-[#6B4226] font-semibold px-4 py-1.5 rounded-full">
        <Heart className="w-3.5 h-3.5 text-[#C86A82] fill-[#C86A82]" />
        <span>Toca la opción que mejor resuene contigo</span>
      </div>
    </div>
  );
};
