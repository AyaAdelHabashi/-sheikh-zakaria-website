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

const LibraryPage = ({ books }: { books: Book[] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const categories = [
    { id: "all", name: "الكل" },
    { id: "الدعوة", name: "الدعوة" },
    { id: "العقيدة", name: "العقيدة" },
    { id: "الفقه", name: "الفقه" },
    { id: "التربية الإسلامية", name: "التربية الإسلامية" },
  ];

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.includes(searchQuery) ||
      book.description.includes(searchQuery);
    const matchesCategory =
      activeCategory === "all" || book.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const recommendedBooks = books
    .filter((b) => b.id !== selectedBook?.id)
    .slice(0, 4);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-20 bg-emerald-900 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop"
            alt="Islamic Library"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-emerald-950/60 mix-blend-multiply"></div>
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-amiri text-white mb-6">
            كتب الشيخ
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
            تحتوي هذه الصفحة على مؤلفات الشيخ زكريا الحيح العلمية والدعوية، تهدف
            لنشر العلم الشرعي وتوفير الهداية والمعرفة لطلاب العلم والباحثين.
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b border-emerald-100 shadow-sm">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full flex-1">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="ابحث عن كتاب..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-emerald-50/50 border border-emerald-100 rounded-xl py-3.5 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-gold-500/50 transition-all text-base shadow-sm"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <select
                    value={activeCategory}
                    onChange={(e) => setActiveCategory(e.target.value as any)}
                    className="w-full bg-white border border-emerald-100 rounded-xl py-3.5 pr-4 pl-10 text-emerald-800 focus:outline-none focus:ring-2 focus:ring-gold-500/50 text-base font-bold shadow-sm appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23065f46%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[position:left_1rem_center] bg-[length:1.5em_1.5em] bg-no-repeat"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  categoryName={
                    categories.find((c) => c.id === book.category)?.name
                  }
                  onDetails={() => setSelectedBook(book)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 md:py-20">
              <p className="text-emerald-600 text-lg">
                لم يتم العثور على كتب تطابق بحثك.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="mt-4 text-gold-600 font-bold hover:underline"
              >
                إعادة ضبط البحث
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-12 md:py-20 bg-emerald-900 relative overflow-hidden">
        <div className="islamic-pattern absolute inset-0 opacity-5"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="text-gold-500 text-6xl font-serif mb-4 block">
              "
            </span>
            <h2 className="text-lg md:text-xl lg:text-2xl md:text-3xl font-bold font-amiri text-white leading-relaxed mb-8">
              "العلم ليس بكثرة الرواية، إنما العلم نور يقذفه الله في القلب،
              وثمرته العمل والخشية، فمن لم يورثه علمه خشية فليس بعالم."
            </h2>
            <div className="h-px w-20 bg-gold-500/30 mx-auto mb-4"></div>
            <p className="text-gold-400 font-medium">من كتاب: فقه القلوب</p>
          </div>
        </div>
      </section>

      {/* Recommended Books */}
      <section className="py-12 md:py-20 bg-ivory">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHeader
            title="كتب مقترحة"
            subtitle="قد يهمك أيضاً قراءة هذه المؤلفات"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recommendedBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white p-4 rounded-xl shadow-sm border border-emerald-50 hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedBook(book)}
              >
                <div className="aspect-[2/3] rounded-lg overflow-hidden mb-4">
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-bold text-emerald-900 font-amiri text-center">
                  {book.title}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Book Details Modal */}
      <AnimatePresence>
        {selectedBook && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBook(null)}
              className="absolute inset-0 bg-emerald-950/60 backdrop-blur-sm"
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10"
            >
              <button
                onClick={() => setSelectedBook(null)}
                className="absolute top-6 left-6 p-2 text-emerald-400 hover:text-emerald-900 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="grid md:grid-cols-2 gap-8 md:gap-12 p-8 md:p-12">
                <div className="relative">
                  <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border-4 border-white">
                    <img
                      src={selectedBook.coverUrl}
                      alt={selectedBook.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gold-400/20 rounded-full blur-3xl -z-10"></div>
                </div>

                <div className="flex flex-col">
                  <div className="mb-6">
                    <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full mb-4">
                      {
                        categories.find((c) => c.id === selectedBook.category)
                          ?.name
                      }
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 font-amiri mb-4">
                      {selectedBook.title}
                    </h2>
                    <div className="flex gap-6 text-sm text-emerald-600 mb-6">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>{selectedBook.pages} صفحة</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowUpRight className="w-4 h-4" />
                        <span>سنة النشر: {selectedBook.year}م</span>
                      </div>
                    </div>
                  </div>

                  <div className="prose prose-emerald mb-8">
                    <h4 className="text-emerald-900 font-bold mb-2">
                      عن الكتاب:
                    </h4>
                    <p className="text-emerald-800/80 leading-relaxed text-lg">
                      {selectedBook.description} هذا الكتاب يعد من أبرز مؤلفات
                      الشيخ في هذا الباب، حيث يتناول المسائل بعمق وتأصيل شرعي
                      دقيق، مع مراعاة الواقع المعاصر وتقديم حلول عملية للمشكلات
                      التي تواجه المسلم اليوم.
                    </p>
                  </div>

                  <div className="mt-auto flex flex-wrap gap-4">
                    <Button variant="primary" className="flex-1">
                      تحميل الكتاب (PDF)
                      <Download className="mr-2 w-5 h-5" />
                    </Button>
                    <Button variant="outline" className="flex-1">
                      قراءة أونلاين
                      <BookOpen className="mr-2 w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { LibraryPage };
import { SectionHeader } from "../components/SectionHeader";
import { Button } from "../components/Button";
import { BookCard } from "../components/BookCard";
import {
  Search,
  FileText,
  ArrowUpRight,
  Download,
  BookOpen,
  Video,
  X,
} from "lucide-react";
