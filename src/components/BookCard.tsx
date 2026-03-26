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
import { BookOpen, Download, ChevronLeft, Video } from "lucide-react";

const BookCard = ({
  book,
  onDetails,
  categoryName,
}: {
  book: any;
  onDetails?: () => void;
  categoryName?: string;
  key?: React.Key;
}) => (
  <motion.div
    layout
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    whileHover={{ y: -10 }}
    className="bg-white rounded-xl overflow-hidden shadow-lg border border-emerald-50 hover:shadow-2xl transition-all duration-300 group flex flex-col h-full"
  >
    <div className="aspect-[2/3] overflow-hidden relative bg-emerald-100">
      <img
        src={book.imageUrl}
        alt={book.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      {categoryName && (
        <div className="absolute top-4 right-4 bg-gold-500 text-emerald-950 text-xs md:text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
          {categoryName}
        </div>
      )}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
        <a
          href={book.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-white rounded-full text-emerald-900 hover:bg-gold-400 transition-colors shadow-lg"
          title="قراءة"
        >
          <BookOpen className="w-5 h-5" />
        </a>
        <a
          href={book.pdfUrl}
          download
          className="p-3 bg-white rounded-full text-emerald-900 hover:bg-gold-400 transition-colors shadow-lg"
          title="تحميل"
        >
          <Download className="w-5 h-5" />
        </a>
      </div>
    </div>
    <div className="p-6 flex flex-col flex-1">
      <h3 className="font-bold text-lg md:text-xl lg:text-2xl text-emerald-900 mb-3 font-amiri line-clamp-1">
        {book.title}
      </h3>
      <p className="text-emerald-700/80 text-base md:text-lg mb-6 line-clamp-2 leading-relaxed flex-1">
        {book.description}
      </p>
      <div className="flex justify-between items-center pt-4 border-t border-emerald-50 mt-auto">
        <span className="text-base md:text-lg text-emerald-500 font-medium">
          PDF متوفر
        </span>
        <button
          onClick={onDetails}
          className="text-gold-600 hover:text-gold-700 text-base md:text-lg font-bold flex items-center transition-colors"
        >
          تصفح الكتاب <ChevronLeft className="w-5 h-5 mr-1" />
        </button>
      </div>
    </div>
  </motion.div>
);

export { BookCard };
