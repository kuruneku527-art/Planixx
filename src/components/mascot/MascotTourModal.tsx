import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { VISUAL_TOUR_SECTIONS, SectionVisualTourStep } from '../../data/visualTourData';
import { SectionDiagramMockup } from './SectionDiagramMockup';
import { toPersianDigits } from '../../utils/jalali';
import { soundEffects } from '../../utils/audio';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Compass,
  Check,
  Lightbulb,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const MascotTourModal: React.FC = () => {
  const {
    mascotTourOpen,
    setMascotTourOpen,
    mascotInitialStep,
    settings,
    updateSettings,
    activeView,
    setActiveView,
    showToast,
  } = useApp();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedCalloutId, setSelectedCalloutId] = useState<string | null>(null);

  // Sync initial step when tour opens
  useEffect(() => {
    if (mascotTourOpen) {
      const initIdx =
        typeof mascotInitialStep === 'number' &&
        mascotInitialStep >= 0 &&
        mascotInitialStep < VISUAL_TOUR_SECTIONS.length
          ? mascotInitialStep
          : 0;
      setCurrentStepIndex(initIdx);
      setSelectedCalloutId(null);
    }
  }, [mascotTourOpen, mascotInitialStep]);

  if (!mascotTourOpen) return null;

  const currentStep = VISUAL_TOUR_SECTIONS[currentStepIndex] || VISUAL_TOUR_SECTIONS[0];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === VISUAL_TOUR_SECTIONS.length - 1;
  const progressPercentage = Math.round(((currentStepIndex + 1) / VISUAL_TOUR_SECTIONS.length) * 100);

  const formatDigits = (val: string | number) =>
    settings.persianDigits ? toPersianDigits(val) : String(val);

  const handleNext = () => {
    if (settings.soundEnabled || settings.soundEffectsEnabled) {
      soundEffects.play('click');
    }
    if (!isLastStep) {
      setCurrentStepIndex((prev) => prev + 1);
      setSelectedCalloutId(null);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (settings.soundEnabled || settings.soundEffectsEnabled) {
      soundEffects.play('click');
    }
    if (!isFirstStep) {
      setCurrentStepIndex((prev) => prev - 1);
      setSelectedCalloutId(null);
    }
  };

  const handleSelectStep = (idx: number) => {
    if (settings.soundEnabled || settings.soundEffectsEnabled) {
      soundEffects.play('click');
    }
    setCurrentStepIndex(idx);
    setSelectedCalloutId(null);
  };

  const handleFinish = () => {
    if (settings.soundEnabled || settings.soundEffectsEnabled) {
      soundEffects.play('success');
    }
    updateSettings({ hasSeenMascotTour: true });
    setMascotTourOpen(false);
    showToast('آموزش تصویری بخش‌ها به پایان رسید! موفق باشید 🦊', 'success');
  };

  const handleGoToRealView = () => {
    setActiveView(currentStep.viewKey);
    setMascotTourOpen(false);
    showToast(`ورود به بخش «${currentStep.title}»`, 'info');
  };

  return (
    <div
      id="visual-mascot-tour-modal"
      className="fixed inset-0 z-[200] overflow-y-auto bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-start p-2 sm:p-4 text-slate-100 animate-in fade-in duration-300"
      dir="rtl"
    >
      {/* Container max-w-5xl */}
      <div className="w-full max-w-5xl my-auto py-2 sm:py-4 flex flex-col gap-3">
        
        {/* Top Floating Control Bar */}
        <div className="w-full flex items-center justify-between gap-3 px-3.5 sm:px-5 py-2.5 rounded-2xl bg-slate-900/95 border border-purple-500/40 shadow-xl shadow-purple-950/50 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-slate-950 border-2 border-purple-400/50 shadow-md shrink-0">
              <img
                src="/mascot.png"
                alt="ممد راهنما"
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-purple-200">
                  راهنمای تصویری مرحله‌به‌مرحله با ممد 🦊
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 border border-purple-700/50 text-purple-300 font-bold hidden sm:inline">
                  بخش {formatDigits(currentStepIndex + 1)} از {formatDigits(VISUAL_TOUR_SECTIONS.length)}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                توضیحات تصویری همراه با فلش‌های راهنما برای تمام بخش‌های برنامه
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleGoToRealView}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900/80 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="بستن راهنما و رفتن مستقیم به این بخش در برنامه"
            >
              <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">ورود به این بخش</span>
            </button>

            <button
              type="button"
              onClick={handleFinish}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              title="بستن آموزش"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Section Navigation Pills (Quick jump to ANY of the 12 sections) */}
        <div className="w-full overflow-x-auto pb-1 scrollbar-none flex items-center gap-1.5 px-1">
          {VISUAL_TOUR_SECTIONS.map((sec, idx) => {
            const isCurrent = idx === currentStepIndex;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => handleSelectStep(idx)}
                className={`whitespace-nowrap px-2.5 sm:px-3 py-1 rounded-xl text-[11px] font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                  isCurrent
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-950/50 scale-102 border border-purple-400/40'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{formatDigits(idx + 1)}.</span>
                <span>{sec.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Main Step Content Card */}
        <div className="w-full rounded-2xl sm:rounded-3xl bg-slate-900/90 border border-purple-800/40 p-3 sm:p-5 shadow-2xl space-y-4">
          
          {/* Header of Step: Title & Mascot Speech */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/50 border border-purple-700/30">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-950 border-2 border-amber-500/60 shadow-lg shrink-0 overflow-hidden">
                <img src="/mascot.png" alt="ممد" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] bg-purple-900/80 text-purple-200 px-2 py-0.5 rounded-full font-bold">
                    {currentStep.category}
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-slate-100">
                    {currentStep.title}
                  </h3>
                </div>
                <p className="text-xs text-purple-200 leading-relaxed max-w-2xl">
                  {currentStep.mascotSpeech}
                </p>
              </div>
            </div>

            {/* Pro Tip Pill */}
            <div className="w-full md:w-auto bg-amber-950/40 border border-amber-500/40 p-2 sm:p-2.5 rounded-xl flex items-start gap-2 text-right shrink-0 max-w-xs">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span className="text-[11px] text-amber-200 leading-snug">
                {currentStep.proTip}
              </span>
            </div>
          </div>

          {/* Graphical Mockup with Purple Curved Arrows and Numbered Badges */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 px-1">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-purple-400" />
                نمودار تصویری و اجزای بخش (مطابق نمونه ارسالی)
              </span>
              <span className="text-[11px] text-purple-300 hidden sm:inline">
                شماره‌های بنفش روی شکل را با کارت‌های توضیحات پایین تطبیق دهید
              </span>
            </div>

            <SectionDiagramMockup
              viewKey={currentStep.viewKey}
              activeCalloutId={selectedCalloutId}
              onSelectCallout={setSelectedCalloutId}
            />
          </div>

          {/* 4 Annotated Explanation Cards matching the Numbered Badges */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentStep.callouts.map((callout) => (
                <div
                  key={callout.id}
                  onClick={() => setSelectedCalloutId(callout.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer text-right flex items-start gap-3 ${
                    selectedCalloutId === callout.id
                      ? 'bg-purple-950/70 border-purple-400 shadow-lg shadow-purple-950/60 ring-1 ring-purple-400'
                      : 'bg-slate-950/70 border-slate-800 hover:border-purple-700/60 hover:bg-slate-900'
                  }`}
                >
                  {/* Number Badge */}
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-md border border-purple-300">
                    {formatDigits(callout.number)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-black text-slate-100">
                        {callout.title}
                      </h4>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-300 font-bold">
                        {callout.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {callout.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Stepper & Progress Footer */}
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2.5">
            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              {/* Previous Button */}
              <button
                type="button"
                onClick={handlePrev}
                disabled={isFirstStep}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                <span>بخش قبلی</span>
              </button>

              {/* Progress Count */}
              <div className="text-xs text-slate-400 font-bold">
                بخش {formatDigits(currentStepIndex + 1)} از {formatDigits(VISUAL_TOUR_SECTIONS.length)}
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-purple-950/50 active:scale-95"
              >
                <span>{isLastStep ? 'پایان آموزش و شروع کار 🎉' : 'بخش بعدی'}</span>
                {!isLastStep ? <ArrowLeft className="w-4 h-4" /> : <Check className="w-4 h-4" />}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
