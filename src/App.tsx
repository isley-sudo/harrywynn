import { useState, useMemo, useEffect, useRef } from 'react';

const C = {
  bg: '#070810',
  bgDeep: '#04050a',
  card: '#0d0f1a',
  cardBorder: '#1a1d2e',
  accent: '#7c6fff',
  accentDim: 'rgba(124,111,255,0.12)',
  accentGlow: 'rgba(124,111,255,0.3)',
  cyan: '#00d4ff',
  green: '#00f5a0',
  red: '#ff4466',
  yellow: '#ffb340',
  pink: '#f472b6',
  orange: '#ff7a40',
  text: '#e8eaf6',
  muted: '#4a4f6a',
  sub: '#8b90b0',
};

const TYPE_META = {
  'B2B Strategic': { color: C.accent, icon: '🤝' },
  Affiliate: { color: C.cyan, icon: '📣' },
  Integration: { color: C.green, icon: '🔌' },
};
const STAGE_COLOR = {
  Active: C.cyan,
  Expanding: C.green,
  Negotiation: C.yellow,
  Stalled: C.red,
};

const fmt$ = (n) =>
  n >= 1e6
    ? `$${(n / 1e6).toFixed(1)}M`
    : n >= 1e3
    ? `$${(n / 1e3).toFixed(0)}K`
    : `$${n}`;
const pct = (n) => `${Number(n).toFixed(1)}%`;

const REPS = [
  {
    id: 1,
    name: 'Jordan Mills',
    avatar: 'JM',
    color: '#7c6fff',
    quota: 600000,
    arr: 487000,
    pipeline: 820000,
    partners: 18,
    deals: 7,
    wins: 4,
    streak: 5,
    badge: '🔥 On Fire',
    sprint30: 85000,
    sprint60: 180000,
    sprint90: 320000,
  },
  {
    id: 2,
    name: 'Priya Sharma',
    avatar: 'PS',
    color: '#00f5a0',
    quota: 550000,
    arr: 541000,
    pipeline: 910000,
    partners: 22,
    deals: 9,
    wins: 6,
    streak: 12,
    badge: '👑 Top Dog',
    sprint30: 9000,
    sprint60: 60000,
    sprint90: 110000,
  },
  {
    id: 3,
    name: 'Marcus Webb',
    avatar: 'MW',
    color: '#00d4ff',
    quota: 500000,
    arr: 312000,
    pipeline: 580000,
    partners: 14,
    deals: 5,
    wins: 3,
    streak: 2,
    badge: '📈 Climbing',
    sprint30: 68000,
    sprint60: 138000,
    sprint90: 238000,
  },
  {
    id: 4,
    name: 'Taylor Rhodes',
    avatar: 'TR',
    color: '#ffb340',
    quota: 500000,
    arr: 228000,
    pipeline: 410000,
    partners: 11,
    deals: 4,
    wins: 2,
    streak: 0,
    badge: '⚡ Needs Push',
    sprint30: 122000,
    sprint60: 222000,
    sprint90: 322000,
  },
  {
    id: 5,
    name: 'Sam Okonkwo',
    avatar: 'SO',
    color: '#f472b6',
    quota: 450000,
    arr: 419000,
    pipeline: 760000,
    partners: 20,
    deals: 8,
    wins: 5,
    streak: 7,
    badge: '🚀 Surging',
    sprint30: 31000,
    sprint60: 81000,
    sprint90: 131000,
  },
];

const BASE_PARTNERS = [
  {
    id: 1,
    name: 'Apex Ventures',
    type: 'B2B Strategic',
    arr: 310000,
    potential: 900000,
    engagement: 88,
    dealStage: 'Negotiation',
    daysIdle: 4,
    repId: 2,
    qbr: true,
    jointPlan: true,
    execSponsor: true,
    churnRisk: 12,
  },
  {
    id: 2,
    name: 'Growthlink',
    type: 'Affiliate',
    arr: 94000,
    potential: 280000,
    engagement: 72,
    dealStage: 'Active',
    daysIdle: 9,
    repId: 5,
    qbr: false,
    jointPlan: true,
    execSponsor: false,
    churnRisk: 28,
  },
  {
    id: 3,
    name: 'SyncLayer',
    type: 'Integration',
    arr: 175000,
    potential: 520000,
    engagement: 81,
    dealStage: 'Active',
    daysIdle: 6,
    repId: 3,
    qbr: true,
    jointPlan: true,
    execSponsor: false,
    churnRisk: 15,
  },
  {
    id: 4,
    name: 'Meridian Co',
    type: 'B2B Strategic',
    arr: 58000,
    potential: 750000,
    engagement: 39,
    dealStage: 'Stalled',
    daysIdle: 34,
    repId: 4,
    qbr: false,
    jointPlan: false,
    execSponsor: false,
    churnRisk: 74,
  },
  {
    id: 5,
    name: 'RefNet',
    type: 'Affiliate',
    arr: 42000,
    potential: 160000,
    engagement: 55,
    dealStage: 'Active',
    daysIdle: 18,
    repId: 3,
    qbr: false,
    jointPlan: false,
    execSponsor: false,
    churnRisk: 41,
  },
  {
    id: 6,
    name: 'Orbital APIs',
    type: 'Integration',
    arr: 230000,
    potential: 410000,
    engagement: 91,
    dealStage: 'Expanding',
    daysIdle: 2,
    repId: 2,
    qbr: true,
    jointPlan: true,
    execSponsor: true,
    churnRisk: 8,
  },
  {
    id: 7,
    name: 'BlueSky Partners',
    type: 'B2B Strategic',
    arr: 18000,
    potential: 630000,
    engagement: 28,
    dealStage: 'Stalled',
    daysIdle: 52,
    repId: 4,
    qbr: false,
    jointPlan: false,
    execSponsor: false,
    churnRisk: 88,
  },
  {
    id: 8,
    name: 'Veloci-T',
    type: 'Affiliate',
    arr: 112000,
    potential: 195000,
    engagement: 66,
    dealStage: 'Active',
    daysIdle: 11,
    repId: 5,
    qbr: false,
    jointPlan: true,
    execSponsor: false,
    churnRisk: 22,
  },
  {
    id: 9,
    name: 'DataBridge',
    type: 'Integration',
    arr: 88000,
    potential: 300000,
    engagement: 48,
    dealStage: 'Stalled',
    daysIdle: 27,
    repId: 1,
    qbr: true,
    jointPlan: false,
    execSponsor: false,
    churnRisk: 61,
  },
  {
    id: 10,
    name: 'Cascade Global',
    type: 'B2B Strategic',
    arr: 420000,
    potential: 850000,
    engagement: 95,
    dealStage: 'Expanding',
    daysIdle: 1,
    repId: 2,
    qbr: true,
    jointPlan: true,
    execSponsor: true,
    churnRisk: 5,
  },
  {
    id: 11,
    name: 'TalentBridge',
    type: 'B2B Strategic',
    arr: 195000,
    potential: 500000,
    engagement: 78,
    dealStage: 'Active',
    daysIdle: 5,
    repId: 1,
    qbr: true,
    jointPlan: true,
    execSponsor: false,
    churnRisk: 18,
  },
  {
    id: 12,
    name: 'LoopNet',
    type: 'Affiliate',
    arr: 67000,
    potential: 220000,
    engagement: 61,
    dealStage: 'Active',
    daysIdle: 14,
    repId: 5,
    qbr: false,
    jointPlan: false,
    execSponsor: false,
    churnRisk: 35,
  },
];

const WIN_FEED = [
  {
    id: 1,
    rep: 'Priya',
    text: 'closed Cascade Global expansion',
    val: 420000,
    time: '2h ago',
    emoji: '🏆',
  },
  {
    id: 2,
    rep: 'Sam',
    text: 'activated LoopNet as new partner',
    val: 67000,
    time: '5h ago',
    emoji: '🎉',
  },
  {
    id: 3,
    rep: 'Jordan',
    text: 'moved TalentBridge to Active',
    val: 195000,
    time: '1d ago',
    emoji: '📈',
  },
  {
    id: 4,
    rep: 'Priya',
    text: 'signed Orbital APIs QBR',
    val: 230000,
    time: '1d ago',
    emoji: '✅',
  },
  {
    id: 5,
    rep: 'Marcus',
    text: 'reactivated SyncLayer deal',
    val: 175000,
    time: '2d ago',
    emoji: '🔥',
  },
  {
    id: 6,
    rep: 'Sam',
    text: 'closed Veloci-T deal',
    val: 112000,
    time: '2d ago',
    emoji: '💰',
  },
  {
    id: 7,
    rep: 'Jordan',
    text: 'scheduled exec intro at Apex',
    val: 310000,
    time: '3d ago',
    emoji: '🤝',
  },
];

