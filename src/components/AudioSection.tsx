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
import { SectionHeader } from "./SectionHeader";
import { Play, Mic, ChevronLeft, Download, Share2, Video } from "lucide-react";

const AudioSection = ({
  onNavigate,
  audioLectures,
}: {
  onNavigate: (page: string) => void;
  audioLectures: AudioLecture[];
}) => {
  const displayAudio = audioLectures.slice(0, 4);
  return (
    <section id="audio" className="py-12 md:py-20 bg-ivory">
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeader
          title="المحاضرات الصوتية"
          subtitle="استمع إلى أحدث الدروس والخطب والمحاضرات"
        />

        <div className="grid lg:grid-cols-2 gap-8">
          {displayAudio.map((audio) => (
            <div
              key={audio.id}
              className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 flex items-center gap-6 hover:shadow-md transition-shadow group"
            >
              <a
                href={audio.soundcloudUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 bg-emerald-800 rounded-full flex items-center justify-center text-white hover:bg-gold-500 transition-colors shrink-0"
              >
                <Play className="w-6 h-6 fill-current ml-1" />
              </a>
              <div className="flex-1">
                <h3 className="font-bold text-emerald-900 mb-2 text-lg md:text-xl lg:text-2xl font-amiri line-clamp-1">
                  {audio.title}
                </h3>
                <p className="text-emerald-600/80 text-base md:text-lg line-clamp-2 mb-3 leading-relaxed">
                  {audio.description}
                </p>
                <div className="flex items-center text-base md:text-lg text-emerald-600 gap-6">
                  <span className="flex items-center gap-2">
                    <Mic className="w-4 h-4" /> {audio.category}
                  </span>
                </div>
                <button
                  onClick={() => onNavigate("audio")}
                  className="text-gold-600 hover:text-gold-700 text-sm md:text-base font-bold flex items-center mt-2 transition-colors"
                >
                  تصفح المقطع الصوتي <ChevronLeft className="w-4 h-4 mr-1" />
                </button>
              </div>
              <div className="flex gap-3">
                <a
                  href={audio.soundcloudUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 text-emerald-400 hover:text-emerald-800 transition-colors bg-emerald-50 rounded-full"
                >
                  <Download className="w-5 h-5" />
                </a>
                <button className="p-3 text-emerald-400 hover:text-emerald-800 transition-colors bg-emerald-50 rounded-full">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button
            variant="text"
            className="text-emerald-800"
            onClick={() => onNavigate("audio")}
          >
            استعراض المكتبة الصوتية كاملة{" "}
            <ChevronLeft className="w-4 h-4 mr-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export { AudioSection };
