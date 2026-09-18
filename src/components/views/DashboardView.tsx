import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '../../services/db';
import { formatToJalali, toPersianDigits, toGregorianIsoDate } from '../../utils/jalali';
import { HabitCreateModal } from '../habits/HabitCreateModal';
import {
  CheckSquare,
  Calendar as CalendarIcon,
  Timer,
  Flame,
  Plus,
  FolderKanban,
  Target,
  FileText,
  Sparkles,
  Zap,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { openQuickAdd, setActiveView, refreshTrigger, settings, openMascotTour } = useApp();
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);

  const todayIso = toGregorianIsoDate();
  const todayJalali = formatToJalali(new Date(), 'full', settings.persianDigits);

  // Real Database Queries for Today
  const allTasks = useMemo(() => db.getTasks(), [refreshTrigger]);
  const allEvents = useMemo(() => db.getEvents(), [refreshTrigger]);
  const allHabits = useMemo(() => db.getHabits(), [refreshTrigger]);
  const allHabitLogs = useMemo(() => db.getHabitLogs(), [refreshTrigger]);
  const allPomodoro = useMemo(() => db.getPomodoroSessions(), [refreshTrigger]);

  // Today's specific data
  const todayTasks = useMemo(() => {
    return allTasks.filter((t) => !t.dueDate || t.dueDate === todayIso);
  }, [allTasks, todayIso]);

  const completedTodayTasks = useMemo(() => {
    return todayTasks.filter((t) => t.status === 'completed');
  }, [todayTasks]);

  const todayEvents = useMemo(() => {
    return allEvents.filter((e) => e.startDate === todayIso);
  }, [allEvents, todayIso]);

  const todayPomodoros = useMemo(() => {
    return allPomodoro.filter((p) => p.completedAt.startsWith(todayIso) && p.mode === 'focus');
  }, [allPomodoro, todayIso]);

  const todayFocusMinutes = useMemo(() => {
    return todayPomodoros.reduce((acc, p) => acc + p.durationMinutes, 0);
  }, [todayPomodoros]);

  const todayHabitsDoneCount = useMemo(() => {
    return allHabitLogs.filter((l) => l.date === todayIso && l.completed).length;
  }, [allHabitLogs, todayIso]);

  const focusHours = Math.floor(todayFocusMinutes / 60);
  const focusRemMinutes = todayFocusMinutes % 60;
  const focusTimeDisplay =
    focusHours > 0
      ? `${focusHours}:${String(focusRemMinutes).padStart(2, '0')}`
      : `${focusRemMinutes} دقیقه`;

  return (
    <div id="dashboard-view" className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-24 sm:pb-8" dir="rtl">
      
      {/* Action Buttons Bar (Clean, immediate access) */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {/* Left (in RTL): شروع تمرکز */}
        <button
          id="dashboard-secondary-focus-btn"
          type="button"
          onClick={() => setActiveView('pomodoro')}
          className="w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 font-bold text-xs sm:text-sm border border-slate-700/70 hover:border-purple-500/50 flex items-center justify-center gap-2 transition shadow-md cursor-pointer active:scale-98"
        >
          <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
          <span>شروع تمرکز</span>
        </button>

        {/* Right (in RTL): وظیفه جدید */}
        <button
          id="dashboard-primary-add-btn"
          type="button"
          onClick={() => openQuickAdd('task')}
          className="w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/35 border border-purple-400/40 transition active:scale-98 cursor-pointer"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5] text-white" />
          <span className="text-white font-black">+ وظیفه جدید</span>
        </button>
      </div>

      {/* Top 4 Summary Metric Cards (Clean, 2x2 matching screenshot) */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
        {/* Card 1: وظایف امروز */}
        <div
          onClick={() => setActiveView('tasks')}
          className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-700/50 transition cursor-pointer group flex flex-col justify-between shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1.5 sm:mb-2">
            <span className="text-xs sm:text-sm font-bold text-slate-200">وظایف امروز</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-purple-950/70 border border-purple-800/40 text-purple-400 flex items-center justify-center group-hover:scale-105 transition">
              <CheckSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-xl sm:text-2xl font-black text-slate-100">
              {settings.persianDigits ? toPersianDigits(completedTodayTasks.length) : completedTodayTasks.length}
            </span>
            <span className="text-xs text-slate-400">
              از {settings.persianDigits ? toPersianDigits(todayTasks.length) : todayTasks.length}
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-800 h-1 sm:h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-purple-500 h-full rounded-full transition-all duration-500"
              style={{
                width: `${todayTasks.length > 0 ? (completedTodayTasks.length / todayTasks.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Card 2: رویدادها */}
        <div
          onClick={() => setActiveView('calendar')}
          className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-700/50 transition cursor-pointer group flex flex-col justify-between shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1.5 sm:mb-2">
            <span className="text-xs sm:text-sm font-bold text-slate-200">رویدادها</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-indigo-950/70 border border-indigo-800/40 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition">
              <CalendarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="my-1">
            <span className="text-xs sm:text-sm font-bold text-slate-200 block truncate">
              {todayEvents.length > 0
                ? `${settings.persianDigits ? toPersianDigits(todayEvents.length) : todayEvents.length} برنامه امروز`
                : `${settings.persianDigits ? toPersianDigits(0) : '0'} برنامه امروز`}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 truncate">
            {todayEvents.length > 0 ? `اولین: ${todayEvents[0].startTime}` : 'بدون جلسه کاری'}
          </p>
        </div>

        {/* Card 3: تمرکز امروز */}
        <div
          onClick={() => setActiveView('pomodoro')}
          className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-700/50 transition cursor-pointer group flex flex-col justify-between shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1.5 sm:mb-2">
            <span className="text-xs sm:text-sm font-bold text-slate-200">تمرکز امروز</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-emerald-950/70 border border-emerald-800/40 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition">
              <Timer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-xl sm:text-2xl font-black text-slate-100">
              {settings.persianDigits ? toPersianDigits(focusTimeDisplay) : focusTimeDisplay}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 truncate">
            {settings.persianDigits ? toPersianDigits(todayPomodoros.length) : todayPomodoros.length} سشن تمرکز
          </p>
        </div>

        {/* Card 4: عادت‌ها */}
        <div
          onClick={() => setActiveView('habits')}
          className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-700/50 transition cursor-pointer group flex flex-col justify-between shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1.5 sm:mb-2">
            <span className="text-xs sm:text-sm font-bold text-slate-200">عادت‌ها</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-amber-950/70 border border-amber-800/40 text-amber-400 flex items-center justify-center group-hover:scale-105 transition">
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-xl sm:text-2xl font-black text-slate-100">
              {settings.persianDigits ? toPersianDigits(todayHabitsDoneCount) : todayHabitsDoneCount}
            </span>
            <span className="text-xs text-slate-400">
              از {settings.persianDigits ? toPersianDigits(allHabits.length) : allHabits.length}
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-800 h-1 sm:h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{
                width: `${allHabits.length > 0 ? (todayHabitsDoneCount / allHabits.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Quick Actions Bar (Compact 6-button Grid matching screenshot) */}
      <div className="p-3 sm:p-4.5 rounded-xl sm:rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-purple-400" />
            دسترسی و ثبت سریع
          </span>
        </div>

        {/* 6 Grid items in 2 rows of 3 */}
        <div className="grid grid-cols-3 gap-2">
          {/* Row 1: + وظیفه | + رویداد | + پروژه */}
          <button
            type="button"
            onClick={() => openQuickAdd('task')}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-800/70 hover:bg-purple-950/40 border border-slate-700/50 hover:border-purple-800/60 flex items-center justify-center gap-1.5 sm:gap-2 transition cursor-pointer group active:scale-95"
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-purple-950/80 text-purple-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
              <CheckSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <span className="text-xs font-bold text-slate-200">+ وظیفه</span>
          </button>

          <button
            type="button"
            onClick={() => openQuickAdd('event')}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-800/70 hover:bg-indigo-950/40 border border-slate-700/50 hover:border-indigo-800/60 flex items-center justify-center gap-1.5 sm:gap-2 transition cursor-pointer group active:scale-95"
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-indigo-950/80 text-indigo-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
              <CalendarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <span className="text-xs font-bold text-slate-200">+ رویداد</span>
          </button>

          <button
            type="button"
            onClick={() => openQuickAdd('project')}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-800/70 hover:bg-blue-950/40 border border-slate-700/50 hover:border-blue-800/60 flex items-center justify-center gap-1.5 sm:gap-2 transition cursor-pointer group active:scale-95"
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-950/80 text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
              <FolderKanban className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <span className="text-xs font-bold text-slate-200">+ پروژه</span>
          </button>

          {/* Row 2: + هدف | + یادداشت | + عادت */}
          <button
            type="button"
            onClick={() => openQuickAdd('goal')}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-800/70 hover:bg-emerald-950/40 border border-slate-700/50 hover:border-emerald-800/60 flex items-center justify-center gap-1.5 sm:gap-2 transition cursor-pointer group active:scale-95"
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-950/80 text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
              <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <span className="text-xs font-bold text-slate-200">+ هدف</span>
          </button>

          <button
            type="button"
            onClick={() => openQuickAdd('note')}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-800/70 hover:bg-amber-950/40 border border-slate-700/50 hover:border-amber-800/60 flex items-center justify-center gap-1.5 sm:gap-2 transition cursor-pointer group active:scale-95"
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-amber-950/80 text-amber-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <span className="text-xs font-bold text-slate-200">+ یادداشت</span>
          </button>

          <button
            type="button"
            onClick={() => setIsHabitModalOpen(true)}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-800/70 hover:bg-rose-950/40 border border-slate-700/50 hover:border-rose-800/60 flex items-center justify-center gap-1.5 sm:gap-2 transition cursor-pointer group active:scale-95"
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-rose-950/80 text-rose-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <span className="text-xs font-bold text-slate-200">+ عادت</span>
          </button>
        </div>
      </div>

      {/* Dedicated Clean Habit Create Modal */}
      <HabitCreateModal
        isOpen={isHabitModalOpen}
        onClose={() => setIsHabitModalOpen(false)}
      />
    </div>
  );
};
