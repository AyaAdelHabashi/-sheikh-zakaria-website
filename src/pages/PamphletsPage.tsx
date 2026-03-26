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
import { Download, Video } from "lucide-react";

const PamphletsPage = ({ pamphlets }: { pamphlets: Pamphlet[] }) => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-20 bg-emerald-900 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1585036156171-384164a8c675?q=80&w=2000&auto=format&fit=crop"
            alt="Islamic Pamphlets"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-emerald-950/60 mix-blend-multiply"></div>
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-amiri text-white mb-6">
            المطويات الدعوية
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
            مجموعة من المطويات الدعوية والتعليمية التي أعدها فضيلة الشيخ لنشر
            العلم وتيسير الفهم.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-20 bg-ivory">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {pamphlets.map((pamphlet) => (
              <motion.div
                key={pamphlet.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all text-center group cursor-pointer"
                onClick={() => window.open(pamphlet.pdfUrl, "_blank")}
              >
                <div className="aspect-[2/3] bg-emerald-100 rounded-lg mb-4 overflow-hidden relative">
                  <img
                    src={pamphlet.imageUrl}
                    alt={pamphlet.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Download className="text-white w-10 h-10" />
                  </div>
                </div>
                <h3 className="font-bold text-emerald-900 text-lg md:text-xl lg:text-2xl font-amiri">
                  {pamphlet.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export { PamphletsPage };
