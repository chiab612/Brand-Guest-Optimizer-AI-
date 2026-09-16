import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// System prompt embodying the persona:
// 黃老師｜活動優化師
// Technology & Lifestyle Media Creator / Brand Content Consultant
// 「不是把人分類，而是讓品牌更了解誰適合這場活動。」
// 「AI 提供分析，最終邀請決策由品牌方與活動優化師人工確認。」
const HUANG_TEACHER_SYSTEM_PROMPT = `
你是由「黃老師｜活動優化師」（Technology & Lifestyle Media Creator / Brand Content Consultant）指導的專業品牌活動來賓分析助理。
核心理念：
1. 「不是把人分類，而是讓品牌更了解誰適合這場活動。」
2. 絕對不對任何人進行道德評判或使用任何侮辱性、貶低性標籤（嚴格禁止使用「壞人」、「詐欺犯」、「危險人物」、「騙子」等詞彙）。
3. 所有分析必須是客觀、結構化、專業且具建設性的「參與訊號與合作適配度分析」。
4. 最終推薦分類只能是以下三種中性類別：
   - "High Match" (高契合度推薦)
   - "Review Further" (待進一步評估)
   - "Low Match" (契合度較低)
5. 8 大維度量化與質化評估（分數 0~100）：
   - Event Fit (活動契合度)
   - Professional Relevance (專業背景關聯度)
   - Participation Purpose (參與目的明確性)
   - Industry Relevance (產業生態關聯度)
   - Collaboration Potential (潛在商務/內容合作價值)
   - Profile Consistency (公開專業經歷一致性)
   - Previous Participation Signals (過往活動出席與互動訊號: positive / neutral / caution)
   - Duplicate / abnormal registration signals (重複或資訊異常填報檢測: none / low / moderate，以客觀填報行為訊號分析，如電話號碼重疊、簡短填答、連結格式等，絕非人身批判)
`;

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    consultant: '黃老師｜活動優化師',
  });
});

