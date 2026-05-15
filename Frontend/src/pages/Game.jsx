import { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";

const animations = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=DM+Sans:wght@300;400;500&display=swap');

@keyframes planeFly {
  0%   { transform: translate(0px, 0px) rotate(-8deg); }
  25%  { transform: translate(6px, -10px) rotate(-12deg); }
  50%  { transform: translate(0px, -4px) rotate(-8deg); }
  75%  { transform: translate(-4px, -12px) rotate(-6deg); }
  100% { transform: translate(0px, 0px) rotate(-8deg); }
}

@keyframes planeCrash {
  0%   { transform: translate(0,0) rotate(-8deg); opacity:1; }
  40%  { transform: translate(40px, 60px) rotate(60deg); opacity:0.7; }
  100% { transform: translate(80px, 140px) rotate(120deg); opacity:0; }
}

@keyframes multiplierPulse {
  0%,100% { transform: scale(1); }
  50% { transform: scale(1.06); }
}

@keyframes glowGreen {
  0%,100% {
    text-shadow: 0 0 20px rgba(0,229,122,0.4),
                 0 0 60px rgba(0,229,122,0.1);
  }
  50% {
    text-shadow: 0 0 40px rgba(0,229,122,0.8),
                 0 0 100px rgba(0,229,122,0.3);
  }
}

@keyframes float {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

@keyframes starTwinkle {
  0%,100% { opacity: 0.2; }
  50% { opacity: 0.8; }
}

.plane-flying {
  animation: planeFly 2.4s ease-in-out infinite;
}

.plane-crash {
  animation: planeCrash 0.9s ease-in forwards;
}

.plane-waiting {
  animation: float 3s ease-in-out infinite;
}

.multi-running {
  animation:
    multiplierPulse 0.6s ease-in-out infinite,
    glowGreen 1.4s ease-in-out infinite;
}
`;

function PlaneIcon({ status }) {
  const cls =
    status === "start"
      ? "plane-flying"
      : status === "crash"
      ? "plane-crash"
      : "plane-waiting";

  return (
    <div
      className={`${cls} text-[56px] inline-block select-none`}
      style={{
        filter:
          status === "crash"
            ? "drop-shadow(0 0 12px #ff3b5c)"
            : "drop-shadow(0 0 16px rgba(0,229,122,0.7))",
      }}
    >
      ✈
    </div>
  );
}

function createStars() {
  return Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    delay: Math.random() * 3,
    dur: 1.5 + Math.random() * 2,
  }));
}

function Stars() {
  const [stars] = useState(() => createStars());

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animation: `starTwinkle ${s.dur}s ${s.delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

const QUICK_BETS = [50, 100, 250, 500];

export default function Game() {
  const [game, setGame] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [history, setHistory] = useState([]);
  const [betAmount, setBetAmount] = useState(100);
 const [socket] = useState(() =>
  io("http://localhost:5000", {
    auth: { token: localStorage.getItem("token") },
  })
);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = animations;
    document.head.appendChild(style);

    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
  socket.on("game-update", (data) => {
    setGame(data.game);
    setWallet(data.player);
  });

  fetch("http://localhost:5000/history")
    .then((r) => r.json())
    .then(setHistory);

  return () => socket.disconnect();
}, [socket]);

  const placeBet = useCallback(() => {
    if (!socket) return;
    socket.emit("place-bet", Number(betAmount));
  }, [socket, betAmount]);

  const cashOut = useCallback(() => {
    if (!socket) return;
    socket.emit("cash-out");
  }, [socket]);

  if (!game || !wallet) {
    return (
      <div className="min-h-screen bg-[#06060f] flex flex-col items-center justify-center gap-5">
        <div className="w-12 h-12 rounded-full border-[3px] border-[#00e57a33] border-t-[#00e57a] animate-spin" />

        <p className="text-white/40 uppercase tracking-[3px] text-xs">
          Connecting...
        </p>
      </div>
    );
  }

  const isCrash = game.status === "crash";
  const isRunning = game.status === "start";
  const isWaiting = game.status === "waiting";

  const multiplierColor = isCrash
    ? "#ff3b5c"
    : isRunning
    ? "#00e57a"
    : "#ffd84d";

  return (
    <div className="min-h-screen bg-[#06060f] text-white relative overflow-hidden px-4 py-6 flex flex-col items-center gap-5 font-['DM_Sans']">
      <Stars />

      <header className="w-full max-w-215 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <span className="text-[26px]">✈</span>

          <h1 className="font-black text-[22px] tracking-[3px] bg-linear-to-r from-[#00e57a] to-[#3d9bff] text-transparent bg-clip-text font-['Orbitron']">
            AVIATOR
          </h1>
        </div>

        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl px-5 py-2">
          <span className="text-lg">💰</span>

          <div>
            <p className="uppercase tracking-[2px] text-[10px] text-white/40">
              Balance
            </p>

            <p className="font-['Orbitron'] font-bold text-base">
              ₹{wallet.balance.toFixed(2)}
            </p>
          </div>
        </div>
      </header>

      <div className="w-full max-w-215 flex flex-wrap justify-center gap-2 z-10">
        {history.slice(-14).map((item, i) => {
          const v = Number(item);

          const color =
            v < 2 ? "#ff3b5c" : v < 5 ? "#ffd84d" : "#00e57a";

          return (
            <div
              key={i}
              className="px-3 py-1 rounded-full text-xs font-bold font-['Orbitron']"
              style={{
                color,
                background: `${color}18`,
                border: `1px solid ${color}40`,
              }}
            >
              {v.toFixed(2)}x
            </div>
          );
        })}
      </div>

      <div className="relative overflow-hidden w-full max-w-215 min-h-70 rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl flex flex-col items-center justify-center z-10">
        <div
          className="absolute top-5 left-5 px-4 py-1 rounded-full text-[11px] uppercase tracking-[2px] font-semibold"
          style={{
            color: multiplierColor,
            background: `${multiplierColor}18`,
            border: `1px solid ${multiplierColor}40`,
          }}
        >
          {isWaiting ? "⏳ Waiting" : isCrash ? "💥 Crashed" : "🚀 Flying"}
        </div>

        <div className="mb-4 relative z-10">
          <PlaneIcon status={game.status} />
        </div>

        <div
          className={`font-['Orbitron'] font-black leading-none tracking-[-2px] text-[clamp(56px,12vw,96px)] ${
            isRunning ? "multi-running" : ""
          }`}
          style={{
            color: multiplierColor,
          }}
        >
          {game.multiplier.toFixed(2)}x
        </div>

        {isCrash && (
          <p className="mt-2 text-[#ff3b5c] uppercase tracking-[3px] text-sm font-['Orbitron']">
            Flew away!
          </p>
        )}

        {isWaiting && (
          <p className="mt-2 text-white/40 uppercase tracking-[2px] text-sm">
            Place your bet before takeoff
          </p>
        )}
      </div>

      <div className="w-full max-w-215 grid grid-cols-1 md:grid-cols-2 gap-4 z-10">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 flex flex-col gap-4">
          <p className="uppercase tracking-[3px] text-[11px] text-white/40">
            Place Bet
          </p>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-['Orbitron'] text-white/40 font-bold">
              ₹
            </span>

            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-4 py-3 text-xl font-bold font-['Orbitron'] outline-none focus:border-[#00e57a]"
            />
          </div>

          <div className="flex gap-2">
            {QUICK_BETS.map((v) => (
              <button
                key={v}
                onClick={() => setBetAmount(v)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  betAmount == v
                    ? "bg-[#00e57a22] border-[#00e57a55] text-[#00e57a]"
                    : "bg-white/5 border-white/10 text-white/50"
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={placeBet}
              disabled={!isWaiting || !!wallet.bet}
              className={`flex-1 py-3 rounded-xl font-bold tracking-wide transition-all ${
                !isWaiting || wallet.bet
                  ? "bg-white/5 text-white/20 cursor-not-allowed"
                  : "bg-linear-to-r from-[#00e57a] to-[#00c96a] text-black shadow-[0_0_20px_rgba(0,229,122,0.35)]"
              }`}
            >
              🎰 BET
            </button>

            <button
              onClick={cashOut}
              disabled={!isRunning || !wallet.bet}
              className={`flex-1 py-3 rounded-xl font-bold tracking-wide transition-all ${
                !isRunning || !wallet.bet
                  ? "bg-white/5 text-white/20 cursor-not-allowed"
                  : "bg-linear-to-r from-[#ff3b5c] to-[#c91040] text-white shadow-[0_0_20px_rgba(255,59,92,0.45)]"
              }`}
            >
              💸 CASH OUT
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 flex flex-col gap-4">
          <p className="uppercase tracking-[3px] text-[11px] text-white/40">
            Player
          </p>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex justify-between items-center">
            <div>
              <p className="text-[10px] uppercase tracking-[2px] text-white/40">
                Wallet
              </p>

              <p className="font-['Orbitron'] text-[22px] font-bold">
                ₹{wallet.balance.toFixed(2)}
              </p>
            </div>

            <div className="w-11 h-11 rounded-full bg-linear-to-br from-[#00e57a33] to-[#3d9bff33] border border-[#00e57a55] flex items-center justify-center text-xl">
              💼
            </div>
          </div>

          <div
            className={`rounded-2xl p-4 flex justify-between items-center border transition-all ${
              wallet.bet
                ? "bg-[#00e57a14] border-[#00e57a44]"
                : "bg-white/3 border-white/10"
            }`}
          >
            <div>
              <p className="text-[10px] uppercase tracking-[2px] text-white/40">
                Active Bet
              </p>

              <p
                className={`font-['Orbitron'] text-xl font-bold ${
                  wallet.bet ? "text-[#00e57a]" : "text-white/20"
                }`}
              >
                {wallet.bet ? `₹${wallet.bet}` : "—"}
              </p>
            </div>

            {wallet.bet && isRunning && (
              <div className="px-3 py-1 rounded-lg border border-[#00e57a55] bg-[#00e57a22] text-[#00e57a] font-bold font-['Orbitron']">
                ×{game.multiplier.toFixed(2)}
              </div>
            )}
          </div>

          {wallet.bet && isRunning && (
            <div className="rounded-2xl border border-[#ffd84d33] bg-[#ffd84d12] p-4 flex items-center justify-between">
              <p className="uppercase tracking-[2px] text-[11px] text-[#ffd84db0]">
                Potential Win
              </p>

              <p className="font-['Orbitron'] font-bold text-[#ffd84d]">
                ₹{(wallet.bet * game.multiplier).toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}