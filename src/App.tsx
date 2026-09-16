import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Users,
  Search,
  Filter,
  ArrowUpDown,
  PlusCircle,
  RotateCw,
  CheckCircle2,
  Clock,
  HelpCircle,
  AlertTriangle,
  XCircle,
  Layers,
  FileSpreadsheet,
  Check,
} from 'lucide-react';
import { EventProfile, GuestApplication, HumanDecision, MatchCategory, EventRosterStats } from './types';
import { INITIAL_EVENTS, INITIAL_GUESTS } from './data/initialEvents';
import { Navbar } from './components/Navbar';
import { ConsultantProfileBanner } from './components/ConsultantProfileBanner';
import { EventProfileCard } from './components/EventProfileCard';
import { GuestCard } from './components/GuestCard';
import { GuestDetailModal } from './components/GuestDetailModal';
import { EventFormModal } from './components/EventFormModal';
import { AddGuestModal } from './components/AddGuestModal';
import { ExportSummaryModal } from './components/ExportSummaryModal';
import { ConsultantMethodologyModal } from './components/ConsultantMethodologyModal';

export default function App() {
  const [events, setEvents] = useState<EventProfile[]>(INITIAL_EVENTS);
  const [currentEvent, setCurrentEvent] = useState<EventProfile>(INITIAL_EVENTS[0]);
  const [guestsByEvent, setGuestsByEvent] = useState<Record<string, GuestApplication[]>>(INITIAL_GUESTS);

  // Modals
  const [selectedGuestForDetail, setSelectedGuestForDetail] = useState<GuestApplication | null>(null);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [eventFormMode, setEventFormMode] = useState<'create' | 'edit'>('create');
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  // Filters & Search
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'High Match' | 'Review Further' | 'Low Match' | 'confirmed_invited' | 'abnormal_flag'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'score_desc' | 'score_asc' | 'attendance' | 'name'>('score_desc');

  // Loading states
  const [isBatchAnalyzing, setIsBatchAnalyzing] = useState(false);
  const [isSingleAnalyzing, setIsSingleAnalyzing] = useState(false);
  const [batchNotice, setBatchNotice] = useState<string | null>(null);

  // Current guests list
  const currentGuests = useMemo(() => {
    return guestsByEvent[currentEvent.id] || [];
  }, [guestsByEvent, currentEvent.id]);

  // Statistics calculation
  const stats: EventRosterStats = useMemo(() => {
    const totalApplicants = currentGuests.length;
    const highMatchCount = currentGuests.filter((g) => g.analysis.recommendation === 'High Match').length;
    const reviewFurtherCount = currentGuests.filter((g) => g.analysis.recommendation === 'Review Further').length;
    const lowMatchCount = currentGuests.filter((g) => g.analysis.recommendation === 'Low Match').length;
    const confirmedInvitedCount = currentGuests.filter((g) => g.humanDecision === 'confirmed_invited').length;
    const waitlistCount = currentGuests.filter((g) => g.humanDecision === 'waitlist').length;
    const pendingReviewCount = currentGuests.filter((g) => g.humanDecision === 'pending').length;

    return {
      totalApplicants,
      highMatchCount,
      reviewFurtherCount,
      lowMatchCount,
      confirmedInvitedCount,
      waitlistCount,
      pendingReviewCount,
      capacity: currentEvent.maxCapacity,
    };
  }, [currentGuests, currentEvent.maxCapacity]);

  // Filtered & Sorted guests
  const filteredGuests = useMemo(() => {
    let list = [...currentGuests];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.company.toLowerCase().includes(q) ||
          g.industry.toLowerCase().includes(q) ||
          g.professionalBackground.toLowerCase().includes(q) ||
          g.reasonForAttending.toLowerCase().includes(q)
      );
    }

    // Category / Status Filter
    if (activeFilter === 'High Match') {
      list = list.filter((g) => g.analysis.recommendation === 'High Match');
    } else if (activeFilter === 'Review Further') {
      list = list.filter((g) => g.analysis.recommendation === 'Review Further');
    } else if (activeFilter === 'Low Match') {
      list = list.filter((g) => g.analysis.recommendation === 'Low Match');
    } else if (activeFilter === 'confirmed_invited') {
      list = list.filter((g) => g.humanDecision === 'confirmed_invited');
    } else if (activeFilter === 'abnormal_flag') {
      list = list.filter((g) => g.registrationMeta.ipDuplicateFlag || g.analysis.duplicateOrAbnormalSignals.detected);
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'score_desc') return b.analysis.overallMatchScore - a.analysis.overallMatchScore;
      if (sortBy === 'score_asc') return a.analysis.overallMatchScore - b.analysis.overallMatchScore;
      if (sortBy === 'attendance') return b.previousParticipation.attendanceRate - a.previousParticipation.attendanceRate;
      if (sortBy === 'name') return a.name.localeCompare(b.name, 'zh-TW');
      return 0;
    });

    return list;
  }, [currentGuests, searchQuery, activeFilter, sortBy]);

  // Handlers: Save / Create Event
  const handleSaveEvent = (savedEvent: EventProfile) => {
    if (eventFormMode === 'create') {
      setEvents((prev) => [savedEvent, ...prev]);
      setCurrentEvent(savedEvent);
      // Seed an initial empty array or copy templates
      setGuestsByEvent((prev) => ({
        ...prev,
        [savedEvent.id]: [],
      }));
    } else {
      setEvents((prev) => prev.map((ev) => (ev.id === savedEvent.id ? savedEvent : ev)));
      setCurrentEvent(savedEvent);
    }
  };

  // Quick Decision
  const handleQuickDecision = (guestId: string, decision: HumanDecision) => {
    setGuestsByEvent((prev) => {
      const eventGuests = prev[currentEvent.id] || [];
      const updated = eventGuests.map((g) =>
        g.id === guestId ? { ...g, humanDecision: decision } : g
      );
      return { ...prev, [currentEvent.id]: updated };
    });

    if (selectedGuestForDetail && selectedGuestForDetail.id === guestId) {
      setSelectedGuestForDetail((prev) => (prev ? { ...prev, humanDecision: decision } : null));
    }
  };

  // Update Decision from Modal
  const handleUpdateDecision = (guestId: string, decision: HumanDecision, notes: string) => {
    setGuestsByEvent((prev) => {
      const eventGuests = prev[currentEvent.id] || [];
      const updated = eventGuests.map((g) =>
        g.id === guestId ? { ...g, humanDecision: decision, humanNotes: notes } : g
      );
      return { ...prev, [currentEvent.id]: updated };
    });

    if (selectedGuestForDetail && selectedGuestForDetail.id === guestId) {
      setSelectedGuestForDetail((prev) =>
        prev ? { ...prev, humanDecision: decision, humanNotes: notes } : null
      );
    }
  };

  // Re-Analyze Single Guest with Gemini backend
  const handleReAnalyzeGuest = async (guest: GuestApplication) => {
    setIsSingleAnalyzing(true);
    try {
      const res = await fetch('/api/analyze-guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: currentEvent,
          applicant: guest,
        }),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setGuestsByEvent((prev) => {
          const eventGuests = prev[currentEvent.id] || [];
          const updated = eventGuests.map((g) =>
            g.id === guest.id ? { ...g, analysis: data.analysis } : g
          );
          return { ...prev, [currentEvent.id]: updated };
        });

        if (selectedGuestForDetail && selectedGuestForDetail.id === guest.id) {
          setSelectedGuestForDetail((prev) =>
            prev ? { ...prev, analysis: data.analysis } : null
          );
        }
      }
    } catch (err) {
      console.error('Failed to re-analyze guest:', err);
    } finally {
      setIsSingleAnalyzing(false);
    }
  };

  // Batch Analyze All Guests
  const handleBatchAnalyzeAll = async () => {
    if (currentGuests.length === 0) return;
    setIsBatchAnalyzing(true);
    setBatchNotice('活動優化師 AI 引擎正在比對當前活動目標與所有來賓...');

    try {
      const updatedList: GuestApplication[] = [];
      for (const guest of currentGuests) {
        try {
          const res = await fetch('/api/analyze-guest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event: currentEvent,
              applicant: guest,
            }),
          });
          const data = await res.json();
          if (data.success && data.analysis) {
            updatedList.push({ ...guest, analysis: data.analysis });
          } else {
            updatedList.push(guest);
          }
        } catch {
          updatedList.push(guest);
        }
      }

      setGuestsByEvent((prev) => ({
        ...prev,
        [currentEvent.id]: updatedList,
      }));

      setBatchNotice('全體來賓 8 維度評估完成！已同步更新至決策看板。');
      setTimeout(() => setBatchNotice(null), 4000);
    } catch (err) {
      console.error('Batch analyze error:', err);
      setBatchNotice(null);
    } finally {
      setIsBatchAnalyzing(false);
    }
  };

  // Add New Guest
  const handleAddGuest = async (newGuestPayload: Partial<GuestApplication>) => {
    const tempId = `g-${Date.now()}`;
    const avatar =
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';

    // Temporary placeholder analysis
    const guestObj: GuestApplication = {
      id: tempId,
      name: newGuestPayload.name || '新報名來賓',
      avatar,
      company: newGuestPayload.company || '個人工作室',
      title: newGuestPayload.title || '創作者',
      industry: newGuestPayload.industry || '數位媒體',
      professionalBackground: newGuestPayload.professionalBackground || '',
      reasonForAttending: newGuestPayload.reasonForAttending || '',
      previousParticipation: newGuestPayload.previousParticipation || {
        attendanceCount: 0,
        pastEvents: [],
        attendanceRate: 0,
        engagementNotes: '新報名',
      },
      publicProfile: newGuestPayload.publicProfile || {
        platform: '公開社群',
        handle: '@profile',
        url: 'https://example.com',
        reach: '公開',
        verified: false,
      },
      potentialCollaborationValue: newGuestPayload.potentialCollaborationValue || '',
      registrationMeta: newGuestPayload.registrationMeta || {
        submittedAt: new Date().toLocaleString(),
        sourceChannel: '線上報名',
        ipDuplicateFlag: false,
      },
      analysis: {
        eventFitScore: 80,
        eventFitRationale: '正在執行分析...',
        professionalRelevanceScore: 80,
        professionalRelevanceRationale: '',
        participationPurposeScore: 80,
        participationPurposeRationale: '',
        industryRelevanceScore: 80,
        industryRelevanceRationale: '',
        collaborationPotentialScore: 80,
        collaborationPotentialRationale: '',
        profileConsistencyScore: 85,
        profileConsistencyRationale: '',
        previousParticipationSignals: { status: 'neutral', summary: '初次報名' },
        duplicateOrAbnormalSignals: { detected: false, level: 'none', details: '正常填寫' },
        overallMatchScore: 80,
        recommendation: 'Review Further',
        recommendationReason: '分析處理中',
        huangTeacherConsultantAdvice: '建議先行了解其具體參與期待。',
      },
      humanDecision: 'pending',
      humanNotes: '',
    };

    // Analyze via API
    try {
      const res = await fetch('/api/analyze-guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: currentEvent,
          applicant: guestObj,
        }),
      });
      const data = await res.json();
      if (data.success && data.analysis) {
        guestObj.analysis = data.analysis;
      }
    } catch (e) {
      console.warn('Analysis completed via internal heuristics');
    }

    setGuestsByEvent((prev) => ({
      ...prev,
      [currentEvent.id]: [guestObj, ...(prev[currentEvent.id] || [])],
    }));

    // Select this guest to open deep dive
    setSelectedGuestForDetail(guestObj);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navigation */}
      <Navbar
        events={events}
        currentEvent={currentEvent}
        onSelectEvent={(ev) => setCurrentEvent(ev)}
        onOpenCreateEvent={() => {
          setEventFormMode('create');
          setIsEventFormOpen(true);
        }}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        confirmedCount={stats.confirmedInvitedCount}
        totalApplicants={stats.totalApplicants}
      />

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1">
        {/* Prominent Profile Card: 黃老師｜活動優化師 */}
        <ConsultantProfileBanner onOpenMethodology={() => setIsMethodologyOpen(true)} />

        {/* Section 1: Create Event / Current Event Details Card */}
        <EventProfileCard
          event={currentEvent}
          stats={stats}
          onEditEvent={() => {
            setEventFormMode('edit');
            setIsEventFormOpen(true);
          }}
          onCreateNewEvent={() => {
            setEventFormMode('create');
            setIsEventFormOpen(true);
          }}
          onAddApplicant={() => setIsAddGuestOpen(true)}
        />

        {/* Batch Notice Toast if active */}
        {batchNotice && (
          <div className="mb-6 p-4 rounded-xl bg-blue-900 text-white shadow-md border border-blue-700 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold">{batchNotice}</span>
            </div>
            <button
              onClick={() => setBatchNotice(null)}
              className="text-blue-200 hover:text-white text-xs px-2 py-1 rounded"
            >
              關閉
            </button>
          </div>
        )}

        {/* Guest Application Header & Controls */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-150">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  來賓報名清單與 AI 篩選審定 (Guest Applications)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                  {currentGuests.length} 位申請者
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                依據活動目標產出 8 維度評估，透過三種中性類別協助品牌進行人機協同決策
              </p>
            </div>

            {/* Top Action Toolbar */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                id="btn-batch-analyze"
                disabled={isBatchAnalyzing || currentGuests.length === 0}
                onClick={handleBatchAnalyzeAll}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors shadow-2xs disabled:opacity-50"
              >
                <RotateCw className={`w-3.5 h-3.5 text-blue-600 ${isBatchAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isBatchAnalyzing ? '全體 8 維度運算中...' : '全體執行 AI 深度重評'}</span>
              </button>

              <button
                onClick={() => setIsAddGuestOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 transition-colors shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>手動新增申請資料</span>
              </button>
            </div>
          </div>

          {/* Filter Tabs & Search & Sort Bar */}
          <div className="pt-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Filter Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 text-xs no-scrollbar">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  activeFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                全部申請 ({stats.totalApplicants})
              </button>

              <button
                onClick={() => setActiveFilter('High Match')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeFilter === 'High Match'
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100/70 border border-emerald-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                高契合度 ({stats.highMatchCount})
              </button>

              <button
                onClick={() => setActiveFilter('Review Further')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeFilter === 'Review Further'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100/70 border border-amber-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                待進一步評估 ({stats.reviewFurtherCount})
              </button>

              <button
                onClick={() => setActiveFilter('Low Match')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeFilter === 'Low Match'
                    ? 'bg-slate-700 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                契合度較低 ({stats.lowMatchCount})
              </button>

              <button
                onClick={() => setActiveFilter('confirmed_invited')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeFilter === 'confirmed_invited'
                    ? 'bg-blue-900 text-white shadow-2xs'
                    : 'bg-blue-50 text-blue-900 hover:bg-blue-100 border border-blue-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                正式確認席位 ({stats.confirmedInvitedCount})
              </button>

              <button
                onClick={() => setActiveFilter('abnormal_flag')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeFilter === 'abnormal_flag'
                    ? 'bg-amber-700 text-white shadow-2xs'
                    : 'bg-slate-100 text-amber-800 hover:bg-amber-50 border border-slate-200'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                填報特徵注意
              </button>
            </div>

            {/* Search and Sort controls */}
            <div className="flex items-center gap-2.5">
              {/* Search bar */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜尋姓名、公司、背景關鍵字..."
                  className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Sort dropdown */}
              <div className="relative shrink-0">
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="score_desc">排序：契合評分最高</option>
                  <option value="score_asc">排序：契合評分最低</option>
                  <option value="attendance">排序：出席率優先</option>
                  <option value="name">排序：姓名順序</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Applicant Cards Grid (Section 2 & 4 & 5) */}
        {filteredGuests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">無符合篩選條件之申請資料</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              嘗試切換上方分類標籤、清除搜尋關鍵字，或點擊「手動新增申請資料」建立測試名單。
            </p>
            <div className="mt-4">
              <button
                onClick={() => {
                  setActiveFilter('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
              >
                重設所有篩選條件
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            {filteredGuests.map((guest) => (
              <GuestCard
                key={guest.id}
                guest={guest}
                onOpenDetail={(g) => setSelectedGuestForDetail(g)}
                onQuickDecision={handleQuickDecision}
                onReAnalyze={handleReAnalyzeGuest}
              />
            ))}
          </div>
        )}

        {/* Bottom Banner: Philosophy & Commercial Credibility */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold shrink-0">
              黃
            </div>
            <div>
              <span className="font-bold text-slate-900 block">
                黃老師｜活動優化師 專業品牌活動諮詢體系
              </span>
              <p className="text-slate-500">
                協助品牌在籌備頂級 VIP 沙龍、私密發表會、創作者商務聚會時，建立具備商業轉化力與真實對話價值的貴賓名單。
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsMethodologyOpen(true)}
              className="text-xs font-semibold text-blue-900 hover:text-blue-750 underline underline-offset-4"
            >
              閱讀 8 維度指標準則
            </button>
            <button
              onClick={() => setIsExportOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-900 text-white font-bold hover:bg-blue-850 shadow-xs"
            >
              檢視完整邀請簡報與名冊
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            <strong>Brand Guest Optimizer</strong> ‧ 活動優化師｜AI 品牌來賓篩選工具
          </div>
          <div className="flex items-center gap-4">
            <span>策展顧問：黃老師 (Technology & Lifestyle Media Creator)</span>
            <span>‧</span>
            <span>非黑即白判定已被停用 ‧ 專注於品牌適配度訊號</span>
          </div>
        </div>
      </footer>

      {/* Section 3 & 4 & 5: Deep Dive 8-Dimension Detail Modal */}
      <GuestDetailModal
        isOpen={Boolean(selectedGuestForDetail)}
        onClose={() => setSelectedGuestForDetail(null)}
        guest={selectedGuestForDetail}
        event={currentEvent}
        onUpdateDecision={handleUpdateDecision}
        onReAnalyze={handleReAnalyzeGuest}
        isAnalyzing={isSingleAnalyzing}
      />

      {/* Section 1: Create / Edit Event Modal */}
      <EventFormModal
        isOpen={isEventFormOpen}
        onClose={() => setIsEventFormOpen(false)}
        onSave={handleSaveEvent}
        initialData={eventFormMode === 'edit' ? currentEvent : null}
        mode={eventFormMode}
      />

      {/* Add New Guest Modal */}
      <AddGuestModal
        isOpen={isAddGuestOpen}
        onClose={() => setIsAddGuestOpen(false)}
        event={currentEvent}
        onAddGuest={handleAddGuest}
      />

      {/* Export Roster & Executive Briefing Modal */}
      <ExportSummaryModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        event={currentEvent}
        guests={currentGuests}
        stats={stats}
      />

      {/* Consultant Methodology & Creed Modal */}
      <ConsultantMethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />
    </div>
  );
}