const AI_TIPS = {
  1: [
    'DataBridge has been idle 27 days — a quick check-in could unlock $300K in potential. Strike now before it goes cold.',
    'Your win rate is 57% — solid. Focus on getting 2 more deals to Negotiation stage this week to hit your 30-day sprint.',
    "You're $113K from quota. At your avg deal size, that's 3 closes. You have the pipeline — push for urgency.",
  ],
  2: [
    "You're 98% to quota — incredible. Lock in Apex Ventures (Negotiation) to finish the period strong and set a new team record.",
    'Cascade Global is expanding. Schedule an exec QBR now to maximize upsell timing before end of period.',
    "You lead in streak (12 days) and partners (22). Share what's working in the next team standup — leaders elevate the team.",
  ],
  3: [
    'RefNet engagement dropped to 55. A co-marketing offer or intro to an integration partner could rekindle momentum fast.',
    "You're 38% below quota pace. Prioritize SyncLayer and DataBridge — they have the highest potential in your book.",
    'Your pipeline is $580K but conversion has been slow. Consider requesting deal support or a co-sell motion on top accounts.',
  ],
  4: [
    'BlueSky Partners is at 88% churn risk — 52 days idle. This is your most urgent recovery call. High potential, high risk.',
    'Meridian Co has $750K potential sitting stalled. A single exec intro could unstall this deal. Worth the effort.',
    "You have 0-day streak — let's change that today. One partner touchpoint sets the streak back in motion. Small action, big momentum.",
  ],
  5: [
    "You're $31K from quota — literally one mid-size deal away. Growthlink and LoopNet are warm. Push for close this week.",
    'Your 7-day streak is strong. Keep daily partner touchpoints going — consistency is what separates closers from the pack.',
    'Sam, your engagement avg across partners is the highest on the team. Convert that goodwill into referrals from your top 3 partners.',
  ],
};

// ── primitives ───────────────────────────────────────────────────
const Glow = ({ children, hi = false, style = {} }) => (
  <div
    style={{
      background: C.card,
      borderRadius: 14,
      border: `1px solid ${hi ? C.accent : C.cardBorder}`,
      boxShadow: hi
        ? `0 0 28px ${C.accentGlow},inset 0 1px 0 rgba(255,255,255,.04)`
        : 'inset 0 1px 0 rgba(255,255,255,.03)',
      ...style,
    }}
  >
    {children}
  </div>
);
const Tag = ({ label, color }) => (
  <span
    style={{
      background: color + '1a',
      color,
      border: `1px solid ${color}33`,
      borderRadius: 6,
      padding: '2px 8px',
      fontSize: 11,
      fontWeight: 700,
    }}
  >
    {label}
  </span>
);
const Bar = ({ val, max = 100, color = C.accent, h = 6 }) => (
  <div
    style={{
      height: h,
      borderRadius: h,
      background: C.cardBorder,
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        height: '100%',
        width: `${Math.min((val / max) * 100, 100)}%`,
        background: color,
        borderRadius: h,
        transition: 'width .4s',
      }}
    />
  </div>
);
const SL = ({ text, color = C.accent }) => (
  <div
    style={{
      fontSize: 10,
      color,
      letterSpacing: 2,
      textTransform: 'uppercase',
      fontWeight: 800,
      marginBottom: 16,
    }}
  >
    {text}
  </div>
);
const rankColor = (i) =>
  [C.yellow, '#c0c0c0', '#cd7f32', C.sub, C.muted][i] || C.muted;
const rankEmoji = (i) => ['🥇', '🥈', '🥉', '4th', '5th'][i] || `${i + 1}`;

function generateReport(reps, partners, target) {
  const totalARR = reps.reduce((s, r) => s + r.arr, 0);
  const totalPipeline = reps.reduce((s, r) => s + r.pipeline, 0);
  const attainment = (totalARR / target) * 100;
  const top = [...reps].sort((a, b) => b.arr - a.arr)[0];
  const bottom = [...reps].sort((a, b) => a.arr - b.arr)[0];
  const stalled = partners.filter((p) => p.dealStage === 'Stalled');
  const expanding = partners.filter((p) => p.dealStage === 'Expanding');
  const atQuota = reps.filter((r) => r.arr / r.quota >= 0.8).length;
  const highChurn = partners.filter((p) => p.churnRisk >= 60);
  const date = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  return `PARTNERSHIPS TEAM — LEADERSHIP BRIEFING\n${date}  ·  Confidential\n\n${'━'.repeat(
    45
  )}\nEXECUTIVE SUMMARY\n${'━'.repeat(
    45
  )}\nThe partnerships team is tracking at ${pct(attainment)} of the ${fmt$(
    target
  )} revenue target, with ${fmt$(totalARR)} in closed/active ARR and ${fmt$(
    totalPipeline
  )} in total pipeline. ${atQuota} of ${
    reps.length
  } reps are pacing at or above 80% quota attainment.\n\n${'━'.repeat(
    45
  )}\nTEAM PERFORMANCE\n${'━'.repeat(45)}\n${[...reps]
    .sort((a, b) => b.arr - a.arr)
    .map(
      (r, i) =>
        `  ${i + 1}. ${r.name.padEnd(16)} ARR: ${fmt$(r.arr).padEnd(8)} | ${pct(
          (r.arr / r.quota) * 100
        )} quota | Pipeline: ${fmt$(r.pipeline)}`
    )
    .join('\n')}\n\nTOP PERFORMER : ${top.name} — ${fmt$(top.arr)} (${pct(
    (top.arr / top.quota) * 100
  )} of quota)\nNEEDS SUPPORT : ${bottom.name} — ${fmt$(bottom.arr)} (${pct(
    (bottom.arr / bottom.quota) * 100
  )} of quota)\n\n${'━'.repeat(45)}\nPARTNER PORTFOLIO\n${'━'.repeat(
    45
  )}\n  Total Partners    : ${partners.length}\n  Expanding         : ${
    expanding.length
  } — ${expanding.map((p) => p.name).join(', ')}\n  Stalled           : ${
    stalled.length
  } — ${stalled.map((p) => p.name).join(', ')}\n  High Churn Risk   : ${
    highChurn.length
  } partners (${highChurn.map((p) => p.name).join(', ')})\n\n${'━'.repeat(
    45
  )}\nRISKS & ACTIONS\n${'━'.repeat(45)}\n${
    stalled.length > 2
      ? `⚠  ${stalled.length} stalled deals = ${fmt$(
          stalled.reduce((s, p) => s + p.potential, 0)
        )} unrealized potential. Recommend exec outreach within 2 weeks.`
      : '✓  Stalled pipeline within acceptable range.'
  }\n${
    highChurn.length > 0
      ? `⚠  ${highChurn.length} partners at high churn risk. Immediate re-engagement plan recommended.`
      : '✓  No critical churn risk detected.'
  }\n${
    bottom.arr / bottom.quota < 0.6
      ? `⚠  ${bottom.name} at ${pct(
          (bottom.arr / bottom.quota) * 100
        )} quota — recommend 1:1 pipeline review.`
      : '✓  No reps critically below quota threshold.'
  }\n${
    attainment < 80
      ? `⚠  Team is ${pct(100 - attainment)} below target pace.`
      : `✓  Team on pace to meet or exceed target.`
  }\n\n${'━'.repeat(45)}\nFORWARD LOOK\n${'━'.repeat(
    45
  )}\nPipeline coverage: ${pct((totalPipeline / target) * 100)} — ${
    totalPipeline > target * 1.5
      ? 'strong downside protection.'
      : totalPipeline > target
      ? 'adequate, monitor closely.'
      : 'below 1.5× recommended — prioritize pipeline build.'
  } Key focus: accelerate ${expanding
    .map((p) => p.name)
    .join(
      ' & '
    )} expansions; reduce partner idle time; increase exec engagement on strategic accounts.\n\n${'━'.repeat(
    45
  )}\nGenerated by Partnerships Command Center\n`;
}

