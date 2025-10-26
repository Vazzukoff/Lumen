"use client";

import { useState, useRef, useEffect } from "react";
import { IoSend } from "react-icons/io5";

// Definir tipo de props
type InputProps = {
  onSend: (message: string) => void;
};

export default function Input({ onSend }: InputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 150) + "px";
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  return (
    <div className="bg-white/70 backdrop-blur-md border-t border-purple-100 px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg border border-purple-100 p-2 flex items-end gap-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Cuéntame qué hay en tu mente..."
            className="flex-1 resize-none bg-transparent px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none text-[15px] leading-relaxed min-h-[24px] max-h-[150px]"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-gradient-to-br from-purple-400 to-indigo-400 text-white p-3 rounded-full hover:from-purple-500 hover:to-indigo-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
          >
            <IoSend className="w-5 h-5" />
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-3">
          Lumen es un espacio de apoyo, no reemplaza terapia profesional
        </p>
      </div>
    </div>
  );
}