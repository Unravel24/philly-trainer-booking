"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [status, setStatus] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Working...");

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        setStatus(error.message);
        return;
      }

      const userId = data.user?.id;

      if (userId) {
        await supabase.from("profiles").insert([
          {
            id: userId,
            role: "player",
            full_name: fullName,
          },
        ]);
      }

      setStatus("Signed up successfully.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus("Signed in successfully.");
  }

  return (
    <main style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h1>Auth</h1>

      <div style={{ marginBottom: 10 }}>
        <button onClick={() => setMode("signup")}>Sign up</button>
        <button onClick={() => setMode("signin")}>Sign in</button>
      </div>

      <form onSubmit={onSubmit}>
        {mode === "signup" && (
          <input
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        )}

        <br />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />

        <button type="submit">
          {mode === "signup" ? "Create account" : "Sign in"}
        </button>
      </form>

      <p>{status}</p>
    </main>
  );
}