function generateMonthlyRecap(reps, partners) {
  const totalARR = reps.reduce((s, r) => s + r.arr, 0);
  const mvp = [...reps].sort((a, b) => b.arr - a.arr)[0];
  const mostImproved = [...reps].sort((a, b) => b.streak - a.streak)[0];
  const topPartner = [...partners].sort((a, b) => b.arr - a.arr)[0];
  const wins = partners.filter((p) =>
    ['Active', 'Expanding'].includes(p.dealStage)
  ).length;
  const misses = partners.filter((p) => p.dealStage === 'Stalled').length;
  const churnSaved = partners.filter(
    (p) => p.churnRisk < 30 && p.engagement > 70
  ).length;
  return `🏅 MONTHLY RECAP — ${new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })}\n${'═'.repeat(42)}\n\n💰 TOTAL ARR CLOSED THIS MONTH\n   ${fmt$(
    totalARR
  )} across ${reps.length} reps\n\n🏆 MVP OF THE MONTH\n   ${mvp.name} — ${fmt$(
    mvp.arr
  )} ARR (${pct((mvp.arr / mvp.quota) * 100)} of quota)\n   ${mvp.badge} · ${
    mvp.streak
  }-day active streak\n\n🚀 MOST IMPROVED\n   ${mostImproved.name} — ${
    mostImproved.streak
  }-day streak, highest consistency\n\n✅ WINS THIS MONTH\n   · ${wins} active/expanding partnerships\n   · ${churnSaved} at-risk partners saved from churn\n   · Top partner: ${
    topPartner.name
  } at ${fmt$(topPartner.arr)} ARR\n   · ${
    reps.filter((r) => r.arr >= r.quota * 0.8).length
  }/${
    reps.length
  } reps at 80%+ quota\n\n⚠  MISSES & GAPS\n   · ${misses} stalled partnerships need recovery\n   · ${
    reps.filter((r) => r.streak === 0).length
  } rep(s) with no active streak\n   · ${
    partners.filter((p) => p.churnRisk > 60).length
  } high-risk partners not re-engaged\n\n🎯 GOALS FOR NEXT MONTH\n   · Close ${misses} stalled deals or reassign\n   · Get all reps to 5+ day streak\n   · Activate exec sponsors on top 3 strategic accounts\n   · Target ${fmt$(
    reps.reduce((s, r) => s + r.quota, 0) * 1.05
  )} total ARR (5% stretch)\n\n${'═'.repeat(
    42
  )}\nAuto-generated · Partnerships Command Center\n`;
}

const TABS = [
  '🏆 LEADERBOARD',
  '👤 REP BREAKDOWN',
  '🎯 PRIORITY',
  '📊 PIPELINE',
  '⚠ CHURN',
  '💡 HEALTH',
  '📝 REPORT',
  '🏅 RECAP',
  '⚙ SETTINGS',
];

