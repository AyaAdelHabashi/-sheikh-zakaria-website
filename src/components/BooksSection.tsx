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

const BooksSection = ({
  onNavigate,
  books,
}: {
  onNavigate: (page: string) => void;
  books: Book[];
}) => {
  const displayBooks = books.slice(0, 4);

  return (
    <section id="books" className="py-12 md:py-20 bg-white relative">
      <div className="islamic-pattern absolute inset-0 opacity-[0.02]"></div>
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <SectionHeader
          title="أحدث الإصدارات والمؤلفات"
          subtitle="مجموعة مختارة من كتب ومؤلفات الشيخ المتاحة للقراءة والتحميل"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onDetails={() => onNavigate("library")}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" onClick={() => onNavigate("library")}>
            عرض جميع الكتب
          </Button>
        </div>
      </div>
    </section>
  );
};

export { BooksSection };
import { Button } from "./Button";
import { SectionHeader } from "./SectionHeader";
import { BookCard } from "./BookCard";
import { Video } from "lucide-react";
