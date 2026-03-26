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
import { SectionHeader } from "./SectionHeader";
import { BookOpen, Video, Mic } from "lucide-react";

const MostPopularSection = () => {
  return (
    <section className="py-12 md:py-20 bg-ivory">
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeader
          title="الأكثر مشاهدة"
          subtitle="المحتوى الأكثر طلباً وتفاعلاً من الزوار"
        />
        <div className="grid md:grid-cols-3 gap-8">
          {/* Books */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-emerald-50">
            <div className="flex items-center gap-3 mb-8">
              <BookOpen className="w-6 h-6 text-gold-500" />
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-emerald-900 font-amiri">
                الكتب الأكثر قراءة
              </h3>
            </div>
            <ul className="space-y-6">
              {[
                { title: "فقه القلوب", views: "15.2k" },
                { title: "نور اليقين", views: "12.2k" },
                { title: "منهاج المسلم المعاصر", views: "12.2k" },
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-gold-500 font-bold text-base md:text-lg">
                      {i + 1}.
                    </span>
                    <span className="text-base md:text-lg text-emerald-800 group-hover:text-gold-600 transition-colors">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-sm md:text-base text-emerald-400 font-medium">
                    {item.views}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Videos */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-emerald-50">
            <div className="flex items-center gap-3 mb-8">
              <Video className="w-6 h-6 text-gold-500" />
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-emerald-900 font-amiri">
                المرئيات الأكثر مشاهدة
              </h3>
            </div>
            <ul className="space-y-6">
              {[
                { title: "خطبة: فضل العشر الأواخر", views: "15.2k" },
                { title: "قصص الأنبياء: يوسف", views: "12.2k" },
                { title: "ندوة الشباب", views: "12.2k" },
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-gold-500 font-bold text-base md:text-lg">
                      {i + 1}.
                    </span>
                    <span className="text-base md:text-lg text-emerald-800 group-hover:text-gold-600 transition-colors">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-sm md:text-base text-emerald-400 font-medium">
                    {item.views}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Audio */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-emerald-50">
            <div className="flex items-center gap-3 mb-8">
              <Mic className="w-6 h-6 text-gold-500" />
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-emerald-900 font-amiri">
                الصوتيات الأكثر استماعاً
              </h3>
            </div>
            <ul className="space-y-6">
              {[
                { title: "شرح حديث النيات", views: "15.2k" },
                { title: "تفسير سورة الكهف", views: "12.2k" },
                { title: "أحكام الصيام", views: "12.2k" },
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-gold-500 font-bold text-base md:text-lg">
                      {i + 1}.
                    </span>
                    <span className="text-base md:text-lg text-emerald-800 group-hover:text-gold-600 transition-colors">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-sm md:text-base text-emerald-400 font-medium">
                    {item.views}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export { MostPopularSection };
