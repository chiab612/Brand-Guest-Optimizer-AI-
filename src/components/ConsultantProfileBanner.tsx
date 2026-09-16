import React from 'react';
import { ShieldCheck, Sparkles, Award, Compass, Lightbulb, UserCheck } from 'lucide-react';

interface ConsultantProfileBannerProps {
  onOpenMethodology: () => void;
}

export const ConsultantProfileBanner: React.FC<ConsultantProfileBannerProps> = ({
  onOpenMethodology,
}) => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl shadow-xl overflow-hidden border border-blue-900/50 mb-8">
      {/* Top Banner Headline Strip */}
      <div className="bg-blue-600/20 border-b border-blue-500/20 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-blue-500/30 text-blue-200 font-semibold tracking-wide uppercase text-[11px]">
            核心策展思維
          </span>
          <span className="text-blue-100 font-semibold tracking-wide">
            「不是把人分類，而是讓品牌更了解誰適合這場活動。」
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-blue-200/90 text-xs font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>非黑即白判定已被停用 ‧ 全面採用 8 維度結構化參與訊號</span>
        </div>
      </div>

      {/* Main Consultant Profile Card Content */}
      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Consultant Persona Card */}
        <div className="lg:col-span-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar / Monogram */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 p-0.5 shadow-lg shadow-black/40">
              <div className="w-full h-full rounded-2xl bg-slate-900 flex flex-col items-center justify-center p-2 text-center border border-amber-300/30">
                <span className="text-xl sm:text-2xl font-black tracking-wider text-amber-300 font-serif">
                  黃老師
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-0.5">
                  OPTIMIZER
                </span>
              </div>
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-blue-600 border-2 border-slate-900 flex items-center justify-center text-white shadow-xs">
              <Award className="w-3.5 h-3.5 text-amber-300" />
            </div>
          </div>

          {/* Identity & Mission */}
          <div className="space-y-2 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                黃老師｜活動優化師
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                主理顧問
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-blue-200/90 tracking-wide">
              Technology & Lifestyle Media Creator / Brand Content Consultant
            </p>
            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl font-normal">
              <strong className="text-white font-semibold">
                協助品牌優化活動、分析來賓需求與參與訊號，建立更符合品牌目的的邀請名單。
              </strong>
              透過深入解讀報名動機、專業作品一致性與過往出席數據，讓每場 VIP 沙龍都凝聚最有共感與合作潛力的對話。
            </p>
          </div>
        </div>

        {/* Right: Human Review Guarantee Card */}
        <div className="lg:col-span-4 bg-slate-800/70 rounded-xl p-4.5 border border-slate-700/80 backdrop-blur-xs flex flex-col justify-between h-full">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>雙重人工確認機制 (Human Review)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <span className="text-white font-bold block mb-1">
                「AI 提供分析，最終邀請決策由品牌方與活動優化師人工確認。」
              </span>
              拒絕演算法一言堂。我們將系統輸出之 8 大維度評估作為決策輔助，由品牌方與顧問進行最後的名單核定與客製接待引導。
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-400" /> Powered by Gemini 3.8 & 專業策展模型
            </span>
            <button
              onClick={onOpenMethodology}
              className="text-xs font-medium text-blue-300 hover:text-white underline underline-offset-4 flex items-center gap-1 transition-colors"
            >
              <Lightbulb className="w-3 h-3" />
              策展思維指南
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
