import React, { useState } from 'react';
import { X, Sparkles, User, Briefcase, MessageSquare, History, Globe, Layers } from 'lucide-react';
import { GuestApplication, EventProfile } from '../types';

interface AddGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventProfile;
  onAddGuest: (applicant: Partial<GuestApplication>) => Promise<void>;
  isSubmitting?: boolean;
}

export const AddGuestModal: React.FC<AddGuestModalProps> = ({
  isOpen,
  onClose,
  event,
  onAddGuest,
  isSubmitting = false,
}) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [industry, setIndustry] = useState('科技與生活風格自媒體');
  const [professionalBackground, setProfessionalBackground] = useState('');
  const [reasonForAttending, setReasonForAttending] = useState('');
  const [attendanceCount, setAttendanceCount] = useState(1);
  const [attendanceRate, setAttendanceRate] = useState(100);
  const [engagementNotes, setEngagementNotes] = useState('積極參與交流');
  const [platform, setPlatform] = useState('Instagram & Substack');
  const [reach, setReach] = useState('42,000 追蹤');
  const [potentialCollaborationValue, setPotentialCollaborationValue] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await onAddGuest({
      name,
      company,
      title,
      industry,
      professionalBackground,
      reasonForAttending,
      previousParticipation: {
        attendanceCount,
        pastEvents: attendanceCount > 0 ? ['過往活動'] : [],
        attendanceRate,
        engagementNotes,
      },
      publicProfile: {
        platform,
        handle: `@${name.toLowerCase().replace(/\s+/g, '_')}`,
        url: 'https://example.com',
        reach,
        verified: true,
      },
      potentialCollaborationValue,
      registrationMeta: {
        submittedAt: new Date().toLocaleString(),
        sourceChannel: '品牌官網報名表單',
        ipDuplicateFlag: false,
        registrationPatternNote: '透過系統手動建檔或即時送件',
      },
    });

    onClose();
  };

  const fillQuickPreset = (preset: 'kpi-media' | 'designer' | 'casual') => {
    if (preset === 'kpi-media') {
      setName('溫若涵 Nicole Wen');
      setCompany('TRENDLIFE 品味趨勢網');
      setTitle('數位主編');
      setIndustry('科技生活與消費趨勢媒體');
      setProfessionalBackground('前知名生活風格雜誌專欄作家，長期報導高端音響、居家品味與現代工藝趨勢，累積超過 6 年評測資歷。');
      setReasonForAttending('希望實地體驗 AURA 新品的空間音質與外觀工藝，規劃於 11 月秋季生活選品專刊做深度主題報導並進行創辦人專訪。');
      setAttendanceCount(3);
      setAttendanceRate(100);
      setEngagementNotes('過往每次皆全程出席，互動深度高，會後均產出報導。');
      setPlatform('專欄網站 & IG');
      setReach('68,000+ 高度活躍讀者群');
      setPotentialCollaborationValue('全版專題報導、專訪影音開箱、社群選品推薦。');
    } else if (preset === 'designer') {
      setName('郭彥廷 Allen Kuo');
      setCompany('森格建築空間整合');
      setTitle('主持建築師');
      setIndustry('高端私人會所與豪宅室內建築');
      setProfessionalBackground('主持豪宅與私人招待所設計案 10 年，目前手上有兩處豪宅招待會館正在進行聲學與智慧家電選品。');
      setReasonForAttending('評估 AURA 旗艦機種是否適合融入當前頂級住宅案之客廳與起居空間，希望能索取技術規格與樣品配置諮詢。');
      setAttendanceCount(1);
      setAttendanceRate(100);
      setEngagementNotes('初次參與表現專業，重視實際工程整合。');
      setPlatform('官方作品集網站');
      setReach('高資產私人業主圈');
      setPotentialCollaborationValue('直接導入豪宅案場採購規格，具備高客單實質轉化力。');
    } else {
      setName('陳阿偉 David Chen');
      setCompany('自由接案');
      setTitle('科技愛好者');
      setIndustry('通用社群');
      setProfessionalBackground('平常喜歡看 3C 資訊。');
      setReasonForAttending('看到有免費活動想來看看，希望能拿到品牌贈品耳機。');
      setAttendanceCount(0);
      setAttendanceRate(0);
      setEngagementNotes('無過往紀錄。');
      setPlatform('個人臉書');
      setReach('私人帳號 150 好友');
      setPotentialCollaborationValue('無特定合作規劃。');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-150">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              新增報名者並啟動 AI 優化師篩選
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              系統將依據當前活動【{event.name}】之 6 大目標指標進行 8 維度評估
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-700">快速帶入測試範例：</span>
          <button
            type="button"
            onClick={() => fillQuickPreset('kpi-media')}
            className="text-xs bg-white text-blue-800 hover:bg-blue-50 px-2.5 py-1 rounded-lg border border-slate-300 font-medium transition-colors"
          >
            高調性美學主編 (High Match)
          </button>
          <button
            type="button"
            onClick={() => fillQuickPreset('designer')}
            className="text-xs bg-white text-indigo-800 hover:bg-indigo-50 px-2.5 py-1 rounded-lg border border-slate-300 font-medium transition-colors"
          >
            豪宅建築設計師 (High Match)
          </button>
          <button
            type="button"
            onClick={() => fillQuickPreset('casual')}
            className="text-xs bg-white text-slate-700 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-300 font-medium transition-colors"
          >
            大眾休閒報名 (Low Match)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                姓名 (Name) *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例：林書瑋 Sean Lin"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-slate-50/50 focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                任職單位與職稱 (Company & Title)
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="例：Aesthetic Modern 主理人兼創辦人"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-slate-50/50 focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                產業類別 (Industry)
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="例：生活風格與消費科技媒體"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-slate-50/50 focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                公開履歷/社群平台與受眾
              </label>
              <input
                type="text"
                value={reach}
                onChange={(e) => setReach(e.target.value)}
                placeholder="例：Substack 50,000+ 訂閱者"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-slate-50/50 focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              專業背景 (Professional Background) *
            </label>
            <textarea
              rows={2}
              required
              value={professionalBackground}
              onChange={(e) => setProfessionalBackground(e.target.value)}
              placeholder="描述其從業歷程、代表專案、專業公信力..."
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-slate-50/50 focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              報名原因 (Reason for Attending) *
            </label>
            <textarea
              rows={2}
              required
              value={reasonForAttending}
              onChange={(e) => setReasonForAttending(e.target.value)}
              placeholder="參加活動的具體目標、期待與關注重點..."
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-slate-50/50 focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              潛在合作價值 (Potential Collaboration Value)
            </label>
            <input
              type="text"
              value={potentialCollaborationValue}
              onChange={(e) => setPotentialCollaborationValue(e.target.value)}
              placeholder="例：專案深度開箱報導、樣品展示案場採購、跨界社群擴散..."
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-slate-50/50 focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="pt-4 border-t border-slate-150 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-850 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-blue-300" />
              {isSubmitting ? 'AI 8 維度分析運算中...' : '送件並執行 AI 篩選'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
