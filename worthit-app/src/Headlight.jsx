import { useState, useEffect, useRef } from "react";

const LEVELS = [
  { name: "Rookie", minXP: 0, icon: "🌱" },
  { name: "Planner", minXP: 50, icon: "📊" },
  { name: "Strategist", minXP: 150, icon: "🧠" },
  { name: "Investor", minXP: 300, icon: "💼" },
  { name: "Expert", minXP: 500, icon: "🏆" },
];

function getLevel(xp) {
  let current = LEVELS[0];
  let next = LEVELS[1];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) {
      current = LEVELS[i];
      next = LEVELS[i + 1] || null;
      break;
    }
  }
  return { current, next };
}

function getTrafficLight(pct) {
  if (pct <= 15) return { color: "green", label: "Safe", emoji: "🟢", desc: "This purchase fits your budget comfortably." };
  if (pct <= 30) return { color: "yellow", label: "Moderate", emoji: "🟡", desc: "Manageable, but keep an eye on other expenses." };
  return { color: "red", label: "Risky", emoji: "🔴", desc: "This could strain your finances significantly." };
}

function AnimatedNumber({ value, decimals = 2 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (value === 0) { setDisplay(0); return; }
    let start = 0;
    const end = value;
    const duration = 600;
    const step = (timestamp) => {
      if (!ref.current) return;
      const elapsed = timestamp - ref.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + (end - start) * eased);
      if (progress < 1) requestAnimationFrame(step);
    };
    ref.current = performance.now();
    requestAnimationFrame(step);
  }, [value]);

  return <>{display.toFixed(decimals)}</>;
}

function TrafficLightVisual({ status }) {
  const colors = ["red", "yellow", "green"];
  const activeMap = { red: 0, yellow: 1, green: 2 };
  const activeIdx = status ? activeMap[status.color] : -1;

  const glowColors = {
    red: "#ef4444",
    yellow: "#eab308",
    green: "#22c55e",
  };

  const bgColors = {
    red: "rgba(239,68,68,0.18)",
    yellow: "rgba(234,179,8,0.18)",
    green: "rgba(34,197,94,0.18)",
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "10px",
      background: "#111",
      border: "3px solid #333",
      borderRadius: "20px",
      padding: "18px 22px",
      boxShadow: status ? `0 0 40px ${bgColors[status.color]}` : "none",
      transition: "box-shadow 0.5s ease",
    }}>
      {colors.map((c, i) => {
        const isActive = i === activeIdx;
        return (
          <div key={c} style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: isActive ? glowColors[c] : "#222",
            boxShadow: isActive ? `0 0 20px ${glowColors[c]}, 0 0 40px ${glowColors[c]}55` : "none",
            border: `2px solid ${isActive ? glowColors[c] : "#333"}`,
            transition: "all 0.4s ease",
          }} />
        );
      })}
    </div>
  );
}

function XPBar({ xp }) {
  const { current, next } = getLevel(xp);
  const pct = next
    ? ((xp - current.minXP) / (next.minXP - current.minXP)) * 100
    : 100;

  return (
    <div style={{ width: "100%", fontFamily: "'Space Mono', monospace" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: "#f59e0b", letterSpacing: "0.05em" }}>
          {current.icon} {current.name}
        </span>
        <span style={{ fontSize: 12, color: "#888" }}>{xp} XP</span>
        {next && <span style={{ fontSize: 12, color: "#555" }}>{next.name} →</span>}
      </div>
      <div style={{ height: 8, background: "#1e1e1e", borderRadius: 99, overflow: "hidden", border: "1px solid #333" }}>
        <div style={{
          height: "100%",
          width: `${pct}%`,
          background: "linear-gradient(90deg, #f59e0b, #fbbf24)",
          borderRadius: 99,
          transition: "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
          boxShadow: "0 0 10px #f59e0b88",
        }} />
      </div>
    </div>
  );
}

function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      position: "fixed",
      bottom: 32,
      left: "50%",
      transform: "translateX(-50%)",
      background: "#f59e0b",
      color: "#000",
      padding: "10px 24px",
      borderRadius: 99,
      fontFamily: "'Space Mono', monospace",
      fontSize: 14,
      fontWeight: "bold",
      zIndex: 9999,
      boxShadow: "0 0 30px #f59e0b66",
      animation: "fadeInUp 0.3s ease",
    }}>
      {message}
    </div>
  );
}

