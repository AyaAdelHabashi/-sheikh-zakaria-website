import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Book,
  AudioLecture,
  VideoLecture,
  Reflection,
  Pamphlet,
  Message,
} from "../types";
import { Video } from "lucide-react";

const QuoteSection = () => {
  return (
    <section className="py-10 md:py-16 md:py-24 bg-emerald-950 relative overflow-hidden flex items-center justify-center text-center px-4">
      <div className="islamic-pattern absolute inset-0 opacity-5"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/50 to-transparent"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-gold-500 mb-6 opacity-80">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mx-auto"
          >
            <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
          </svg>
        </div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-amiri text-white leading-relaxed mb-10">
          "إنما يخشى الله من عباده العلماء، فالعلم ليس مجرد معلومات تُحفظ، بل هو
          نور يقذفه الله في القلب يورث الخشية والعمل."
        </h2>
        <div className="flex items-center justify-center gap-6">
          <div className="h-px w-16 bg-gold-500/50"></div>
          <p className="text-gold-400 font-bold text-lg md:text-xl lg:text-2xl font-amiri">
            الشيخ زكريا بن طه شحادة
          </p>
          <div className="h-px w-16 bg-gold-500/50"></div>
        </div>
      </div>
    </section>
  );
};

export { QuoteSection };
