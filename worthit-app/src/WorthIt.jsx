import { useState, useEffect, useRef } from "react";

const LEVELS = [
  { name: "Rookie", minXP: 0, icon: "🌱" },
  { name: "Explorer", minXP: 100, icon: "🧭" },
  { name: "Warrior", minXP: 300, icon: "⚔️" },
  { name: "Legend", minXP: 600, icon: "🔥" }
];

export default function WorthIt() {
  const [xp, setXP] = useState(0);
  const [level, setLevel] = useState(LEVELS[0]);
  const intervalRef = useRef(null);

  useEffect(() => {
    const current = [...LEVELS].reverse().find(l => xp >= l.minXP);
    setLevel(current);
  }, [xp]);

  const startXP = () => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setXP(prev => prev + 10);
    }, 1000);
  };

  const stopXP = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const resetXP = () => {
    stopXP();
    setXP(0);
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>WorthIt Tracker</h1>

      <h2>
        {level.icon} {level.name}
      </h2>

      <p>XP: {xp}</p>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={startXP}>Start</button>
        <button onClick={stopXP} style={{ marginLeft: "10px" }}>
          Stop
        </button>
        <button onClick={resetXP} style={{ marginLeft: "10px" }}>
          Reset
        </button>
      </div>
    </div>
  );
}