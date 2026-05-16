import {  useState } from "react";
import { Link } from "react-router-dom";

const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap');

  @keyframes twinkle {
    0%,100% { opacity:.12; }
    50% { opacity:.7; }
  }

  @keyframes float {
    0%,100% {
      transform: translateY(0) rotate(-8deg);
    }
    50% {
      transform: translateY(-10px) rotate(-8deg);
    }
  }

  @keyframes fadeUp {
    from {
      opacity:0;
      transform:translateY(20px);
    }
    to {
      opacity:1;
      transform:translateY(0);
    }
  }

  @keyframes shimmer {
    from { background-position: -200% center; }
    to { background-position: 200% center; }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes successPop {
    0% {
      transform: scale(0.7);
      opacity: 0;
    }

    70% {
      transform: scale(1.1);
    }

    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  .font-orbitron {
    font-family: 'Orbitron', monospace;
  }

  .font-dm {
    font-family: 'DM Sans', sans-serif;
  }

  .plane-float {
    animation: float 3s ease-in-out infinite;
  }

  .card-fade-up {
    animation: fadeUp .5s ease-out both;
  }

  .text-shimmer {
    background: linear-gradient(
      90deg,
      #00e57a,
      #3d9bff,
      #00e57a
    );

    background-size: 200% auto;

    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    animation: shimmer 3s linear infinite;
  }

  .spinner {
    width: 18px;
    height: 18px;

    border: 2px solid rgba(0,0,0,.2);
    border-top-color: #000;

    border-radius: 50%;

    animation: spin .6s linear infinite;

    display: inline-block;
  }

  .success-pop {
    animation: successPop .4s cubic-bezier(.34,1.56,.64,1) both;
  }
`;

function createStars() {
  return Array.from(
    { length: 50 },
    (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      s: Math.random() * 2 + 0.5,
      d: Math.random() * 4,
      dur: 1.5 + Math.random() * 2.5,
    })
  );
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
function StrengthBar({ password }) {

  const score =
    password.length === 0
      ? 0
      : password.length < 6
      ? 1
      : password.length < 10 &&
        !/[^a-zA-Z0-9]/.test(password)
      ? 2
      : password.length >= 10 &&
        /[^a-zA-Z0-9]/.test(password)
      ? 4
      : 3;

  const labels = [
    "",
    "Weak",
    "Fair",
    "Good",
    "Strong"
  ];

  const colors = [
    "",
    "bg-red-500",
    "bg-yellow-400",
    "bg-blue-400",
    "bg-emerald-400"
  ];

  const textColors = [
    "",
    "text-red-400",
    "text-yellow-300",
    "text-blue-400",
    "text-emerald-400"
  ];

  if (password.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 mt-1 px-1">

      <div className="flex gap-1 flex-1">

        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= score
                ? colors[score]
                : "bg-white/10"
            }`}
          />
        ))}

      </div>

      <span
        className={`text-[10px] font-semibold uppercase tracking-wide ${textColors[score]}`}
      >
        {labels[score]}
      </span>

    </div>
  );
}

export default function Register() {

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [msgType, setMsgType] =
    useState("error");

  const [loading, setLoading] =
    useState(false);

  const [showPass, setShowPass] =
    useState(false);

  const [done, setDone] =
    useState(false);

  async function handleRegister(e) {

    e.preventDefault();

    setLoading(true);

    setMessage("");

    try {

      const response = await fetch(
        "http://15.134.234.250:5000/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            username,
            email,
            password
          }),
        }
      );

      const data =
        await response.json();

      if (response.ok) {

        setMsgType("success");

        setMessage(
          data.message ||
          "Account created successfully!"
        );

        setDone(true);

      } else {

        setMsgType("error");

        setMessage(
          data.message ||
          "Registration failed."
        );

      }

    } catch (error) {

      setMsgType("error");

      setMessage(
        "Something went wrong. " + error
      );

    } finally {

      setLoading(false);

    }
  }

  return (
    <>
      <style>{KEYFRAMES}</style>

      <div className="font-dm min-h-screen bg-[#06060f] flex items-center justify-center px-4 py-10 relative overflow-hidden">

        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(61,155,255,.09) 0%, transparent 70%)"
          }}
        />

        <Stars />

        <div className="card-fade-up relative z-10 w-full max-w-md">

          <div className="flex flex-col items-center mb-8 gap-3">

            <span
              className="plane-float text-5xl select-none"
              style={{
                filter:
                  "drop-shadow(0 0 18px rgba(61,155,255,.8))",
                display: "inline-block"
              }}
            >
              ✈
            </span>

            <h1 className="font-orbitron font-black text-2xl tracking-[5px] text-shimmer">
              AVIATOR
            </h1>

            <p className="text-white/30 text-sm tracking-widest uppercase">
              Begin your flight
            </p>

          </div>

          {done ? (

            <div className="success-pop bg-white/4 border border-emerald-400/25 rounded-3xl p-10 backdrop-blur-xl flex flex-col items-center gap-5 text-center">

              <div className="w-16 h-16 rounded-full bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center text-3xl">
                ✅
              </div>

              <h2 className="font-orbitron font-bold text-white text-lg tracking-wider">
                You're on the runway!
              </h2>

              <p className="text-white/50 text-sm leading-relaxed">
                {message}
              </p>

              <Link
                to="/login"
                className="w-full py-4 rounded-2xl font-orbitron font-bold text-sm tracking-[3px] uppercase text-center text-black transition-all duration-200 hover:brightness-110 active:scale-[.98]"
                style={{
                  background:
                    "linear-gradient(to right, #00e57a, #22c55e)",
                  boxShadow:
                    "0 0 28px rgba(0,229,122,.35)"
                }}
              >
                🚀 Go to Login
              </Link>

            </div>

          ) : (

            <form
              onSubmit={handleRegister}
              className="bg-white/4 border border-white/8 rounded-3xl p-8 backdrop-blur-xl shadow-2xl flex flex-col gap-5"
            >

              <h2 className="font-orbitron font-bold text-white text-xl text-center tracking-wider">
                Create Account
              </h2>

              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                required
                className="w-full bg-white/6 border border-white/10 rounded-2xl px-4 py-3.5 text-white outline-none"
              />

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                className="w-full bg-white/6 border border-white/10 rounded-2xl px-4 py-3.5 text-white outline-none"
              />

              <div className="relative">

                <input
                  type={
                    showPass
                      ? "text"
                      : "password"
                  }
                  placeholder="Password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                  className="w-full bg-white/6 border border-white/10 rounded-2xl px-4 py-3.5 pr-12 text-white outline-none"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPass((prev) => !prev)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40"
                >
                  {showPass ? "🙈" : "👁"}
                </button>

                <StrengthBar
                  password={password}
                />

              </div>

              {message && (
                <div
                  className={`text-sm text-center px-4 py-3 rounded-2xl border ${
                    msgType === "success"
                      ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/25"
                      : "text-red-400 bg-red-500/10 border-red-500/25"
                  }`}
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-2xl font-orbitron font-bold text-sm tracking-[3px] uppercase transition-all duration-200 flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-blue-400/40 text-black/50 cursor-not-allowed"
                    : "bg-linear-to-r from-blue-400 to-blue-500 text-black hover:brightness-110 active:scale-[.98]"
                }`}
                style={
                  loading
                    ? {}
                    : {
                        boxShadow:
                          "0 0 28px rgba(61,155,255,.35)"
                      }
                }
              >
                {loading ? (
                  <>
                    <span
                      className="spinner"
                      style={{
                        borderTopColor: "#000"
                      }}
                    />
                    Creating...
                  </>
                ) : (
                  "✈ Register"
                )}
              </button>

              <p className="text-center text-white/40 text-sm">

                Already a pilot?{" "}

                <Link
                  to="/login"
                  className="text-blue-400 hover:text-blue-300"
                >
                  Sign in →
                </Link>

              </p>

            </form>

          )}

        </div>

      </div>
    </>
  );
}