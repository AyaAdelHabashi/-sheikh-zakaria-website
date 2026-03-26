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
import { Button } from "./Button";
import { ChevronLeft, Video } from "lucide-react";

const ReflectionsSection = ({
  onNavigate,
  reflections,
}: {
  onNavigate: (page: string) => void;
  reflections: Reflection[];
}) => {
  const displayReflections = reflections.slice(0, 3);
  return (
    <section
      id="reflections"
      className="py-12 md:py-20 bg-emerald-900 text-white relative overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=2000&auto=format&fit=crop"
          alt="Reflections Background"
          className="w-full h-full object-cover opacity-20"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/90 to-emerald-900/90"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-16">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-amiri text-gold-100 mb-4">
              خواطر وفوائد
            </h2>
            <p className="text-emerald-200 text-lg md:text-xl lg:text-2xl">
              إشراقات إيمانية ولطائف قرآنية من فيض الخاطر
            </p>
          </div>
          <Button
            variant="outline"
            className="border-gold-500/50 text-gold-100 hover:bg-gold-500/10 mt-8 md:mt-0 text-base md:text-lg"
            onClick={() => onNavigate("reflections")}
          >
            أرشيف الخواطر
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {displayReflections.map((reflection) => (
            <div
              key={reflection.id}
              className="bg-emerald-800/50 backdrop-blur-sm border border-emerald-700 p-6 md:p-10 rounded-2xl hover:bg-emerald-800 transition-colors duration-300 flex flex-col h-full"
            >
              <div className="w-12 h-12 bg-gold-500/20 rounded-full flex items-center justify-center text-gold-400 mb-8">
                <span className="font-amiri text-3xl">❝</span>
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-6 font-amiri line-clamp-1">
                {reflection.title}
              </h3>
              <p className="text-emerald-200 mb-8 leading-relaxed text-base md:text-lg line-clamp-3 flex-1">
                {reflection.text}
              </p>
              <button
                onClick={() => onNavigate("reflections")}
                className="inline-flex items-center text-gold-400 hover:text-gold-300 font-medium transition-colors text-base md:text-lg mt-auto"
              >
                تصفح الخاطرة <ChevronLeft className="w-5 h-5 mr-1" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { ReflectionsSection };
