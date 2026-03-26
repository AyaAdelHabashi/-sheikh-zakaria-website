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
import { BookOpen, Mic, Video, FileText } from "lucide-react";

const WhatsNewSection = ({
  onNavigate,
  books,
  reflections,
  audioLectures,
  videoLectures,
  pamphlets,
}: {
  onNavigate: (page: string) => void;
  books: Book[];
  reflections: Reflection[];
  audioLectures: AudioLecture[];
  videoLectures: VideoLecture[];
  pamphlets: Pamphlet[];
}) => {
  // Combine all items and sort by createdAt
  const allItems = [
    ...books.map((b) => ({
      ...b,
      type: "book",
      typeLabel: "كتاب",
      icon: BookOpen,
      link: "library",
    })),
    ...reflections.map((r) => ({
      ...r,
      type: "reflection",
      typeLabel: "خاطرة",
      icon: FileText,
      link: "reflections",
    })),
    ...audioLectures.map((a) => ({
      ...a,
      type: "audio",
      typeLabel: "صوتية",
      icon: Mic,
      link: "audio",
    })),
    ...videoLectures.map((v) => ({
      ...v,
      type: "video",
      typeLabel: "مرئية",
      icon: Video,
      link: "video",
    })),
    ...pamphlets.map((p) => ({
      ...p,
      type: "pamphlet",
      typeLabel: "مطوية",
      icon: FileText,
      link: "pamphlets",
    })),
  ]
    .sort((a, b) => {
      const dateA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const dateB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return dateB - dateA;
    })
    .slice(0, 4);

  if (allItems.length === 0) return null;

  return (
    <section className="py-10 md:py-16 bg-emerald-50 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-gold-500 rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-bold font-amiri text-emerald-900">
              جديدنا
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {allItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={`${item.type}-${item.id}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => onNavigate(item.link)}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-emerald-100 cursor-pointer group flex flex-col h-full"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Icon className="w-3 h-3" />
                    {item.typeLabel}
                  </span>
                  {item.createdAt && (
                    <span className="text-emerald-600/60 text-xs">
                      {new Date(
                        item.createdAt.toDate
                          ? item.createdAt.toDate()
                          : Date.now(),
                      ).toLocaleDateString("ar-EG")}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-lg md:text-xl text-emerald-900 mb-3 font-amiri line-clamp-2 group-hover:text-gold-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-emerald-700/80 text-sm md:text-base line-clamp-2 mt-auto">
                  {"description" in item
                    ? item.description
                    : "text" in item
                      ? item.text
                      : "انقر للتفاصيل..."}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export { WhatsNewSection };
