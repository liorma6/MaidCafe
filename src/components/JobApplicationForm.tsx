"use client";

import { useState } from "react";

export default function JobApplicationForm() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    experience: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setStatus("success");
      setForm({
        fullName: "",
        email: "",
        phone: "",
        age: "",
        experience: "",
        message: "",
      });
    } else {
      const data = await res.json();
      setErrorMsg(data.error || "שגיאה בשליחה");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="kawaii-card mx-auto max-w-lg p-8 text-center">
        <p className="text-4xl">♡</p>
        <h2 className="mt-4 text-xl font-bold text-pink-700">תודה על הפנייה!</h2>
        <p className="mt-2 text-pink-600">
          קיבלנו את המועמדות שלך ונחזור אלייך בהקדם!
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="admin-btn mt-6"
        >
          שליחת מועמדות נוספת
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="kawaii-card mx-auto max-w-lg space-y-4 p-8"
    >
      <h2 className="text-center text-xl font-bold text-pink-700">
        טופס הצטרפות לצוות ♡
      </h2>
      <p className="text-center text-sm text-pink-600">
        רוצים להצטרף לצוות המיידים והבאטלרים שלנו? מלאו את הטופס!
      </p>

      {status === "error" && (
        <p className="rounded-lg bg-red-100 px-4 py-2 text-center text-sm text-red-700">
          {errorMsg}
        </p>
      )}

      <input
        value={form.fullName}
        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        placeholder="שם מלא *"
        className="admin-input"
        required
      />
      <input
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="מייל *"
        className="admin-input"
        required
      />
      <input
        type="tel"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        placeholder="טלפון *"
        className="admin-input"
        required
      />
      <input
        value={form.age}
        onChange={(e) => setForm({ ...form, age: e.target.value })}
        placeholder="גיל"
        className="admin-input"
      />
      <textarea
        value={form.experience}
        onChange={(e) => setForm({ ...form, experience: e.target.value })}
        placeholder="ניסיון רלוונטי (אירועים, שירות, קוספליי וכו')"
        rows={3}
        className="admin-input"
      />
      <textarea
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        placeholder="למה את/ה רוצה להצטרף אלינו?"
        rows={3}
        className="admin-input"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="admin-btn w-full"
      >
        {status === "loading" ? "שולח..." : "שליחת מועמדות ♡"}
      </button>
    </form>
  );
}
