import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  Award,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MessageSquare,
  XCircle,
  TrendingUp,
  Briefcase,
  Layers,
  ExternalLink,
  History,
  RotateCw,
  Save,
  Check,
} from 'lucide-react';
import { GuestApplication, HumanDecision, MatchCategory, EventProfile } from '../types';

interface GuestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest: GuestApplication | null;
  event: EventProfile;
  onUpdateDecision: (guestId: string, decision: HumanDecision, notes: string) => void;
  onReAnalyze: (guest: GuestApplication) => Promise<void>;
  isAnalyzing?: boolean;
}

export const GuestDetailModal: React.FC<GuestDetailModalProps> = ({
  isOpen,
  onClose,
  guest,
  event,
  onUpdateDecision,
  onReAnalyze,
  isAnalyzing = false,
}) => {
  if (!isOpen || !guest) return null;

  const [localDecision, setLocalDecision] = useState<HumanDecision>(guest.humanDecision);
  const [localNotes, setLocalNotes] = useState<string>(guest.humanNotes || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const analysis = guest.analysis;

  const handleSave = () => {
    onUpdateDecision(guest.id, localDecision, localNotes);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 65) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-slate-600 bg-slate-100 border-slate-200';
  };

  const getProgressWidth = (score: number) => `${Math.max(10, Math.min(100, score))}%`;

  const getProgressBarColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-500';
    if (score >= 65) return 'bg-amber-500';
    return 'bg-slate-400';
  };

  const getRecommendationBadge = (rec: MatchCategory) => {
    switch (rec) {
      case 'High Match':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            高契合度 (High Match)
          </span>
        );
      case 'Review Further':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            待進一步評估 (Review Further)
          </span>
        );
      case 'Low Match':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-150 text-slate-750 border border-slate-300">
            <span className="w-2 h-2 rounded-full bg-slate-500"></span>
            契合度較低 (Low Match)
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight">
                  AI 8 大維度來賓綜合剖析報表
                </span>
                <span className="text-xs bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded font-mono">
                  ID: {guest.id}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                對應活動：{event.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Guest Profile Summary Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={guest.avatar}
                alt={guest.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white shadow-sm shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-slate-900">{guest.name}</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 border border-blue-200">
                    {guest.industry}
                  </span>
                  {getRecommendationBadge(analysis.recommendation)}
                </div>
                <p className="text-xs text-slate-600 mt-1 font-medium">
                  {guest.title} ‧ {guest.company}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5 flex-wrap">
                  <span className="flex items-center gap-1">
                    <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                    {guest.publicProfile.platform}: {guest.publicProfile.reach}
                  </span>
                  <span>‧</span>
                  <span className="flex items-center gap-1">
                    <History className="w-3.5 h-3.5 text-slate-500" />
                    出席率: {guest.previousParticipation.attendanceRate}%
                  </span>
                </div>
              </div>
            </div>

            {/* Overall Score & Re-run with Gemini */}
            <div className="flex flex-row md:flex-col items-end gap-2 shrink-0">
              <div className="text-right">
                <span className="text-[11px] text-slate-400 font-semibold uppercase block">
                  綜合契合指數
                </span>
                <span className="text-2xl sm:text-3xl font-black text-blue-950 font-mono">
                  {analysis.overallMatchScore}
                  <span className="text-sm font-normal text-slate-400">/100</span>
                </span>
              </div>
              <button
                disabled={isAnalyzing}
                onClick={() => onReAnalyze(guest)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors shadow-2xs"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                {isAnalyzing ? 'Gemini 3.8 分析中...' : '重新以 AI 深度運算'}
              </button>
            </div>
          </div>

          {/* Section 4: Event Optimizer Recommendation & Consultant Advice */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-900 via-slate-900 to-blue-950 text-white shadow-md">
            <div className="flex items-center justify-between gap-2 border-b border-blue-800/80 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                  Section 4: 活動優化師綜合推薦建議 (Event Optimizer Recommendation)
                </span>
              </div>
              <div>{getRecommendationBadge(analysis.recommendation)}</div>
            </div>

            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed mb-3">
              <strong>評定結論：</strong> {analysis.recommendationReason}
            </p>

            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
              <div className="font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                黃老師｜活動優化師專屬策展接待建議：
              </div>
              <p className="text-slate-200 leading-relaxed font-normal">
                {analysis.huangTeacherConsultantAdvice}
              </p>
            </div>
          </div>

          {/* Section 3: AI Guest Analysis (8 Required Dimensions) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Section 3: AI 8 大維度結構化訊號分析 (AI Guest Analysis)
              </h4>
              <span className="text-[11px] text-slate-500">
                基於品牌定位、活動目標與申請內容自動權重配比
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. Event Fit */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    1. 活動契合度 (Event Fit)
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border font-mono ${getScoreColor(analysis.eventFitScore)}`}>
                    {analysis.eventFitScore} 分
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${getProgressBarColor(analysis.eventFitScore)}`}
                    style={{ width: getProgressWidth(analysis.eventFitScore) }}
                  />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {analysis.eventFitRationale}
                </p>
              </div>

              {/* 2. Professional Relevance */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    2. 專業背景關聯度 (Professional Relevance)
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border font-mono ${getScoreColor(analysis.professionalRelevanceScore)}`}>
                    {analysis.professionalRelevanceScore} 分
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${getProgressBarColor(analysis.professionalRelevanceScore)}`}
                    style={{ width: getProgressWidth(analysis.professionalRelevanceScore) }}
                  />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {analysis.professionalRelevanceRationale}
                </p>
              </div>

              {/* 3. Participation Purpose */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    3. 參與目的明確性 (Participation Purpose)
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border font-mono ${getScoreColor(analysis.participationPurposeScore)}`}>
                    {analysis.participationPurposeScore} 分
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${getProgressBarColor(analysis.participationPurposeScore)}`}
                    style={{ width: getProgressWidth(analysis.participationPurposeScore) }}
                  />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {analysis.participationPurposeRationale}
                </p>
              </div>

              {/* 4. Industry Relevance */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    4. 產業生態關聯度 (Industry Relevance)
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border font-mono ${getScoreColor(analysis.industryRelevanceScore)}`}>
                    {analysis.industryRelevanceScore} 分
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${getProgressBarColor(analysis.industryRelevanceScore)}`}
                    style={{ width: getProgressWidth(analysis.industryRelevanceScore) }}
                  />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {analysis.industryRelevanceRationale}
                </p>
              </div>

              {/* 5. Collaboration Potential */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    5. 合作潛在價值 (Collaboration Potential)
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border font-mono ${getScoreColor(analysis.collaborationPotentialScore)}`}>
                    {analysis.collaborationPotentialScore} 分
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${getProgressBarColor(analysis.collaborationPotentialScore)}`}
                    style={{ width: getProgressWidth(analysis.collaborationPotentialScore) }}
                  />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {analysis.collaborationPotentialRationale}
                </p>
              </div>

              {/* 6. Profile Consistency */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    6. 公開經歷一致性 (Profile Consistency)
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border font-mono ${getScoreColor(analysis.profileConsistencyScore)}`}>
                    {analysis.profileConsistencyScore} 分
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${getProgressBarColor(analysis.profileConsistencyScore)}`}
                    style={{ width: getProgressWidth(analysis.profileConsistencyScore) }}
                  />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {analysis.profileConsistencyRationale}
                </p>
              </div>

              {/* 7. Previous Participation Signals */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    7. 過往參與出席訊號 (Previous Participation)
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                    analysis.previousParticipationSignals.status === 'positive'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : analysis.previousParticipationSignals.status === 'caution'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {analysis.previousParticipationSignals.status === 'positive'
                      ? '良好穩定'
                      : analysis.previousParticipationSignals.status === 'caution'
                      ? '需留意確認'
                      : '新來賓無歷史紀錄'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {analysis.previousParticipationSignals.summary}
                </p>
              </div>

              {/* 8. Duplicate / Abnormal Registration Signals */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                    8. 填報訊號與異常特徵檢測 (Abnormal / Duplicate Signals)
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                    analysis.duplicateOrAbnormalSignals.detected
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}>
                    {analysis.duplicateOrAbnormalSignals.detected ? '注意填答特徵' : '常態獨立報名'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {analysis.duplicateOrAbnormalSignals.details}
                </p>
                <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  註：本系統僅就客觀填答行為與格式做訊號檢核，嚴格恪守不作人身或道德標籤。
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Human Review & Decision Workflow */}
          <div className="p-5 rounded-2xl bg-white border-2 border-blue-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-150 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-900" />
                  Section 5: 品牌方與活動優化師人工審定 (Human Review)
                </h4>
                <p className="text-xs text-blue-900 font-semibold mt-0.5">
                  「AI 提供分析，最終邀請決策由品牌方與活動優化師人工確認。」
                </p>
              </div>
              <span className="text-xs text-slate-500">
                共同審定責任制 ‧ 捍衛品牌與活動品質
              </span>
            </div>

            {/* Decision Select Radio / Buttons */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                最終名單歸納決策：
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  type="button"
                  onClick={() => setLocalDecision('confirmed_invited')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    localDecision === 'confirmed_invited'
                      ? 'bg-blue-900 text-white border-blue-900 shadow-md ring-2 ring-blue-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>正式發送邀請 (Invited)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLocalDecision('waitlist')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    localDecision === 'waitlist'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-400'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Clock className="w-4 h-4 text-amber-300" />
                  <span>保留為候補 (Waitlist)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLocalDecision('further_discussion')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    localDecision === 'further_discussion'
                      ? 'bg-purple-700 text-white border-purple-700 shadow-md ring-2 ring-purple-400'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-purple-300" />
                  <span>事前深度對焦 (Chat)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLocalDecision('declined')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    localDecision === 'declined'
                      ? 'bg-slate-700 text-white border-slate-700 shadow-md ring-2 ring-slate-500'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <XCircle className="w-4 h-4 text-slate-300" />
                  <span>本次暫不安排 (Declined)</span>
                </button>
              </div>
            </div>

            {/* Internal Collaborative Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                品牌方與黃老師協同備註 (Internal Notes)：
              </label>
              <textarea
                rows={2}
                value={localNotes}
                onChange={(e) => setLocalNotes(e.target.value)}
                placeholder="記錄品牌團隊或優化師的內部考量，例如：安排其與特定來賓同桌、借測機種型號、特殊飲食需求..."
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            {savedSuccess && (
              <span className="text-emerald-700 font-bold flex items-center gap-1 animate-in fade-in">
                <Check className="w-4 h-4" /> 決策已成功儲存！
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/70 rounded-xl transition-colors"
            >
              關閉
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-850 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              儲存人工審定決策
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
