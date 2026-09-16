import React from 'react';
import {
  Calendar,
  MapPin,
  Target,
  Users,
  Compass,
  Briefcase,
  Layers,
  Edit3,
  PlusCircle,
  CheckCircle2,
} from 'lucide-react';
import { EventProfile, EventRosterStats } from '../types';

interface EventProfileCardProps {
  event: EventProfile;
  stats: EventRosterStats;
  onEditEvent: () => void;
  onCreateNewEvent: () => void;
  onAddApplicant: () => void;
}

export const EventProfileCard: React.FC<EventProfileCardProps> = ({
  event,
  stats,
  onEditEvent,
  onCreateNewEvent,
  onAddApplicant,
}) => {
  const capacityPercent = Math.min(
    100,
    Math.round((stats.confirmedInvitedCount / (event.maxCapacity || 1)) * 100)
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      {/* Header bar */}
      <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-900 border border-blue-200">
              當前策劃專案
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {event.date}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {event.location}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {event.name}
          </h1>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            id="btn-edit-event-settings"
            onClick={onEditEvent}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-all shadow-2xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            修改活動目標與標準
          </button>
          <button
            id="btn-create-new-event"
            onClick={onCreateNewEvent}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-xl transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
            建立新活動
          </button>
          <button
            id="btn-add-applicant"
            onClick={onAddApplicant}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5 text-white" />
            新增申請者
          </button>
        </div>
      </div>

      {/* Grid of 6 Core Event Criteria defined by the user */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 1. Brand Positioning */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-150 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              1. 品牌定位 (Brand Positioning)
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {event.brandPositioning}
            </p>
          </div>
        </div>

        {/* 2. Target Audience */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-150 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              2. 目標受眾 (Target Audience)
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {event.targetAudience}
            </p>
          </div>
        </div>

        {/* 3. Event Purpose */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-150 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              <Target className="w-3.5 h-3.5 text-blue-600" />
              3. 活動目的 (Event Purpose)
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {event.eventPurpose}
            </p>
          </div>
        </div>

        {/* 4. Preferred Guest Profile */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-150 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-600" />
              4. 偏好來賓輪廓 (Preferred Guest Profile)
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {event.preferredGuestProfile}
            </p>
          </div>
        </div>

        {/* 5. Collaboration Goals */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-150 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
              5. 合作目標 (Collaboration Goals)
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {event.collaborationGoals}
            </p>
          </div>
        </div>

        {/* 6. Capacity & Selection Progress Status */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-900 to-slate-900 text-white flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-blue-200 uppercase tracking-wider mb-1.5">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                6. 席位確認進度
              </span>
              <span className="text-amber-300 font-mono">
                {stats.confirmedInvitedCount}/{event.maxCapacity} 席
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 mb-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-400 to-blue-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${capacityPercent}%` }}
              />
            </div>
            <div className="grid grid-cols-3 gap-1 text-[11px] pt-1 text-center border-t border-slate-800">
              <div>
                <span className="text-slate-400 block text-[10px]">高契合</span>
                <span className="font-bold text-emerald-300">{stats.highMatchCount}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">待確認</span>
                <span className="font-bold text-amber-300">{stats.reviewFurtherCount}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">總報名</span>
                <span className="font-bold text-white">{stats.totalApplicants}</span>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-blue-200/80 mt-2 text-right">
            上限 {event.maxCapacity} 席 ‧ 嚴選高品質交流
          </div>
        </div>
      </div>
    </div>
  );
};
