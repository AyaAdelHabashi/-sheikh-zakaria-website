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

const SearchPage = ({
  onNavigate,
  books,
  audioLectures,
  videoLectures,
  reflections,
  pamphlets,
}: {
  onNavigate: (page: string) => void;
  books: Book[];
  audioLectures: AudioLecture[];
  videoLectures: VideoLecture[];
  reflections: Reflection[];
  pamphlets: Pamphlet[];
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filters = [
    { id: "all", label: "الكل" },
    { id: "books", label: "الكتب" },
    { id: "audio", label: "الصوتيات" },
    { id: "video", label: "المرئيات" },
    { id: "reflections", label: "الخواطر" },
    { id: "pamphlets", label: "المطويات" },
  ];

  const allResults = [
    ...books.map((b) => ({ ...b, type: "books", typeLabel: "كتاب" })),
    ...audioLectures.map((a) => ({
      ...a,
      type: "audio",
      typeLabel: "مقطع صوتي",
    })),
    ...videoLectures.map((v) => ({
      ...v,
      type: "video",
      typeLabel: "مقطع مرئي",
    })),
    ...reflections.map((r) => ({
      ...r,
      type: "reflections",
      typeLabel: "خاطرة",
    })),
    ...pamphlets.map((p) => ({ ...p, type: "pamphlets", typeLabel: "مطوية" })),
  ];

  const filteredResults = allResults.filter((item) => {
    const query = searchQuery.toLowerCase();
    const titleMatch = item.title?.toLowerCase().includes(query);
    const descMatch = (item as any).description?.toLowerCase().includes(query);
    const excerptMatch = (item as any).excerpt?.toLowerCase().includes(query);

    const matchesQuery = titleMatch || descMatch || excerptMatch;
    const matchesFilter = activeFilter === "all" || item.type === activeFilter;

    return matchesQuery && matchesFilter;
  });

  return (
    <div className="pt-20 min-h-screen bg-ivory">
      {/* Hero */}
      <section className="bg-emerald-950 py-10 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-5"></div>
        <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold font-amiri text-gold-50 mb-8">
            البحث في الموقع
          </h1>
          <div className="max-w-3xl mx-auto relative">
            <input
              type="text"
              placeholder="ابحث عن كتاب أو درس أو خاطرة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white rounded-full py-4 px-6 pr-14 text-emerald-950 focus:outline-none focus:ring-2 focus:ring-gold-500 text-lg shadow-lg"
            />
            <Search className="absolute right-5 top-1/2 transform -translate-y-1/2 text-emerald-600 w-6 h-6" />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-emerald-100 bg-white shadow-sm">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-center">
            <div className="relative w-full md:w-64">
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="w-full bg-emerald-50 border border-emerald-100 rounded-xl py-3 pr-4 pl-10 text-emerald-800 focus:outline-none focus:ring-2 focus:ring-gold-500/50 text-base font-bold shadow-sm appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23065f46%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[position:left_1rem_center] bg-[length:1.5em_1.5em] bg-no-repeat"
              >
                {filters.map((filter) => (
                  <option key={filter.id} value={filter.id}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          {filteredResults.length > 0 ? (
            <div className="space-y-4">
              {filteredResults.map((result, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.05, 0.5) }}
                  key={`${result.type}-${result.id}`}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50 hover:shadow-md transition-all flex flex-col sm:flex-row gap-6 items-start sm:items-center"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold px-3 py-1 bg-gold-50 text-gold-700 rounded-full">
                        {result.typeLabel}
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-emerald-950 font-amiri mb-2">
                      {result.title}
                    </h3>
                    <p className="text-emerald-700/80 text-base md:text-lg line-clamp-2">
                      {(result as any).description ||
                        (result as any).excerpt ||
                        "لا يوجد وصف متاح."}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="shrink-0 w-full sm:w-auto text-sm py-2"
                    onClick={() => {
                      if (result.type === "books") onNavigate("library");
                      else if (result.type === "audio") onNavigate("audio");
                      else if (result.type === "video") onNavigate("video");
                      else if (result.type === "reflections")
                        onNavigate("reflections");
                      else if (result.type === "pamphlets")
                        onNavigate("pamphlets");
                    }}
                  >
                    عرض المحتوى
                  </Button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 md:py-20">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-emerald-300" />
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-emerald-900 font-amiri mb-2">
                لم يتم العثور على نتائج مطابقة
              </h3>
              <p className="text-emerald-600">
                حاول البحث بكلمات مختلفة أو تصفح الأقسام مباشرة.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export { SearchPage };
import { Button } from "../components/Button";
import { Search, Video } from "lucide-react";
