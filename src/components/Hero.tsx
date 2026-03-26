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
import { BookOpen, Video } from "lucide-react";

const Hero = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  return (
    <section
      id="home"
      className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=2000&auto=format&fit=crop"
          alt="Islamic Library Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/80 to-emerald-900/40"></div>
        <div className="absolute inset-0 islamic-pattern opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white text-right"
        >
          <div className="inline-block px-6 py-2 border border-gold-400/50 rounded-full text-gold-300 text-base md:text-lg mb-8 bg-emerald-950/30 backdrop-blur-sm">
            الموقع الرسمي
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-amiri mb-6 leading-tight text-gold-50">
            الشيخ زكريا بن طه شحادة
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-emerald-100 mb-10 max-w-2xl leading-relaxed font-light">
            منصة جامعة لحفظ ونشر تراث الشيخ زكريا بن طه شحادة من كتب ومحاضرات
            وخواطر، لتكون منارة للعلم الشرعي والدعوة إلى الله بالحكمة والموعظة
            الحسنة.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button variant="secondary" onClick={() => onNavigate("library")}>
              <BookOpen className="ml-2 w-5 h-5" />
              تصفح الكتب
            </Button>
            <Button
              variant="outline"
              className="text-white border-white hover:bg-white/10 hover:text-white"
            >
              <Video className="ml-2 w-5 h-5" />
              شاهد المرئيات
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden md:block relative"
        >
          <div className="relative z-10 rounded-2xl overflow-hidden border-4 border-gold-500/30 shadow-2xl max-w-md mx-auto transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
            {/* Placeholder for Sheikh's Image - Using a dignified placeholder */}
            <img
              src="https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1000&auto=format&fit=crop"
              alt="Sheikh Zakaria Al-Heh"
              className="w-full h-auto object-cover grayscale-[20%] sepia-[10%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 to-transparent"></div>
            <div className="absolute bottom-8 right-8 text-white">
              <p className="text-gold-400 font-amiri text-lg md:text-xl lg:text-2xl mb-2">
                {" "}
                الموقع الرسمي لفضيلة الشيخ
              </p>
              <h3 className="text-2xl md:text-3xl font-bold font-amiri">
                زكريا بن طه شحادة
              </h3>
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold font-amiri">
                "العلم نور يُهتدى به"
              </h2>
            </div>
          </div>
          {/* Decorative elements behind image */}
          <div className="absolute -top-6 -right-6 w-full h-full border-2 border-gold-500/20 rounded-2xl -z-10"></div>
          <div className="absolute -bottom-6 -left-6 w-full h-full bg-emerald-800/20 rounded-2xl -z-10 backdrop-blur-sm"></div>
        </motion.div>
      </div>
    </section>
  );
};

export { Hero };
