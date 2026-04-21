import { useState, useEffect } from "react";

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Syne:wght@700;800&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --sun: #F59E0B; --sun-light: #FEF3C7; --sun-deep: #D97706;
      --sky: #0EA5E9; --sky-light: #E0F2FE;
      --leaf: #10B981; --leaf-light: #D1FAE5;
      --coral: #F43F5E;
      --ink: #0F172A; --ink-2: #334155; --ink-3: #64748B;
      --border: #E2E8F0; --bg: #F8FAFC; --white: #FFFFFF;
      --radius: 16px;
      --shadow: 0 4px 24px rgba(15,23,42,0.08);
      --shadow-lg: 0 8px 40px rgba(15,23,42,0.12);
    }
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: var(--bg); color: var(--ink); min-height: 100vh; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
    @keyframes pulse-ring { 0% { transform:scale(1); opacity:1; } 100% { transform:scale(1.6); opacity:0; } }
    @keyframes spin-slow { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
    @keyframes float { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-8px); } }
    @keyframes slideIn { from { opacity:0; transform:translateX(-16px); } to { opacity:1; transform:translateX(0); } }
    @keyframes countUp { from { opacity:0; transform:scale(0.8); } to { opacity:1; transform:scale(1); } }
    .fade-up   { animation: fadeUp  0.5s ease forwards; }
    .slide-in  { animation: slideIn 0.4s ease forwards; }
    .float-anim{ animation: float   3s ease-in-out infinite; }
    .btn-primary {
      background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
      color: #fff; border: none; border-radius: 12px;
      padding: 12px 28px; font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 700; font-size: 15px; cursor: pointer;
      transition: all 0.2s; box-shadow: 0 4px 16px rgba(245,158,11,0.35);
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(245,158,11,0.45); }
    .btn-ghost {
      background: transparent; color: #334155;
      border: 1.5px solid #E2E8F0; border-radius: 12px;
      padding: 11px 24px; font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s;
    }
    .btn-ghost:hover { background: #F8FAFC; border-color: #64748B; }
    .card {
      background: #fff; border-radius: 16px;
      box-shadow: 0 4px 24px rgba(15,23,42,0.08);
      border: 1px solid #E2E8F0; padding: 24px;
      transition: box-shadow 0.2s, transform 0.2s;
    }
    .card:hover { box-shadow: 0 8px 40px rgba(15,23,42,0.12); }
    .input-field {
      width: 100%; padding: 12px 16px;
      border: 1.5px solid #E2E8F0; border-radius: 10px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 14px; color: #0F172A; background: #fff;
      outline: none; transition: border-color 0.2s, box-shadow 0.2s;
    }
    .input-field:focus { border-color: #F59E0B; box-shadow: 0 0 0 3px rgba(245,158,11,0.15); }
    .input-field::placeholder { color: #64748B; }
    .badge { display:inline-flex; align-items:center; gap:4px; padding:4px 10px; border-radius:99px; font-size:12px; font-weight:600; }
    .badge-green { background:#D1FAE5; color:#065F46; }
    .badge-amber { background:#FEF3C7; color:#92400E; }
    .badge-blue  { background:#E0F2FE; color:#0C4A6E; }
    .badge-red   { background:#FEE2E2; color:#991B1B; }
    .progress-bar { height:8px; border-radius:99px; background:#E2E8F0; overflow:hidden; }
    .progress-fill { height:100%; border-radius:99px; background:linear-gradient(90deg,#F59E0B,#D97706); transition:width 1s ease; }
  `}</style>
);

// ── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK = {
  energy: {
    today: 24.8, thisMonth: 612, saved: 4897, co2: 487, efficiency: 87,
    hourly: [1.2,1.8,2.4,3.1,3.8,4.2,3.9,3.5,2.8,2.1,1.6,1.0],
    labels: ["7am","8am","9am","10am","11am","12pm","1pm","2pm","3pm","4pm","5pm","6pm"],
  },
  panels: [
    { id:"P01", name:"Row A - Panel 1", health:96, temp:42, voltage:38.2, status:"optimal" },
    { id:"P02", name:"Row A - Panel 2", health:91, temp:44, voltage:37.8, status:"optimal" },
    { id:"P03", name:"Row B - Panel 1", health:73, temp:52, voltage:34.1, status:"warning" },
    { id:"P04", name:"Row B - Panel 2", health:58, temp:61, voltage:29.4, status:"critical" },
    { id:"P05", name:"Row C - Panel 1", health:88, temp:45, voltage:36.9, status:"optimal" },
    { id:"P06", name:"Row C - Panel 2", health:94, temp:41, voltage:38.0, status:"optimal" },
  ],
  neighbors: [
    { name:"Your System", value:87, color:"#F59E0B" },
    { name:"Block A Avg",  value:79, color:"#0EA5E9" },
    { name:"Block B Avg",  value:83, color:"#10B981" },
    { name:"City Average", value:71, color:"#A78BFA" },
  ],
  weather: [
    { day:"Today", icon:"☀️", temp:34, pred:24.8, chance:5  },
    { day:"Wed",   icon:"🌤️", temp:33, pred:21.2, chance:15 },
    { day:"Thu",   icon:"⛅",  temp:30, pred:17.4, chance:40 },
    { day:"Fri",   icon:"🌧️", temp:27, pred:8.1,  chance:80 },
    { day:"Sat",   icon:"🌦️", temp:29, pred:13.5, chance:55 },
    { day:"Sun",   icon:"☀️", temp:35, pred:25.1, chance:5  },
    { day:"Mon",   icon:"☀️", temp:36, pred:26.3, chance:0  },
  ],
  subsidies: [
    { name:"PM-KUSUM Scheme",      status:"Active",  amount:"₹54,000",  deadline:"Mar 2025", progress:68, type:"Central" },
    { name:"TN Solar Policy 2023", status:"Active",  amount:"₹32,000",  deadline:"Dec 2024", progress:45, type:"State"   },
    { name:"Net Metering TANGEDCO",status:"Eligible",amount:"₹8,200/yr",deadline:"Ongoing",  progress:100,type:"DISCOM"  },
    { name:"MNRE Rooftop Phase II", status:"Applied", amount:"₹40,000", deadline:"Jun 2025", progress:30, type:"Central" },
  ],
};

// ── ICONS ────────────────────────────────────────────────────────────────────
const IcZap    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const IcShield = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IcLeaf   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></svg>;
const IcCalc   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="10" y2="14"/><line x1="14" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="16" y2="18"/></svg>;
const IcUsers  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IcCloud  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>;
const IcGift   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>;
const IcBell   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const IcOut    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const IcEye    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IcEyeOff = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;

// ── SOLAR LOGO ───────────────────────────────────────────────────────────────
const SolarLogo = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    <defs>
      <radialGradient id="sunG" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FCD34D"/>
        <stop offset="100%" stopColor="#F59E0B"/>
      </radialGradient>
    </defs>
    <circle cx="40" cy="40" r="18" fill="url(#sunG)"/>
    {[0,45,90,135,180,225,270,315].map((deg,i) => (
      <rect key={i} x="38" y="6" width="4" height="12" rx="2"
        fill="#F59E0B" transform={`rotate(${deg} 40 40)`} opacity={i%2===0?"1":"0.6"}/>
    ))}
    <rect x="20" y="50" width="40" height="18" rx="4" fill="#0EA5E9" opacity="0.9"/>
    <line x1="29" y1="50" x2="29" y2="68" stroke="white" strokeWidth="1.5" opacity="0.5"/>
    <line x1="40" y1="50" x2="40" y2="68" stroke="white" strokeWidth="1.5" opacity="0.5"/>
    <line x1="51" y1="50" x2="51" y2="68" stroke="white" strokeWidth="1.5" opacity="0.5"/>
    <line x1="20" y1="59" x2="60" y2="59"  stroke="white" strokeWidth="1.5" opacity="0.5"/>
  </svg>
);

// ── SPARKLINE ────────────────────────────────────────────────────────────────
const Sparkline = ({ data, color = "#F59E0B", height = 48 }) => {
  const max = Math.max(...data);
  const w = 200, h = height;
  const pts = data.map((v,i) => `${(i/(data.length-1))*w},${h-(v/max)*h}`).join(" ");
  const area = `M${pts.split(" ").join("L")} L${w},${h} L0,${h} Z`;
  const gid = `sg${color.replace(/[^a-z]/gi,"")}`;
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

// ── BAR CHART ────────────────────────────────────────────────────────────────
const BarChart = ({ data, labels, color = "#F59E0B" }) => {
  const max = Math.max(...data);
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:80 }}>
      {data.map((v,i) => (
        <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
          <div style={{
            width:"100%", borderRadius:"4px 4px 0 0",
            height:`${Math.max(4,(v/max)*70)}px`,
            background:`linear-gradient(180deg,${color},${color}99)`,
            transition:"height 0.8s ease",
          }}/>
          <span style={{ fontSize:9, color:"#64748B", whiteSpace:"nowrap" }}>{labels[i]}</span>
        </div>
      ))}
    </div>
  );
};

// ── RADIAL GAUGE ─────────────────────────────────────────────────────────────
const Gauge = ({ value, max = 100, color = "#F59E0B", size = 90 }) => {
  const r = 36, cx = 45, cy = 45, circ = 2*Math.PI*r;
  const dash = circ*(value/max);
  return (
    <svg width={size} height={size} viewBox="0 0 90 90">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E2E8F0" strokeWidth="8"/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 45 45)" style={{ transition:"stroke-dasharray 1s ease" }}/>
      <text x={cx} y={cy+5} textAnchor="middle" fill="#0F172A" fontSize="16"
        fontWeight="800" fontFamily="Plus Jakarta Sans">{value}%</text>
    </svg>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// AUTH PAGE
// ════════════════════════════════════════════════════════════════════════════
const AuthPage = ({ onLogin }) => {
  const [mode,    setMode]    = useState("login");
  const [form,    setForm]    = useState({ username:"", email:"", password:"" });
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handle = async () => {
    setError("");
    if (!form.email || !form.password) { setError("Please fill all required fields."); return; }
    if (mode==="signup" && !form.username) { setError("Username is required."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    onLogin({ name: form.username || "Arjun Sharma", email: form.email });
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", background:"linear-gradient(135deg,#FFFBEB 0%,#FEF3C7 40%,#E0F2FE 100%)" }}>
      {/* Left dark panel */}
      <div style={{
        flex:1, display:"flex", flexDirection:"column", justifyContent:"center",
        alignItems:"center", padding:48,
        background:"linear-gradient(160deg,#0F172A 0%,#1E3A5F 100%)",
        position:"relative", overflow:"hidden"
      }}>
        {[200,320,440].map((s,i) => (
          <div key={i} style={{
            position:"absolute", top:"50%", left:"50%", width:s, height:s,
            borderRadius:"50%", border:`1px solid rgba(245,158,11,${0.08+i*0.04})`,
            transform:"translate(-50%,-50%)",
            animation:`spin-slow ${20+i*8}s linear infinite`,
          }}/>
        ))}
        <div style={{ position:"relative", zIndex:1, textAlign:"center", color:"white" }}>
          <div className="float-anim" style={{ marginBottom:32 }}>
            <SolarLogo size={80}/>
          </div>
          <div style={{ fontFamily:"Syne,sans-serif", fontSize:36, fontWeight:800, marginBottom:8 }}>
            Solar<span style={{ color:"#F59E0B" }}>Sync</span>
          </div>
          <p style={{ fontSize:15, color:"rgba(255,255,255,0.65)", maxWidth:280, lineHeight:1.6 }}>
            India's smartest rooftop solar asset management & energy intelligence platform
          </p>
          <div style={{ marginTop:40, display:"flex", flexDirection:"column", gap:14 }}>
            {[
              ["⚡","Live energy monitoring"],
              ["🌿","Carbon credit tracking"],
              ["🔧","AI predictive maintenance"],
              ["🏛️","Govt subsidy alerts"],
              ["🌤️","Solar weather forecast"],
              ["📊","ROI payback calculator"],
              ["👥","Neighborhood benchmarking"],
            ].map(([icon,label]) => (
              <div key={label} style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:18 }}>{icon}</span>
                <span style={{ fontSize:13, color:"rgba(255,255,255,0.8)" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:48 }}>
        <div className="fade-up" style={{ width:"100%", maxWidth:420 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:32 }}>
            <SolarLogo size={40}/>
            <div>
              <div style={{ fontFamily:"Syne,sans-serif", fontSize:22, fontWeight:800, color:"#0F172A" }}>
                Solar<span style={{ color:"#F59E0B" }}>Sync</span>
              </div>
              <div style={{ fontSize:12, color:"#64748B" }}>Energy Intelligence Platform</div>
            </div>
          </div>

          <h2 style={{ fontFamily:"Syne,sans-serif", fontSize:28, fontWeight:800, marginBottom:6 }}>
            {mode==="login" ? "Welcome back 👋" : "Create your account ✨"}
          </h2>
          <p style={{ color:"#64748B", fontSize:14, marginBottom:28 }}>
            {mode==="login" ? "Sign in to monitor your solar installation" : "Start optimizing your rooftop solar today"}
          </p>

          {/* Mode tabs */}
          <div style={{ display:"flex", background:"#F8FAFC", borderRadius:12, padding:4, marginBottom:24, border:"1px solid #E2E8F0" }}>
            {["login","signup"].map(m => (
              <button key={m} onClick={()=>setMode(m)} style={{
                flex:1, padding:"8px 0", borderRadius:9, border:"none", cursor:"pointer",
                fontFamily:"Plus Jakarta Sans,sans-serif", fontWeight:600, fontSize:14,
                background: mode===m ? "white" : "transparent",
                color: mode===m ? "#0F172A" : "#64748B",
                boxShadow: mode===m ? "0 1px 8px rgba(0,0,0,0.08)" : "none",
                transition:"all 0.2s",
              }}>
                {m==="login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {mode==="signup" && (
              <div>
                <label style={{ fontSize:13, fontWeight:600, color:"#334155", display:"block", marginBottom:6 }}>Username</label>
                <input className="input-field" placeholder="e.g. arjun_solar" value={form.username}
                  onChange={e=>setForm({...form,username:e.target.value})}/>
              </div>
            )}
            <div>
              <label style={{ fontSize:13, fontWeight:600, color:"#334155", display:"block", marginBottom:6 }}>Email Address</label>
              <input className="input-field" type="email" placeholder="you@example.com" value={form.email}
                onChange={e=>setForm({...form,email:e.target.value})}/>
            </div>
            <div>
              <label style={{ fontSize:13, fontWeight:600, color:"#334155", display:"block", marginBottom:6 }}>Password</label>
              <div style={{ position:"relative" }}>
                <input className="input-field" type={showPw?"text":"password"} placeholder="••••••••"
                  value={form.password} onChange={e=>setForm({...form,password:e.target.value})}
                  onKeyDown={e=>e.key==="Enter"&&handle()} style={{ paddingRight:44 }}/>
                <button onClick={()=>setShowPw(!showPw)} style={{
                  position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                  background:"none", border:"none", cursor:"pointer", color:"#64748B"
                }}>
                  {showPw ? <IcEyeOff/> : <IcEye/>}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background:"#FEE2E2", border:"1px solid #FCA5A5", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#991B1B" }}>
                ⚠️ {error}
              </div>
            )}

            <button className="btn-primary" onClick={handle} disabled={loading}
              style={{ marginTop:4, width:"100%", padding:"14px", fontSize:15, opacity:loading?0.7:1 }}>
              {loading ? "⏳ Authenticating…" : mode==="login" ? "Sign In →" : "Create Account →"}
            </button>
          </div>

          <p style={{ fontSize:13, color:"#64748B", textAlign:"center", marginTop:16 }}>
            Demo: use any email + password (min 6 characters)
          </p>

          <div style={{ marginTop:16, padding:"12px 16px", background:"#FEF3C7", borderRadius:10, border:"1px solid #FDE68A" }}>
            <p style={{ fontSize:12, color:"#92400E" }}>
              ☁️ <strong>Cloud Stack:</strong> Supabase (Auth + DB) · Railway.app (API) · Vercel (Frontend)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// SIDEBAR
// ════════════════════════════════════════════════════════════════════════════
const NAV = [
  { id:"dashboard",   label:"Dashboard",      Ic: IcZap    },
  { id:"maintenance", label:"Maintenance AI",  Ic: IcShield },
  { id:"roi",         label:"ROI Calculator",  Ic: IcCalc   },
  { id:"carbon",      label:"Carbon Tracker",  Ic: IcLeaf   },
  { id:"benchmark",   label:"Benchmarking",    Ic: IcUsers  },
  { id:"weather",     label:"Solar Forecast",  Ic: IcCloud  },
  { id:"subsidy",     label:"Govt Subsidies",  Ic: IcGift   },
];

const Sidebar = ({ active, setActive, user, onLogout }) => (
  <aside style={{
    width:240, background:"#0F172A", height:"100vh",
    position:"fixed", left:0, top:0, display:"flex",
    flexDirection:"column", zIndex:100,
    boxShadow:"4px 0 24px rgba(0,0,0,0.15)"
  }}>
    <div style={{ padding:"24px 20px 20px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <SolarLogo size={36}/>
        <div>
          <div style={{ fontFamily:"Syne,sans-serif", fontSize:20, fontWeight:800, color:"white" }}>
            Solar<span style={{ color:"#F59E0B" }}>Sync</span>
          </div>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", letterSpacing:"0.05em" }}>ENERGY PLATFORM</div>
        </div>
      </div>
    </div>

    <nav style={{ flex:1, padding:"12px", display:"flex", flexDirection:"column", gap:2 }}>
      {NAV.map(({ id, label, Ic }) => {
        const on = active===id;
        return (
          <button key={id} onClick={()=>setActive(id)} style={{
            display:"flex", alignItems:"center", gap:10,
            padding:"10px 12px", borderRadius:10, border:"none",
            cursor:"pointer", width:"100%", textAlign:"left",
            background: on ? "rgba(245,158,11,0.15)" : "transparent",
            color: on ? "#F59E0B" : "rgba(255,255,255,0.55)",
            fontFamily:"Plus Jakarta Sans,sans-serif", fontWeight:600, fontSize:13.5,
            transition:"all 0.15s",
            borderLeft: on ? "3px solid #F59E0B" : "3px solid transparent",
          }}>
            <Ic/>{label}
          </button>
        );
      })}
    </nav>

    <div style={{ padding:16, borderTop:"1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
        <div style={{
          width:34, height:34, borderRadius:"50%",
          background:"linear-gradient(135deg,#F59E0B,#D97706)",
          display:"flex", alignItems:"center", justifyContent:"center",
          color:"white", fontWeight:800, fontSize:14
        }}>{(user.name||"U")[0].toUpperCase()}</div>
        <div>
          <div style={{ color:"white", fontSize:13, fontWeight:600 }}>{user.name}</div>
          <div style={{ color:"rgba(255,255,255,0.4)", fontSize:11 }}>Coimbatore, TN</div>
        </div>
      </div>
      <button onClick={onLogout} className="btn-ghost" style={{
        width:"100%", color:"rgba(255,255,255,0.5)", borderColor:"rgba(255,255,255,0.1)",
        fontSize:12, padding:"8px", display:"flex", alignItems:"center", justifyContent:"center", gap:6
      }}>
        <IcOut/> Sign Out
      </button>
    </div>
  </aside>
);

// ════════════════════════════════════════════════════════════════════════════
// FEATURE 1 — LIVE ENERGY DASHBOARD
// ════════════════════════════════════════════════════════════════════════════
const DashboardView = () => {
  const [live, setLive] = useState(24.8);
  useEffect(() => {
    const t = setInterval(() => setLive(p => +(p+(Math.random()-0.5)*0.3).toFixed(1)), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="fade-up" style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div>
        <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:26, fontWeight:800 }}>Live Energy Dashboard</h1>
        <p style={{ color:"#64748B", fontSize:14, marginTop:2 }}>Real-time monitoring of your 6 kW rooftop solar system</p>
      </div>

      {/* Hero live card */}
      <div style={{
        background:"linear-gradient(135deg,#0F172A,#1E3A5F)", borderRadius:16,
        padding:24, color:"white", display:"flex",
        justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16
      }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
            <div style={{ position:"relative", width:10, height:10 }}>
              <div style={{ width:10, height:10, borderRadius:"50%", background:"#10B981", position:"absolute" }}/>
              <div style={{ width:10, height:10, borderRadius:"50%", background:"#10B981", position:"absolute", animation:"pulse-ring 1.5s ease infinite" }}/>
            </div>
            <span style={{ fontSize:13, color:"rgba(255,255,255,0.6)" }}>LIVE GENERATION</span>
          </div>
          <div style={{ fontSize:52, fontWeight:800, fontFamily:"Syne,sans-serif", color:"#FCD34D" }}>
            {live} <span style={{ fontSize:20, color:"rgba(255,255,255,0.5)" }}>kWh</span>
          </div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.5)", marginTop:4 }}>Today's generation • 87% efficiency</div>
        </div>
        <div style={{ display:"flex", gap:24 }}>
          {[["Grid Export","8.2 kWh","↑","#10B981"],["Consumption","16.6 kWh","→","#0EA5E9"],["Peak Power","4.8 kW","⚡","#F59E0B"]].map(([l,v,ic,c]) => (
            <div key={l} style={{ textAlign:"center" }}>
              <div style={{ fontSize:22, marginBottom:4 }}>{ic}</div>
              <div style={{ fontSize:18, fontWeight:800, color:c }}>{v}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16 }}>
        {[
          { label:"This Month",    value:"612",    unit:"kWh", color:"#F59E0B", bg:"#FEF3C7", delta:12 },
          { label:"Money Saved",   value:"₹4,897", unit:"",    color:"#10B981", bg:"#D1FAE5", delta:8  },
          { label:"CO₂ Avoided",   value:"487",    unit:"kg",  color:"#10B981", bg:"#D1FAE5", delta:5  },
          { label:"System Health", value:"87",     unit:"%",   color:"#0EA5E9", bg:"#E0F2FE"           },
        ].map(({ label, value, unit, color, bg, delta }) => (
          <div key={label} className="card" style={{ background:bg }}>
            <p style={{ fontSize:12, fontWeight:600, color:"#64748B", textTransform:"uppercase", letterSpacing:"0.05em" }}>{label}</p>
            <div style={{ display:"flex", alignItems:"baseline", gap:4, marginTop:6 }}>
              <span style={{ fontSize:28, fontWeight:800, color:"#0F172A", fontFamily:"Syne,sans-serif" }}>{value}</span>
              <span style={{ fontSize:13, color:"#64748B" }}>{unit}</span>
            </div>
            {delta && <div style={{ fontSize:12, color:"#10B981", marginTop:4, fontWeight:600 }}>↑ {delta}% vs last week</div>}
          </div>
        ))}
      </div>

      {/* Hourly bar chart */}
      <div className="card">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <h3 style={{ fontWeight:700, fontSize:16 }}>Today's Generation Curve</h3>
          <span className="badge badge-green">Live</span>
        </div>
        <BarChart data={MOCK.energy.hourly} labels={MOCK.energy.labels} color="#F59E0B"/>
      </div>

      {/* Energy flow */}
      <div className="card">
        <h3 style={{ fontWeight:700, fontSize:16, marginBottom:16 }}>Energy Flow Diagram</h3>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, flexWrap:"wrap" }}>
          {[
            { icon:"☀️", label:"Solar Panels",  sub:"6 kW system",      bg:"#FEF3C7", bc:"#F59E0B" },
            { icon:"→",  label:"",               sub:"",                  bg:"",        bc:""        },
            { icon:"⚡", label:"Inverter",       sub:"98% efficiency",   bg:"#E0F2FE", bc:"#0EA5E9" },
            { icon:"→",  label:"",               sub:"",                  bg:"",        bc:""        },
            { icon:"🏠", label:"Home",           sub:"16.6 kWh used",    bg:"#D1FAE5", bc:"#10B981" },
            { icon:"→",  label:"",               sub:"",                  bg:"",        bc:""        },
            { icon:"🔌", label:"DISCOM Grid",    sub:"8.2 kWh exported", bg:"#EDE9FE", bc:"#8B5CF6" },
          ].map((n,i) => n.label ? (
            <div key={i} style={{ padding:"12px 16px", borderRadius:12, border:`2px solid ${n.bc}`, background:n.bg, textAlign:"center", minWidth:100 }}>
              <div style={{ fontSize:24 }}>{n.icon}</div>
              <div style={{ fontSize:13, fontWeight:700, marginTop:4 }}>{n.label}</div>
              <div style={{ fontSize:11, color:"#64748B" }}>{n.sub}</div>
            </div>
          ) : (
            <div key={i} style={{ fontSize:22, color:"#64748B" }}>→</div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// FEATURE 2 — AI PREDICTIVE MAINTENANCE
// ════════════════════════════════════════════════════════════════════════════
const MaintenanceView = () => {
  const [selected, setSelected] = useState(null);
  const sColor = { optimal:"#10B981", warning:"#F59E0B", critical:"#F43F5E" };
  const sBg    = { optimal:"#D1FAE5", warning:"#FEF3C7", critical:"#FEE2E2" };

  return (
    <div className="fade-up" style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div>
        <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:26, fontWeight:800 }}>AI Predictive Maintenance</h1>
        <p style={{ color:"#64748B", fontSize:14, marginTop:2 }}>Real-time panel health scoring with fault detection before failures</p>
      </div>

      <div style={{ background:"#FFF7ED", border:"1px solid #FED7AA", borderRadius:12, padding:"14px 18px", display:"flex", gap:12 }}>
        <span style={{ fontSize:20 }}>⚠️</span>
        <div>
          <div style={{ fontWeight:700, color:"#9A3412", fontSize:14 }}>2 Panels Need Attention</div>
          <div style={{ fontSize:13, color:"#C2410C", marginTop:2 }}>P03 & P04 showing degraded performance. AI predicts 23% output loss within 14 days.</div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:16 }}>
        {MOCK.panels.map(p => (
          <div key={p.id} className="card" onClick={()=>setSelected(selected?.id===p.id?null:p)}
            style={{ cursor:"pointer", border:`2px solid ${selected?.id===p.id?"#F59E0B":"#E2E8F0"}`, transition:"all 0.2s" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <div>
                <div style={{ fontWeight:700, fontSize:14 }}>{p.name}</div>
                <div style={{ fontSize:11, color:"#64748B", marginTop:2 }}>ID: {p.id}</div>
              </div>
              <Gauge value={p.health} size={72} color={sColor[p.status]}/>
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <span className="badge" style={{ background:sBg[p.status], color:sColor[p.status] }}>
                {p.status==="optimal"?"✅":p.status==="warning"?"⚠️":"🚨"} {p.status.toUpperCase()}
              </span>
              <span className="badge badge-blue">{p.temp}°C</span>
              <span className="badge badge-amber">{p.voltage}V</span>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="card slide-in" style={{ border:"2px solid #F59E0B", background:"#FFFBEB" }}>
          <h3 style={{ fontWeight:700, fontSize:16, marginBottom:12 }}>🤖 AI Analysis — {selected.name}</h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <div>
              <div style={{ fontSize:13, color:"#64748B", marginBottom:8 }}>Health Trend (Last 10 readings)</div>
              <Sparkline data={[92,91,90,89,87,85,82,80,76,selected.health]} color={sColor[selected.status]}/>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {[
                ["Temperature",selected.temp+"°C"],
                ["Voltage",selected.voltage+"V"],
                ["Dust Level",selected.health<75?"High":"Low"],
                ["Status",selected.status],
                ["Action",selected.status==="critical"?"Immediate inspection":"Monitor weekly"],
              ].map(([k,v]) => (
                <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:13, padding:"6px 0", borderBottom:"1px solid #E2E8F0" }}>
                  <span style={{ color:"#64748B" }}>{k}</span>
                  <span style={{ fontWeight:600 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <button className="btn-primary" style={{ marginTop:16 }}>🔧 Schedule Technician Visit</button>
        </div>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// FEATURE 3 — ROI CALCULATOR
// ════════════════════════════════════════════════════════════════════════════
const ROIView = () => {
  const [inputs, setInputs] = useState({ cost:350000, size:6, tariff:7.5, subsidy:54000 });
  const set = (k,v) => setInputs({...inputs,[k]:+v});
  const annualGen    = inputs.size * 1600;
  const annualSaving = annualGen * inputs.tariff;
  const netCost      = inputs.cost - inputs.subsidy;
  const payback      = (netCost / annualSaving).toFixed(1);
  const roi25        = ((annualSaving*25 - netCost) / netCost * 100).toFixed(0);
  const yearlyData   = Array.from({length:10},(_,i)=> annualSaving*(i+1) - netCost);

  return (
    <div className="fade-up" style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div>
        <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:26, fontWeight:800 }}>ROI & Payback Calculator</h1>
        <p style={{ color:"#64748B", fontSize:14, marginTop:2 }}>Dynamic financial projections with real electricity tariff inputs</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <div className="card">
          <h3 style={{ fontWeight:700, fontSize:16, marginBottom:16 }}>Your System Parameters</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {[
              ["System Cost (₹)","cost",100000,1000000,10000],
              ["System Size (kW)","size",1,20,0.5],
              ["Electricity Tariff (₹/kWh)","tariff",3,15,0.5],
              ["Govt Subsidy (₹)","subsidy",0,200000,1000],
            ].map(([label,key,min,max,step]) => (
              <div key={key}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <label style={{ fontSize:13, fontWeight:600, color:"#334155" }}>{label}</label>
                  <span style={{ fontSize:13, fontWeight:700, color:"#F59E0B" }}>
                    {key==="cost"||key==="subsidy"?"₹":""}{inputs[key]}{key==="tariff"?"/kWh":key==="size"?" kW":""}
                  </span>
                </div>
                <input type="range" min={min} max={max} step={step} value={inputs[key]}
                  onChange={e=>set(key,e.target.value)}
                  style={{ width:"100%", accentColor:"#F59E0B" }}/>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ background:"linear-gradient(135deg,#0F172A,#1E3A5F)", borderRadius:16, padding:24, color:"white" }}>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.5)", marginBottom:4 }}>PAYBACK PERIOD</div>
            <div style={{ fontSize:48, fontWeight:800, fontFamily:"Syne,sans-serif", color:"#FCD34D" }}>
              {payback} <span style={{ fontSize:18 }}>years</span>
            </div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.5)", marginTop:4 }}>
              25-year ROI: <strong style={{ color:"#10B981" }}>{roi25}%</strong>
            </div>
          </div>
          {[
            ["Annual Generation",`${annualGen.toLocaleString()} kWh`,"⚡","#FEF3C7"],
            ["Annual Savings",   `₹${Math.round(annualSaving).toLocaleString()}`,"💰","#D1FAE5"],
            ["Net Investment",   `₹${netCost.toLocaleString()}`,"🏦","#E0F2FE"],
          ].map(([l,v,ic,bg]) => (
            <div key={l} className="card" style={{ background:bg, padding:"16px 20px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:12, color:"#64748B", fontWeight:600 }}>{l}</div>
                  <div style={{ fontSize:22, fontWeight:800, color:"#0F172A", marginTop:2, fontFamily:"Syne,sans-serif" }}>{v}</div>
                </div>
                <div style={{ fontSize:28 }}>{ic}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontWeight:700, fontSize:16, marginBottom:4 }}>10-Year Cumulative Profit</h3>
        <p style={{ fontSize:12, color:"#64748B", marginBottom:14 }}>Green = profit, Red = still recovering investment</p>
        <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:80 }}>
          {yearlyData.map((v,i) => (
            <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <div style={{
                width:"100%", borderRadius:"4px 4px 0 0",
                height:`${Math.max(4,Math.min(70,(Math.abs(v)/Math.max(...yearlyData.map(Math.abs)))*70))}px`,
                background: v>=0 ? "linear-gradient(180deg,#10B981,#059669)" : "linear-gradient(180deg,#F43F5E,#BE123C)",
                transition:"height 0.8s ease",
              }}/>
              <span style={{ fontSize:9, color:"#64748B" }}>Y{i+1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// FEATURE 4 — CARBON TRACKER
// ════════════════════════════════════════════════════════════════════════════
const CarbonView = () => {
  const trees = Math.round(MOCK.energy.co2 / 21);
  const cars   = (MOCK.energy.co2 / 180).toFixed(1);

  return (
    <div className="fade-up" style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div>
        <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:26, fontWeight:800 }}>Carbon Footprint Tracker</h1>
        <p style={{ color:"#64748B", fontSize:14, marginTop:2 }}>CO₂ savings with downloadable green certificates</p>
      </div>

      <div style={{
        background:"linear-gradient(135deg,#064E3B,#065F46,#047857)",
        borderRadius:16, padding:32, color:"white",
        display:"grid", gridTemplateColumns:"1fr 1fr", gap:24
      }}>
        <div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.6)", marginBottom:6 }}>TOTAL CO₂ AVOIDED THIS YEAR</div>
          <div style={{ fontSize:56, fontWeight:800, fontFamily:"Syne,sans-serif", color:"#6EE7B7" }}>{MOCK.energy.co2}<span style={{ fontSize:20 }}> kg</span></div>
          <div style={{ marginTop:12, display:"flex", gap:8, flexWrap:"wrap" }}>
            <span className="badge" style={{ background:"rgba(255,255,255,0.15)", color:"white" }}>🌳 {trees} Trees</span>
            <span className="badge" style={{ background:"rgba(255,255,255,0.15)", color:"white" }}>🚗 {cars} Car trips</span>
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {[["Daily Average","1.9 kg"],["Monthly Total","45.2 kg"],["Yearly Projection","582 kg"],["Lifetime (25yr)","14,550 kg"]].map(([l,v]) => (
            <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
              <span style={{ fontSize:13, color:"rgba(255,255,255,0.6)" }}>{l}</span>
              <span style={{ fontSize:13, fontWeight:700, color:"#6EE7B7" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <div className="card">
          <h3 style={{ fontWeight:700, fontSize:16, marginBottom:12 }}>Monthly CO₂ Savings (kg)</h3>
          <BarChart data={[32,38,45,52,61,58,55,62,48,41,44,53]}
            labels={["J","F","M","A","M","J","J","A","S","O","N","D"]} color="#10B981"/>
        </div>
        <div className="card" style={{ background:"linear-gradient(135deg,#ECFDF5,#D1FAE5)", border:"2px dashed #6EE7B7" }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:40 }}>🏆</div>
            <h3 style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:18, margin:"8px 0 4px" }}>Green Certificate</h3>
            <p style={{ fontSize:12, color:"#64748B", marginBottom:12 }}>Arjun Sharma — 2024</p>
            <div style={{ background:"white", borderRadius:10, padding:14, marginBottom:14 }}>
              <div style={{ fontSize:13, color:"#64748B" }}>Total CO₂ Avoided</div>
              <div style={{ fontSize:28, fontWeight:800, color:"#10B981", fontFamily:"Syne,sans-serif" }}>{MOCK.energy.co2} kg</div>
              <div style={{ fontSize:12, color:"#64748B", marginTop:4 }}>Verified by SolarSync Platform</div>
            </div>
            <button className="btn-primary" style={{ width:"100%", background:"linear-gradient(135deg,#10B981,#059669)", boxShadow:"0 4px 16px rgba(16,185,129,0.35)" }}>
              📄 Download Certificate
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontWeight:700, fontSize:16, marginBottom:14 }}>Your Impact in Real Terms</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:12 }}>
          {[["🌳",`${trees}`,"Trees grown for a year"],["🚗",`${cars}`,"Car trips offset"],["✈️","0.8","Flights avoided"],["💡","2,340","LED hours powered"],["📱","8,700","Phone charges"]].map(([ic,v,l]) => (
            <div key={l} style={{ textAlign:"center", padding:14, background:"#D1FAE5", borderRadius:12 }}>
              <div style={{ fontSize:28 }}>{ic}</div>
              <div style={{ fontSize:22, fontWeight:800, color:"#10B981", marginTop:4, fontFamily:"Syne,sans-serif" }}>{v}</div>
              <div style={{ fontSize:11, color:"#64748B", marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// FEATURE 5 — NEIGHBORHOOD BENCHMARKING
// ════════════════════════════════════════════════════════════════════════════
const BenchmarkView = () => (
  <div className="fade-up" style={{ display:"flex", flexDirection:"column", gap:20 }}>
    <div>
      <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:26, fontWeight:800 }}>Neighborhood Benchmarking</h1>
      <p style={{ color:"#64748B", fontSize:14, marginTop:2 }}>Compare your system with similar installations nearby</p>
    </div>

    <div style={{ background:"linear-gradient(135deg,#E0F2FE,#BAE6FD)", borderRadius:16, height:160, display:"flex", alignItems:"center", justifyContent:"center", border:"1px solid #7DD3FC", position:"relative", overflow:"hidden" }}>
      <div style={{ fontSize:13, color:"#0C4A6E", fontWeight:600, zIndex:1 }}>📍 Coimbatore, TN — 47 similar systems nearby</div>
      {[{x:30,y:40},{x:55,y:60},{x:70,y:35},{x:45,y:70},{x:80,y:65}].map((d,i)=>(
        <div key={i} style={{ position:"absolute", left:`${d.x}%`, top:`${d.y}%`, width:10, height:10, borderRadius:"50%", background:i===2?"#F59E0B":"#0EA5E9", transform:"translate(-50%,-50%)", boxShadow:`0 0 0 4px ${i===2?"rgba(245,158,11,0.3)":"rgba(14,165,233,0.3)"}` }}/>
      ))}
    </div>

    <div className="card">
      <h3 style={{ fontWeight:700, fontSize:16, marginBottom:16 }}>Efficiency Comparison</h3>
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {MOCK.neighbors.map((n,i) => (
          <div key={n.name}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                {i===0 && <span className="badge badge-amber">You</span>}
                <span style={{ fontSize:14, fontWeight:600 }}>{n.name}</span>
              </div>
              <span style={{ fontSize:14, fontWeight:800, color:n.color }}>{n.value}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width:`${n.value}%`, background:n.color }}/>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
      <div className="card" style={{ background:"linear-gradient(135deg,#FEF3C7,#FDE68A)", border:"1px solid #F59E0B" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:40 }}>🥇</div>
          <div style={{ fontFamily:"Syne,sans-serif", fontSize:24, fontWeight:800, marginTop:8 }}>Top 15%</div>
          <div style={{ fontSize:13, color:"#64748B", marginTop:4 }}>in Coimbatore district</div>
          <div style={{ marginTop:12, fontSize:13, color:"#334155" }}>Outperforms <strong>85%</strong> of similar setups</div>
        </div>
      </div>
      <div className="card">
        <h3 style={{ fontWeight:700, fontSize:15, marginBottom:12 }}>📊 Insights</h3>
        {[["Best performer","Row A panels (96% health)"],["Area avg","21.4 kWh/day"],["Your output","24.8 kWh/day (+16%)"],["Tip","Clean panels monthly"]].map(([k,v]) => (
          <div key={k} style={{ fontSize:13, padding:"6px 0", borderBottom:"1px solid #E2E8F0" }}>
            <div style={{ color:"#64748B" }}>{k}</div>
            <div style={{ fontWeight:600, marginTop:2 }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// FEATURE 6 — WEATHER & SOLAR FORECAST
// ════════════════════════════════════════════════════════════════════════════
const WeatherView = () => (
  <div className="fade-up" style={{ display:"flex", flexDirection:"column", gap:20 }}>
    <div>
      <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:26, fontWeight:800 }}>Weather & Solar Forecast</h1>
      <p style={{ color:"#64748B", fontSize:14, marginTop:2 }}>7-day weather outlook with predicted solar generation</p>
    </div>

    <div style={{ background:"linear-gradient(135deg,#0EA5E9,#0284C7)", borderRadius:16, padding:28, color:"white", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
      <div>
        <div style={{ fontSize:13, color:"rgba(255,255,255,0.6)", marginBottom:6 }}>TODAY — COIMBATORE</div>
        <div style={{ fontSize:52 }}>☀️</div>
        <div style={{ fontSize:42, fontWeight:800, fontFamily:"Syne,sans-serif", marginTop:4 }}>34°C</div>
        <div style={{ fontSize:14, color:"rgba(255,255,255,0.7)", marginTop:4 }}>Clear sky • UV Index 9</div>
      </div>
      <div style={{ textAlign:"right" }}>
        <div style={{ fontSize:13, color:"rgba(255,255,255,0.6)", marginBottom:8 }}>Predicted Generation</div>
        <div style={{ fontSize:36, fontWeight:800, fontFamily:"Syne,sans-serif", color:"#FCD34D" }}>24.8 kWh</div>
        <div style={{ fontSize:13, color:"rgba(255,255,255,0.7)", marginTop:4 }}>≈ ₹186 earnings today</div>
      </div>
    </div>

    <div className="card">
      <h3 style={{ fontWeight:700, fontSize:16, marginBottom:16 }}>7-Day Solar Generation Forecast</h3>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:8 }}>
        {MOCK.weather.map((d,i) => (
          <div key={i} style={{ textAlign:"center", padding:"14px 8px", borderRadius:12, background:i===0?"#E0F2FE":"#F8FAFC", border:`1px solid ${i===0?"#0EA5E9":"#E2E8F0"}` }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#64748B", marginBottom:6 }}>{d.day}</div>
            <div style={{ fontSize:24 }}>{d.icon}</div>
            <div style={{ fontSize:14, fontWeight:800, marginTop:6 }}>{d.temp}°</div>
            <div style={{ fontSize:11, color:"#D97706", fontWeight:700, marginTop:4 }}>{d.pred} kWh</div>
            <div style={{ fontSize:10, color:d.chance>50?"#F43F5E":"#64748B", marginTop:4 }}>💧{d.chance}%</div>
          </div>
        ))}
      </div>
    </div>

    <div className="card">
      <h3 style={{ fontWeight:700, fontSize:16, marginBottom:4 }}>Predicted kWh This Week</h3>
      <p style={{ fontSize:12, color:"#64748B", marginBottom:14 }}>Rain on Friday will reduce output significantly</p>
      <BarChart data={MOCK.weather.map(d=>d.pred)} labels={MOCK.weather.map(d=>d.day)} color="#0EA5E9"/>
    </div>

    <div className="card">
      <h3 style={{ fontWeight:700, fontSize:16, marginBottom:12 }}>⚡ Smart Alerts</h3>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {[
          ["🌧️","Friday","Heavy rain expected. Grid export drops 67%. Avoid scheduling high-consumption tasks.","badge-blue"],
          ["☀️","Weekend","Excellent solar — UV 9–10. Best time for high energy tasks.","badge-green"],
          ["🌡️","Heat Alert","36°C temps may reduce panel efficiency slightly. Monitor inverter.","badge-amber"],
        ].map(([ic,day,msg,cls]) => (
          <div key={day} style={{ display:"flex", gap:12, padding:"12px 14px", background:"#F8FAFC", borderRadius:10, border:"1px solid #E2E8F0" }}>
            <div style={{ fontSize:20 }}>{ic}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700 }}>{day}</div>
              <div style={{ fontSize:12, color:"#64748B", marginTop:2 }}>{msg}</div>
            </div>
            <span className={`badge ${cls}`} style={{ marginLeft:"auto", alignSelf:"flex-start" }}>Alert</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// FEATURE 7 — GOVT SUBSIDY TRACKER
// ════════════════════════════════════════════════════════════════════════════
const SubsidyView = () => {
  const [applied, setApplied] = useState({});

  return (
    <div className="fade-up" style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div>
        <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:26, fontWeight:800 }}>Government Subsidy Tracker</h1>
        <p style={{ color:"#64748B", fontSize:14, marginTop:2 }}>Track PM-KUSUM, net metering & state schemes for your installation</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
        {[["Total Eligible","₹1,34,200","💰","#FEF3C7"],["Already Applied","₹40,000","📋","#E0F2FE"],["Annual Benefit","₹8,200","📅","#D1FAE5"]].map(([l,v,ic,bg]) => (
          <div key={l} className="card" style={{ background:bg }}>
            <div style={{ fontSize:24 }}>{ic}</div>
            <div style={{ fontSize:22, fontWeight:800, color:"#0F172A", marginTop:8, fontFamily:"Syne,sans-serif" }}>{v}</div>
            <div style={{ fontSize:12, color:"#64748B", marginTop:2 }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {MOCK.subsidies.map((s,i) => (
          <div key={i} className="card">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
              <div>
                <div style={{ fontWeight:700, fontSize:15 }}>{s.name}</div>
                <div style={{ fontSize:12, color:"#64748B", marginTop:3 }}>
                  <span className="badge badge-blue" style={{ marginRight:8 }}>{s.type}</span>
                  Deadline: {s.deadline}
                </div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:20, fontWeight:800, color:"#D97706", fontFamily:"Syne,sans-serif" }}>{s.amount}</div>
                <span className={`badge ${s.status==="Active"?"badge-green":s.status==="Eligible"?"badge-amber":"badge-blue"}`}>
                  {s.status==="Active"?"✅":s.status==="Eligible"?"⭐":"📋"} {s.status}
                </span>
              </div>
            </div>
            <div style={{ marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#64748B", marginBottom:6 }}>
                <span>Application Progress</span><span>{s.progress}%</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{ width:`${s.progress}%` }}/></div>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              {s.status!=="Applied" ? (
                <button className="btn-primary" style={{ fontSize:13, padding:"9px 18px", opacity:applied[i]?0.6:1 }}
                  onClick={()=>setApplied({...applied,[i]:true})}>
                  {applied[i]?"✅ Sent":"Apply Now →"}
                </button>
              ) : (
                <button className="btn-ghost" style={{ fontSize:13, padding:"9px 18px" }}>Track Status 📋</button>
              )}
              <button className="btn-ghost" style={{ fontSize:13, padding:"9px 18px" }}>Learn More</button>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ background:"#E0F2FE", border:"1px solid #7DD3FC" }}>
        <h3 style={{ fontWeight:700, fontSize:15, marginBottom:10 }}>💡 Subsidy Tips for Tamil Nadu</h3>
        {["TANGEDCO net metering lets you export surplus solar to the grid and earn credits","PM-KUSUM Phase II: 30% subsidy for systems up to 10 kW — apply before Mar 2025","TN state policy: Additional 20% subsidy for residential solar above 3 kW","Carbon credits from MNRE programs can earn ₹500–₹2000 annually"].map((t,i) => (
          <div key={i} style={{ display:"flex", gap:8, fontSize:13, marginBottom:8 }}>
            <span style={{ color:"#0EA5E9" }}>→</span>
            <span style={{ color:"#334155" }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ════════════════════════════════════════════════════════════════════════════
const VIEWS = { dashboard:DashboardView, maintenance:MaintenanceView, roi:ROIView, carbon:CarbonView, benchmark:BenchmarkView, weather:WeatherView, subsidy:SubsidyView };

export default function SolarSync() {
  const [user,   setUser]   = useState(null);
  const [active, setActive] = useState("dashboard");
  const [notif,  setNotif]  = useState(false);

  if (!user) return (<><GlobalStyle/><AuthPage onLogin={setUser}/></>);

  const View = VIEWS[active];

  return (
    <>
      <GlobalStyle/>
      <Sidebar active={active} setActive={setActive} user={user} onLogout={()=>setUser(null)}/>

      <div style={{ marginLeft:240, minHeight:"100vh", background:"#F8FAFC" }}>
        {/* Top bar */}
        <header style={{
          position:"sticky", top:0, zIndex:50,
          background:"rgba(248,250,252,0.92)", backdropFilter:"blur(12px)",
          borderBottom:"1px solid #E2E8F0",
          padding:"14px 28px", display:"flex", justifyContent:"space-between", alignItems:"center"
        }}>
          <div style={{ fontSize:12, color:"#64748B" }}>📍 Coimbatore, Tamil Nadu &nbsp;|&nbsp; ☀️ Today: 24.8 kWh generated</div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ position:"relative" }}>
              <button className="btn-ghost" style={{ padding:"8px 12px", display:"flex", alignItems:"center", gap:6, fontSize:13 }}
                onClick={()=>setNotif(!notif)}>
                <IcBell/> Alerts
                <span style={{ width:8, height:8, borderRadius:"50%", background:"#F43F5E", display:"inline-block" }}/>
              </button>
              {notif && (
                <div style={{ position:"absolute", right:0, top:"calc(100% + 8px)", width:300, background:"white", borderRadius:12, border:"1px solid #E2E8F0", boxShadow:"0 8px 40px rgba(15,23,42,0.12)", zIndex:200, overflow:"hidden" }}>
                  <div style={{ padding:"12px 16px", borderBottom:"1px solid #E2E8F0", fontWeight:700, fontSize:13 }}>🔔 Notifications</div>
                  {[["🚨","Panel P04 critical","Health dropped to 58%","2m ago"],["💰","Subsidy deadline","PM-KUSUM closes Mar 2025","1h ago"],["🌧️","Weather alert","Rain forecast Friday","3h ago"]].map(([ic,t,d,time]) => (
                    <div key={t} style={{ padding:"10px 16px", borderBottom:"1px solid #E2E8F0", display:"flex", gap:10 }}>
                      <div style={{ fontSize:18 }}>{ic}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:600 }}>{t}</div>
                        <div style={{ fontSize:12, color:"#64748B" }}>{d}</div>
                      </div>
                      <div style={{ fontSize:11, color:"#64748B" }}>{time}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#F59E0B,#D97706)", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:800, fontSize:14 }}>
              {(user.name||"U")[0].toUpperCase()}
            </div>
          </div>
        </header>

        <main style={{ padding:"28px 28px 48px" }}>
          <View key={active}/>
        </main>
      </div>

      <div style={{ position:"fixed", bottom:0, right:0, background:"#0F172A", color:"rgba(255,255,255,0.6)", fontSize:11, padding:"6px 14px", borderTopLeftRadius:8, zIndex:1000 }}>
        ☁️ Vercel · Railway.app · Supabase
      </div>
    </>
  );
}
