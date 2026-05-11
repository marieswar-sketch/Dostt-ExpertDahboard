import Image from "next/image";
import MobileInput from "@/components/MobileInput";
import AutoRedirect from "@/components/AutoRedirect";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <AutoRedirect />
      {/* Brand header */}
      <div className="mb-8 flex flex-col items-center gap-3">
        {/* Purple pill with white logo (mascot + dostt text) */}
        <div className="bg-dostt-purple rounded-2xl px-6 py-4 flex items-center justify-center shadow-lg">
          <Image
            src="/dostt-logo-white.png"
            alt="dostt"
            width={140}
            height={44}
            className="object-contain"
          />
        </div>
        <p className="text-gray-500 text-sm">Expert Performance Dashboard</p>
      </div>

      {/* Input card */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8 border border-purple-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Check My Performance</h2>
        <p className="text-gray-500 text-sm mb-6">
          Enter your registered mobile number to view your availability, talk time, and call history.
        </p>
        <MobileInput />
      </div>

      <p className="mt-6 text-xs text-gray-400">
        Stay active · Earn more · Grow with Dostt
      </p>
    </main>
  );
}
