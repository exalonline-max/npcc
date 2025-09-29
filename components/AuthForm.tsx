"use client";

import { useState } from "react";
import { SignIn } from "@clerk/nextjs";
import { SignUp } from "@clerk/nextjs";

export default function AuthForm() {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");

  return (
    <div className="center-screen">
      <div className="card" style={{ width: 420 }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <h2 style={{ margin: 0 }}>Sign {mode === "sign-in" ? "In" : "Up"}</h2>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              className={`btn ${mode === "sign-in" ? "btn-primary" : ""}`}
              onClick={() => setMode("sign-in")}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`btn ${mode === "sign-up" ? "btn-primary" : ""}`}
              onClick={() => setMode("sign-up")}
            >
              Sign Up
            </button>
          </div>
        </header>

        <div>
          {mode === "sign-in" ? (
            <SignIn path="/signin" routing="path" signUpUrl="/signin?mode=sign-up" />
          ) : (
            <SignUp path="/signin" routing="path" signInUrl="/signin?mode=sign-in" />
          )}
        </div>
      </div>
    </div>
  );
}
