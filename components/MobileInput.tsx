"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MobileInput() {
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setMobile(val);
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    localStorage.setItem("dostt_mobile", mobile);
    router.push(`/dashboard?mobile=${mobile}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <div className="flex items-center border-2 border-purple-200 rounded-xl overflow-hidden focus-within:border-dostt-purple transition-colors">
          <span className="px-3 text-gray-500 text-sm font-medium border-r border-purple-200 py-3 bg-purple-50">
            +91
          </span>
          <input
            type="tel"
            inputMode="numeric"
            placeholder="9500365660"
            value={mobile}
            onChange={handleChange}
            className="flex-1 px-4 py-3 text-gray-800 text-base outline-none bg-white placeholder-gray-300"
          />
        </div>
        {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
      </div>
      <button
        type="submit"
        className="w-full bg-dostt-purple hover:bg-dostt-purple-dark text-white font-semibold py-3 rounded-xl transition-colors text-base shadow-sm"
      >
        Check My Performance →
      </button>
    </form>
  );
}
