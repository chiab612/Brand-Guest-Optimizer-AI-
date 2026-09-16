import React, { useState } from 'react';
import { X, Download, Copy, Check, CheckCircle2, Users, FileSpreadsheet, ShieldCheck, Sparkles } from 'lucide-react';
import { GuestApplication, EventProfile, EventRosterStats } from '../types';

interface ExportSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventProfile;
  guests: GuestApplication[];
  stats: EventRosterStats;
}

export const ExportSummaryModal: React.FC<ExportSummaryModalProps> = ({
  isOpen,
  onClose,
  event,
  guests,
  stats,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const confirmedGuests = guests.filter((g) => g.humanDecision === 'confirmed_invited');
  const waitlistGuests = guests.filter((g) => g.humanDecision === 'waitlist');
  const chatGuests = guests.filter((g) => g.humanDecision === 'further_discussion');

  const generateReportText = () => {
    return `【${event.name}｜貴賓邀請名冊與活動優化決策摘要】
顧問主理：黃老師｜活動優化師 (Technology & Lifestyle Media Creator / Brand Content Consultant)
策展原則：「不是把人分類，而是讓品牌更了解誰適合這場活動。」
審核機制：「AI 提供分析，最終邀請決策由品牌方與活動優化師人工確認。」

■ 活動基本資訊：
- 活動日期：${event.date}
- 活動場地：${event.location}
- 席位目標：${stats.confirmedInvitedCount} / ${event.maxCapacity} 席 (總申請 ${stats.totalApplicants} 位)
- 品牌定位：${event.brandPositioning}
- 活動目的：${event.eventPurpose}

■ 正式確認出席名單 (${confirmedGuests.length} 位)：
${confirmedGuests
  .map(
    (g, i) =>
      `${i + 1}. ${g.name} ｜ ${g.title} (${g.company})\n   產業：${g.industry} ｜ 契合評分：${g.analysis.overallMatchScore}分\n   合作價值：${g.potentialCollaborationValue}\n   優化師備註：${g.analysis.huangTeacherConsultantAdvice}`
  )
  .join('\n\n')}

■ 候補席次名單 (${waitlistGuests.length} 位)：
${waitlistGuests.map((g, i) => `${i + 1}. ${g.name} (${g.company}) - 契合度：${g.analysis.overallMatchScore}分`).join('\n')}

■ 安排事前對焦名單 (${chatGuests.length} 位)：
${chatGuests.map((g, i) => `${i + 1}. ${g.name} (${g.company})`).join('\n')}
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateReportText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCSV = () => {
    const headers = [
      '姓名',
      '公司職稱',
      '產業領域',
      'AI推薦類別',
      '綜合契合分',
      '人工審定結果',
      '出席率',
      '參與動機',
      '潛在合作價值',
      '優化師黃老師建議',
      '品牌內部備註',
    ];

    const rows = guests.map((g) => [
      `"${g.name}"`,
      `"${g.company} / ${g.title}"`,
      `"${g.industry}"`,
      `"${g.analysis.recommendation}"`,
      g.analysis.overallMatchScore,
      `"${g.humanDecision}"`,
      `"${g.previousParticipation.attendanceRate}%"`,
      `"${(g.reasonForAttending || '').replace(/"/g, '""')}"`,
      `"${(g.potentialCollaborationValue || '').replace(/"/g, '""')}"`,
      `"${(g.analysis.huangTeacherConsultantAdvice || '').replace(/"/g, '""')}"`,
      `"${(g.humanNotes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${event.name}_邀請審定名冊.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-base font-bold">出席名冊與策展決策簡報匯出</h3>
              <p className="text-xs text-slate-400">
                供品牌高階決策層、公關接待團隊與現場簽到組使用
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Summary Box */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="font-bold text-blue-950 block text-sm mb-0.5">
                {event.name}
              </span>
              <p className="text-blue-900">
                已確認正式席次：<strong className="text-blue-950 font-bold">{confirmedGuests.length} 席</strong> / 上限 {event.maxCapacity} 席
                （候補：{waitlistGuests.length} 位 ‧ 待對焦：{chatGuests.length} 位）
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-white border border-blue-200 text-blue-900 font-bold hover:bg-blue-100 flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? '已複製簡報！' : '複製文字簡報'}
              </button>
              <button
                onClick={handleDownloadCSV}
                className="px-3.5 py-1.5 rounded-lg bg-blue-900 text-white font-bold hover:bg-blue-800 flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                下載完整 CSV 報表
              </button>
            </div>
          </div>

          {/* Core Creed Reminder */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
            <span>
              <strong>活動優化師提醒：</strong>「不是把人分類，而是讓品牌更了解誰適合這場活動。」所有出席人員均已附上專業接待重點與後續合作切角。
            </span>
          </div>

          {/* Confirmed list preview */}
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              正式確認出席貴賓清單 ({confirmedGuests.length} 人)
            </h4>
            <div className="space-y-2">
              {confirmedGuests.length === 0 ? (
                <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  尚未標記任何確認出席之來賓。可在卡片上點擊「邀請」按鈕進行審定。
                </div>
              ) : (
                confirmedGuests.map((g) => (
                  <div
                    key={g.id}
                    className="p-3 bg-white rounded-xl border border-slate-200 flex items-start justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={g.avatar}
                        alt={g.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          {g.name}
                          <span className="text-[10px] font-normal text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {g.industry}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px]">
                          {g.title} ‧ {g.company}
                        </p>
                        <p className="text-blue-900 text-[11px] mt-0.5">
                          接待引導：{g.analysis.huangTeacherConsultantAdvice}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {g.analysis.overallMatchScore} 分
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg"
          >
            關閉視窗
          </button>
        </div>
      </div>
    </div>
  );
};
