import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "./firebase";
import AdminDashboard from "./AdminDashboard";
import {
  Book,
  AudioLecture,
  VideoLecture,
  Reflection,
  Pamphlet,
  Message,
} from "./types";
import { SectionHeader } from "./components/SectionHeader";
import { Button } from "./components/Button";
import { BookCard } from "./components/BookCard";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { WhatsNewSection } from "./components/WhatsNewSection";
import { AboutSection } from "./components/AboutSection";
import { BooksSection } from "./components/BooksSection";
import { ReflectionsSection } from "./components/ReflectionsSection";
import { AudioSection } from "./components/AudioSection";
import { VideoSection } from "./components/VideoSection";
import { PamphletsSection } from "./components/PamphletsSection";
import { QuoteSection } from "./components/QuoteSection";
import { MostPopularSection } from "./components/MostPopularSection";
import { Footer } from "./components/Footer";
import { LibraryPage } from "./pages/LibraryPage";
import { AboutPage } from "./pages/AboutPage";
import { AudioPage } from "./pages/AudioPage";
import { VideoPage } from "./pages/VideoPage";
import { ReflectionsPage } from "./pages/ReflectionsPage";
import { PamphletsPage } from "./pages/PamphletsPage";
import { SearchPage } from "./pages/SearchPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ContactPage } from "./pages/ContactPage";
import { TermsOfUsePage } from "./pages/TermsOfUsePage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import {
  BookOpen,
  Mic,
  Video,
  FileText,
  Heart,
  Users,
  Search,
  User,
  X,
  Menu,
  Play,
  Download,
  Share2,
  ChevronLeft,
  Facebook,
  Youtube,
  Send,
  Mail,
  Globe,
  ArrowUpRight,
} from "lucide-react";

// --- Types ---
// --- Components ---

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = (page: string) => {
    if (page === "home") {
      navigate("/");
    } else {
      navigate(`/${page}`);
    }
  };

  const currentPage =
    location.pathname === "/" ? "home" : location.pathname.slice(1);
  const isAdminPage = location.pathname === "/admin";

  const [books, setBooks] = useState<Book[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [audioLectures, setAudioLectures] = useState<AudioLecture[]>([]);
  const [videoLectures, setVideoLectures] = useState<VideoLecture[]>([]);
  const [pamphlets, setPamphlets] = useState<Pamphlet[]>([]);

  useEffect(() => {
    const qBooks = query(collection(db, "books"), orderBy("createdAt", "desc"));
    const unsubscribeBooks = onSnapshot(
      qBooks,
      (snapshot) => {
        setBooks(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Book),
        );
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, "books");
      },
    );

    const qReflections = query(
      collection(db, "reflections"),
      orderBy("createdAt", "desc"),
    );
    const unsubscribeReflections = onSnapshot(
      qReflections,
      (snapshot) => {
        setReflections(
          snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as Reflection,
          ),
        );
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, "reflections");
      },
    );

    const qAudio = query(collection(db, "audio"), orderBy("createdAt", "desc"));
    const unsubscribeAudio = onSnapshot(
      qAudio,
      (snapshot) => {
        setAudioLectures(
          snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as AudioLecture,
          ),
        );
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, "audio");
      },
    );

    const qVideos = query(
      collection(db, "videos"),
      orderBy("createdAt", "desc"),
    );
    const unsubscribeVideos = onSnapshot(
      qVideos,
      (snapshot) => {
        setVideoLectures(
          snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as VideoLecture,
          ),
        );
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, "videos");
      },
    );

    const qPamphlets = query(
      collection(db, "pamphlets"),
      orderBy("createdAt", "desc"),
    );
    const unsubscribePamphlets = onSnapshot(
      qPamphlets,
      (snapshot) => {
        setPamphlets(
          snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as Pamphlet,
          ),
        );
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, "pamphlets");
      },
    );

    return () => {
      unsubscribeBooks();
      unsubscribeReflections();
      unsubscribeAudio();
      unsubscribeVideos();
      unsubscribePamphlets();
    };
  }, []);

  return (
    <div className="min-h-screen font-sans bg-ivory text-emerald-950" dir="rtl">
      {!isAdminPage && (
        <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      )}

      <AnimatePresence mode="wait">
        {/* @ts-ignore - React Router Routes does accept key in React 19 but types might be outdated */}
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Hero onNavigate={handleNavigate} />
                <WhatsNewSection
                  onNavigate={handleNavigate}
                  books={books}
                  reflections={reflections}
                  audioLectures={audioLectures}
                  videoLectures={videoLectures}
                  pamphlets={pamphlets}
                />
                <AboutSection onNavigate={handleNavigate} />
                <BooksSection onNavigate={handleNavigate} books={books} />
                <ReflectionsSection
                  onNavigate={handleNavigate}
                  reflections={reflections}
                />
                <AudioSection
                  onNavigate={handleNavigate}
                  audioLectures={audioLectures}
                />
                <VideoSection
                  onNavigate={handleNavigate}
                  videoLectures={videoLectures}
                />
                <PamphletsSection
                  onNavigate={handleNavigate}
                  pamphlets={pamphlets}
                />
                <QuoteSection />
                <MostPopularSection />
              </motion.div>
            }
          />
          <Route
            path="/library"
            element={
              <motion.div
                key="library"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <LibraryPage books={books} />
              </motion.div>
            }
          />
          <Route
            path="/audio"
            element={
              <motion.div
                key="audio"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AudioPage
                  onNavigate={handleNavigate}
                  audioLectures={audioLectures}
                />
              </motion.div>
            }
          />
          <Route
            path="/video"
            element={
              <motion.div
                key="video"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <VideoPage
                  onNavigate={handleNavigate}
                  videoLectures={videoLectures}
                />
              </motion.div>
            }
          />
          <Route
            path="/reflections"
            element={
              <motion.div
                key="reflections"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ReflectionsPage
                  onNavigate={handleNavigate}
                  reflections={reflections}
                />
              </motion.div>
            }
          />
          <Route
            path="/admin"
            element={
              <motion.div
                key="admin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AdminDashboard onNavigate={handleNavigate} />
              </motion.div>
            }
          />
          <Route
            path="/pamphlets"
            element={
              <motion.div
                key="pamphlets"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PamphletsPage pamphlets={pamphlets} />
              </motion.div>
            }
          />
          <Route
            path="/search"
            element={
              <motion.div
                key="search"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SearchPage
                  onNavigate={handleNavigate}
                  books={books}
                  reflections={reflections}
                  audioLectures={audioLectures}
                  videoLectures={videoLectures}
                  pamphlets={pamphlets}
                />
              </motion.div>
            }
          />
          <Route
            path="/about"
            element={
              <motion.div
                key="about"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AboutPage onNavigate={handleNavigate} />
              </motion.div>
            }
          />
          <Route
            path="/contact"
            element={
              <motion.div
                key="contact"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ContactPage onNavigate={handleNavigate} />
              </motion.div>
            }
          />
          <Route
            path="/privacy"
            element={
              <motion.div
                key="privacy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PrivacyPolicyPage onNavigate={handleNavigate} />
              </motion.div>
            }
          />
          <Route
            path="/terms"
            element={
              <motion.div
                key="terms"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TermsOfUsePage onNavigate={handleNavigate} />
              </motion.div>
            }
          />
          <Route
            path="*"
            element={
              <motion.div
                key="notfound"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <NotFoundPage onNavigate={handleNavigate} />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>

      {!isAdminPage && <Footer onNavigate={handleNavigate} />}
    </div>
  );
}
