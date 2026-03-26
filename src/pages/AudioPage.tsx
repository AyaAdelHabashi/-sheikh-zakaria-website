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

const AudioPage = ({
  onNavigate,
  audioLectures,
}: {
  onNavigate: (page: string) => void;
  audioLectures: AudioLecture[];
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const categories = [
    { id: "all", name: "جميع الدروس" },
    { id: "العقيدة", name: "العقيدة والإيمان" },
    { id: "الآداب والأخلاق", name: "الآداب والأخلاق" },
    { id: "الدعوة", name: "الدعوة" },
    { id: "خطب الجمعة", name: "خطب الجمعة" },
  ];

  const filteredLectures = audioLectures.filter((lecture) => {
    const matchesSearch =
      lecture.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lecture.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || lecture.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedLectures = [...filteredLectures].sort((a, b) => {
    if (sortBy === "newest") return b.createdAt?.seconds - a.createdAt?.seconds;
    return 0;
  });

  return (
    <div className="min-h-screen bg-ivory font-cairo" dir="rtl">
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-20 bg-emerald-900 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1557127318-19f63283712d?q=80&w=2000&auto=format&fit=crop"
            alt="Islamic Audio"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-emerald-950/60 mix-blend-multiply"></div>
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-amiri text-white mb-6">
            الدروس الصوتية
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
            مكتبة صوتية تضم تسجيلات لدروس ومحاضرات الشيخ، لتكون زاداً للمسلم في
            طريقه إلى الله.
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b border-emerald-100 shadow-sm">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full flex-1">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="ابحث عن درس أو موضوع..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-emerald-50/50 border border-emerald-100 rounded-xl py-3.5 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-gold-500/50 transition-all text-base shadow-sm"
                />
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-48">
                  <select
                    value={activeCategory}
                    onChange={(e) => setActiveCategory(e.target.value)}
                    className="w-full bg-white border border-emerald-100 rounded-xl py-3.5 pr-4 pl-10 text-emerald-800 focus:outline-none focus:ring-2 focus:ring-gold-500/50 text-base font-bold shadow-sm appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23065f46%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[position:left_1rem_center] bg-[length:1.5em_1.5em] bg-no-repeat"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative flex-1 md:w-48">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-white border border-emerald-100 rounded-xl py-3.5 pr-4 pl-10 text-emerald-800 focus:outline-none focus:ring-2 focus:ring-gold-500/50 text-base font-bold shadow-sm appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23065f46%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[position:left_1rem_center] bg-[length:1.5em_1.5em] bg-no-repeat"
                  >
                    <option value="newest">الأحدث</option>
                    <option value="listened">الأكثر استماعاً</option>
                    <option value="popular">الأكثر تفاعلاً</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Lecture */}
      <section className="py-10 md:py-16 bg-emerald-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-emerald-100 flex flex-col md:flex-row gap-8 md:gap-12 items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl -z-10"></div>

            <div className="flex-1">
              <span className="inline-block px-4 py-1 bg-gold-100 text-gold-700 rounded-full text-sm md:text-base font-bold mb-6">
                درس مميز
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-emerald-900 font-amiri mb-4">
                شرح العقيدة الواسطية - الدرس الأول
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl text-emerald-700/80 leading-relaxed mb-8">
                مقدمة هامة في دراسة العقيدة الإسلامية، وبيان أهمية التوحيد وأثره
                في حياة المسلم، مع شرح مبسط لمقدمة الإمام ابن تيمية رحمه الله.
              </p>
              <div className="flex items-center gap-6 text-base md:text-lg text-emerald-600 mb-8">
                <span className="flex items-center gap-2">
                  <Mic className="w-5 h-5" /> العقيدة
                </span>
                <span className="flex items-center gap-2">
                  <Play className="w-5 h-5" /> 1:15:00
                </span>
              </div>
              <div className="flex gap-4">
                <Button variant="primary" className="rounded-full px-8">
                  استمع الآن <Play className="mr-2 w-5 h-5 fill-current" />
                </Button>
                <button className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center hover:bg-emerald-100 transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="w-full md:w-1/3 aspect-square bg-emerald-900 rounded-2xl overflow-hidden relative shadow-2xl group cursor-pointer flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=800&auto=format&fit=crop"
                alt="Featured"
                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700"
              />
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 group-hover:bg-gold-500 group-hover:border-gold-500 transition-colors z-10">
                <Play className="w-8 h-8 fill-current ml-2" />
              </div>
              {/* Fake Audio Waveform */}
              <div className="absolute bottom-8 left-8 right-8 h-12 flex items-end justify-between gap-1 opacity-50">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="w-full bg-white rounded-t-sm"
                    style={{ height: `${Math.random() * 100}%` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audio List */}
      <section className="py-12 md:py-20 bg-ivory">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-5xl mx-auto space-y-6">
            {sortedLectures.map((audio) => (
              <div
                key={audio.id}
                className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-emerald-50 hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-center group"
              >
                <a
                  href={audio.soundcloudUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-800 group-hover:bg-gold-500 group-hover:text-white transition-colors shrink-0"
                >
                  <Play className="w-6 h-6 fill-current ml-1" />
                </a>

                <div className="flex-1 text-center md:text-right">
                  <h3 className="font-bold text-emerald-900 mb-2 text-lg md:text-xl lg:text-2xl font-amiri group-hover:text-emerald-700 transition-colors">
                    {audio.title}
                  </h3>
                  <p className="text-base md:text-lg text-emerald-600/80 mb-4 line-clamp-1">
                    {audio.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-center md:justify-start text-sm md:text-base text-emerald-500 gap-6">
                    <span className="flex items-center gap-2">
                      <Mic className="w-4 h-4" />{" "}
                      {categories.find((c) => c.id === audio.category)?.name ||
                        audio.category}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 shrink-0">
                  <a
                    href={audio.soundcloudUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 text-emerald-400 hover:text-emerald-800 transition-colors bg-emerald-50 rounded-full"
                    title="تحميل"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                  <button
                    className="p-3 text-emerald-400 hover:text-emerald-800 transition-colors bg-emerald-50 rounded-full"
                    title="مشاركة"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button variant="outline" className="px-12">
              عرض المزيد
            </Button>
          </div>
        </div>
      </section>

      {/* Quote Section */}
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
            "الاستماع إلى مجالس العلم تحفها الملائكة وتغشاها الرحمة، فاجعل لنفسك
            نصيباً منها لتزكي قلبك وتُنير دربك."
          </h2>
        </div>
      </section>

      {/* Related Lectures */}
      <section className="py-12 md:py-20 bg-ivory">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHeader
            title="سلاسل علمية مقترحة"
            subtitle="مجموعات متكاملة من الدروس في مواضيع محددة"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "سلسلة الدار الآخرة", count: 12 },
              { title: "شرح كتاب التوحيد", count: 24 },
              { title: "فقه الأسرة المسلمة", count: 8 },
            ].map((series, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-50 hover:shadow-md transition-all cursor-pointer group text-center"
              >
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6 group-hover:bg-gold-500 group-hover:text-white transition-colors">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h4 className="text-lg md:text-xl lg:text-2xl font-bold text-emerald-900 font-amiri mb-2">
                  {series.title}
                </h4>
                <p className="text-base md:text-lg text-emerald-500 mb-6">
                  {series.count} محاضرة
                </p>
                <span className="text-gold-600 font-bold group-hover:text-gold-700 transition-colors">
                  تصفح السلسلة
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export { AudioPage };
import { SectionHeader } from "../components/SectionHeader";
import { Button } from "../components/Button";
import {
  Search,
  Mic,
  Play,
  Download,
  Share2,
  BookOpen,
  Video,
} from "lucide-react";
