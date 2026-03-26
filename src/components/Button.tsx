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

const Button = ({
  children,
  variant = "primary",
  className = "",
  icon: Icon,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "text";
  className?: string;
  icon?: any;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  const baseStyle =
    "inline-flex items-center justify-center px-6 py-3 rounded-lg transition-all duration-300 font-medium text-lg cursor-pointer";
  const variants = {
    primary:
      "bg-emerald-800 text-white hover:bg-emerald-900 shadow-lg hover:shadow-xl border border-transparent",
    secondary:
      "bg-gold-500 text-emerald-950 hover:bg-gold-400 shadow-md hover:shadow-lg border border-transparent",
    outline:
      "bg-transparent border-2 border-gold-500 text-emerald-900 hover:bg-gold-50",
    text: "bg-transparent text-emerald-800 hover:text-emerald-950 underline-offset-4 hover:underline p-0",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
      {Icon && <Icon className="mr-2 w-5 h-5" />}
    </button>
  );
};

export { Button };
