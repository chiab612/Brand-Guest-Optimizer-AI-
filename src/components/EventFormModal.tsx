import React, { useState } from 'react';
import { X, Calendar, MapPin, Sparkles, Check, Layers, Target, Users, Compass, Briefcase } from 'lucide-react';
import { EventProfile } from '../types';

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: EventProfile) => void;
  initialData?: EventProfile | null;
  mode: 'create' | 'edit';
}

export const EventFormModal: React.FC<EventFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode,
}) => {
  const [formData, setFormData] = useState<EventProfile>(
    initialData || {
      id: `event-${Date.now()}`,
      name: '',
      brandPositioning: '',
      targetAudience: '',
      eventPurpose: '',
      preferredGuestProfile: '',
      collaborationGoals: '',
      date: new Date().toISOString().split('T')[0],
      location: '台北市信義區 旗艦體驗中心',
      maxCapacity: 15,
    }
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSave(formData);
    onClose();
  };

  const applyTemplate = (type: 'luxury' | 'creator' | 'saas') => {
    if (type === 'luxury') {
      setFormData({
        id: `event-${Date.now()}`,
        name: '2026 極光美學旗艦 VIP 私享鑑賞沙龍',
        brandPositioning: '歐洲傳承頂奢生活風格品牌，訴求高雅工藝美學與智慧居家協同。',
        targetAudience: '資深生活美學主編、室內設計大師、高端生活博主、精品鑑賞收藏家。',
        eventPurpose: '全台首次閉門新品體驗，營造高口碑與精緻內容共創。',
        preferredGuestProfile: '具備視覺品味、社群互動高且過往活動守時誠信之高階人士。',
        collaborationGoals: '專題開箱撰文、VIP 私宅實裝專案、高端策展跨界聯名。',
        date: '2026-10-25',
        location: '台北市大安區 藝文 VIP 會所',
        maxCapacity: 16,
      });
    } else if (type === 'creator') {
      setFormData({
        id: `event-${Date.now()}`,
        name: 'Inspire Lab: 風格創作者品牌商業私聚',
        brandPositioning: '亞太區頂尖內容策略智庫，專注於賦能高品質創作者商業變現。',
        targetAudience: '專注科技、生活風尚、設計與商業趨勢之自媒體創辦人與影音導演。',
        eventPurpose: '推動品牌主與百萬優質創作者直接對話，達成年度策略合作。',
        preferredGuestProfile: '原創內容黏著度高、受眾具消費力、願意參與商業深度對焦之創作者。',
        collaborationGoals: '年度形象大使、聯名系列企劃、品牌沙龍共同主辦。',
        date: '2026-11-12',
        location: '台北寒舍艾美酒店 宴會廳',
        maxCapacity: 20,
      });
    } else {
      setFormData({
        id: `event-${Date.now()}`,
        name: 'Enterprise AI Strategy 領袖圓桌高峰閉門會',
        brandPositioning: '全球領導級企業 AI 工作流程與資訊安全架構解決方案。',
        targetAudience: '跨國企業 CIO、CTO、數位副總、顧問公司合夥人。',
        eventPurpose: '深度剖析生成式 AI 企業私有化落地之合規與效益架構。',
        preferredGuestProfile: '握有科技預算決策權、正推進關鍵專案之企業核心經理人。',
        collaborationGoals: '旗艦級 POC 簽署、高階決策者顧問生態系加盟。',
        date: '2026-11-28',
        location: '台北君悅酒店 總統套房會議室',
        maxCapacity: 12,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-150">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              {mode === 'create' ? '建立新活動策劃 (Create Event)' : '編輯活動設定與來賓指標'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              活動優化師將依據以下 6 大活動核心指標，為品牌建立 AI 篩選準則與權重
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Templates */}
        {mode === 'create' && (
          <div className="mt-4 p-3 bg-blue-50/70 rounded-xl border border-blue-150 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-blue-900">快速載入優化師範本：</span>
            <button
              type="button"
              onClick={() => applyTemplate('luxury')}
              className="text-xs bg-white text-blue-800 hover:bg-blue-100/60 px-2.5 py-1 rounded-lg border border-blue-200 font-medium transition-colors"
            >
              精品美學新品沙龍
            </button>
            <button
              type="button"
              onClick={() => applyTemplate('creator')}
              className="text-xs bg-white text-blue-800 hover:bg-blue-100/60 px-2.5 py-1 rounded-lg border border-blue-200 font-medium transition-colors"
            >
              創作者商務晚宴
            </button>
            <button
              type="button"
              onClick={() => applyTemplate('saas')}
              className="text-xs bg-white text-blue-800 hover:bg-blue-100/60 px-2.5 py-1 rounded-lg border border-blue-200 font-medium transition-colors"
            >
              B2B 企業領袖高峰會
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* 1. Event Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              活動名稱 (Event Name) *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="例：2026 AURA 頂級聲學旗艦新品私享體驗沙龍"
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 2. Brand Positioning */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                品牌定位 (Brand Positioning) *
              </label>
              <textarea
                rows={2}
                required
                value={formData.brandPositioning}
                onChange={(e) => setFormData({ ...formData, brandPositioning: e.target.value })}
                placeholder="品牌的核心調性、客群層級、風格偏好..."
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
              />
            </div>

            {/* 3. Target Audience */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                目標受眾 (Target Audience) *
              </label>
              <textarea
                rows={2}
                required
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                placeholder="欲邀請的特定角色、頭銜、產業界別..."
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 4. Event Purpose */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-blue-600" />
                活動目的 (Event Purpose) *
              </label>
              <textarea
                rows={2}
                required
                value={formData.eventPurpose}
                onChange={(e) => setFormData({ ...formData, eventPurpose: e.target.value })}
                placeholder="例：新品盲聽試音、深層口碑傳播、促成商務對接..."
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
              />
            </div>

            {/* 5. Preferred Guest Profile */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-indigo-600" />
                偏好來賓輪廓 (Preferred Guest Profile) *
              </label>
              <textarea
                rows={2}
                required
                value={formData.preferredGuestProfile}
                onChange={(e) => setFormData({ ...formData, preferredGuestProfile: e.target.value })}
                placeholder="具備鑑賞力、高質量作品產出、互動積極熱絡..."
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
              />
            </div>
          </div>

          {/* 6. Collaboration Goals */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
              合作目標 (Collaboration Goals) *
            </label>
            <input
              type="text"
              required
              value={formData.collaborationGoals}
              onChange={(e) => setFormData({ ...formData, collaborationGoals: e.target.value })}
              placeholder="例：深度專案開箱評測、聯名企劃、工程案場採購轉介..."
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
            />
          </div>

          {/* Date, Location, Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">活動日期</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">活動場地</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">席位上限 (VIP 容量)</label>
              <input
                type="number"
                min={5}
                max={200}
                value={formData.maxCapacity}
                onChange={(e) => setFormData({ ...formData, maxCapacity: Number(e.target.value) || 15 })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
              />
            </div>
          </div>

          {/* Action footer */}
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
              className="px-5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-850 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              儲存並套用篩選模型
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
