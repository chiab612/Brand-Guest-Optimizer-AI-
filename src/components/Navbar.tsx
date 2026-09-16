import React from 'react';
import { Sparkles, Calendar, Users, FileText, CheckCircle2 } from 'lucide-react';
import { EventProfile } from '../types';

interface NavbarProps {
  events: EventProfile[];
  currentEvent: EventProfile;
  onSelectEvent: (event: EventProfile) => void;
  onOpenCreateEvent: () => void;
  onOpenMethodology: () => void;
  onOpenExport: () => void;
  confirmedCount: number;
  totalApplicants: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  events,
  currentEvent,
  onSelectEvent,
  onOpenCreateEvent,
  onOpenMethodology,
  onOpenExport,
  confirmedCount,
  totalApplicants,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Product Positioning */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white flex items-center justify-center shadow-md shadow-blue-950/20 shrink-0">
              <Sparkles className="w-5 h-5 text-blue-300" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 truncate">
                  Brand Guest Optimizer
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                  活動優化師｜AI 品牌來賓篩選工具
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate hidden sm:block">
                Professional Event Guest Screening & Brand Alignment Platform
              </p>
            </div>
          </div>

          {/* Right actions: Event Switcher & Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Event Dropdown Switcher */}
            <div className="relative hidden md:flex items-center">
              <span className="text-xs font-medium text-slate-500 mr-2 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" /> 當前專案:
              </span>
              <select
                id="event-selector-dropdown"
                value={currentEvent.id}
                onChange={(e) => {
                  const target = events.find((ev) => ev.id === e.target.value);
                  if (target) onSelectEvent(target);
                }}
                className="text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200/80 border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors max-w-[220px] truncate"
              >
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Event Capacity Pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs">
              <Users className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-slate-600 font-medium">席位進度:</span>
              <span className="font-bold text-blue-900">
                {confirmedCount} / {currentEvent.maxCapacity}
              </span>
              <span className="text-slate-400">({totalApplicants} 位申請)</span>
            </div>

            {/* Methodology Guide Button */}
            <button
              id="btn-open-methodology"
              onClick={onOpenMethodology}
              className="text-xs font-medium text-slate-700 hover:text-blue-900 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              title="查看活動優化師篩選哲學與指標說明"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">優化學導引</span>
            </button>

            {/* Export Roster Button */}
            <button
              id="btn-open-export"
              onClick={onOpenExport}
              className="text-xs font-semibold text-white bg-blue-900 hover:bg-blue-850 px-3 py-1.5 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-300" />
              <span>出席名冊與簡報</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