function InputField({ label, value, onChange, prefix, placeholder, hint }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#888", fontFamily: "'Space Mono', monospace" }}>
        {label}
      </label>
      <div style={{
        display: "flex",
        alignItems: "center",
        background: "#0d0d0d",
        border: `1.5px solid ${focused ? "#f59e0b" : "#2a2a2a"}`,
        borderRadius: 10,
        overflow: "hidden",
        transition: "border-color 0.2s",
        boxShadow: focused ? "0 0 12px #f59e0b22" : "none",
      }}>
        {prefix && (
          <span style={{ padding: "0 14px", color: "#f59e0b", fontSize: 15, fontFamily: "'Space Mono', monospace", fontWeight: "bold" }}>
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#fff",
            fontSize: 16,
            fontFamily: "'Space Mono', monospace",
            padding: "13px 14px 13px 0",
          }}
        />
      </div>
      {hint && <span style={{ fontSize: 11, color: "#555", fontFamily: "'Space Mono', monospace" }}>{hint}</span>}
    </div>
  );
}

const HISTORY_KEY = "headlight_history";
const XP_KEY = "headlight_xp";
const BADGES_KEY = "headlight_badges";

const BADGE_DEFS = [
  { id: "first_sim", label: "First Simulation", icon: "🚀", desc: "Ran your first simulation" },
  { id: "five_sims", label: "Analyst", icon: "📈", desc: "Ran 5 simulations" },
  { id: "green_light", label: "Green Zone", icon: "🟢", desc: "Got a Safe result" },
  { id: "red_alert", label: "Red Alert", icon: "🔴", desc: "Got a Risky result — stay sharp!" },
  { id: "saved_50", label: "Saver", icon: "💰", desc: "Installment under 10% of income" },
];

