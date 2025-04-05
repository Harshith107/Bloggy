// components/WelcomeToast.tsx
'use client'

import { toast } from 'sonner';

export const showWelcomeToast = () => {
  toast.custom((t) => (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg rounded-xl px-6 py-4 flex items-center gap-4 animate-fadeIn backdrop-blur-md">
      <span className="text-3xl animate-pulse">🚀</span>
      <div>
        <p className="font-bold text-lg">Welcome back!</p>
        <p className="text-sm text-white/90">You're in. Time to make some noise 📝</p>
      </div>
      <button
        onClick={() => toast.dismiss(t)}
        className="ml-auto text-white/70 hover:text-white transition"
      >
        ✖
      </button>
    </div>
  ));
};
