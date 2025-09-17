"use client";

import { useEffect, useState } from "react";

export default function WhatsAppModal() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
          onClick={() => setShowModal(false)}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold text-center mb-4 text-[#8A00C4]">
          Join Our WhatsApp Group!
        </h2>
        <p className="text-gray-700 text-center mb-6">
          Get the latest job updates directly on WhatsApp. Don't miss any
          opportunity!
        </p>
        <a
          href="https://chat.whatsapp.com/EZ4w1JWnHPZBVPIiPfRclM"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center bg-[#25D366] hover:bg-[#1eb954] text-white font-semibold py-3 rounded-xl shadow-md transition-colors duration-200"
        >
          Join Now
        </a>
      </div>

      {/* Fade-in animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
