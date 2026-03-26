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
import { Download, ChevronLeft, Video } from "lucide-react";

const PamphletsSection = ({
  onNavigate,
  pamphlets,
}: {
  onNavigate: (page: string) => void;
  pamphlets: Pamphlet[];
}) => {
  const displayPamphlets = pamphlets.slice(0, 4);
  return (
    <section id="pamphlets" className="py-12 md:py-20 bg-emerald-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-amiri text-emerald-900">
            المطويات الدعوية
          </h2>
          <button
            onClick={() => onNavigate("pamphlets")}
            className="text-gold-600 hover:text-gold-700 font-bold mt-6 md:mt-0 text-lg md:text-xl lg:text-2xl"
          >
            عرض الكل
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {displayPamphlets.map((pamphlet) => (
            <div
              key={pamphlet.id}
              className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all text-center group flex flex-col h-full"
            >
              <div className="aspect-[2/3] bg-emerald-100 rounded-lg mb-4 overflow-hidden relative">
                <img
                  src={pamphlet.imageUrl}
                  alt={pamphlet.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <a
                  href={pamphlet.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <Download className="text-white w-10 h-10" />
                </a>
              </div>
              <h3 className="font-bold text-emerald-900 text-lg md:text-xl lg:text-2xl font-amiri mb-3 line-clamp-1">
                {pamphlet.title}
              </h3>
              <button
                onClick={() => onNavigate("pamphlets")}
                className="text-gold-600 hover:text-gold-700 text-base md:text-lg font-bold flex items-center justify-center transition-colors mt-auto"
              >
                تصفح المطوية <ChevronLeft className="w-5 h-5 mr-1" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { PamphletsSection };
