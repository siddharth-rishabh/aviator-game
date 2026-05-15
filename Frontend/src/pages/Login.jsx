import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const navigate = useNavigate();

  async function handleLogin(e) {

    e.preventDefault();

    try {

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (data.token) {

        localStorage.setItem(
          "token",
          data.token
        );

        setMessage("Login successful");

        navigate("/game");

      } else {

        setMessage(data.message);

      }

    } catch (error) {

      setMessage("Something went wrong "+ error);

    }

  }

  return (

    <div className="min-h-screen bg-black flex items-center justify-center">

      <form
        onSubmit={handleLogin}
        className="bg-zinc-900 p-8 rounded-2xl w-87.5 flex flex-col gap-4 shadow-2xl"
      >

        <h1 className="text-white text-3xl font-bold text-center">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="bg-zinc-800 text-white p-3 rounded-lg outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="bg-zinc-800 text-white p-3 rounded-lg outline-none"
        />

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 transition-all text-white p-3 rounded-lg font-semibold"
        >
          Login
        </button>

        <p className="text-center text-white">
          {message}
        </p>

      </form>

    </div>

  );

}

export default Login;
