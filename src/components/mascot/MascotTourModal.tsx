import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { VISUAL_TOUR_SECTIONS } from '../../data/visualTourData';
import { SectionDiagramMockup } from './SectionDiagramMockup';
import { toPersianDigits } from '../../utils/jalali';
import { soundEffects } from '../../utils/audio';
import {
  ArrowRight,
  ArrowLeft,
  X,
  Check,
  Lightbulb,
  ExternalLink,
  Compass,
  LayoutGrid,
  CheckSquare,
  FolderKanban,
  Calendar as CalendarIcon,
  Clock,
  Flame,
  Timer,
  FileText,
  Bell,
  BarChart3,
  Paperclip,
  Bookmark,
  RefreshCw,
  Database,
  Settings as SettingsIcon,
  Sparkles,
} from 'lucide-react';

const getSectionIcon = (viewKey: string) => {
  switch (viewKey) {
    case 'dashboard':
      return LayoutGrid;
    case 'tasks':
      return CheckSquare;
    case 'projects':
      return FolderKanban;
    case 'calendar':
      return CalendarIcon;
    case 'daily_planner':
      return Clock;
    case 'weekly_planner':
      return CalendarIcon;
    case 'goals':
      return Compass;
    case 'habits':
      return Flame;
    case 'pomodoro':
      return Timer;
    case 'time_management':
      return Clock;
    case 'notes':
      return FileText;
    case 'reminders':
      return Bell;
    case 'reports':
      return BarChart3;
    case 'files':
      return Paperclip;
    case 'templates':
      return Bookmark;
    case 'sync':
      return RefreshCw;
    case 'backup':
      return Database;
    case 'settings':
      return SettingsIcon;
    default:
      return Sparkles;
  }
};

