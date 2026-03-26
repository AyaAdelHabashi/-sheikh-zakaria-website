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
import { Video } from "lucide-react";

const SectionHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
  <div className="text-center mb-10 md:mb-16">
    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-emerald-900 mb-6 font-amiri">
      {title}
    </h2>
    {subtitle && (
      <p className="text-emerald-700/80 max-w-3xl mx-auto text-lg md:text-xl lg:text-2xl leading-relaxed">
        {subtitle}
      </p>
    )}
    <div className="h-1 w-24 bg-gold-400 mx-auto mt-6 rounded-full"></div>
  </div>
);

export { SectionHeader };
