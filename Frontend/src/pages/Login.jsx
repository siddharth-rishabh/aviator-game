import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap');

  @keyframes twinkle {
    0%,100% { opacity:.12; } 50% { opacity:.7; }
  }
  @keyframes float {
    0%,100% { transform: translateY(0) rotate(-8deg); }
    50%      { transform: translateY(-10px) rotate(-8deg); }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes shimmer {
    from { background-position: -200% center; }
    to   { background-position: 200% center; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .font-orbitron { font-family: 'Orbitron', monospace; }
  .font-dm       { font-family: 'DM Sans', sans-serif; }

  .plane-float   { animation: float 3s ease-in-out infinite; }
  .card-fade-up  { animation: fadeUp .5s ease-out both; }
  .text-shimmer  {
    background: linear-gradient(90deg, #00e57a, #3d9bff, #00e57a);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 3s linear infinite;
  }
  .spinner {
    width: 18px; height: 18px;
    border: 2px solid rgba(0,0,0,.2);
    border-top-color: #000;
    border-radius: 50%;
    animation: spin .6s linear infinite;
    display: inline-block;
  }
`;

function createStars() {
  return Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    s: Math.random() * 2 + 0.5,
    d: Math.random() * 4,
    dur: 1.5 + Math.random() * 2.5,
  }));
}

function Stars() {
  const [stars] = useState(() => createStars());

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {stars.map((st) => (
        <div
          key={st.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${st.x}%`,
            top: `${st.y}%`,
            width: st.s,
            height: st.s,
            animation: `twinkle ${st.dur}s ${st.d}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}
export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage]   = useState("");
  const [msgType, setMsgType]   = useState("error"); // "error" | "success"
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("http://15.134.234.250:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        setMsgType("success");
        setMessage("Login successful! Redirecting…");
        setTimeout(() => navigate("/game"), 800);
      } else {
        setMsgType("error");
        setMessage(data.message || "Login failed.");
      }
    } catch (error) {
      setMsgType("error");
      setMessage("Something went wrong. " + error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{KEYFRAMES}</style>

      <div className="font-dm min-h-screen bg-[#06060f] flex items-center justify-center px-4 relative overflow-hidden">

        {/* ambient glow */}
        <div className="fixed inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(0,229,122,.09) 0%, transparent 70%)" }} />

        <Stars />

        {/* card */}
        <div className="card-fade-up relative z-10 w-full max-w-md">

          {/* logo */}
          <div className="flex flex-col items-center mb-8 gap-3">
            <span className="plane-float text-5xl select-none"
              style={{ filter: "drop-shadow(0 0 18px rgba(0,229,122,.8))", display: "inline-block" }}>✈</span>
            <h1 className="font-orbitron font-black text-2xl tracking-[5px] text-shimmer">AVIATOR</h1>
            <p className="text-white/30 text-sm tracking-widest uppercase">Welcome back, pilot</p>
          </div>

          {/* glass card */}
          <div className="bg-white/4 border border-white/8 rounded-3xl p-8 backdrop-blur-xl shadow-2xl flex flex-col gap-5">

            <h2 className="font-orbitron font-bold text-white text-xl text-center tracking-wider">Sign In</h2>

            {/* email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-white/40 text-[11px] uppercase tracking-[2px] pl-1">Email</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-base">✉</span>
                <input
                  type="email"
                  placeholder="pilot@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/6 border border-white/10 rounded-2xl pl-10 pr-4 py-3.5 text-white text-sm outline-none placeholder-white/20 focus:border-emerald-400/50 focus:bg-white/8 transition-all duration-200"
                />
              </div>
            </div>

            {/* password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-white/40 text-[11px] uppercase tracking-[2px] pl-1">Password</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-base">🔒</span>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/6 border border-white/10 rounded-2xl pl-10 pr-12 py-3.5 text-white text-sm outline-none placeholder-white/20 focus:border-emerald-400/50 focus:bg-white/8 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors text-sm"
                >
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* message */}
            {message && (
              <div className={`text-sm text-center px-4 py-3 rounded-2xl border font-medium
                ${msgType === "success"
                  ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/25"
                  : "text-red-400 bg-red-500/10 border-red-500/25"}`}>
                {message}
              </div>
            )}

            {/* submit */}
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-orbitron font-bold text-sm tracking-[3px] uppercase transition-all duration-200 flex items-center justify-center gap-2
                ${loading
                  ? "bg-emerald-500/40 text-black/50 cursor-not-allowed"
                  : "bg-linear-to-r from-emerald-400 to-emerald-500 text-black hover:brightness-110 active:scale-[.98]"}`}
              style={loading ? {} : { boxShadow: "0 0 28px rgba(0,229,122,.35)" }}
            >
              {loading ? <><span className="spinner" /> Signing in…</> : "🚀 Launch"}
            </button>

            {/* divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/[.07]" />
              <span className="text-white/20 text-xs">OR</span>
              <div className="flex-1 h-px bg-white/[.07]" />
            </div>

            {/* register link */}
            <p className="text-center text-white/40 text-sm">
              New pilot?{" "}
              <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                Create account →
              </Link>
            </p>

          </div>
        </div>
      </div>
    </>
  );
}