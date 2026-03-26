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
import { Search, User, Menu, Video, X } from "lucide-react";

const Navbar = ({
  currentPage,
  onNavigate,
}: {
  currentPage: string;
  onNavigate: (page: string) => void;
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "الرئيسية", id: "home" },
    { name: "عن الشيخ", id: "about" },
    { name: "الكتب", id: "library" },
    { name: "الخواطر", id: "reflections" },
    { name: "المطويات", id: "pamphlets" },
    { name: "الصوتيات", id: "audio" },
    { name: "المرئيات", id: "video" },
    { name: "اتصل بنا", id: "contact" },
  ];

  const handleLinkClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (id === "library") {
      onNavigate("library");
    } else if (id === "about") {
      onNavigate("about");
    } else if (id === "audio") {
      onNavigate("audio");
    } else if (id === "video") {
      onNavigate("video");
    } else if (id === "reflections") {
      onNavigate("reflections");
    } else if (id === "pamphlets") {
      onNavigate("pamphlets");
    } else if (id === "contact") {
      onNavigate("contact");
    } else {
      onNavigate("home");
      // Scroll to section after a short delay if we just switched to home
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 bg-white/95 backdrop-blur-md shadow-md py-2`}
    >
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => onNavigate("home")}
        >
          <div className="w-10 h-10 bg-emerald-800 rounded-full flex items-center justify-center text-gold-400 font-bold text-xl border-2 border-gold-500">
            ز
          </div>
          <div className="flex flex-col justify-center text-emerald-900">
            <p className="text-sm font-medium leading-tight mb-2 text-emerald-700">
              الموقع الرسمي
            </p>
            <h1 className="text-lg font-bold font-amiri leading-none">
              للشيخ زكريا بن طه شحادة
            </h1>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive =
              currentPage === link.id ||
              (currentPage === "library" && link.id === "library");
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleLinkClick(e, link.id)}
                className={`text-emerald-800 hover:text-gold-600 font-medium transition-colors relative group ${isActive ? "!text-gold-600" : ""}`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-1 right-0 h-0.5 bg-gold-500 transition-all ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                ></span>
              </a>
            );
          })}
        </div>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={() => onNavigate("search")}
            className="text-emerald-800 hover:text-gold-600 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => onNavigate("admin")}
            className="text-emerald-800 hover:text-gold-600 transition-colors"
          >
            <User className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-emerald-800"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-emerald-100 overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className="text-emerald-900 font-medium hover:text-gold-600 py-2 border-b border-emerald-50"
                  onClick={(e) => handleLinkClick(e, link.id)}
                >
                  {link.name}
                </a>
              ))}
              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => {
                    onNavigate("search");
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-emerald-800"
                >
                  <Search className="w-4 h-4" /> بحث
                </button>
                <button
                  onClick={() => {
                    onNavigate("admin");
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-emerald-800"
                >
                  <User className="w-4 h-4" /> دخول المشرف
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export { Navbar };
