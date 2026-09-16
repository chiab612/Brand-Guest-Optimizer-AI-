import React from 'react';
import { X, Award, ShieldCheck, Sparkles, CheckCircle2, HeartHandshake, Eye, Lightbulb } from 'lucide-react';

interface ConsultantMethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConsultantMethodologyModal: React.FC<ConsultantMethodologyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold font-serif text-lg">
              黃
            </div>
            <div>
              <h3 className="text-base font-bold">黃老師｜活動優化師 策展哲學與 AI 篩選準則</h3>
              <p className="text-xs text-blue-200">
                Technology & Lifestyle Media Creator / Brand Content Consultant
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed">
          {/* Main Creed */}
          <div className="p-4.5 bg-blue-50/80 rounded-2xl border border-blue-200 text-blue-950">
            <div className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
              活動優化核心座右銘
            </div>
            <p className="text-base sm:text-lg font-bold text-slate-900">
              「不是把人分類，而是讓品牌更了解誰適合這場活動。」
            </p>
            <p className="text-xs text-slate-600 mt-2">
              一場頂級私人沙龍或品牌 VIP 發表會，其成敗往往不取決於現場裝潢有多豪華，而是現場<strong>來賓之間能否激盪出真誠的對話、共感與實質合作</strong>。本工具並非為了冰冷地淘汰人群，而是作為品牌決策者與活動優化師的「共感放大鏡」。
            </p>
          </div>

          {/* Section: Ethical and Structured Signal Guarantee */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              中性訊號與絕對無歧視原則
            </h4>
            <p>
              傳統篩選常流於主觀臆測或簡單粗暴的二分法。黃老師設計的 AI 品牌來賓篩選體系嚴格恪守：
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>
                <strong>絕不使用任何侮辱性或貶低性標籤</strong>（例如嚴格禁止標註「壞人」、「詐欺」、「危險人物」等）。
              </li>
              <li>
                僅劃分三種中性類別：<strong>高契合度 (High Match)</strong>、<strong>待進一步評估 (Review Further)</strong>、<strong>契合度較低 (Low Match)</strong>。
              </li>
              <li>
                所謂「契合度較低」，純粹代表該來賓目前的專業領域或參與目標與「本次專屬主題」尚未吻合，絕非否定其個人價值，品牌應以誠懇專業的態度予以引導至未來適合的公眾場次。
              </li>
            </ul>
          </div>

          {/* Section: 8 Structured Dimensions */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              活動優化師的 8 大訊號解碼維度
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">1. 活動契合度 (Event Fit)</span>
                來賓的核心特質與本次活動品牌調性、主題高度的契合共鳴程度。
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">2. 專業背景關聯度 (Professional Relevance)</span>
                從業職能、資歷深度與實務專長是否能對活動討論形成專業支撐。
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">3. 參與目的明確性 (Participation Purpose)</span>
                是否有明確的採訪、報導、採購、技術對話或商業共創目標。
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">4. 產業生態關聯度 (Industry Relevance)</span>
                所屬產業與主辦品牌在產業價值鏈上的生態協同與跨界潛能。
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">5. 潛在商務/內容合作價值 (Collaboration Potential)</span>
                活動後能否轉化為專案報導、開箱專欄、工程採購案場或聯名合作。
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">6. 公開經歷一致性 (Profile Consistency)</span>
                公開的社群、專欄、公司官網作品集與報名表述是否真確一致。
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">7. 過往活動出席訊號 (Previous Participation)</span>
                出席誠信率、過往到場互動熱度、是否曾無故缺席或早退之客觀紀錄。
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">8. 填報異常/重複特徵 (Duplicate & Abnormal Signals)</span>
                客觀偵測同 IP 批量套版填寫、通用灌水格式等技術特徵，保障真實申請者席位。
              </div>
            </div>
          </div>

          {/* Section: Human Review Guarantee */}
          <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200">
            <h4 className="text-sm font-bold text-amber-950 flex items-center gap-2 mb-1">
              <Eye className="w-4 h-4 text-amber-600" />
              人機協同最終審核保證 (Human-in-the-loop)
            </h4>
            <p className="font-semibold text-slate-900">
              「AI 提供分析，最終邀請決策由品牌方與活動優化師人工確認。」
            </p>
            <p className="text-xs text-slate-600 mt-1">
              AI 負責快速整理 8 大訊號並給出分析建議；品牌主理人與活動優化師則親自核定名單、設計座席配對、量身規劃活動現場的互動接點，確保每一位貴賓均能享受到最高規格的體驗。
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Brand Guest Optimizer ‧ 策展優化專利分析模型
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors"
          >
            了解並返回儀表板
          </button>
        </div>
      </div>
    </div>
  );
};
