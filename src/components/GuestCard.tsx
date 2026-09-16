import React from 'react';
import {
  Sparkles,
  ExternalLink,
  Clock,
  History,
  AlertTriangle,
  ChevronRight,
  Briefcase,
  CheckCircle2,
  HelpCircle,
  XCircle,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { GuestApplication, HumanDecision, MatchCategory } from '../types';

interface GuestCardProps {
  guest: GuestApplication;
  onOpenDetail: (guest: GuestApplication) => void;
  onQuickDecision: (guestId: string, decision: HumanDecision) => void;
  onReAnalyze: (guest: GuestApplication) => void;
}

export const GuestCard: React.FC<GuestCardProps> = ({
  guest,
  onOpenDetail,
  onQuickDecision,
  onReAnalyze,
}) => {
  const getRecommendationBadge = (rec: MatchCategory) => {
    switch (rec) {
      case 'High Match':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            高契合度 (High Match)
          </span>
        );
      case 'Review Further':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            待進一步評估 (Review Further)
          </span>
        );
      case 'Low Match':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            契合度較低 (Low Match)
          </span>
        );
    }
  };

  const getHumanDecisionBadge = (decision: HumanDecision) => {
    switch (decision) {
      case 'confirmed_invited':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-900 text-white shadow-2xs">
            <CheckCircle2 className="w-3 h-3 text-emerald-300" /> 正式邀請名單
          </span>
        );
      case 'waitlist':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-700" /> 候補名單
          </span>
        );
      case 'further_discussion':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-purple-100 text-purple-900 border border-purple-300">
            <MessageSquare className="w-3 h-3 text-purple-700" /> 安排事前對焦
          </span>
        );
      case 'declined':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-200 text-slate-700">
            <XCircle className="w-3 h-3 text-slate-500" /> 本次暫無席位
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <HelpCircle className="w-3 h-3 text-slate-400" /> 待人工確認
          </span>
        );
    }
  };

  return (
    <div
      id={`guest-card-${guest.id}`}
      className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden"
    >
      {/* Top Header Section: Profile & Status */}
      <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 bg-gradient-to-b from-white to-slate-50/40">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={guest.avatar}
              alt={guest.name}
              referrerPolicy="no-referrer"
              className="w-13 h-13 rounded-2xl object-cover ring-2 ring-slate-100 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-slate-900 truncate">
                  {guest.name}
                </h3>
                <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  {guest.industry}
                </span>
              </div>
              <p className="text-xs text-slate-600 truncate mt-0.5 font-medium">
                {guest.title} ‧ {guest.company}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-end gap-1.5">
            {getRecommendationBadge(guest.analysis.recommendation)}
            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 font-semibold">
              綜合契合分:
              <span className="text-blue-900 font-bold text-xs bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-150">
                {guest.analysis.overallMatchScore}分
              </span>
            </div>
          </div>
        </div>

        {/* Human Decision Badge Bar */}
        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100/80">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-medium">決策進度:</span>
            {getHumanDecisionBadge(guest.humanDecision)}
          </div>
          {guest.registrationMeta.ipDuplicateFlag && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              偵測到填報重複特徵
            </span>
          )}
        </div>
      </div>

      {/* Main Content Info Fields */}
      <div className="p-5 sm:p-6 space-y-4 text-xs">
        {/* 1. Professional Background */}
        <div>
          <span className="font-bold text-slate-700 block mb-1 uppercase tracking-wider text-[11px]">
            專業背景與經歷 (Professional Background)
          </span>
          <p className="text-slate-600 leading-relaxed line-clamp-2">
            {guest.professionalBackground}
          </p>
        </div>

        {/* 2. Reason for Attending */}
        <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-150">
          <span className="font-bold text-blue-950 block mb-1 text-[11px] flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
            報名參與動機 (Reason for Attending)
          </span>
          <p className="text-slate-700 italic leading-relaxed line-clamp-2">
            "{guest.reasonForAttending}"
          </p>
        </div>

        {/* 3. Potential Collaboration Value */}
        <div>
          <span className="font-bold text-slate-700 block mb-1 text-[11px] flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
            潛在商務 / 內容共創價值 (Collaboration Value)
          </span>
          <p className="text-slate-600 leading-relaxed font-medium line-clamp-2">
            {guest.potentialCollaborationValue}
          </p>
        </div>

        {/* 4. Previous Attendance & Public Profile Signals */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-[11px]">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <div className="text-slate-400 font-medium mb-1 flex items-center gap-1">
              <History className="w-3 h-3 text-slate-500" />
              過往參與紀錄
            </div>
            <div className="font-bold text-slate-800">
              出席率: {guest.previousParticipation.attendanceRate}% ({guest.previousParticipation.attendanceCount}場)
            </div>
            <div className="text-slate-500 truncate text-[10px] mt-0.5">
              {guest.previousParticipation.pastEvents.length > 0
                ? guest.previousParticipation.pastEvents[0]
                : '初次報名來賓'}
            </div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <div className="text-slate-400 font-medium mb-1 flex items-center gap-1">
              <ExternalLink className="w-3 h-3 text-slate-500" />
              公開社群與專業輪廓
            </div>
            <div className="font-bold text-slate-800 truncate">
              {guest.publicProfile.platform}
            </div>
            <div className="text-slate-500 truncate text-[10px] mt-0.5">
              {guest.publicProfile.reach}
            </div>
          </div>
        </div>

        {/* Consultant Quote Snippet */}
        <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-150/70 text-[11px]">
          <span className="font-bold text-blue-900 block mb-0.5 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-blue-600" /> 黃老師優化師筆記：
          </span>
          <p className="text-blue-950/80 leading-relaxed line-clamp-2">
            {guest.analysis.huangTeacherConsultantAdvice}
          </p>
        </div>
      </div>

      {/* Footer Actions: Decision buttons & View Detail */}
      <div className="p-4 bg-slate-50/90 border-t border-slate-150 flex flex-wrap items-center justify-between gap-2.5">
        {/* Quick Decision Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => onQuickDecision(guest.id, 'confirmed_invited')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
              guest.humanDecision === 'confirmed_invited'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-blue-50 border border-slate-200'
            }`}
            title="確認邀請此來賓出席"
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            邀請
          </button>
          <button
            onClick={() => onQuickDecision(guest.id, 'waitlist')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
              guest.humanDecision === 'waitlist'
                ? 'bg-amber-600 text-white'
                : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
            }`}
            title="納入候補席次"
          >
            <Clock className="w-3 h-3 text-amber-500" />
            候補
          </button>
          <button
            onClick={() => onQuickDecision(guest.id, 'declined')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
              guest.humanDecision === 'declined'
                ? 'bg-slate-600 text-white'
                : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
            }`}
            title="本次暫無名額"
          >
            婉謝
          </button>
        </div>

        {/* Deep Dive 8-Dimension Detail Button */}
        <button
          onClick={() => onOpenDetail(guest)}
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 hover:text-blue-700 bg-white hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 shadow-2xs transition-all ml-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>8 維度 AI 分析詳情</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
