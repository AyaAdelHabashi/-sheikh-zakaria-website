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
import { Play, ChevronLeft, Youtube, Video } from "lucide-react";

const VideoSection = ({
  onNavigate,
  videoLectures,
}: {
  onNavigate: (page: string) => void;
  videoLectures: VideoLecture[];
}) => {
  const displayVideos = videoLectures.slice(0, 3);
  return (
    <section id="video" className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeader
          title="المرئيات"
          subtitle="شاهد أحدث الخطب واللقاءات التلفزيونية"
        />

        <div className="grid md:grid-cols-3 gap-8">
          {displayVideos.map((video) => (
            <div
              key={video.id}
              className="group cursor-pointer flex flex-col h-full"
            >
              <div className="relative rounded-xl overflow-hidden aspect-video mb-4 shadow-md">
                <img
                  src={`https://img.youtube.com/vi/${video.youtubeUrl.split("v=")[1]?.split("&")[0] || video.youtubeUrl.split("/").pop()}/maxresdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div
                  className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center"
                  onClick={() => window.open(video.youtubeUrl, "_blank")}
                >
                  <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center text-emerald-900 shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-lg md:text-xl lg:text-2xl text-emerald-900 mb-3 group-hover:text-gold-600 transition-colors font-amiri line-clamp-1">
                {video.title}
              </h3>
              <p className="text-emerald-600/80 text-base md:text-lg line-clamp-2 leading-relaxed mb-4 flex-1">
                {video.description}
              </p>
              <button
                onClick={() => onNavigate("video")}
                className="text-gold-600 hover:text-gold-700 text-base md:text-lg font-bold flex items-center transition-colors mt-auto"
              >
                تصفح المقطع المرئي <ChevronLeft className="w-5 h-5 mr-1" />
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="primary" onClick={() => onNavigate("video")}>
            عرض جميع المرئيات
            <Youtube className="mr-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export { VideoSection };