export const MascotTourModal: React.FC = () => {
  const {
    mascotTourOpen,
    setMascotTourOpen,
    mascotInitialStep,
    settings,
    updateSettings,
    setActiveView,
    showToast,
  } = useApp();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [activeCalloutId, setActiveCalloutId] = useState<string | undefined>(undefined);
  const pillsContainerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
      setActiveCalloutId(undefined);
    }
  }, [mascotTourOpen, mascotInitialStep]);

  // Scroll to top and scroll pill into view when step changes
  useEffect(() => {
    setActiveCalloutId(undefined);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (pillsContainerRef.current) {
      const activeBtn = pillsContainerRef.current.querySelector<HTMLButtonElement>(
        `[data-step-index="${currentStepIndex}"]`
      );
      if (activeBtn) {
        activeBtn.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [currentStepIndex]);

  if (!mascotTourOpen) return null;

  const currentStep = VISUAL_TOUR_SECTIONS[currentStepIndex] || VISUAL_TOUR_SECTIONS[0];
  const totalSteps = VISUAL_TOUR_SECTIONS.length;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;
  const progressPercentage = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  const formatDigits = (val: string | number) =>
    settings.persianDigits ? toPersianDigits(val) : String(val);

  const handleNext = () => {
    if (settings.soundEnabled || settings.soundEffectsEnabled) {
      soundEffects.playTick();
    }
    if (!isLastStep) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (settings.soundEnabled || settings.soundEffectsEnabled) {
      soundEffects.playTick();
    }
    if (!isFirstStep) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleSelectStep = (idx: number) => {
    if (settings.soundEnabled || settings.soundEffectsEnabled) {
      soundEffects.playTick();
    }
    setCurrentStepIndex(idx);
  };

  const handleFinish = () => {
    if (settings.soundEnabled || settings.soundEffectsEnabled) {
      soundEffects.playSuccessNotification();
    }
    updateSettings({ hasSeenMascotTour: true, hasCompletedOnboarding: true });
    setMascotTourOpen(false);
    showToast('به برنامه Planix خوش آمدید 🦊', 'success');
  };

  const handleGoToRealView = () => {
    updateSettings({ hasSeenMascotTour: true, hasCompletedOnboarding: true });
    setActiveView(currentStep.viewKey);
    setMascotTourOpen(false);
    showToast(`ورود به بخش «${currentStep.title}»`, 'info');
  };

  return (
    <div
      id="visual-mascot-tour-modal"
      className="fixed inset-0 z-[250] bg-slate-950/90 backdrop-blur-md flex flex-col justify-between text-slate-100 select-none overflow-hidden h-[100dvh] max-h-[100dvh] w-full"
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 8px)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)',
        paddingLeft: 'max(env(safe-area-inset-left, 0px), 8px)',
        paddingRight: 'max(env(safe-area-inset-right, 0px), 8px)',
      }}
      dir="rtl"
    >
      {/* 1. TOP HEADER (Identical to Screenshot 2) */}
      <header className="w-full max-w-2xl mx-auto px-2 py-1.5 shrink-0 flex items-center justify-between border-b border-purple-900/30">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-900 border-2 border-amber-500/60 p-0.5 shadow-md shrink-0 flex items-center justify-center">
            <img
              src="/mascot.png"
              alt="ممد"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs sm:text-sm font-black text-white">
              راهنمای تصویری مرحله‌به‌مرحله با ممد 🦊
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/80 border border-purple-600/50 text-purple-200 font-bold">
              {formatDigits(currentStepIndex + 1)} از {formatDigits(totalSteps)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleFinish}
            className="py-1 px-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer active:scale-95"
            title="رد کردن راهنما و ورود مستقیم به برنامه"
          >
            <span>رد کردن و ورود</span>
            <X className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={handleGoToRealView}
            className="p-1.5 rounded-lg bg-purple-950/70 hover:bg-purple-900 border border-purple-600/40 text-purple-300 transition cursor-pointer active:scale-95"
            title="ورود مستقیم به این بخش"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. SECTION HORIZONTAL TABS (Identical to Screenshot 2) */}
      <div className="w-full max-w-2xl mx-auto px-2 pt-1.5 pb-1 shrink-0">
        <div
          ref={pillsContainerRef}
          className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar scroll-smooth"
        >
          {VISUAL_TOUR_SECTIONS.map((sec, idx) => {
            const IconComponent = getSectionIcon(sec.viewKey);
            const isCurrent = idx === currentStepIndex;
            return (
              <button
                key={sec.id}
                data-step-index={idx}
                type="button"
                onClick={() => handleSelectStep(idx)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 border border-purple-400/50'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span>{formatDigits(idx + 1)}.</span>
                <IconComponent className="w-3.5 h-3.5" />
                <span>{sec.title.split('(')[0].trim()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. MAIN SCROLLABLE CONTENT (Preserving the full rich original form cleanly!) */}
      <main
        ref={scrollContainerRef}
        className="w-full max-w-2xl mx-auto px-2 py-2 flex-1 min-h-0 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-purple-900/40 scroll-smooth"
      >
        {/* MASCOT SPEECH CARD (Screenshot 2) */}
        <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-purple-950/70 via-slate-900/90 to-indigo-950/70 border border-purple-600/40 shadow-lg relative">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-950 border-2 border-amber-500/70 p-0.5 shrink-0 overflow-hidden shadow-md">
              <img
                src="/mascot.png"
                alt="ممد"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                <h4 className="text-xs sm:text-sm font-black text-white">
                  {currentStep.title}
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-900/80 border border-purple-700/50 text-purple-200 font-bold">
                  {currentStep.category}
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed font-normal mb-2">
                {currentStep.mascotSpeech}
              </p>

              {/* Amber Pro Tip Box (Screenshot 2) */}
              <div className="p-2 sm:p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-center gap-2 text-xs text-amber-200">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="leading-snug">{currentStep.proTip}</span>
              </div>
            </div>
          </div>
        </div>

        {/* MOCKUP SECTION (Screenshot 2) */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-300 text-xs font-bold px-1">
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            <span>نمودار تصویری و اجزای بخش (مطابق نمونه ارسالی)</span>
          </div>

          <SectionDiagramMockup
            viewKey={currentStep.viewKey}
            activeCalloutId={activeCalloutId}
            onSelectCallout={(id) => setActiveCalloutId(id)}
          />
        </div>

        {/* 4 CALLOUT CARDS (Screenshot 3 - Clean, tidy, and minimalized!) */}
        <div className="space-y-2 pt-1">
          {currentStep.callouts.map((callout) => {
            const isSelected = activeCalloutId === callout.id;
            return (
              <div
                key={callout.id}
                onClick={() => {
                  if (settings.soundEnabled || settings.soundEffectsEnabled) {
                    soundEffects.playTick();
                  }
                  setActiveCalloutId(isSelected ? undefined : callout.id);
                }}
                className={`p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isSelected
                    ? 'bg-purple-950/60 border-purple-400 shadow-md shadow-purple-900/50'
                    : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Number Badge */}
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-md border border-purple-300/40">
                  {formatDigits(callout.number)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                    <h5 className="text-xs sm:text-sm font-black text-white">
                      {callout.title}
                    </h5>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-950/80 border border-purple-800/60 text-purple-300 font-bold">
                      {callout.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {callout.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* 4. BOTTOM ACTION FOOTER (Pinned with Safe Area Insets - Screenshot 3) */}
      <footer
        className="w-full max-w-2xl mx-auto px-2 pt-1.5 shrink-0 border-t border-purple-900/30 bg-slate-950/90"
        style={{
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)',
        }}
      >
        {/* Slim Progress Bar */}
        <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mb-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-2">
          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={isFirstStep}
            className="py-2 px-3 sm:px-4 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-slate-300 border border-slate-800 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-95 shrink-0"
          >
            <ArrowRight className="w-4 h-4" />
            <span>بخش قبلی</span>
          </button>

          {/* Skip / Step Count */}
          <button
            type="button"
            onClick={handleFinish}
            className="text-[11px] sm:text-xs font-semibold text-slate-400 hover:text-purple-300 py-1 px-2 rounded-lg transition cursor-pointer"
            title="رد کردن راهنما و ورود مستقیم به برنامه"
          >
            رد کردن راهنما
          </button>

          {/* Next / Finish Button */}
          <button
            type="button"
            onClick={handleNext}
            className="py-2 px-4 sm:px-5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-purple-600/30 border border-purple-400/40 transition cursor-pointer active:scale-98 shrink-0"
          >
            <span>{isLastStep ? 'پایان تور ✨' : 'بخش بعدی'}</span>
            {!isLastStep ? <ArrowLeft className="w-4 h-4" /> : <Check className="w-4 h-4" />}
          </button>
        </div>
      </footer>
    </div>
  );
};
