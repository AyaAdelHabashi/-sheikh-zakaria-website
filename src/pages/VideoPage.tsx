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

const VideoPage = ({
  onNavigate,
  videoLectures,
}: {
  onNavigate: (page: string) => void;
  videoLectures: VideoLecture[];
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const categories = [
    { id: "all", name: "جميع المرئيات" },
    { id: "محاضرات عامة", name: "محاضرات عامة" },
    { id: "خطب الجمعة", name: "خطب الجمعة" },
    { id: "دروس علمية", name: "دروس علمية" },
  ];

  const filteredVideos = videoLectures.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || video.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedVideos = [...filteredVideos].sort((a, b) => {
    if (sortBy === "newest") return b.createdAt?.seconds - a.createdAt?.seconds;
    return 0;
  });

  return (
    <div className="min-h-screen bg-ivory font-cairo" dir="rtl">
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-20 bg-emerald-900 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2000&auto=format&fit=crop"
            alt="Islamic Video"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-emerald-950/60 mix-blend-multiply"></div>
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-amiri text-white mb-6">
            الدروس المرئية
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
            مكتبة مرئية تضم تسجيلات لخطب ومحاضرات ودروس الشيخ، لنشر العلم وتيسير
            الوصول إليه.
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
                  placeholder="ابحث عن مقطع مرئي..."
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
                    <option value="viewed">الأكثر مشاهدة</option>
                    <option value="popular">الأكثر تفاعلاً</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Video */}
      <section className="py-10 md:py-16 bg-emerald-50">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHeader
            title="مقطع مميز"
            subtitle="اخترنا لكم هذا المقطع من درر الشيخ"
          />
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-emerald-100 mt-12">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <div className="aspect-video bg-emerald-950 rounded-2xl overflow-hidden relative shadow-inner group">
                  {/* Simulated YouTube Embed */}
                  <img
                    src="https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=1200&auto=format&fit=crop"
                    alt="Featured Video"
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:bg-red-700 transition-colors cursor-pointer">
                      <Play className="w-10 h-10 fill-current ml-2" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div className="h-full bg-red-600 w-1/3"></div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-4 flex flex-col justify-center">
                <span className="inline-block px-4 py-1 bg-gold-100 text-gold-700 rounded-full text-sm md:text-base font-bold mb-4 w-fit">
                  الأكثر مشاهدة هذا الأسبوع
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 font-amiri mb-4">
                  شرح كتاب التوحيد - الحلقة الأولى
                </h2>
                <p className="text-lg md:text-xl text-emerald-700/80 leading-relaxed mb-6">
                  مقدمة تأصيلية في أهمية التوحيد وفضله، وشرح لترجمة الإمام محمد
                  بن عبد الوهاب رحمه الله، وبيان مقاصد الكتاب.
                </p>
                <div className="flex items-center gap-6 text-base md:text-lg text-emerald-600 mb-8">
                  <span className="flex items-center gap-2">
                    <Video className="w-5 h-5" /> دروس علمية
                  </span>
                  <span className="flex items-center gap-2">
                    <Users className="w-5 h-5" /> 125k مشاهدة
                  </span>
                </div>
                <Button variant="primary" className="w-full md:w-auto">
                  شاهد السلسلة كاملة{" "}
                  <Play className="mr-2 w-5 h-5 fill-current" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Grid */}
      <section className="py-12 md:py-20 bg-ivory">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedVideos.map((video) => (
              <a
                key={video.id}
                href={video.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-emerald-50 hover:shadow-xl transition-all duration-300 group flex flex-col"
              >
                <div className="aspect-video relative overflow-hidden bg-emerald-900 cursor-pointer">
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeUrl.split("v=")[1]?.split("&")[0] || video.youtubeUrl.split("/").pop()}/maxresdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                    <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-emerald-900 shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-current ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs md:text-sm font-bold text-gold-600 bg-gold-50 px-3 py-1 rounded-full">
                      {categories.find((c) => c.id === video.category)?.name ||
                        video.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg md:text-xl lg:text-2xl text-emerald-900 mb-3 font-amiri group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-base md:text-lg text-emerald-600/80 mb-6 line-clamp-2 flex-1">
                    {video.description}
                  </p>
                  <div className="flex justify-end items-center pt-4 border-t border-emerald-50">
                    <span className="text-emerald-800 hover:text-gold-600 transition-colors flex items-center gap-2 text-base md:text-lg font-bold">
                      شاهد الآن <Play className="w-4 h-4 fill-current" />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button variant="outline" className="px-12">
              تحميل المزيد
            </Button>
          </div>
        </div>
      </section>

      {/* Related Videos */}
      <section className="py-12 md:py-20 bg-emerald-900 relative overflow-hidden">
        <div className="islamic-pattern absolute inset-0 opacity-5"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 font-amiri">
              قوائم تشغيل مقترحة
            </h2>
            <div className="h-1 w-24 bg-gold-400 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "سلسلة السيرة النبوية",
                count: 30,
                img: "https://images.unsplash.com/photo-1585036156171-384164a8c675?q=80&w=400&auto=format&fit=crop",
              },
              {
                title: "شرح الأربعين النووية",
                count: 42,
                img: "https://images.unsplash.com/photo-1564121211835-e88c852648ab?q=80&w=400&auto=format&fit=crop",
              },
              {
                title: "فتاوى رمضانية",
                count: 15,
                img: "https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?q=80&w=400&auto=format&fit=crop",
              },
              {
                title: "دروس العقيدة",
                count: 25,
                img: "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=400&auto=format&fit=crop",
              },
            ].map((playlist, i) => (
              <div
                key={i}
                className="relative rounded-xl overflow-hidden aspect-[4/3] group cursor-pointer shadow-lg"
              >
                <img
                  src={playlist.img}
                  alt={playlist.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/60 to-transparent opacity-90"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <div className="flex items-center gap-2 mb-2 text-gold-400">
                    <Video className="w-4 h-4" />
                    <span className="text-sm md:text-base">
                      {playlist.count} مقطع
                    </span>
                  </div>
                  <h4 className="text-lg md:text-xl font-bold font-amiri group-hover:text-gold-400 transition-colors">
                    {playlist.title}
                  </h4>
                </div>
                <div className="absolute top-4 left-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-5 h-5 fill-white ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export { VideoPage };
import { SectionHeader } from "../components/SectionHeader";
import { Button } from "../components/Button";
import { Search, Play, Video, Users, User } from "lucide-react";
