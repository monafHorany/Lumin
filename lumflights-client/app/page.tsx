"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('airport-terminal.jpg')",
      }}
    >
      <h1 className="text-5xl tracking-widest font-bold">LumFlights’e Hoş Geldiniz</h1>
      <p className="mt-2 text-xl text-center max-w-lg font-bold">
        LumFlights offers the best flight booking experience, with exclusive
        deals and seamless travel planning.
      </p>
      <button
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded"
        onClick={() => router.push("/login")}
      >
        Giriş Yap
      </button>
    </div>
  );
}
