"use client";
import { API_URL } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setError("");

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error("Geçersiz kullanıcı adı veya şifre");
      }

      const data = await res.json();
      router.push(`/dashboard?role=${data.role}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('airport-terminal.jpg')",
      }}
    >
      <h2 className="text-5xl font-bold text-white font-outline-2 tracking-widest">
        Giriş Yap
      </h2>
      {error && <p className="text-red-500">{error}</p>}
      <input
        className="mt-4 p-2 border rounded w-[20vw]"
        type="text"
        placeholder="Kullanıcı Adı"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="mt-2 p-2 border rounded w-[20vw]"
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="  w-[20vw] mt-4 px-6 py-2 bg-green-600 text-white rounded"
        onClick={handleLogin}
      >
        Giriş Yap
      </button>
    </div>
  );
}
