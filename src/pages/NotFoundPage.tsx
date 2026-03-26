import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Book,
  AudioLecture,
  VideoLecture,
  Reflection,
  Pamphlet,
  Message,
} from "../types";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const NotFoundPage = ({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 md:pt-32 pb-20 min-h-[85vh] flex items-center justify-center relative overflow-hidden bg-ivory">
      {/* Background Pattern */}
      <div className="absolute inset-0 islamic-pattern opacity-5 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          {/* Visual Element */}
          <div className="relative w-40 h-40 md:w-48 md:h-48 mx-auto mb-8">
            <div className="absolute inset-0 bg-emerald-100 rounded-full transform rotate-6 transition-transform hover:rotate-12"></div>
            <div className="absolute inset-0 bg-gold-100 rounded-full transform -rotate-6 transition-transform hover:-rotate-12"></div>
            <img
              src="https://images.unsplash.com/photo-1585036156171-384164a8c675?q=80&w=500&auto=format&fit=crop"
              alt="Islamic Library"
              className="absolute inset-0 w-full h-full object-cover rounded-full border-4 border-white shadow-md"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* 404 Number */}
          <h1 className="text-7xl md:text-9xl font-bold font-amiri text-emerald-900 mb-2 opacity-90">
            404
          </h1>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold font-amiri text-emerald-800 mb-4">
            الصفحة غير موجودة
          </h2>

          {/* Description */}
          <p className="text-lg text-emerald-700/80 mb-10 max-w-md mx-auto leading-relaxed">
            عذراً، يبدو أن الصفحة التي تبحث عنها غير موجودة أو تم نقلها. يمكنك
            العودة إلى الصفحة الرئيسية أو تصفح مكتبة الشيخ.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              onClick={() => onNavigate("home")}
              className="w-full sm:w-auto"
            >
              العودة للرئيسية
            </Button>
            <Button
              variant="outline"
              onClick={() => onNavigate("library")}
              className="w-full sm:w-auto"
            >
              <BookOpen className="ml-2 w-5 h-5 inline" />
              تصفح الكتب
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export { NotFoundPage };
import { Button } from "../components/Button";
import { BookOpen, Video } from "lucide-react";
