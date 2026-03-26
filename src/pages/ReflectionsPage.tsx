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

const ReflectionsPage = ({
  onNavigate,
  reflections,
}: {
  onNavigate: (page: string) => void;
  reflections: Reflection[];
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-ivory font-cairo" dir="rtl">
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-20 bg-emerald-900 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=2000&auto=format&fit=crop"
            alt="Islamic Reflections"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-emerald-950/70 mix-blend-multiply"></div>
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-amiri text-white mb-6">
            خواطر الشيخ
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
            إشراقات إيمانية ولطائف قرآنية، وخواطر قصيرة سطرها الشيخ حول الإيمان
            والعلم والحياة، لتكون تذكرة للقلوب.
          </p>
        </div>
      </section>

      {/* Reflections Grid */}
      <section className="py-12 md:py-20 bg-emerald-50/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reflections.map((reflection) => (
              <div
                key={reflection.id}
                className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-100 hover:shadow-md transition-all duration-300 group flex flex-col h-full"
              >
                <div className="text-gold-400 mb-6 opacity-50 group-hover:opacity-100 transition-opacity">
                  <span className="font-amiri text-5xl leading-none">❝</span>
                </div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-emerald-900 font-amiri mb-4 group-hover:text-emerald-700 transition-colors">
                  {reflection.title}
                </h3>
                <p className="text-base md:text-lg text-emerald-700/80 leading-relaxed mb-8 flex-1">
                  {reflection.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button variant="outline" className="px-12">
              تحميل المزيد من الخواطر
            </Button>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-10 md:py-16 md:py-24 bg-emerald-950 relative overflow-hidden flex items-center justify-center text-center px-4">
        <div className="islamic-pattern absolute inset-0 opacity-5"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/50 to-transparent"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-amiri text-white leading-relaxed mb-10">
            "الكتابة قيد للعلم، والخاطرة صيد للقلب، فقيّدوا صيدكم بالكتابة لئلا
            يفر."
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

      {/* Related Reflections */}
      <section className="py-12 md:py-20 bg-ivory">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHeader
            title="مواضيع ذات صلة"
            subtitle="خواطر أخرى قد تلامس قلبك"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "في رحاب القرآن",
                desc: "تأملات في آيات الذكر الحكيم وأثرها في هداية القلوب.",
                page: "reflections",
              },
              {
                title: "أخلاق المسلم",
                desc: "وقفات مع مكارم الأخلاق التي حث عليها الإسلام.",
                page: "reflections",
              },
              {
                title: "مناجاة ودعاء",
                desc: "كلمات رقيقة في التضرع واللجوء إلى الخالق سبحانه.",
                page: "reflections",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-50 hover:shadow-md transition-all cursor-pointer group text-center"
                onClick={() => onNavigate(item.page)}
              >
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6 group-hover:bg-gold-500 group-hover:text-white transition-colors">
                  <FileText className="w-8 h-8" />
                </div>
                <h4 className="text-lg md:text-xl lg:text-2xl font-bold text-emerald-900 font-amiri mb-4">
                  {item.title}
                </h4>
                <p className="text-base md:text-lg text-emerald-600/80 mb-6 line-clamp-2">
                  {item.desc}
                </p>
                <span className="text-gold-600 font-bold group-hover:text-gold-700 transition-colors">
                  تصفح القسم
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export { ReflectionsPage };
import { SectionHeader } from "../components/SectionHeader";
import { Button } from "../components/Button";
import { FileText, Video } from "lucide-react";
