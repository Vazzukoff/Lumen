"use client";

import { CiMenuBurger } from "react-icons/ci";
import { LuSparkles } from "react-icons/lu";

// Header Component
export default function Header() {
  return (
    <header className="bg-white/70 backdrop-blur-md border-b border-purple-100 px-6 py-4 shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center">
            <LuSparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-light text-gray-800">Lumen</h1>
            <p className="text-xs text-gray-500">Tu espacio seguro 🔒</p>
          </div>
        </div>
        <button className="text-sm text-gray-600 hover:text-gray-800 transition-colors px-4 py-2 rounded-full hover:bg-white/50 flex items-center gap-2">
          <CiMenuBurger className="w-4 h-4" />
          <span>Menú</span>
        </button>
      </div>
    </header>
  );
}