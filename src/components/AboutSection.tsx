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

const AboutSection = ({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) => {
  return (
    <section
      id="about"
      className="py-12 md:py-20 bg-ivory relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-10 opacity-60"></div>

      <div className="container mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-6 md:p-10 md:gap-16 items-center">
          <div className="order-2 md:order-1 relative">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl relative">
              <img
                src="https://images.unsplash.com/photo-1585036156171-384164a8c675?q=80&w=1000&auto=format&fit=crop"
                alt="Sheikh Zakaria Portrait"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-emerald-900/10"></div>
            </div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gold-100 rounded-full blur-2xl -z-10"></div>
          </div>

          <div className="order-1 md:order-2">
            <h2 className="text-gold-600 font-bold tracking-wider mb-4 text-lg md:text-xl lg:text-2xl">
              السيرة الذاتية
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-emerald-900 font-amiri mb-8">
              الشيخ زكريا بن طه شحادة
            </h3>
            <div className="space-y-6 text-emerald-800/80 leading-relaxed text-lg md:text-xl lg:text-2xl text-justify">
              <p>
                عالم جليل وداعية إسلامي، كرس حياته لخدمة العلم الشرعي والدعوة
                إلى الله. نشأ في بيت علم وصلاح، وحفظ القرآن الكريم في سن مبكرة.
                تتلمذ على يد كبار العلماء في عصره، ونهل من معين علمهم الصافي.
              </p>
              <p>
                تميز الشيخ بأسلوبه الحكيم في الدعوة، وسعة صدره في تعليم الناس،
                وحرصه على تأصيل المسائل الشرعية وربطها بواقع الناس المعاصر. له
                العديد من المؤلفات القيمة التي أثرت المكتبة الإسلامية، وسلاسل
                علمية ومحاضرات مسجلة انتفع بها الكثيرون.
              </p>
              <p>
                يشغل حالياً عدة مناصب علمية ودعوية، ويواصل عطاءه في نشر العلم
                وتزكية النفوس، سائلاً المولى عز وجل أن يتقبل منه وأن ينفع به
                الإسلام والمسلمين.
              </p>
            </div>
            <div className="mt-10">
              <Button variant="primary" onClick={() => onNavigate("about")}>
                اقرأ السيرة الكاملة
                <ChevronLeft className="mr-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { AboutSection };