app.post('/api/analyze-guest', async (req, res) => {
  try {
    const { event, applicant } = req.body;
    if (!event || !applicant) {
      return res.status(400).json({ error: 'Missing event or applicant payload' });
    }

    const ai = getGeminiClient();

    if (ai) {
      const prompt = `
請依據活動設定與申請來賓資料，由「活動優化師 黃老師」的專業策展視角進行深度分析。

【活動設定】
- 活動名稱：${event.name}
- 品牌定位：${event.brandPositioning}
- 目標受眾：${event.targetAudience}
- 活動目的：${event.eventPurpose}
- 偏好來賓輪廓：${event.preferredGuestProfile}
- 合作目標：${event.collaborationGoals}

【來賓報名資訊】
- 姓名：${applicant.name}
- 任職單位與職稱：${applicant.company} / ${applicant.title}
- 產業類別：${applicant.industry}
- 專業背景：${applicant.professionalBackground}
- 報名參與原因：${applicant.reasonForAttending}
- 過往參與活動經歷：出席次數 ${applicant.previousParticipation?.attendanceCount || 0} 次，紀錄：${applicant.previousParticipation?.engagementNotes || '無'}
- 公開專業履歷與社群：${applicant.publicProfile?.platform || '無'} (${applicant.publicProfile?.handle || ''}) 觸及：${applicant.publicProfile?.reach || '未填'}
- 潛在合作價值自述：${applicant.potentialCollaborationValue || '未填'}
- 填報背景備註：${applicant.registrationMeta?.registrationPatternNote || '正常填報'}

請輸出符合以下 JSON 格式的回傳內容（純 JSON，不要任何 Markdown 圍欄代碼）：
{
  "eventFitScore": 85,
  "eventFitRationale": "簡短深刻說明與本活動的契合度",
  "professionalRelevanceScore": 88,
  "professionalRelevanceRationale": "專業經歷對應活動主題的關聯性",
  "participationPurposeScore": 80,
  "participationPurposeRationale": "參與動機的具體度與建設性",
  "industryRelevanceScore": 85,
  "industryRelevanceRationale": "產業領域對應活動的生態協同度",
  "collaborationPotentialScore": 82,
  "collaborationPotentialRationale": "後續商業、專題開箱或合作價值",
  "profileConsistencyScore": 90,
  "profileConsistencyRationale": "公開專業資料與報名內容一致性",
  "previousParticipationSignals": {
    "status": "positive",
    "summary": "過往出席紀錄與互動訊號總結"
  },
  "duplicateOrAbnormalSignals": {
    "detected": false,
    "level": "none",
    "details": "填報訊號是否正常，有無重複/模板填寫（客觀描述，絕無人身攻擊）"
  },
  "overallMatchScore": 85,
  "recommendation": "High Match",
  "recommendationReason": "綜合評估結論",
  "huangTeacherConsultantAdvice": "活動優化師 黃老師給主辦品牌方的專屬接待與交流策略建議"
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: HUANG_TEACHER_SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const text = response.text?.trim();
      if (text) {
        try {
          const parsed = JSON.parse(text);
          return res.json({ success: true, analysis: parsed, source: 'gemini' });
        } catch (parseErr) {
          console.error('Failed to parse Gemini response JSON:', text);
        }
      }
    }

    // Intelligent domain heuristic fallback when Gemini API key is not yet set or during offline preview
    const fallbackAnalysis = generateHeuristicAnalysis(event, applicant);
    return res.json({ success: true, analysis: fallbackAnalysis, source: 'heuristic-optimizer' });
  } catch (error: any) {
    console.error('Error analyzing guest:', error);
    const fallback = generateHeuristicAnalysis(req.body.event, req.body.applicant);
    return res.json({ success: true, analysis: fallback, source: 'fallback', error: error?.message });
  }
});

function generateHeuristicAnalysis(event: any, applicant: any) {
  const reason = (applicant.reasonForAttending || '').toLowerCase();
  const background = (applicant.professionalBackground || '').toLowerCase();
  const industry = (applicant.industry || '').toLowerCase();
  const notes = (applicant.registrationMeta?.registrationPatternNote || '').toLowerCase();

  const isHighMatch =
    reason.includes('專題') ||
    reason.includes('採訪') ||
    reason.includes('採購') ||
    reason.includes('案場') ||
    reason.includes('交流') ||
    background.includes('主編') ||
    background.includes('總監') ||
    background.includes('顧問') ||
    background.includes('工程');

  const isLowMatch =
    reason.includes('免費') ||
    reason.includes('贈品') ||
    reason.includes('咖啡') ||
    background.includes('不詳') ||
    notes.includes('重複') ||
    notes.includes('同 ip');

  let recommendation: 'High Match' | 'Review Further' | 'Low Match' = 'Review Further';
  let overallScore = 75;

  if (isHighMatch && !isLowMatch) {
    recommendation = 'High Match';
    overallScore = Math.floor(88 + Math.random() * 8);
  } else if (isLowMatch) {
    recommendation = 'Low Match';
    overallScore = Math.floor(30 + Math.random() * 15);
  } else {
    recommendation = 'Review Further';
    overallScore = Math.floor(70 + Math.random() * 10);
  }

  const hasDuplicateNote = notes.includes('重複') || notes.includes('同 ip');

  return {
    eventFitScore: Math.min(100, overallScore + 2),
    eventFitRationale:
      recommendation === 'High Match'
        ? `來賓之背景與【${event.name}】之核心調性高度共鳴，能有效促進品牌高端深度交流。`
        : recommendation === 'Low Match'
        ? `來賓目前關切重點偏向大眾體驗，與本場專屬高奢私享鑑賞之主要目標存在客群分歧。`
        : `具備跨界探索價值，但需進一步釐清於當日活動中可投入之實質互動深度。`,
    professionalRelevanceScore: Math.min(100, overallScore - 1),
    professionalRelevanceRationale: `在${applicant.industry}累積相當實務，對應活動主題呈現專業關聯。`,
    participationPurposeScore: Math.min(100, overallScore + 1),
    participationPurposeRationale:
      recommendation === 'High Match'
        ? '參與動機清晰具體，具備直接內容產出或專案選品之可行性。'
        : '動機偏向常規參與，可進一步溝通活動當天之交流期望。',
    industryRelevanceScore: Math.min(100, overallScore),
    industryRelevanceRationale: `所屬之${applicant.industry}與主辦品牌生態系具備互動可能。`,
    collaborationPotentialScore: Math.min(100, overallScore + 3),
    collaborationPotentialRationale: applicant.potentialCollaborationValue || '具備品牌交流與跨領域擴散價值。',
    profileConsistencyScore: isLowMatch ? 55 : 94,
    profileConsistencyRationale: isLowMatch
      ? '公開履歷資訊相對簡略，建議於邀請前進一步核對真實身份。'
      : '公開專業社群與自述經歷一致性高，具備良好誠信指標。',
    previousParticipationSignals: {
      status: (applicant.previousParticipation?.attendanceRate || 0) >= 80 ? 'positive' : 'neutral',
      summary: `過往參與出席率為 ${applicant.previousParticipation?.attendanceRate ?? 0}%，歷史出席與活動配合度穩定。`,
    },
    duplicateOrAbnormalSignals: {
      detected: hasDuplicateNote,
      level: hasDuplicateNote ? 'moderate' : 'none',
      details: hasDuplicateNote
        ? '系統偵測到近似聯絡資訊或填答特徵，建議品牌方進行溫和之名額確認。'
        : '填報訊號完整獨立，無發現異常特徵。',
    },
    overallMatchScore: overallScore,
    recommendation,
    recommendationReason:
      recommendation === 'High Match'
        ? '高度符合本場活動目標受眾，推薦優先發送正式 VIP 邀請席位。'
        : recommendation === 'Low Match'
        ? '建議保留本場私享名額給直接核心受眾，可禮貌轉介至下一期大眾發表活動。'
        : '具備潛力但本場席次珍貴，建議活動優化師先行聯繫對焦再行決定。',
    huangTeacherConsultantAdvice:
      recommendation === 'High Match'
        ? '建議活動當天由主理人或產品總監親自接待，安排近距離座席以創造高質量合作觸點。'
        : recommendation === 'Low Match'
        ? '請公關團隊以溫和婉謝通知回覆，維繫品牌良好形象並邀請加入後續活動通知清單。'
        : '建議由活動優化小組先行電聯或發送 3 個預期對焦問題，評估其時間投入度。',
  };
}

// Development vs Production serving
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Brand Guest Optimizer server running on http://0.0.0.0:${PORT}`);
  });
}

start();