export default function App() {
  const [tab, setTab] = useState(0);
  const [selRep, setSelRep] = useState(1);
  const [target, setTarget] = useState(3000000);
  const [copied, setCopied] = useState(false);
  const [tipIdx, setTipIdx] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  const [feedIdx, setFeedIdx] = useState(0);
  const [sprintMode, setSprintMode] = useState(30);
  const tickRef = useRef();

  useEffect(() => {
    tickRef.current = setInterval(
      () => setFeedIdx((i) => (i + 1) % WIN_FEED.length),
      3000
    );
    return () => clearInterval(tickRef.current);
  }, []);

  const sorted = useMemo(() => [...REPS].sort((a, b) => b.arr - a.arr), []);
  const rep = REPS.find((r) => r.id === selRep);
  const repPartners = BASE_PARTNERS.filter((p) => p.repId === selRep);
  const totalARR = REPS.reduce((s, r) => s + r.arr, 0);
  const totalPipeline = REPS.reduce((s, r) => s + r.pipeline, 0);
  const attainment = (totalARR / target) * 100;
  const report = useMemo(
    () => generateReport(REPS, BASE_PARTNERS, target),
    [target]
  );
  const recap = useMemo(() => generateMonthlyRecap(REPS, BASE_PARTNERS), []);

  const churnPartners = useMemo(
    () => [...BASE_PARTNERS].sort((a, b) => b.churnRisk - a.churnRisk),
    []
  );
  const highChurn = churnPartners.filter((p) => p.churnRisk >= 60);
  const medChurn = churnPartners.filter(
    (p) => p.churnRisk >= 30 && p.churnRisk < 60
  );

  const copyText = (txt) => {
    navigator.clipboard.writeText(txt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const nextTip = (id) =>
    setTipIdx((prev) => ({
      ...prev,
      [id]: (prev[id] + 1) % AI_TIPS[id].length,
    }));
  const curFeed = WIN_FEED[feedIdx];

  return (
    <div
      style={{
        background: C.bg,
        minHeight: '100vh',
        fontFamily: "'Inter',system-ui,sans-serif",
        color: C.text,
        paddingBottom: 60,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: '0 24px',
          borderBottom: `1px solid ${C.cardBorder}`,
          background: C.bgDeep,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 18,
            paddingBottom: 14,
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 3,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: C.green,
                  boxShadow: `0 0 10px ${C.green}`,
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  color: C.muted,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                }}
              >
                Partnerships OS · Live
              </span>
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 900,
                letterSpacing: -0.5,
                background: `linear-gradient(100deg,#fff 30%,${C.accent} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Partnerships Command Center
            </h1>
          </div>
          {/* Win Feed ticker */}
          <div style={{ flex: 1, margin: '0 32px', overflow: 'hidden' }}>
            <div
              key={feedIdx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 14px',
                background: C.accentDim,
                borderRadius: 10,
                border: `1px solid ${C.accent}22`,
                animation: 'fadeIn .5s ease',
              }}
            >
              <span style={{ fontSize: 16 }}>{curFeed.emoji}</span>
              <span
                style={{
                  fontSize: 11,
                  color: C.muted,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  flexShrink: 0,
                }}
              >
                LIVE
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: C.text,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                <span style={{ color: C.accent, fontWeight: 700 }}>
                  {curFeed.rep}
                </span>{' '}
                {curFeed.text} —
                <span style={{ color: C.green, fontWeight: 700 }}>
                  {' '}
                  {fmt$(curFeed.val)}
                </span>
              </span>
              <span style={{ fontSize: 11, color: C.muted, flexShrink: 0 }}>
                {curFeed.time}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {[
              { l: 'TEAM ARR', v: fmt$(totalARR), c: C.green },
              { l: 'PIPELINE', v: fmt$(totalPipeline), c: C.cyan },
              {
                l: 'ATTAINMENT',
                v: pct(attainment),
                c:
                  attainment >= 100
                    ? C.green
                    : attainment >= 70
                    ? C.yellow
                    : C.red,
              },
            ].map((m) => (
              <div key={m.l} style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: 9,
                    color: C.muted,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                  }}
                >
                  {m.l}
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: m.c }}>
                  {m.v}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
          {TABS.map((t, i) => (
            <button
              key={i}
              onClick={() => setTab(i)}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px 14px',
                whiteSpace: 'nowrap',
                borderBottom: `2px solid ${
                  tab === i ? C.accent : 'transparent'
                }`,
                color: tab === i ? C.accent : C.muted,
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: 1,
                cursor: 'pointer',
                transition: 'all .15s',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{ padding: '20px 24px' }}>
        {/* ══ LEADERBOARD ═══════════════════════════════════════════ */}
        {tab === 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 310px',
              gap: 20,
            }}
          >
            <div>
              {/* podium */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1.15fr 1fr',
                  gap: 12,
                  marginBottom: 22,
                  alignItems: 'flex-end',
                }}
              >
                {[sorted[1], sorted[0], sorted[2]].map((r, pos) => {
                  const heights = ['138px', '168px', '118px'];
                  return (
                    <div
                      key={r.id}
                      style={{
                        background: C.card,
                        border: `1px solid ${r.color}44`,
                        borderRadius: 14,
                        boxShadow: `0 0 ${pos === 1 ? 40 : 20}px ${r.color}${
                          pos === 1 ? '55' : '33'
                        }`,
                        padding: '16px 12px',
                        textAlign: 'center',
                        minHeight: heights[pos],
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 5,
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        setSelRep(r.id);
                        setTab(1);
                      }}
                    >
                      <div style={{ fontSize: pos === 1 ? 26 : 20 }}>
                        {['🥈', '🥇', '🥉'][pos]}
                      </div>
                      <div
                        style={{
                          width: pos === 1 ? 50 : 40,
                          height: pos === 1 ? 50 : 40,
                          borderRadius: '50%',
                          background: r.color + '22',
                          border: `2px solid ${r.color}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: pos === 1 ? 15 : 13,
                          fontWeight: 900,
                          color: r.color,
                        }}
                      >
                        {r.avatar}
                      </div>
                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: pos === 1 ? 14 : 12,
                        }}
                      >
                        {r.name.split(' ')[0]}
                      </div>
                      <div
                        style={{
                          fontSize: pos === 1 ? 19 : 15,
                          fontWeight: 900,
                          color: r.color,
                        }}
                      >
                        {fmt$(r.arr)}
                      </div>
                      <div style={{ fontSize: 10, color: C.muted }}>
                        {pct((r.arr / r.quota) * 100)} quota
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          background: r.color + '18',
                          color: r.color,
                          borderRadius: 6,
                          padding: '2px 7px',
                          fontWeight: 700,
                        }}
                      >
                        {r.badge}
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* table */}
              <Glow style={{ padding: '16px 18px' }}>
                <SL text="Full Rankings — click to drill down" />
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      '36px 1fr 80px 85px 85px 75px 65px 55px',
                    gap: 10,
                    padding: '0 4px',
                    marginBottom: 8,
                  }}
                >
                  {[
                    '#',
                    'REP',
                    'BADGE',
                    'ARR',
                    'PIPELINE',
                    'QUOTA %',
                    'STREAK',
                    'W/D',
                  ].map((h) => (
                    <div
                      key={h}
                      style={{
                        fontSize: 9,
                        color: C.muted,
                        fontWeight: 800,
                        letterSpacing: 0.8,
                      }}
                    >
                      {h}
                    </div>
                  ))}
                </div>
                {sorted.map((r, i) => {
                  const q = (r.arr / r.quota) * 100;
                  return (
                    <div
                      key={r.id}
                      onClick={() => {
                        setSelRep(r.id);
                        setTab(1);
                      }}
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          '36px 1fr 80px 85px 85px 75px 65px 55px',
                        gap: 10,
                        alignItems: 'center',
                        padding: '9px 4px',
                        borderBottom: `1px solid ${C.cardBorder}`,
                        cursor: 'pointer',
                        borderRadius: 8,
                        background:
                          selRep === r.id ? r.color + '0d' : 'transparent',
                        transition: 'background .15s',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 900,
                          color: rankColor(i),
                        }}
                      >
                        {rankEmoji(i)}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 9,
                        }}
                      >
                        <div
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: '50%',
                            background: r.color + '22',
                            border: `1.5px solid ${r.color}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 10,
                            fontWeight: 800,
                            color: r.color,
                            flexShrink: 0,
                          }}
                        >
                          {r.avatar}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13 }}>
                            {r.name}
                          </div>
                          <div style={{ fontSize: 10, color: C.muted }}>
                            {r.partners} partners
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize: 11 }}>{r.badge}</div>
                      <div
                        style={{
                          fontWeight: 800,
                          color: C.green,
                          fontSize: 13,
                        }}
                      >
                        {fmt$(r.arr)}
                      </div>
                      <div style={{ color: C.sub, fontSize: 12 }}>
                        {fmt$(r.pipeline)}
                      </div>
                      <div>
                        <Bar
                          val={q}
                          color={
                            q >= 100 ? C.green : q >= 70 ? C.yellow : C.red
                          }
                          h={5}
                        />
                        <div
                          style={{
                            fontSize: 10,
                            color:
                              q >= 100 ? C.green : q >= 70 ? C.yellow : C.red,
                            marginTop: 2,
                            fontWeight: 700,
                          }}
                        >
                          {pct(q)}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color:
                            r.streak >= 7
                              ? C.orange
                              : r.streak >= 3
                              ? C.yellow
                              : C.sub,
                          fontWeight: 700,
                        }}
                      >
                        {r.streak > 0 ? `🔥${r.streak}d` : '—'}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 800,
                          color: C.accent,
                        }}
                      >
                        {r.wins}
                        <span style={{ color: C.muted, fontWeight: 400 }}>
                          /{r.deals}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </Glow>
            </div>

            {/* right col */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Glow
                hi
                style={{
                  padding: '16px 18px',
                  background: `linear-gradient(135deg,${C.accentDim},${C.bgDeep})`,
                }}
              >
                <SL text="⚡ This Week's Challenges" color={C.yellow} />
                {[
                  {
                    icon: '💼',
                    title: 'Deal Closer',
                    desc: 'First to close 2 new deals',
                    leader: `${sorted[0].name.split(' ')[0]} leading`,
                    progress: 80,
                  },
                  {
                    icon: '🌱',
                    title: 'Partner Activator',
                    desc: 'Most new partners activated',
                    leader: `${sorted[4].name.split(' ')[0]} on the move`,
                    progress: 45,
                  },
                  {
                    icon: '💬',
                    title: 'Engagement King',
                    desc: 'Highest avg partner engagement',
                    leader: `${sorted[1].name.split(' ')[0]} in the lead`,
                    progress: 65,
                  },
                ].map((c) => (
                  <div
                    key={c.title}
                    style={{
                      marginBottom: 12,
                      padding: '10px',
                      borderRadius: 10,
                      background: '#ffffff06',
                      border: `1px solid ${C.cardBorder}`,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 3,
                      }}
                    >
                      <span style={{ fontWeight: 700, fontSize: 12 }}>
                        {c.icon} {c.title}
                      </span>
                      <span
                        style={{
                          fontSize: 9,
                          color: C.yellow,
                          fontWeight: 700,
                          background: C.yellow + '18',
                          padding: '1px 6px',
                          borderRadius: 4,
                        }}
                      >
                        LIVE
                      </span>
                    </div>
                    <div
                      style={{ fontSize: 11, color: C.muted, marginBottom: 7 }}
                    >
                      {c.desc}
                    </div>
                    <Bar val={c.progress} color={C.yellow} h={5} />
                    <div style={{ fontSize: 10, color: C.sub, marginTop: 3 }}>
                      {c.leader}
                    </div>
                  </div>
                ))}
              </Glow>

              <Glow style={{ padding: '16px 18px' }}>
                <SL text="🎖 Achievement Badges" color={C.pink} />
                {[
                  {
                    emoji: '👑',
                    name: 'Top Dog',
                    desc: 'Highest ARR',
                    holder: sorted[0].name,
                  },
                  {
                    emoji: '🔥',
                    name: 'Longest Streak',
                    desc: 'Most consecutive days',
                    holder: [...REPS].sort((a, b) => b.streak - a.streak)[0]
                      .name,
                  },
                  {
                    emoji: '💎',
                    name: 'Biggest Deal',
                    desc: 'Largest single partner ARR',
                    holder: 'Priya Sharma',
                  },
                  {
                    emoji: '🌟',
                    name: 'Most Partners',
                    desc: 'Widest portfolio',
                    holder: [...REPS].sort((a, b) => b.partners - a.partners)[0]
                      .name,
                  },
                ].map((b) => (
                  <div
                    key={b.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '7px 0',
                      borderBottom: `1px solid ${C.cardBorder}`,
                    }}
                  >
                    <div style={{ fontSize: 20 }}>{b.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 12 }}>
                        {b.name}
                      </div>
                      <div style={{ fontSize: 10, color: C.muted }}>
                        {b.desc}
                      </div>
                    </div>
                    <div
                      style={{ fontSize: 11, color: C.pink, fontWeight: 700 }}
                    >
                      {b.holder.split(' ')[0]}
                    </div>
                  </div>
                ))}
              </Glow>

              <Glow style={{ padding: '16px 18px' }}>
                <SL text="📊 Gap to Next Rank" color={C.cyan} />
                {sorted.map((r, i) => {
                  const gap = i > 0 ? sorted[i - 1].arr - r.arr : 0;
                  return (
                    <div
                      key={r.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '6px 0',
                        borderBottom: `1px solid ${C.cardBorder}`,
                      }}
                    >
                      <span style={{ fontSize: 12 }}>
                        {r.name.split(' ')[0]}
                      </span>
                      <span style={{ fontSize: 12 }}>
                        <span style={{ color: C.green, fontWeight: 700 }}>
                          {fmt$(r.arr)}
                        </span>
                        {i > 0 && (
                          <span
                            style={{
                              color: C.red,
                              fontSize: 10,
                              marginLeft: 6,
                            }}
                          >
                            ▼{fmt$(gap)}
                          </span>
                        )}
                        {i === 0 && (
                          <span
                            style={{
                              color: C.yellow,
                              fontSize: 10,
                              marginLeft: 6,
                            }}
                          >
                            👑 #1
                          </span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </Glow>
            </div>
          </div>
        )}

        {/* ══ REP BREAKDOWN ═════════════════════════════════════════ */}
        {tab === 1 && (
          <div>
            <div
              style={{
                display: 'flex',
                gap: 8,
                marginBottom: 20,
                flexWrap: 'wrap',
              }}
            >
              {REPS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelRep(r.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    padding: '7px 14px',
                    background: selRep === r.id ? r.color + '22' : C.card,
                    border: `1px solid ${
                      selRep === r.id ? r.color : C.cardBorder
                    }`,
                    borderRadius: 10,
                    cursor: 'pointer',
                    color: C.text,
                    fontWeight: 600,
                    fontSize: 12,
                    boxShadow:
                      selRep === r.id ? `0 0 14px ${r.color}33` : 'none',
                    transition: 'all .15s',
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: r.color + '33',
                      border: `1.5px solid ${r.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 9,
                      fontWeight: 800,
                      color: r.color,
                    }}
                  >
                    {r.avatar}
                  </div>
                  {r.name.split(' ')[0]}
                </button>
              ))}
            </div>

            {rep && (
              <div>
                <Glow
                  hi
                  style={{
                    padding: '20px 24px',
                    marginBottom: 18,
                    background: `linear-gradient(135deg,${rep.color}0d,${C.bgDeep})`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 14,
                    }}
                  >
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 14 }}
                    >
                      <div
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: '50%',
                          background: rep.color + '22',
                          border: `2px solid ${rep.color}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 18,
                          fontWeight: 900,
                          color: rep.color,
                        }}
                      >
                        {rep.avatar}
                      </div>
                      <div>
                        <div style={{ fontSize: 20, fontWeight: 900 }}>
                          {rep.name}
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            color: rep.color,
                            fontWeight: 700,
                          }}
                        >
                          {rep.badge}
                        </div>
                        <div
                          style={{ fontSize: 11, color: C.muted, marginTop: 1 }}
                        >
                          {rep.streak > 0
                            ? `🔥 ${rep.streak}-day streak`
                            : 'No streak — time to go!'}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                      {[
                        { l: 'ARR', v: fmt$(rep.arr), c: C.green },
                        { l: 'PIPELINE', v: fmt$(rep.pipeline), c: C.cyan },
                        {
                          l: 'QUOTA',
                          v: pct((rep.arr / rep.quota) * 100),
                          c:
                            rep.arr / rep.quota >= 1
                              ? C.green
                              : rep.arr / rep.quota >= 0.7
                              ? C.yellow
                              : C.red,
                        },
                        {
                          l: 'WIN RATE',
                          v: pct((rep.wins / rep.deals) * 100),
                          c: C.accent,
                        },
                      ].map((m) => (
                        <div key={m.l} style={{ textAlign: 'right' }}>
                          <div
                            style={{
                              fontSize: 9,
                              color: C.muted,
                              letterSpacing: 1,
                              textTransform: 'uppercase',
                            }}
                          >
                            {m.l}
                          </div>
                          <div
                            style={{
                              fontSize: 20,
                              fontWeight: 900,
                              color: m.c,
                            }}
                          >
                            {m.v}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginTop: 14 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 5,
                      }}
                    >
                      <span style={{ fontSize: 11, color: C.muted }}>
                        Quota: {fmt$(rep.arr)} / {fmt$(rep.quota)}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: rep.color,
                        }}
                      >
                        {fmt$(rep.quota - rep.arr)} remaining
                      </span>
                    </div>
                    <Bar
                      val={rep.arr}
                      max={rep.quota}
                      color={rep.color}
                      h={10}
                    />
                  </div>
                </Glow>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: 16,
                  }}
                >
                  {/* Sprint Goals */}
                  <Glow style={{ padding: '18px 20px' }}>
                    <SL text="🎯 Sprint Goals" color={C.yellow} />
                    <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                      {[30, 60, 90].map((d) => (
                        <button
                          key={d}
                          onClick={() => setSprintMode(d)}
                          style={{
                            flex: 1,
                            padding: '5px 0',
                            background:
                              sprintMode === d ? C.yellow + '22' : C.cardBorder,
                            border: `1px solid ${
                              sprintMode === d ? C.yellow : C.cardBorder
                            }`,
                            color: sprintMode === d ? C.yellow : C.muted,
                            borderRadius: 8,
                            cursor: 'pointer',
                            fontSize: 11,
                            fontWeight: 700,
                            transition: 'all .15s',
                          }}
                        >
                          {d}d
                        </button>
                      ))}
                    </div>
                    {(() => {
                      const need =
                        sprintMode === 30
                          ? rep.sprint30
                          : sprintMode === 60
                          ? rep.sprint60
                          : rep.sprint90;
                      const done = rep.quota - rep.arr;
                      const pctDone = Math.min(
                        ((rep.quota - done) / rep.quota) * 100,
                        100
                      );
                      return (
                        <div>
                          <div
                            style={{
                              fontSize: 26,
                              fontWeight: 900,
                              color: C.yellow,
                              marginBottom: 4,
                            }}
                          >
                            {fmt$(need)}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: C.muted,
                              marginBottom: 12,
                            }}
                          >
                            needed in next {sprintMode} days
                          </div>
                          <Bar
                            val={Math.max(
                              0,
                              100 - (need / (rep.quota - rep.arr)) * 100
                            )}
                            color={C.yellow}
                            h={7}
                          />
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              marginTop: 4,
                            }}
                          >
                            <span style={{ fontSize: 10, color: C.muted }}>
                              0
                            </span>
                            <span
                              style={{
                                fontSize: 10,
                                color: C.yellow,
                                fontWeight: 700,
                              }}
                            >
                              {fmt$(need)} target
                            </span>
                          </div>
                          <div
                            style={{
                              marginTop: 12,
                              padding: '8px 10px',
                              borderRadius: 8,
                              background: C.yellow + '0d',
                              border: `1px solid ${C.yellow}22`,
                            }}
                          >
                            <div style={{ fontSize: 11, color: C.yellow }}>
                              ≈ {Math.ceil(need / 45000)} deals at avg size to
                              hit {sprintMode}d goal
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </Glow>

                  {/* AI Coaching */}
                  <Glow
                    hi
                    style={{
                      padding: '18px 20px',
                      background: `linear-gradient(135deg,${C.accentDim},${C.bgDeep})`,
                    }}
                  >
                    <SL text="🧠 AI Coaching Tip" color={C.accent} />
                    <div
                      style={{
                        fontSize: 13,
                        color: C.text,
                        lineHeight: 1.7,
                        minHeight: 80,
                        marginBottom: 14,
                      }}
                    >
                      "{AI_TIPS[rep.id][tipIdx[rep.id]]}"
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: 10, color: C.muted }}>
                        Tip {tipIdx[rep.id] + 1} of {AI_TIPS[rep.id].length}
                      </span>
                      <button
                        onClick={() => nextTip(rep.id)}
                        style={{
                          background: C.accentDim,
                          border: `1px solid ${C.accent}44`,
                          color: C.accent,
                          borderRadius: 8,
                          padding: '5px 12px',
                          cursor: 'pointer',
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        Next tip →
                      </button>
                    </div>
                    <div style={{ marginTop: 12, display: 'flex', gap: 4 }}>
                      {AI_TIPS[rep.id].map((_, i) => (
                        <div
                          key={i}
                          style={{
                            flex: 1,
                            height: 3,
                            borderRadius: 2,
                            background:
                              i === tipIdx[rep.id] ? C.accent : C.cardBorder,
                            transition: 'background .2s',
                          }}
                        />
                      ))}
                    </div>
                  </Glow>

                  {/* vs team + climb */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 14,
                    }}
                  >
                    <Glow style={{ padding: '18px 20px' }}>
                      <SL text="⚔ vs. Team" color={C.pink} />
                      {[
                        {
                          l: 'ARR Rank',
                          v: `#${
                            sorted.findIndex((r) => r.id === rep.id) + 1
                          }/${REPS.length}`,
                          c: C.yellow,
                        },
                        {
                          l: 'Quota %',
                          v: pct((rep.arr / rep.quota) * 100),
                          c: rep.arr / rep.quota >= 1 ? C.green : C.yellow,
                        },
                        {
                          l: 'Streak',
                          v: rep.streak > 0 ? `${rep.streak}d 🔥` : '—',
                          c: rep.streak >= 7 ? C.orange : C.sub,
                        },
                        {
                          l: 'Win Rate',
                          v: pct((rep.wins / rep.deals) * 100),
                          c: C.green,
                        },
                      ].map((m) => (
                        <div
                          key={m.l}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '6px 0',
                            borderBottom: `1px solid ${C.cardBorder}`,
                          }}
                        >
                          <span style={{ fontSize: 12, color: C.sub }}>
                            {m.l}
                          </span>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: m.c,
                            }}
                          >
                            {m.v}
                          </span>
                        </div>
                      ))}
                    </Glow>
                    <Glow style={{ padding: '18px 20px' }}>
                      <SL text="🚀 To Climb" color={C.cyan} />
                      {(() => {
                        const myRank = sorted.findIndex((r) => r.id === rep.id);
                        if (myRank === 0)
                          return (
                            <div style={{ color: C.green, fontSize: 13 }}>
                              👑 You're #1 — defend it!
                            </div>
                          );
                        const above = sorted[myRank - 1];
                        const gap = above.arr - rep.arr;
                        return (
                          <div>
                            <div
                              style={{
                                fontSize: 12,
                                color: C.text,
                                marginBottom: 6,
                              }}
                            >
                              <span style={{ color: C.red, fontWeight: 800 }}>
                                {fmt$(gap)}
                              </span>{' '}
                              behind{' '}
                              <span
                                style={{ color: above.color, fontWeight: 800 }}
                              >
                                {above.name.split(' ')[0]}
                              </span>
                            </div>
                            <Bar
                              val={rep.arr}
                              max={above.arr + 30000}
                              color={rep.color}
                              h={7}
                            />
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginTop: 3,
                              }}
                            >
                              <span style={{ fontSize: 9, color: rep.color }}>
                                {rep.name.split(' ')[0]}
                              </span>
                              <span style={{ fontSize: 9, color: above.color }}>
                                {above.name.split(' ')[0]}
                              </span>
                            </div>
                          </div>
                        );
                      })()}
                    </Glow>
                  </div>

                  {/* partners */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Glow style={{ padding: '18px 20px' }}>
                      <SL
                        text={`📋 ${
                          rep.name.split(' ')[0]
                        }'s Partner Portfolio (${repPartners.length})`}
                        color={rep.color}
                      />
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fill,minmax(260px,1fr))',
                          gap: 10,
                        }}
                      >
                        {repPartners.map((p) => {
                          const tm = TYPE_META[p.type];
                          return (
                            <div
                              key={p.id}
                              style={{
                                padding: '12px 14px',
                                borderRadius: 10,
                                background: '#ffffff04',
                                border: `1px solid ${C.cardBorder}`,
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  marginBottom: 5,
                                }}
                              >
                                <span style={{ fontWeight: 700, fontSize: 13 }}>
                                  {p.name}
                                </span>
                                <Tag
                                  label={p.dealStage}
                                  color={STAGE_COLOR[p.dealStage]}
                                />
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  gap: 6,
                                  alignItems: 'center',
                                  marginBottom: 6,
                                }}
                              >
                                <Tag
                                  label={p.type.split(' ')[0]}
                                  color={tm.color}
                                />
                                <span
                                  style={{
                                    fontSize: 11,
                                    color: C.green,
                                    fontWeight: 700,
                                  }}
                                >
                                  {fmt$(p.arr)}
                                </span>
                                <span
                                  style={{
                                    fontSize: 11,
                                    color: p.daysIdle > 21 ? C.red : C.muted,
                                  }}
                                >
                                  {p.daysIdle}d idle
                                </span>
                              </div>
                              <Bar
                                val={p.engagement}
                                color={
                                  p.engagement >= 70
                                    ? C.green
                                    : p.engagement >= 45
                                    ? C.yellow
                                    : C.red
                                }
                                h={4}
                              />
                              {p.churnRisk >= 50 && (
                                <div
                                  style={{
                                    fontSize: 10,
                                    color: C.red,
                                    marginTop: 4,
                                  }}
                                >
                                  ⚠ Churn risk: {p.churnRisk}%
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </Glow>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ PRIORITY ══════════════════════════════════════════════ */}
        {tab === 2 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 280px',
              gap: 20,
            }}
          >
            <Glow style={{ padding: '18px 20px' }}>
              <SL text="🎯 Partner Priority Ranking" />
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '28px 1.2fr 80px 80px 80px 70px 70px',
                  gap: 10,
                  padding: '0 4px',
                  marginBottom: 8,
                }}
              >
                {[
                  '#',
                  'PARTNER',
                  'TYPE',
                  'ARR',
                  'POTENTIAL',
                  'STAGE',
                  'OWNER',
                ].map((h) => (
                  <div
                    key={h}
                    style={{
                      fontSize: 9,
                      color: C.muted,
                      fontWeight: 800,
                      letterSpacing: 0.8,
                    }}
                  >
                    {h}
                  </div>
                ))}
              </div>
              {[...BASE_PARTNERS]
                .sort((a, b) => b.potential - a.potential)
                .map((p, i) => {
                  const tm = TYPE_META[p.type];
                  const owner = REPS.find((r) => r.id === p.repId);
                  return (
                    <div
                      key={p.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          '28px 1.2fr 80px 80px 80px 70px 70px',
                        gap: 10,
                        alignItems: 'center',
                        padding: '9px 4px',
                        borderBottom: `1px solid ${C.cardBorder}`,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          color: rankColor(i),
                        }}
                      >
                        {i + 1}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>
                          {p.name}
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            color: p.daysIdle > 21 ? C.red : C.muted,
                          }}
                        >
                          {p.daysIdle}d idle
                        </div>
                      </div>
                      <Tag label={p.type.split(' ')[0]} color={tm.color} />
                      <div
                        style={{
                          fontSize: 12,
                          color: C.green,
                          fontWeight: 700,
                        }}
                      >
                        {fmt$(p.arr)}
                      </div>
                      <div style={{ fontSize: 12, color: C.sub }}>
                        {fmt$(p.potential)}
                      </div>
                      <Tag
                        label={p.dealStage}
                        color={STAGE_COLOR[p.dealStage]}
                      />
                      {owner && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 5,
                          }}
                        >
                          <div
                            style={{
                              width: 18,
                              height: 18,
                              borderRadius: '50%',
                              background: owner.color + '33',
                              border: `1px solid ${owner.color}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 8,
                              fontWeight: 800,
                              color: owner.color,
                            }}
                          >
                            {owner.avatar}
                          </div>
                          <span style={{ fontSize: 10, color: C.sub }}>
                            {owner.name.split(' ')[0]}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
            </Glow>
            <Glow style={{ padding: '18px 20px', height: 'fit-content' }}>
              <SL text="Coverage by Rep" color={C.cyan} />
              {REPS.map((r) => {
                const rp = BASE_PARTNERS.filter((p) => p.repId === r.id);
                return (
                  <div key={r.id} style={{ marginBottom: 14 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 4,
                      }}
                    >
                      <span style={{ fontSize: 12 }}>
                        {r.name.split(' ')[0]}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: r.color,
                        }}
                      >
                        {rp.length}
                      </span>
                    </div>
                    <Bar val={rp.length} max={8} color={r.color} h={6} />
                    <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>
                      {fmt$(rp.reduce((s, p) => s + p.arr, 0))} ARR
                    </div>
                  </div>
                );
              })}
            </Glow>
          </div>
        )}

        {/* ══ PIPELINE ══════════════════════════════════════════════ */}
        {tab === 3 && (
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}
          >
            <Glow style={{ padding: '20px 22px' }}>
              <SL text="Deal Stage Funnel" />
              {['Active', 'Expanding', 'Negotiation', 'Stalled'].map((s) => {
                const n = BASE_PARTNERS.filter((p) => p.dealStage === s).length;
                return (
                  <div key={s} style={{ marginBottom: 14 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 5,
                      }}
                    >
                      <span style={{ fontSize: 13 }}>{s}</span>
                      <span style={{ fontWeight: 800, color: STAGE_COLOR[s] }}>
                        {n}
                      </span>
                    </div>
                    <Bar
                      val={n}
                      max={BASE_PARTNERS.length}
                      color={STAGE_COLOR[s]}
                      h={8}
                    />
                  </div>
                );
              })}
            </Glow>
            <Glow style={{ padding: '20px 22px' }}>
              <SL text="Pipeline by Rep" color={C.cyan} />
              {[...REPS]
                .sort((a, b) => b.pipeline - a.pipeline)
                .map((r) => (
                  <div key={r.id} style={{ marginBottom: 14 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 5,
                      }}
                    >
                      <span style={{ fontSize: 13 }}>{r.name}</span>
                      <span style={{ fontWeight: 700, color: r.color }}>
                        {fmt$(r.pipeline)}
                      </span>
                    </div>
                    <Bar
                      val={r.pipeline}
                      max={[...REPS].reduce(
                        (mx, r) => Math.max(mx, r.pipeline),
                        0
                      )}
                      color={r.color}
                      h={7}
                    />
                  </div>
                ))}
            </Glow>
            <Glow style={{ padding: '20px 22px' }}>
              <SL text="ARR by Partner Type" color={C.green} />
              {Object.entries(TYPE_META).map(([type, meta]) => {
                const v = BASE_PARTNERS.filter((p) => p.type === type).reduce(
                  (s, p) => s + p.arr,
                  0
                );
                return (
                  <div key={type} style={{ marginBottom: 14 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 5,
                      }}
                    >
                      <span style={{ fontSize: 13 }}>
                        {meta.icon} {type}
                      </span>
                      <span style={{ fontWeight: 700, color: meta.color }}>
                        {fmt$(v)}
                      </span>
                    </div>
                    <Bar
                      val={v}
                      max={BASE_PARTNERS.reduce((s, p) => s + p.arr, 0)}
                      color={meta.color}
                      h={7}
                    />
                  </div>
                );
              })}
            </Glow>
            <Glow style={{ padding: '20px 22px' }}>
              <SL text="Revenue vs Target" color={C.yellow} />
              {[
                { l: 'Team ARR', v: fmt$(totalARR), c: C.green },
                { l: 'Pipeline', v: fmt$(totalPipeline), c: C.cyan },
                { l: 'Target', v: fmt$(target), c: C.sub },
                {
                  l: 'Attainment',
                  v: pct(attainment),
                  c:
                    attainment >= 100
                      ? C.green
                      : attainment >= 70
                      ? C.yellow
                      : C.red,
                },
              ].map((m) => (
                <div
                  key={m.l}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: `1px solid ${C.cardBorder}`,
                  }}
                >
                  <span style={{ fontSize: 13, color: C.sub }}>{m.l}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: m.c }}>
                    {m.v}
                  </span>
                </div>
              ))}
              <div style={{ marginTop: 14 }}>
                <Bar
                  val={attainment}
                  max={140}
                  color={
                    attainment >= 100
                      ? C.green
                      : attainment >= 70
                      ? C.yellow
                      : C.red
                  }
                  h={10}
                />
              </div>
            </Glow>
          </div>
        )}

        {/* ══ CHURN PREDICTOR ═══════════════════════════════════════ */}
        {tab === 4 && (
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3,1fr)',
                gap: 16,
                marginBottom: 20,
              }}
            >
              {[
                {
                  l: 'High Risk (≥60%)',
                  n: highChurn.length,
                  c: C.red,
                  desc: 'Immediate action needed',
                },
                {
                  l: 'Medium Risk (30–59%)',
                  n: medChurn.length,
                  c: C.yellow,
                  desc: 'Monitor closely',
                },
                {
                  l: 'Low Risk (<30%)',
                  n: churnPartners.filter((p) => p.churnRisk < 30).length,
                  c: C.green,
                  desc: 'Healthy partnerships',
                },
              ].map((m) => (
                <Glow
                  key={m.l}
                  style={{
                    padding: '18px 20px',
                    borderColor:
                      m.n > 0 && m.c === C.red ? C.red + '44' : C.cardBorder,
                  }}
                >
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 900,
                      color: m.c,
                      marginBottom: 4,
                    }}
                  >
                    {m.n}
                  </div>
                  <div
                    style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}
                  >
                    {m.l}
                  </div>
                  <div style={{ fontSize: 11, color: C.muted }}>{m.desc}</div>
                </Glow>
              ))}
            </div>

            <Glow style={{ padding: '20px 22px', marginBottom: 16 }}>
              <SL
                text="⚠ High Churn Risk — Immediate Attention"
                color={C.red}
              />
              {highChurn.map((p) => {
                const tm = TYPE_META[p.type];
                const owner = REPS.find((r) => r.id === p.repId);
                return (
                  <div
                    key={p.id}
                    style={{
                      padding: '14px 0',
                      borderBottom: `1px solid ${C.cardBorder}`,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: 8,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 14,
                            marginBottom: 4,
                          }}
                        >
                          {p.name}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            gap: 8,
                            alignItems: 'center',
                          }}
                        >
                          <Tag label={p.type.split(' ')[0]} color={tm.color} />
                          <Tag
                            label={p.dealStage}
                            color={STAGE_COLOR[p.dealStage]}
                          />
                          <span
                            style={{
                              fontSize: 11,
                              color: C.green,
                              fontWeight: 700,
                            }}
                          >
                            {fmt$(p.arr)} ARR
                          </span>
                          <span style={{ fontSize: 11, color: C.sub }}>
                            {fmt$(p.potential)} potential
                          </span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div
                          style={{
                            fontSize: 26,
                            fontWeight: 900,
                            color: C.red,
                          }}
                        >
                          {p.churnRisk}%
                        </div>
                        <div style={{ fontSize: 10, color: C.muted }}>
                          churn risk
                        </div>
                      </div>
                    </div>
                    <div style={{ marginBottom: 6 }}>
                      <Bar val={p.churnRisk} color={C.red} h={6} />
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ fontSize: 11, color: C.muted }}>
                        {p.daysIdle}d idle · Engagement: {p.engagement} ·
                        {!p.qbr ? ' No QBR ·' : ''}
                        {!p.jointPlan ? ' No joint plan ·' : ''}
                        {!p.execSponsor ? ' No exec sponsor' : ''}
                      </div>
                      {owner && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          <div
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: '50%',
                              background: owner.color + '33',
                              border: `1px solid ${owner.color}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 9,
                              fontWeight: 800,
                              color: owner.color,
                            }}
                          >
                            {owner.avatar}
                          </div>
                          <span style={{ fontSize: 11, color: C.sub }}>
                            Owner: {owner.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </Glow>

            <Glow style={{ padding: '20px 22px' }}>
              <SL text="🟡 Medium Churn Risk — Monitor" color={C.yellow} />
              {medChurn.map((p) => {
                const tm = TYPE_META[p.type];
                const owner = REPS.find((r) => r.id === p.repId);
                return (
                  <div
                    key={p.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 0',
                      borderBottom: `1px solid ${C.cardBorder}`,
                    }}
                  >
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                    >
                      <div
                        style={{
                          fontSize: 18,
                          fontWeight: 900,
                          color: C.yellow,
                          minWidth: 36,
                        }}
                      >
                        {p.churnRisk}%
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>
                          {p.name}
                        </div>
                        <div style={{ display: 'flex', gap: 6, marginTop: 3 }}>
                          <Tag label={p.type.split(' ')[0]} color={tm.color} />
                          <span style={{ fontSize: 11, color: C.muted }}>
                            {p.daysIdle}d idle
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          fontSize: 12,
                          color: C.green,
                          fontWeight: 700,
                        }}
                      >
                        {fmt$(p.arr)}
                      </div>
                      {owner && (
                        <div style={{ fontSize: 11, color: C.muted }}>
                          {owner.name.split(' ')[0]}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </Glow>
          </div>
        )}

        {/* ══ HEALTH ════════════════════════════════════════════════ */}
        {tab === 5 && (
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3,1fr)',
                gap: 16,
                marginBottom: 20,
              }}
            >
              {[
                { label: 'QBR Cadence', key: 'qbr', icon: '📅' },
                { label: 'Joint Biz Plan', key: 'jointPlan', icon: '📋' },
                { label: 'Exec Sponsor', key: 'execSponsor', icon: '👔' },
              ].map(({ label, key, icon }) => {
                const count = BASE_PARTNERS.filter((p) => p[key]).length;
                return (
                  <Glow key={key} style={{ padding: '18px 20px' }}>
                    <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        marginBottom: 10,
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        fontSize: 26,
                        fontWeight: 900,
                        color:
                          count / BASE_PARTNERS.length >= 0.6
                            ? C.green
                            : C.yellow,
                        marginBottom: 6,
                      }}
                    >
                      {count}
                    </div>
                    <Bar
                      val={(count / BASE_PARTNERS.length) * 100}
                      color={
                        count / BASE_PARTNERS.length >= 0.6 ? C.green : C.yellow
                      }
                      h={6}
                    />
                    <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>
                      {pct((count / BASE_PARTNERS.length) * 100)} of portfolio
                    </div>
                  </Glow>
                );
              })}
            </div>
            <Glow style={{ padding: '20px 22px' }}>
              <SL text="Full Partner Health Table" />
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    '1.4fr 90px 80px 70px 60px 60px 60px 70px',
                  gap: 10,
                  padding: '0 4px',
                  marginBottom: 8,
                }}
              >
                {[
                  'PARTNER',
                  'TYPE',
                  'ARR',
                  'ENGAGE',
                  'QBR',
                  'JBIZ',
                  'EXEC',
                  'CHURN',
                ].map((h) => (
                  <div
                    key={h}
                    style={{
                      fontSize: 9,
                      color: C.muted,
                      fontWeight: 800,
                      letterSpacing: 0.8,
                    }}
                  >
                    {h}
                  </div>
                ))}
              </div>
              {BASE_PARTNERS.map((p) => {
                const tm = TYPE_META[p.type];
                const chk = (v) =>
                  v ? (
                    <span style={{ color: C.green }}>✓</span>
                  ) : (
                    <span style={{ color: C.muted }}>—</span>
                  );
                return (
                  <div
                    key={p.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        '1.4fr 90px 80px 70px 60px 60px 60px 70px',
                      gap: 10,
                      alignItems: 'center',
                      padding: '9px 4px',
                      borderBottom: `1px solid ${C.cardBorder}`,
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 13 }}>
                      {p.name}
                    </div>
                    <Tag label={p.type.split(' ')[0]} color={tm.color} />
                    <div
                      style={{ fontSize: 12, color: C.green, fontWeight: 700 }}
                    >
                      {fmt$(p.arr)}
                    </div>
                    <div>
                      <Bar
                        val={p.engagement}
                        color={
                          p.engagement >= 70
                            ? C.green
                            : p.engagement >= 45
                            ? C.yellow
                            : C.red
                        }
                        h={5}
                      />
                      <div
                        style={{ fontSize: 9, color: C.muted, marginTop: 2 }}
                      >
                        {p.engagement}
                      </div>
                    </div>
                    <div style={{ fontSize: 14, textAlign: 'center' }}>
                      {chk(p.qbr)}
                    </div>
                    <div style={{ fontSize: 14, textAlign: 'center' }}>
                      {chk(p.jointPlan)}
                    </div>
                    <div style={{ fontSize: 14, textAlign: 'center' }}>
                      {chk(p.execSponsor)}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color:
                          p.churnRisk >= 60
                            ? C.red
                            : p.churnRisk >= 30
                            ? C.yellow
                            : C.green,
                      }}
                    >
                      {p.churnRisk}%
                    </div>
                  </div>
                );
              })}
            </Glow>
          </div>
        )}

        {/* ══ LEADERSHIP REPORT ═════════════════════════════════════ */}
        {tab === 6 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 260px',
              gap: 20,
            }}
          >
            <Glow style={{ padding: '20px 24px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 18,
                }}
              >
                <SL text="📝 Auto-Generated Leadership Report" color={C.cyan} />
                <button
                  onClick={() => copyText(report)}
                  style={{
                    background: copied ? C.green + '22' : C.accentDim,
                    border: `1px solid ${copied ? C.green : C.accent}`,
                    color: copied ? C.green : C.accent,
                    borderRadius: 8,
                    padding: '6px 14px',
                    cursor: 'pointer',
                    fontSize: 11,
                    fontWeight: 700,
                    transition: 'all .2s',
                  }}
                >
                  {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
              <pre
                style={{
                  fontFamily: "'JetBrains Mono','Fira Code',monospace",
                  fontSize: 11.5,
                  color: C.text,
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.8,
                  margin: 0,
                  background: C.bgDeep,
                  borderRadius: 10,
                  padding: 18,
                  border: `1px solid ${C.cardBorder}`,
                }}
              >
                {report}
              </pre>
            </Glow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Glow style={{ padding: '18px 20px' }}>
                <SL text="⚙ Report Settings" color={C.yellow} />
                <div
                  style={{
                    marginBottom: 6,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: 12, color: C.sub }}>
                    Revenue Target
                  </span>
                  <span
                    style={{ fontSize: 12, fontWeight: 700, color: C.accent }}
                  >
                    {fmt$(target)}
                  </span>
                </div>
                <input
                  type="range"
                  min={500000}
                  max={10000000}
                  step={250000}
                  value={target}
                  onChange={(e) => setTarget(+e.target.value)}
                  style={{
                    width: '100%',
                    accentColor: C.accent,
                    cursor: 'pointer',
                  }}
                />
              </Glow>
              <Glow style={{ padding: '18px 20px' }}>
                <SL text="Snapshot" color={C.green} />
                {[
                  ['Total ARR', fmt$(totalARR), C.green],
                  [
                    'Attainment',
                    pct(attainment),
                    attainment >= 100
                      ? C.green
                      : attainment >= 70
                      ? C.yellow
                      : C.red,
                  ],
                  [
                    'Stalled',
                    BASE_PARTNERS.filter((p) => p.dealStage === 'Stalled')
                      .length,
                    C.red,
                  ],
                  [
                    'Expanding',
                    BASE_PARTNERS.filter((p) => p.dealStage === 'Expanding')
                      .length,
                    C.green,
                  ],
                  ['High Churn Risk', highChurn.length, C.red],
                  [
                    '80%+ Quota',
                    REPS.filter((r) => r.arr / r.quota >= 0.8).length +
                      '/' +
                      REPS.length,
                    C.cyan,
                  ],
                ].map(([k, v, c]) => (
                  <div
                    key={k}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '6px 0',
                      borderBottom: `1px solid ${C.cardBorder}`,
                    }}
                  >
                    <span style={{ fontSize: 12, color: C.sub }}>{k}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: c }}>
                      {v}
                    </span>
                  </div>
                ))}
              </Glow>
            </div>
          </div>
        )}

        {/* ══ MONTHLY RECAP ══════════════════════════════════════════ */}
        {tab === 7 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 260px',
              gap: 20,
            }}
          >
            <Glow style={{ padding: '20px 24px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 18,
                }}
              >
                <SL text="🏅 Monthly Recap" color={C.pink} />
                <button
                  onClick={() => copyText(recap)}
                  style={{
                    background: copied ? C.green + '22' : C.accentDim,
                    border: `1px solid ${copied ? C.green : C.accent}`,
                    color: copied ? C.green : C.accent,
                    borderRadius: 8,
                    padding: '6px 14px',
                    cursor: 'pointer',
                    fontSize: 11,
                    fontWeight: 700,
                    transition: 'all .2s',
                  }}
                >
                  {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
              <pre
                style={{
                  fontFamily: "'JetBrains Mono','Fira Code',monospace",
                  fontSize: 11.5,
                  color: C.text,
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.9,
                  margin: 0,
                  background: C.bgDeep,
                  borderRadius: 10,
                  padding: 18,
                  border: `1px solid ${C.cardBorder}`,
                }}
              >
                {recap}
              </pre>
            </Glow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Glow
                hi
                style={{
                  padding: '18px 20px',
                  background: `linear-gradient(135deg,${C.accentDim},${C.bgDeep})`,
                }}
              >
                <SL text="🏆 Month Highlights" color={C.yellow} />
                {[
                  {
                    emoji: '👑',
                    label: 'MVP',
                    val: [...REPS].sort((a, b) => b.arr - a.arr)[0].name,
                  },
                  {
                    emoji: '🔥',
                    label: 'Longest Streak',
                    ...{
                      val:
                        [...REPS].sort((a, b) => b.streak - a.streak)[0].name +
                        ' (' +
                        [...REPS].sort((a, b) => b.streak - a.streak)[0]
                          .streak +
                        'd)',
                    },
                  },
                  {
                    emoji: '💰',
                    label: 'Top ARR',
                    val: fmt$([...REPS].sort((a, b) => b.arr - a.arr)[0].arr),
                  },
                  {
                    emoji: '✅',
                    label: 'Active Partners',
                    val: BASE_PARTNERS.filter((p) =>
                      ['Active', 'Expanding'].includes(p.dealStage)
                    ).length,
                  },
                  {
                    emoji: '⚠',
                    label: 'Stalled',
                    val: BASE_PARTNERS.filter((p) => p.dealStage === 'Stalled')
                      .length,
                  },
                ].map((m) => (
                  <div
                    key={m.label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '7px 0',
                      borderBottom: `1px solid ${C.cardBorder}`,
                    }}
                  >
                    <span style={{ fontSize: 12, color: C.sub }}>
                      {m.emoji} {m.label}
                    </span>
                    <span
                      style={{ fontSize: 12, fontWeight: 700, color: C.text }}
                    >
                      {m.val}
                    </span>
                  </div>
                ))}
              </Glow>
              <Glow style={{ padding: '18px 20px' }}>
                <SL text="Rep Scorecards" color={C.cyan} />
                {[...REPS]
                  .sort((a, b) => b.arr - a.arr)
                  .map((r, i) => (
                    <div
                      key={r.id}
                      style={{
                        padding: '8px 0',
                        borderBottom: `1px solid ${C.cardBorder}`,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: 4,
                        }}
                      >
                        <span style={{ fontSize: 12, fontWeight: 700 }}>
                          {rankEmoji(i)} {r.name.split(' ')[0]}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: r.color,
                            fontWeight: 700,
                          }}
                        >
                          {fmt$(r.arr)}
                        </span>
                      </div>
                      <Bar val={r.arr} max={r.quota} color={r.color} h={5} />
                      <div
                        style={{ fontSize: 10, color: C.muted, marginTop: 2 }}
                      >
                        {pct((r.arr / r.quota) * 100)} of quota · {r.badge}
                      </div>
                    </div>
                  ))}
              </Glow>
            </div>
          </div>
        )}

        {/* ══ SETTINGS ══════════════════════════════════════════════ */}
        {tab === 8 && (
          <Glow style={{ padding: '22px 24px', maxWidth: 480 }}>
            <SL text="⚙ Global Settings" />
            <div
              style={{
                marginBottom: 6,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: 12, color: C.sub }}>Revenue Target</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.accent }}>
                {fmt$(target)}
              </span>
            </div>
            <input
              type="range"
              min={500000}
              max={10000000}
              step={250000}
              value={target}
              onChange={(e) => setTarget(+e.target.value)}
              style={{
                width: '100%',
                accentColor: C.accent,
                cursor: 'pointer',
                marginBottom: 20,
              }}
            />
            <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.8 }}>
              Upcoming: custom per-rep quotas · partner import via CSV · Slack
              alert delivery · custom challenge builder · mobile view
            </div>
          </Glow>
        )}
      </div>
    </div>
  );
}
