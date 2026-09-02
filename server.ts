import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialization of Gemini AI
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AI-Generated Recovery Recommendation Endpoint
app.post('/api/recovery-recommendation', async (req, res) => {
  try {
    const {
      restingHeartRate,
      baselineRhr = 48,
      hrvMs = 78,
      baselineHrv = 82,
      sleepHours = 7.8,
      sleepQualityScore = 88,
      workloadStrain = 650,
      acuteWorkload = 2400,
      chronicWorkload = 2100,
      acwr = 1.14,
      bowlingDeliveriesCount = 36,
      highSpeedRunningKm = 3.2,
      muscleSoreness = 3,
      userNotes = '',
      specialty = 'Top-Order Batsman & Captain',
      playerName = 'J. Root',
    } = req.body;

    const ai = getAIClient();

    if (ai) {
      const prompt = `You are the Lead Sports Science & High Performance Recovery Physiologist for an Elite Cricket Board (ICC / Cricket Australia / ECB protocols).
Analyze the following physiological biometric and workload data for ${playerName} (${specialty}):

Biometric & Workload Telemetry:
- Resting Heart Rate (RHR): ${restingHeartRate} bpm (Baseline: ${baselineRhr} bpm, Deviation: ${restingHeartRate - baselineRhr > 0 ? '+' : ''}${restingHeartRate - baselineRhr} bpm)
- Heart Rate Variability (HRV / rMSSD): ${hrvMs} ms (Baseline: ${baselineHrv} ms)
- Sleep Duration: ${sleepHours} hours
- Sleep Quality Score: ${sleepQualityScore}/100
- Workload Strain: ${workloadStrain} AU (Daily)
- Acute Workload (7-day rolling): ${acuteWorkload} AU
- Chronic Workload (28-day weekly avg): ${chronicWorkload} AU
- Acute:Chronic Workload Ratio (ACWR): ${acwr} (Optimal sweet spot: 0.8 - 1.3. High injury risk: >1.5)
- Bowling Spell Volume: ${bowlingDeliveriesCount} deliveries
- High Speed Running (>20 km/h): ${highSpeedRunningKm} km
- Muscle Soreness Self-Report: ${muscleSoreness}/10
${userNotes ? `- Athlete Notes / Specific Physical Complaints: "${userNotes}"` : ''}

Generate a comprehensive, scientifically rigorous, action-oriented recovery recommendation.
Return ONLY valid JSON matching the following schema without Markdown wrapping:
{
  "readinessScore": number (0 to 100 calculated from metrics),
  "readinessTier": string ("OPTIMAL" | "MODERATE" | "FATIGUE WARNING" | "OVERTRAINED"),
  "readinessAssessment": string (2-3 concise sentences detailing autonomic nervous system tone, cardiovascular recovery, and muscular status),
  "workloadVerdict": string (1-2 sentences interpreting the ACWR and delivery load),
  "injuryRiskIndex": string (e.g. "Low (0.84 ACWR - In Safe Functional Overreach Zone)" or "Elevated - Hamstring / Lumbar Fatigue Risk"),
  "prescribedTrainingAdaptation": {
    "headline": string (e.g. "Deload Bowling Spell by 40% & Emphasize Tactical Walkthroughs"),
    "maxBowlingOvers": string or number (e.g. "4 overs (24 balls) at sub-maximal 80% intensity" or "0 overs - Full Bowling Rest"),
    "highIntensitySprintsAllowed": boolean,
    "recommendedDrills": string[] (3-4 specific cricket drills appropriate for this readiness state),
    "drillsToAvoid": string[] (2-3 drills that pose high risk given current fatigue)
  },
  "nutritionHydrationProtocol": {
    "waterIntakeLiters": number (e.g. 3.4),
    "electrolytesMg": string (e.g. "1200mg Sodium + 400mg Potassium with Tart Cherry Concentrate"),
    "keySupplements": string[] (3-4 evidence-backed recovery nutrients, e.g. "Magnesium Glycinate 400mg", "Whey Isolate + Leucine 30g", "Curcumin 500mg"),
    "mealTimingAdvice": string (specific timing for glycogen replenishment & anti-inflammatory meal)
  },
  "activeRecoveryRoutine": {
    "durationMinutes": number (e.g. 25),
    "modality": string (e.g. "Contrast Hydrotherapy & Thoracic Spine Decompression"),
    "steps": [
      { "order": 1, "action": string, "duration": string, "rationale": string },
      { "order": 2, "action": string, "duration": string, "rationale": string },
      { "order": 3, "action": string, "duration": string, "rationale": string }
    ]
  },
  "sleepOptimization": {
    "targetBedtime": string (e.g. "22:15"),
    "sleepHygieneCues": string[] (3 specific cues like blue light filter, room temp 18°C, parasympathetic breathwork 4-7-8)
  },
  "coachSummary": string (1 punchy paragraph summary for the head coach and player)
}`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const text = response.text || '';
        const parsed = JSON.parse(text);
        return res.json({ success: true, isAIGenerated: true, data: parsed });
      } catch (genError) {
        console.warn('Gemini generation error, falling back to algorithmic engine:', genError);
      }
    }

    // Algorithmic Fallback Engine (High-Performance Cricket Sports Science Model)
    const rhrDiff = restingHeartRate - baselineRhr;
    const hrvDiff = hrvMs - baselineHrv;
    
    // Calculate readiness score
    let score = 90;
    if (rhrDiff > 5) score -= 15;
    else if (rhrDiff > 2) score -= 8;
    else if (rhrDiff < -2) score += 3;

    if (hrvDiff < -10) score -= 14;
    else if (hrvDiff < -5) score -= 7;
    else if (hrvDiff > 5) score += 5;

    if (sleepHours < 6.5) score -= 18;
    else if (sleepHours < 7.5) score -= 6;
    else if (sleepHours >= 8) score += 4;

    if (sleepQualityScore < 75) score -= 10;
    if (acwr > 1.4) score -= 15;
    else if (acwr > 1.25) score -= 8;
    if (muscleSoreness >= 7) score -= 14;
    else if (muscleSoreness >= 5) score -= 8;

    score = Math.max(30, Math.min(98, score));

    let tier: 'OPTIMAL' | 'MODERATE' | 'FATIGUE WARNING' | 'OVERTRAINED' = 'OPTIMAL';
    if (score < 50) tier = 'OVERTRAINED';
    else if (score < 70) tier = 'FATIGUE WARNING';
    else if (score < 84) tier = 'MODERATE';

    const fallbackPlan = {
      readinessScore: score,
      readinessTier: tier,
      readinessAssessment: `Autonomic balance is ${tier === 'OPTIMAL' ? 'well-stabilized with strong vagal parasympathetic recovery' : tier === 'MODERATE' ? 'showing moderate sympathetic compensation after recent loading' : 'exhibiting suppressed HRV and elevated resting cardiovascular strain'}. RHR is at ${restingHeartRate} bpm (${rhrDiff >= 0 ? '+' : ''}${rhrDiff} bpm vs baseline) with ${sleepHours}h recorded sleep.`,
      workloadVerdict: `ACWR is indexed at ${acwr.toFixed(2)}, situating the player in the ${acwr <= 1.3 && acwr >= 0.8 ? 'safe optimal adaptation sweet spot' : acwr > 1.3 ? 'cautionary acute workload spike zone' : 'under-loaded / deload zone'}. Bowling volume of ${bowlingDeliveriesCount} balls requires ${score < 70 ? 'active deloading' : 'controlled progressive maintenance'}.`,
      injuryRiskIndex: acwr > 1.35 ? 'Elevated (1.35+ ACWR - High Soft Tissue & Lumbar Strain Risk)' : acwr < 0.8 ? 'Low (Under-loaded - Reconditioning Recommended)' : 'Low to Moderate (Optimal Adaptation Range)',
      prescribedTrainingAdaptation: {
        headline: score >= 80 
          ? 'Cleared for Full Match-Intensity Execution & High-Speed Running'
          : score >= 65
          ? 'Modified High-Speed Thresholds; Cap Bowling to 4 Overs Max'
          : 'Strict Deload Protocol: Technical Chalkboard & Pool Recovery Only',
        maxBowlingOvers: score >= 80 ? '6-8 overs (Full Intensity)' : score >= 65 ? '3-4 overs (80% sub-maximal intensity)' : '0 overs (Complete Bowling Rest)',
        highIntensitySprintsAllowed: score >= 75,
        recommendedDrills: score >= 75 
          ? ['High-Velocity Death Bowling Yorkers', 'Match-Sim Target Batting (Over 16-20)', 'Slip Reflex Snatch Drill']
          : ['Static Batting Tee Alignment', 'Slow-Mo Biomechanical Video Review', 'Ground Fielding Pick-and-Throw Under 60%'],
        drillsToAvoid: score >= 75 
          ? ['Excessive weighted bat over-speed training']
          : ['Maximal 30m Sprint Repeats', 'High-impact bouncer barrage bowling', 'Heavy plyometric box jumps']
      },
      nutritionHydrationProtocol: {
        waterIntakeLiters: score < 70 ? 3.8 : 3.2,
        electrolytesMg: '1000mg Sodium, 350mg Potassium, 150mg Magnesium in 750ml water',
        keySupplements: ['Magnesium Glycinate (400mg before bed)', 'Tart Cherry Extract (Anthocyanins 500mg)', 'Hydrolyzed Collagen (15g with Vitamin C)', 'Omega-3 EPA/DHA (2000mg)'],
        mealTimingAdvice: 'Ingest 30g fast-acting protein with 60g complex carbohydrates within 45 minutes of training. Increase anti-inflammatory berries and turmeric with dinner.'
      },
      activeRecoveryRoutine: {
        durationMinutes: score < 70 ? 30 : 20,
        modality: score < 70 ? 'Contrast Water Therapy & Lumbar Traction' : 'Dynamic Mobility & Percussive Therapy',
        steps: [
          { order: 1, action: 'Cold Plunge (11-13°C) vs Warm Jacuzzi (38°C)', duration: '12 mins (3x 3m hot / 1m cold)', rationale: 'Vasoconstriction cycle clearing metabolic waste and dampening delayed-onset muscle soreness.' },
          { order: 2, action: 'Thoracic Extension & Cat-Cow Foam Roll Sequence', duration: '8 mins', rationale: 'Restores spinal rotation mobility essential for cricket bowling gather and batting swing arc.' },
          { order: 3, action: 'Bilateral Hamstring & Hip Flexor PNF Stretch', duration: '8 mins', rationale: 'Relieves anterior pelvic tilt strain accumulated during high-speed run-up decelerations.' }
        ]
      },
      sleepOptimization: {
        targetBedtime: score < 70 ? '21:45' : '22:30',
        sleepHygieneCues: [
          'Maintain room ambient temperature at 18.5°C with blackout curtains',
          'Avoid blue light screens 45 minutes prior to target bedtime',
          'Perform 5 minutes of 4-7-8 parasympathetic breathwork prior to sleep'
        ]
      },
      coachSummary: score >= 80 
        ? `${playerName} is primed in peak physiological readiness (Score: ${score}/100). All markers indicate high readiness for full-intensity match play and maximal workloads.`
        : `${playerName} presents with ${tier.toLowerCase()} indicators (Score: ${score}/100). High performance medical staff recommend limiting bowling repetitions and prioritizing tonight's sleep and contrast recovery protocol.`
    };

    return res.json({ success: true, isAIGenerated: false, data: fallbackPlan });
  } catch (error: any) {
    console.error('Error handling recovery recommendation:', error);
    return res.status(500).json({ success: false, error: error.message || 'Internal Server Error' });
  }
});

// Vite middleware in development or static serve in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
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
    console.log(`Pitch Precision Server running on http://localhost:${PORT}`);
  });
}

startServer();
