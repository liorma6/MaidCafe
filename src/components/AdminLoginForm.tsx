"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "שגיאה בהתחברות");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="kawaii-card mx-auto max-w-md space-y-4 p-8">
      <h1 className="text-center text-2xl font-bold text-pink-700">כניסת מנהל ♡</h1>
      {error && (
        <p className="rounded-lg bg-red-100 px-4 py-2 text-center text-sm text-red-700">
          {error}
        </p>
      )}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="מייל"
        className="admin-input"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="סיסמה"
        className="admin-input"
        required
      />
      <button type="submit" disabled={loading} className="admin-btn w-full">
        {loading ? "מתחבר..." : "התחברות"}
      </button>
    </form>
  );
}
