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
import { Facebook, Youtube, Send, Mail, Video } from "lucide-react";

const Footer = ({ onNavigate }: { onNavigate?: (page: string) => void }) => {
  return (
    <footer className="bg-emerald-950 text-emerald-100 pt-20 pb-10 border-t border-emerald-900 relative">
      <div className="islamic-pattern absolute inset-0 opacity-[0.02] pointer-events-none"></div>
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-16">
          {/* Column 1: About */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-900 rounded-full flex items-center justify-center text-gold-400 font-bold text-xl border border-gold-500/30">
                ز
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold font-amiri text-white">
                الشيخ زكريا بن طه شحادة
              </h3>
            </div>
            <p className="text-emerald-300/80 leading-relaxed mb-6 text-base md:text-lg">
              الموقع الرسمي لفضيلة الشيخ زكريا بن طه شحادة. يهدف إلى نشر العلم
              الشرعي الصحيح وتوثيق تراث الشيخ العلمي والدعوي.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-gold-600 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-gold-600 hover:text-white transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-gold-600 hover:text-white transition-colors"
              >
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 font-amiri">
              روابط هامة
            </h4>
            <ul className="space-y-3">
              {[
                { name: "الكتب والمؤلفات", id: "library" },
                { name: "المحاضرات الصوتية", id: "audio" },
                { name: "المرئيات", id: "video" },
                { name: "المطويات الدعوية", id: "pamphlets" },
                { name: "عن الشيخ", id: "about" },
                { name: "اتصل بنا", id: "contact" },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate?.(item.id);
                    }}
                    className="text-emerald-300/80 hover:text-gold-400 transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-gold-500/50 rounded-full"></span>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Latest */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 font-amiri">
              أحدث المحتويات
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3 group cursor-pointer">
                <div className="w-16 h-16 bg-emerald-900 rounded overflow-hidden shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=100&auto=format&fit=crop"
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <div>
                  <h5 className="text-white font-medium text-sm leading-snug mb-1 group-hover:text-gold-400 transition-colors">
                    تفسير قوله تعالى: "والضحى والليل إذا سجى"
                  </h5>
                  <span className="text-xs text-emerald-500">منذ يومين</span>
                </div>
              </li>
              <li className="flex gap-3 group cursor-pointer">
                <div className="w-16 h-16 bg-emerald-900 rounded overflow-hidden shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1585036156171-384164a8c675?q=80&w=100&auto=format&fit=crop"
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <div>
                  <h5 className="text-white font-medium text-sm leading-snug mb-1 group-hover:text-gold-400 transition-colors">
                    محاضرة: الثبات في زمن الفتن
                  </h5>
                  <span className="text-xs text-emerald-500">منذ أسبوع</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 font-amiri">
              تواصل معنا
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-emerald-300/80">
                <Mail className="w-5 h-5 text-gold-500" />
                <span dir="ltr" className="text-right w-full">
                  info@zakaria196.com
                </span>
              </li>
              <li className="flex items-center gap-3 text-emerald-300/80">
                <Send className="w-5 h-5 text-gold-500" />
                <span>قناة التيليجرام الرسمية</span>
              </li>
            </ul>

            {/* Site Stats Box */}
            <div className="mt-8 p-5 bg-emerald-900/40 rounded-lg border border-emerald-800/50">
              <h5 className="text-white font-bold mb-4 text-sm">
                إحصائيات الموقع
              </h5>
              <div className="flex items-center justify-between">
                <span className="text-emerald-300/80 text-sm">عدد الزوار:</span>
                <span className="bg-gold-600 text-white px-3 py-1 rounded text-sm font-bold">
                  51250
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-emerald-900/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-emerald-500/80">
          <p>© 2026 جميع الحقوق محفوظة للشيخ زكريا بن طه شحادة.</p>
          <div className="flex gap-6 items-center">
            <button
              onClick={() => onNavigate && onNavigate("privacy")}
              className="hover:text-gold-400 transition-colors"
            >
              سياسة الخصوصية
            </button>
            <button
              onClick={() => onNavigate && onNavigate("terms")}
              className="hover:text-gold-400 transition-colors"
            >
              شروط الاستخدام
            </button>
            {onNavigate && (
              <button
                onClick={() => onNavigate("admin")}
                className="text-emerald-400 hover:text-gold-400 transition-colors px-3 py-1 bg-emerald-900/50 rounded-full text-xs border border-emerald-800"
              >
                لوحة الإدارة
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