export default function Headlight() {
  const [price, setPrice] = useState("");
  const [installments, setInstallments] = useState("");
  const [income, setIncome] = useState("");
  const [result, setResult] = useState(null);
  const [xp, setXP] = useState(() => parseInt(localStorage.getItem(XP_KEY) || "0"));
  const [badges, setBadges] = useState(() => JSON.parse(localStorage.getItem(BADGES_KEY) || "[]"));
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"));
  const [toast, setToast] = useState(null);
  const [simCount, setSimCount] = useState(() => parseInt(localStorage.getItem("headlight_simcount") || "0"));
  const [activeTab, setActiveTab] = useState("simulate");
  const [showBadge, setShowBadge] = useState(null);

  useEffect(() => { localStorage.setItem(XP_KEY, xp); }, [xp]);
  useEffect(() => { localStorage.setItem(BADGES_KEY, JSON.stringify(badges)); }, [badges]);
  useEffect(() => { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem("headlight_simcount", simCount); }, [simCount]);

  function awardBadge(id) {
    if (!badges.includes(id)) {
      const def = BADGE_DEFS.find(b => b.id === id);
      setBadges(prev => [...prev, id]);
      setShowBadge(def);
      setTimeout(() => setShowBadge(null), 3000);
    }
  }

  function simulate() {
    const p = parseFloat(price);
    const n = parseInt(installments);
    const inc = parseFloat(income);
    if (!p || !n || !inc || p <= 0 || n <= 0 || inc <= 0) {
      setToast("⚠️ Fill in all fields correctly.");
      return;
    }

    const installmentVal = p / n;
    const pct = (installmentVal / inc) * 100;
    const hourlyRate = inc / (22 * 8);
    const hoursNeeded = installmentVal / hourlyRate;
    const status = getTrafficLight(pct);

    const newResult = { installmentVal, pct, hoursNeeded, status, price: p, installments: n, income: inc, timestamp: Date.now() };
    setResult(newResult);

    // XP
    let xpGain = 10;
    if (status.color === "green") xpGain += 5;
    setXP(prev => prev + xpGain);
    setToast(`+${xpGain} XP earned!`);

    // History
    setHistory(prev => [newResult, ...prev].slice(0, 10));

    // Badges
    const newCount = simCount + 1;
    setSimCount(newCount);
    if (newCount === 1) awardBadge("first_sim");
    if (newCount >= 5) awardBadge("five_sims");
    if (status.color === "green") awardBadge("green_light");
    if (status.color === "red") awardBadge("red_alert");
    if (pct < 10) awardBadge("saved_50");
  }

  const statusColors = { green: "#22c55e", yellow: "#eab308", red: "#ef4444" };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080808",
      color: "#fff",
      fontFamily: "'Space Mono', monospace",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "0 16px 60px",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        @keyframes fadeInUp { from { opacity:0; transform: translateX(-50%) translateY(20px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }
        @keyframes badgePop { 0% { opacity:0; transform:scale(0.5); } 60% { transform:scale(1.1); } 100% { opacity:1; transform:scale(1); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.6; } }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #333; border-radius: 99px; }
      `}</style>

      {/* Background grid */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        opacity: 0.4,
      }} />

      {/* Glow blob */}
      <div style={{
        position: "fixed", top: -150, left: "50%", transform: "translateX(-50%)",
        width: 600, height: 300,
        background: "radial-gradient(ellipse, #f59e0b22, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Header */}
      <div style={{ width: "100%", maxWidth: 480, position: "relative", zIndex: 1, paddingTop: 40, paddingBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 4 }}>
          <span style={{ fontSize: 42, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em", color: "#f59e0b", lineHeight: 1 }}>
            HEADLIGHT
          </span>
          <span style={{ fontSize: 12, color: "#555", marginBottom: 6, letterSpacing: "0.1em" }}>v1.0</span>
        </div>
        <p style={{ fontSize: 12, color: "#666", letterSpacing: "0.05em" }}>Illuminate your financial decisions before you leap.</p>

        {/* XP Bar */}
        <div style={{ marginTop: 20 }}>
          <XPBar xp={xp} />
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginTop: 24, background: "#0d0d0d", border: "1px solid #222", borderRadius: 12, padding: 4 }}>
          {["simulate", "history", "badges"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              flex: 1, padding: "8px 0", border: "none", borderRadius: 8, cursor: "pointer",
              fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
              background: activeTab === tab ? "#f59e0b" : "transparent",
              color: activeTab === tab ? "#000" : "#555",
              fontFamily: "'Space Mono', monospace",
              fontWeight: activeTab === tab ? "bold" : "normal",
              transition: "all 0.2s",
            }}>{tab}</button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ width: "100%", maxWidth: 480, position: "relative", zIndex: 1 }}>

        {/* SIMULATE TAB */}
        {activeTab === "simulate" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 24 }}>
            <div style={{ background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>
              <InputField label="Product Price" value={price} onChange={setPrice} prefix="R$" placeholder="1500.00" hint="Total price of the item" />
              <InputField label="Installments" value={installments} onChange={setInstallments} placeholder="12" hint="Number of monthly payments" />
              <InputField label="Monthly Income" value={income} onChange={setIncome} prefix="R$" placeholder="5000.00" hint="Your net monthly income" />

              <button onClick={simulate} style={{
                marginTop: 4,
                padding: "14px 0",
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                border: "none",
                borderRadius: 10,
                color: "#000",
                fontSize: 14,
                fontFamily: "'Space Mono', monospace",
                fontWeight: "bold",
                letterSpacing: "0.1em",
                cursor: "pointer",
                textTransform: "uppercase",
                boxShadow: "0 0 20px #f59e0b44",
                transition: "transform 0.1s, box-shadow 0.2s",
              }}
                onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
                onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
              >
                ▶ Simulate
              </button>
            </div>

            {/* Result */}
            {result && (
              <div style={{
                background: "#0d0d0d",
                border: `1.5px solid ${statusColors[result.status.color]}44`,
                borderRadius: 16,
                padding: 24,
                boxShadow: `0 0 30px ${statusColors[result.status.color]}18`,
                animation: "fadeIn 0.4s ease",
              }}>
                <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                  <TrafficLightVisual status={result.status} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>Result</div>
                    <div style={{ fontSize: 26, fontFamily: "'Bebas Neue', sans-serif", color: statusColors[result.status.color], letterSpacing: "0.05em", marginBottom: 2 }}>
                      {result.status.label}
                    </div>
                    <div style={{ fontSize: 11, color: "#666", lineHeight: 1.5, maxWidth: 200 }}>{result.status.desc}</div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 20 }}>
                  {[
                    { label: "Per Month", value: `R$ ${result.installmentVal.toFixed(2)}`, sub: `${result.installments}x` },
                    { label: "Of Income", value: `${result.pct.toFixed(1)}%`, sub: "commitment" },
                    { label: "Work Hours", value: `${result.hoursNeeded.toFixed(0)}h`, sub: "per installment" },
                  ].map(({ label, value, sub }) => (
                    <div key={label} style={{ background: "#111", borderRadius: 10, padding: "14px 10px", border: "1px solid #1e1e1e", textAlign: "center" }}>
                      <div style={{ fontSize: 10, color: "#555", letterSpacing: "0.1em", marginBottom: 6, textTransform: "uppercase" }}>{label}</div>
                      <div style={{ fontSize: 18, fontFamily: "'Bebas Neue', sans-serif", color: "#fff", letterSpacing: "0.05em" }}>{value}</div>
                      <div style={{ fontSize: 10, color: "#444", marginTop: 2 }}>{sub}</div>
                    </div>
                  ))}
                </div>

                {/* Commitment bar */}
                <div style={{ marginTop: 18 }}>
                  <div style={{ fontSize: 10, color: "#555", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
                    Budget Impact
                  </div>
                  <div style={{ height: 6, background: "#1a1a1a", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{
                      height: "100%",
                      width: `${Math.min(result.pct, 100)}%`,
                      background: statusColors[result.status.color],
                      borderRadius: 99,
                      transition: "width 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      boxShadow: `0 0 8px ${statusColors[result.status.color]}`,
                    }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                    <span style={{ fontSize: 10, color: "#333" }}>0%</span>
                    <span style={{ fontSize: 10, color: "#333" }}>15% safe</span>
                    <span style={{ fontSize: 10, color: "#333" }}>30% limit</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === "history" && (
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
            {history.length === 0 ? (
              <div style={{ textAlign: "center", color: "#333", padding: 60, fontSize: 13 }}>
                No simulations yet.<br />Run your first one!
              </div>
            ) : history.map((h, i) => (
              <div key={h.timestamp} style={{
                background: "#0d0d0d",
                border: `1px solid ${statusColors[h.status.color]}33`,
                borderRadius: 12,
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}>
                <div style={{
                  width: 12, height: 12, borderRadius: "50%",
                  background: statusColors[h.status.color],
                  boxShadow: `0 0 8px ${statusColors[h.status.color]}`,
                  flexShrink: 0,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "#ddd" }}>R$ {h.price.toFixed(2)} in {h.installments}x</div>
                  <div style={{ fontSize: 11, color: "#555" }}>{h.pct.toFixed(1)}% of income · R$ {h.installmentVal.toFixed(2)}/mo</div>
                </div>
                <div style={{ fontSize: 11, color: "#333" }}>
                  {new Date(h.timestamp).toLocaleDateString("pt-BR")}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BADGES TAB */}
        {activeTab === "badges" && (
          <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {BADGE_DEFS.map(b => {
              const earned = badges.includes(b.id);
              return (
                <div key={b.id} style={{
                  background: earned ? "#0d0d0d" : "#080808",
                  border: `1px solid ${earned ? "#f59e0b44" : "#1a1a1a"}`,
                  borderRadius: 14,
                  padding: "18px 16px",
                  opacity: earned ? 1 : 0.4,
                  transition: "all 0.3s",
                }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{b.icon}</div>
                  <div style={{ fontSize: 13, color: earned ? "#f59e0b" : "#555", fontWeight: "bold", marginBottom: 4 }}>{b.label}</div>
                  <div style={{ fontSize: 11, color: "#555", lineHeight: 1.4 }}>{b.desc}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Badge popup */}
      {showBadge && (
        <div style={{
          position: "fixed", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          background: "#111",
          border: "2px solid #f59e0b",
          borderRadius: 20,
          padding: "32px 40px",
          textAlign: "center",
          zIndex: 9998,
          animation: "badgePop 0.4s ease",
          boxShadow: "0 0 60px #f59e0b44",
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{showBadge.icon}</div>
          <div style={{ fontSize: 11, color: "#f59e0b", letterSpacing: "0.15em", marginBottom: 4, textTransform: "uppercase" }}>Badge Unlocked!</div>
          <div style={{ fontSize: 18, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>{showBadge.label}</div>
          <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>{showBadge.desc}</div>
        </div>
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
