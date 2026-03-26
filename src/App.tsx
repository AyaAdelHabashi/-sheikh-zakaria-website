import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import AdminDashboard from './AdminDashboard';
import { 
  Search, 
  User, 
  Menu, 
  X, 
  BookOpen, 
  Video, 
  Mic, 
  FileText, 
  ChevronLeft, 
  Play, 
  Download, 
  Share2,
  Facebook,
  Youtube,
  Send, // For Telegram
  Mail,
  ArrowUpRight,
  Users,
  Heart,
  Globe,
  Phone,
  MapPin
} from 'lucide-react';

// --- Types ---
interface Book {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  pdfUrl: string;
  category: string;
  createdAt: any;
}

interface Reflection {
  id: string;
  title: string;
  text: string;
  createdAt: any;
}

interface AudioLecture {
  id: string;
  title: string;
  description: string;
  category: string;
  soundcloudUrl: string;
  createdAt: any;
}

interface VideoLecture {
  id: string;
  title: string;
  description: string;
  category: string;
  youtubeUrl: string;
  createdAt: any;
}

interface Pamphlet {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  pdfUrl: string;
  createdAt: any;
}

// --- Components ---

const SectionHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="text-center mb-10 md:mb-16">
    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-emerald-900 mb-6 font-amiri">{title}</h2>
    {subtitle && <p className="text-emerald-700/80 max-w-3xl mx-auto text-lg md:text-xl lg:text-2xl leading-relaxed">{subtitle}</p>}
    <div className="h-1 w-24 bg-gold-400 mx-auto mt-6 rounded-full"></div>
  </div>
);

const Button = ({ children, variant = 'primary', className = '', icon: Icon, onClick, disabled }: { children: React.ReactNode, variant?: 'primary' | 'secondary' | 'outline' | 'text', className?: string, icon?: any, onClick?: () => void, disabled?: boolean }) => {
  const baseStyle = "inline-flex items-center justify-center px-6 py-3 rounded-lg transition-all duration-300 font-medium text-lg cursor-pointer";
  const variants = {
    primary: "bg-emerald-800 text-white hover:bg-emerald-900 shadow-lg hover:shadow-xl border border-transparent",
    secondary: "bg-gold-500 text-emerald-950 hover:bg-gold-400 shadow-md hover:shadow-lg border border-transparent",
    outline: "bg-transparent border-2 border-gold-500 text-emerald-900 hover:bg-gold-50",
    text: "bg-transparent text-emerald-800 hover:text-emerald-950 underline-offset-4 hover:underline p-0"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
      {Icon && <Icon className="mr-2 w-5 h-5" />}
    </button>
  );
};

const BookCard = ({ book, onDetails, categoryName }: { book: any, onDetails?: () => void, categoryName?: string, key?: React.Key }) => (
  <motion.div 
    layout
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    whileHover={{ y: -10 }}
    className="bg-white rounded-xl overflow-hidden shadow-lg border border-emerald-50 hover:shadow-2xl transition-all duration-300 group flex flex-col h-full"
  >
    <div className="aspect-[2/3] overflow-hidden relative bg-emerald-100">
      <img 
        src={book.imageUrl} 
        alt={book.title} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      {categoryName && (
        <div className="absolute top-4 right-4 bg-gold-500 text-emerald-950 text-xs md:text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
          {categoryName}
        </div>
      )}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
        <a href={book.pdfUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-full text-emerald-900 hover:bg-gold-400 transition-colors shadow-lg" title="قراءة">
          <BookOpen className="w-5 h-5" />
        </a>
        <a href={book.pdfUrl} download className="p-3 bg-white rounded-full text-emerald-900 hover:bg-gold-400 transition-colors shadow-lg" title="تحميل">
          <Download className="w-5 h-5" />
        </a>
      </div>
    </div>
    <div className="p-6 flex flex-col flex-1">
      <h3 className="font-bold text-lg md:text-xl lg:text-2xl text-emerald-900 mb-3 font-amiri line-clamp-1">{book.title}</h3>
      <p className="text-emerald-700/80 text-base md:text-lg mb-6 line-clamp-2 leading-relaxed flex-1">{book.description}</p>
      <div className="flex justify-between items-center pt-4 border-t border-emerald-50 mt-auto">
        <span className="text-base md:text-lg text-emerald-500 font-medium">PDF متوفر</span>
        <button onClick={onDetails} className="text-gold-600 hover:text-gold-700 text-base md:text-lg font-bold flex items-center transition-colors">
          تصفح الكتاب <ChevronLeft className="w-5 h-5 mr-1" />
        </button>
      </div>
    </div>
  </motion.div>
);


const Navbar = ({ currentPage, onNavigate }: { currentPage: string, onNavigate: (page: string) => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    if (id === 'library') {
      onNavigate('library');
    } else if (id === 'about') {
      onNavigate('about');
    } else if (id === 'audio') {
      onNavigate('audio');
    } else if (id === 'video') {
      onNavigate('video');
    } else if (id === 'reflections') {
      onNavigate('reflections');
    } else if (id === 'pamphlets') {
      onNavigate('pamphlets');
    } else if (id === 'contact') {
      onNavigate('contact');
    } else {
      onNavigate('home');
      // Scroll to section after a short delay if we just switched to home
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 bg-white/95 backdrop-blur-md shadow-md py-2`}>
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
          <div className="w-10 h-10 bg-emerald-800 rounded-full flex items-center justify-center text-gold-400 font-bold text-xl border-2 border-gold-500">
            ز
          </div>
          <div className="flex flex-col justify-center text-emerald-900">
            <p className="text-sm font-medium leading-tight mb-2 text-emerald-700">الموقع الرسمي</p>
            <h1 className="text-lg font-bold font-amiri leading-none">للشيخ زكريا بن طه شحادة</h1>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = currentPage === link.id || (currentPage === 'library' && link.id === 'library');
            return (
              <a 
                key={link.id} 
                href={`#${link.id}`} 
                onClick={(e) => handleLinkClick(e, link.id)}
                className={`text-emerald-800 hover:text-gold-600 font-medium transition-colors relative group ${isActive ? '!text-gold-600' : ''}`}
              >
                {link.name}
                <span className={`absolute -bottom-1 right-0 h-0.5 bg-gold-500 transition-all ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </a>
            );
          })}
        </div>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <button onClick={() => onNavigate('search')} className="text-emerald-800 hover:text-gold-600 transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button onClick={() => onNavigate('admin')} className="text-emerald-800 hover:text-gold-600 transition-colors">
            <User className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden text-emerald-800"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
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
                <button onClick={() => { onNavigate('search'); setIsMobileMenuOpen(false); }} className="flex items-center gap-2 text-emerald-800">
                  <Search className="w-4 h-4" /> بحث
                </button>
                <button onClick={() => { onNavigate('admin'); setIsMobileMenuOpen(false); }} className="flex items-center gap-2 text-emerald-800">
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

const Hero = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  return (
    <section id="home" className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=2000&auto=format&fit=crop" 
          alt="Islamic Library Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/80 to-emerald-900/40"></div>
        <div className="absolute inset-0 islamic-pattern opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white text-right"
        >
          <div className="inline-block px-6 py-2 border border-gold-400/50 rounded-full text-gold-300 text-base md:text-lg mb-8 bg-emerald-950/30 backdrop-blur-sm">
            الموقع الرسمي
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-amiri mb-6 leading-tight text-gold-50">
            الشيخ زكريا بن طه شحادة
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-emerald-100 mb-10 max-w-2xl leading-relaxed font-light">
            منصة جامعة لحفظ ونشر تراث الشيخ زكريا بن طه شحادة من كتب ومحاضرات وخواطر، لتكون منارة للعلم الشرعي والدعوة إلى الله بالحكمة والموعظة الحسنة.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button variant="secondary" onClick={() => onNavigate('library')}>
              <BookOpen className="ml-2 w-5 h-5" />
              تصفح الكتب
            </Button>
            <Button variant="outline" className="text-white border-white hover:bg-white/10 hover:text-white">
              <Video className="ml-2 w-5 h-5" />
              شاهد المرئيات
            </Button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden md:block relative"
        >
          <div className="relative z-10 rounded-2xl overflow-hidden border-4 border-gold-500/30 shadow-2xl max-w-md mx-auto transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
             {/* Placeholder for Sheikh's Image - Using a dignified placeholder */}
            <img 
              src="https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1000&auto=format&fit=crop" 
              alt="Sheikh Zakaria Al-Heh" 
              className="w-full h-auto object-cover grayscale-[20%] sepia-[10%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 to-transparent"></div>
            <div className="absolute bottom-8 right-8 text-white">
              <p className="text-gold-400 font-amiri text-lg md:text-xl lg:text-2xl mb-2"> الموقع الرسمي لفضيلة الشيخ</p>
              <h3 className="text-2xl md:text-3xl font-bold font-amiri">زكريا بن طه شحادة</h3>
                         <h2 className="text-lg md:text-xl lg:text-2xl font-bold font-amiri">"العلم نور يُهتدى به"</h2></div>
          </div>
          {/* Decorative elements behind image */}
          <div className="absolute -top-6 -right-6 w-full h-full border-2 border-gold-500/20 rounded-2xl -z-10"></div>
          <div className="absolute -bottom-6 -left-6 w-full h-full bg-emerald-800/20 rounded-2xl -z-10 backdrop-blur-sm"></div>
        </motion.div>
      </div>
    </section>
  );
};

const WhatsNewSection = ({ 
  onNavigate, 
  books, 
  reflections, 
  audioLectures, 
  videoLectures, 
  pamphlets 
}: { 
  onNavigate: (page: string) => void, 
  books: Book[], 
  reflections: Reflection[], 
  audioLectures: AudioLecture[], 
  videoLectures: VideoLecture[], 
  pamphlets: Pamphlet[] 
}) => {
  // Combine all items and sort by createdAt
  const allItems = [
    ...books.map(b => ({ ...b, type: 'book', typeLabel: 'كتاب', icon: BookOpen, link: 'library' })),
    ...reflections.map(r => ({ ...r, type: 'reflection', typeLabel: 'خاطرة', icon: FileText, link: 'reflections' })),
    ...audioLectures.map(a => ({ ...a, type: 'audio', typeLabel: 'صوتية', icon: Mic, link: 'audio' })),
    ...videoLectures.map(v => ({ ...v, type: 'video', typeLabel: 'مرئية', icon: Video, link: 'video' })),
    ...pamphlets.map(p => ({ ...p, type: 'pamphlet', typeLabel: 'مطوية', icon: FileText, link: 'pamphlets' }))
  ].sort((a, b) => {
    const dateA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
    const dateB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
    return dateB - dateA;
  }).slice(0, 4);

  if (allItems.length === 0) return null;

  return (
    <section className="py-10 md:py-16 bg-emerald-50 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-gold-500 rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-bold font-amiri text-emerald-900">جديدنا</h2>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {allItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div 
                key={`${item.type}-${item.id}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => onNavigate(item.link)}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-emerald-100 cursor-pointer group flex flex-col h-full"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Icon className="w-3 h-3" />
                    {item.typeLabel}
                  </span>
                  {item.createdAt && (
                    <span className="text-emerald-600/60 text-xs">
                      {new Date(item.createdAt.toDate ? item.createdAt.toDate() : Date.now()).toLocaleDateString('ar-EG')}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-lg md:text-xl text-emerald-900 mb-3 font-amiri line-clamp-2 group-hover:text-gold-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-emerald-700/80 text-sm md:text-base line-clamp-2 mt-auto">
                  {('description' in item ? item.description : ('text' in item ? item.text : 'انقر للتفاصيل...'))}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const AboutSection = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  return (
    <section id="about" className="py-12 md:py-20 bg-ivory relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-10 opacity-60"></div>
      
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-6 md:p-10 md:gap-16 items-center">
          <div className="order-2 md:order-1 relative">
             <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl relative">
                <img 
                  src="https://images.unsplash.com/photo-1585036156171-384164a8c675?q=80&w=1000&auto=format&fit=crop" 
                  alt="Sheikh Zakaria Portrait" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-emerald-900/10"></div>
             </div>
             <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gold-100 rounded-full blur-2xl -z-10"></div>
          </div>
          
          <div className="order-1 md:order-2">
            <h2 className="text-gold-600 font-bold tracking-wider mb-4 text-lg md:text-xl lg:text-2xl">السيرة الذاتية</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-emerald-900 font-amiri mb-8">الشيخ زكريا بن طه شحادة</h3>
            <div className="space-y-6 text-emerald-800/80 leading-relaxed text-lg md:text-xl lg:text-2xl text-justify">
              <p>
                عالم جليل وداعية إسلامي، كرس حياته لخدمة العلم الشرعي والدعوة إلى الله. نشأ في بيت علم وصلاح، وحفظ القرآن الكريم في سن مبكرة. تتلمذ على يد كبار العلماء في عصره، ونهل من معين علمهم الصافي.
              </p>
              <p>
                تميز الشيخ بأسلوبه الحكيم في الدعوة، وسعة صدره في تعليم الناس، وحرصه على تأصيل المسائل الشرعية وربطها بواقع الناس المعاصر. له العديد من المؤلفات القيمة التي أثرت المكتبة الإسلامية، وسلاسل علمية ومحاضرات مسجلة انتفع بها الكثيرون.
              </p>
              <p>
                يشغل حالياً عدة مناصب علمية ودعوية، ويواصل عطاءه في نشر العلم وتزكية النفوس، سائلاً المولى عز وجل أن يتقبل منه وأن ينفع به الإسلام والمسلمين.
              </p>
            </div>
            <div className="mt-10">
              <Button variant="primary" onClick={() => onNavigate('about')}>
                اقرأ السيرة الكاملة
                <ChevronLeft className="mr-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const BooksSection = ({ onNavigate, books }: { onNavigate: (page: string) => void, books: Book[] }) => {
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
            <BookCard key={book.id} book={book} onDetails={() => onNavigate('library')} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="outline" onClick={() => onNavigate('library')}>عرض جميع الكتب</Button>
        </div>
      </div>
    </section>
  );
};

const ReflectionsSection = ({ onNavigate, reflections }: { onNavigate: (page: string) => void, reflections: Reflection[] }) => {
  const displayReflections = reflections.slice(0, 3);
  return (
    <section id="reflections" className="py-12 md:py-20 bg-emerald-900 text-white relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=2000&auto=format&fit=crop" 
          alt="Reflections Background" 
          className="w-full h-full object-cover opacity-20"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/90 to-emerald-900/90"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-16">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-amiri text-gold-100 mb-4">خواطر وفوائد</h2>
            <p className="text-emerald-200 text-lg md:text-xl lg:text-2xl">إشراقات إيمانية ولطائف قرآنية من فيض الخاطر</p>
          </div>
          <Button 
            variant="outline" 
            className="border-gold-500/50 text-gold-100 hover:bg-gold-500/10 mt-8 md:mt-0 text-base md:text-lg"
            onClick={() => onNavigate('reflections')}
          >
            أرشيف الخواطر
          </Button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {displayReflections.map((reflection) => (
            <div key={reflection.id} className="bg-emerald-800/50 backdrop-blur-sm border border-emerald-700 p-6 md:p-10 rounded-2xl hover:bg-emerald-800 transition-colors duration-300 flex flex-col h-full">
              <div className="w-12 h-12 bg-gold-500/20 rounded-full flex items-center justify-center text-gold-400 mb-8">
                <span className="font-amiri text-3xl">❝</span>
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-6 font-amiri line-clamp-1">{reflection.title}</h3>
              <p className="text-emerald-200 mb-8 leading-relaxed text-base md:text-lg line-clamp-3 flex-1">{reflection.text}</p>
              <button 
                onClick={() => onNavigate('reflections')}
                className="inline-flex items-center text-gold-400 hover:text-gold-300 font-medium transition-colors text-base md:text-lg mt-auto"
              >
                تصفح الخاطرة <ChevronLeft className="w-5 h-5 mr-1" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AudioSection = ({ onNavigate, audioLectures }: { onNavigate: (page: string) => void, audioLectures: AudioLecture[] }) => {
  const displayAudio = audioLectures.slice(0, 4);
  return (
    <section id="audio" className="py-12 md:py-20 bg-ivory">
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeader title="المحاضرات الصوتية" subtitle="استمع إلى أحدث الدروس والخطب والمحاضرات" />
        
        <div className="grid lg:grid-cols-2 gap-8">
          {displayAudio.map((audio) => (
            <div key={audio.id} className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 flex items-center gap-6 hover:shadow-md transition-shadow group">
              <a href={audio.soundcloudUrl} target="_blank" rel="noopener noreferrer" className="w-16 h-16 bg-emerald-800 rounded-full flex items-center justify-center text-white hover:bg-gold-500 transition-colors shrink-0">
                <Play className="w-6 h-6 fill-current ml-1" />
              </a>
              <div className="flex-1">
                <h3 className="font-bold text-emerald-900 mb-2 text-lg md:text-xl lg:text-2xl font-amiri line-clamp-1">{audio.title}</h3>
                <p className="text-emerald-600/80 text-base md:text-lg line-clamp-2 mb-3 leading-relaxed">{audio.description}</p>
                <div className="flex items-center text-base md:text-lg text-emerald-600 gap-6">
                  <span className="flex items-center gap-2"><Mic className="w-4 h-4" /> {audio.category}</span>
                </div>
                <button 
                  onClick={() => onNavigate('audio')}
                  className="text-gold-600 hover:text-gold-700 text-sm md:text-base font-bold flex items-center mt-2 transition-colors"
                >
                  تصفح المقطع الصوتي <ChevronLeft className="w-4 h-4 mr-1" />
                </button>
              </div>
              <div className="flex gap-3">
                <a href={audio.soundcloudUrl} target="_blank" rel="noopener noreferrer" className="p-3 text-emerald-400 hover:text-emerald-800 transition-colors bg-emerald-50 rounded-full"><Download className="w-5 h-5" /></a>
                <button className="p-3 text-emerald-400 hover:text-emerald-800 transition-colors bg-emerald-50 rounded-full"><Share2 className="w-5 h-5" /></button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
           <Button variant="text" className="text-emerald-800" onClick={() => onNavigate('audio')}>
             استعراض المكتبة الصوتية كاملة <ChevronLeft className="w-4 h-4 mr-1" />
           </Button>
        </div>
      </div>
    </section>
  );
};

const VideoSection = ({ onNavigate, videoLectures }: { onNavigate: (page: string) => void, videoLectures: VideoLecture[] }) => {
  const displayVideos = videoLectures.slice(0, 3);
  return (
    <section id="video" className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeader title="المرئيات" subtitle="شاهد أحدث الخطب واللقاءات التلفزيونية" />
        
        <div className="grid md:grid-cols-3 gap-8">
          {displayVideos.map((video) => (
            <div key={video.id} className="group cursor-pointer flex flex-col h-full">
              <div className="relative rounded-xl overflow-hidden aspect-video mb-4 shadow-md">
                <img 
                  src={`https://img.youtube.com/vi/${video.youtubeUrl.split('v=')[1]?.split('&')[0] || video.youtubeUrl.split('/').pop()}/maxresdefault.jpg`} 
                  alt={video.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center" onClick={() => window.open(video.youtubeUrl, '_blank')}>
                  <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center text-emerald-900 shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-lg md:text-xl lg:text-2xl text-emerald-900 mb-3 group-hover:text-gold-600 transition-colors font-amiri line-clamp-1">{video.title}</h3>
              <p className="text-emerald-600/80 text-base md:text-lg line-clamp-2 leading-relaxed mb-4 flex-1">{video.description}</p>
              <button 
                onClick={() => onNavigate('video')}
                className="text-gold-600 hover:text-gold-700 text-base md:text-lg font-bold flex items-center transition-colors mt-auto"
              >
                تصفح المقطع المرئي <ChevronLeft className="w-5 h-5 mr-1" />
              </button>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="primary" onClick={() => onNavigate('video')}>
            عرض جميع المرئيات
            <Youtube className="mr-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

const PamphletsSection = ({ onNavigate, pamphlets }: { onNavigate: (page: string) => void, pamphlets: Pamphlet[] }) => {
  const displayPamphlets = pamphlets.slice(0, 4);
  return (
    <section id="pamphlets" className="py-12 md:py-20 bg-emerald-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-amiri text-emerald-900">المطويات الدعوية</h2>
          <button onClick={() => onNavigate('pamphlets')} className="text-gold-600 hover:text-gold-700 font-bold mt-6 md:mt-0 text-lg md:text-xl lg:text-2xl">عرض الكل</button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {displayPamphlets.map((pamphlet) => (
            <div key={pamphlet.id} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all text-center group flex flex-col h-full">
              <div className="aspect-[2/3] bg-emerald-100 rounded-lg mb-4 overflow-hidden relative">
                <img src={pamphlet.imageUrl} alt={pamphlet.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <a href={pamphlet.pdfUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Download className="text-white w-10 h-10" />
                </a>
              </div>
              <h3 className="font-bold text-emerald-900 text-lg md:text-xl lg:text-2xl font-amiri mb-3 line-clamp-1">{pamphlet.title}</h3>
              <button 
                onClick={() => onNavigate('pamphlets')}
                className="text-gold-600 hover:text-gold-700 text-base md:text-lg font-bold flex items-center justify-center transition-colors mt-auto"
              >
                تصفح المطوية <ChevronLeft className="w-5 h-5 mr-1" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const QuoteSection = () => {
  return (
    <section className="py-10 md:py-16 md:py-24 bg-emerald-950 relative overflow-hidden flex items-center justify-center text-center px-4">
      <div className="islamic-pattern absolute inset-0 opacity-5"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/50 to-transparent"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-gold-500 mb-6 opacity-80">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
            <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
          </svg>
        </div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-amiri text-white leading-relaxed mb-10">
          "إنما يخشى الله من عباده العلماء، فالعلم ليس مجرد معلومات تُحفظ، بل هو نور يقذفه الله في القلب يورث الخشية والعمل."
        </h2>
        <div className="flex items-center justify-center gap-6">
          <div className="h-px w-16 bg-gold-500/50"></div>
          <p className="text-gold-400 font-bold text-lg md:text-xl lg:text-2xl font-amiri">الشيخ زكريا بن طه شحادة</p>
          <div className="h-px w-16 bg-gold-500/50"></div>
        </div>
      </div>
    </section>
  );
};

const LibraryPage = ({ books }: { books: Book[] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const categories = [
    { id: 'all', name: 'الكل' },
    { id: 'الدعوة', name: 'الدعوة' },
    { id: 'العقيدة', name: 'العقيدة' },
    { id: 'الفقه', name: 'الفقه' },
    { id: 'التربية الإسلامية', name: 'التربية الإسلامية' },
  ];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.includes(searchQuery) || book.description.includes(searchQuery);
    const matchesCategory = activeCategory === 'all' || book.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const recommendedBooks = books.filter(b => b.id !== selectedBook?.id).slice(0, 4);

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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-amiri text-white mb-6">كتب الشيخ</h1>
          <p className="text-lg md:text-xl lg:text-2xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
            تحتوي هذه الصفحة على مؤلفات الشيخ زكريا الحيح العلمية والدعوية، تهدف لنشر العلم الشرعي وتوفير الهداية والمعرفة لطلاب العلم والباحثين.
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
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
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
                  categoryName={categories.find(c => c.id === book.category)?.name}
                  onDetails={() => setSelectedBook(book)} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 md:py-20">
              <p className="text-emerald-600 text-lg">لم يتم العثور على كتب تطابق بحثك.</p>
              <button 
                onClick={() => {setSearchQuery(''); setActiveCategory('all');}}
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
            <span className="text-gold-500 text-6xl font-serif mb-4 block">"</span>
            <h2 className="text-lg md:text-xl lg:text-2xl md:text-3xl font-bold font-amiri text-white leading-relaxed mb-8">
              "العلم ليس بكثرة الرواية، إنما العلم نور يقذفه الله في القلب، وثمرته العمل والخشية، فمن لم يورثه علمه خشية فليس بعالم."
            </h2>
            <div className="h-px w-20 bg-gold-500/30 mx-auto mb-4"></div>
            <p className="text-gold-400 font-medium">من كتاب: فقه القلوب</p>
          </div>
        </div>
      </section>

      {/* Recommended Books */}
      <section className="py-12 md:py-20 bg-ivory">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHeader title="كتب مقترحة" subtitle="قد يهمك أيضاً قراءة هذه المؤلفات" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recommendedBooks.map((book) => (
              <div key={book.id} className="bg-white p-4 rounded-xl shadow-sm border border-emerald-50 hover:shadow-md transition-all cursor-pointer" onClick={() => setSelectedBook(book)}>
                <div className="aspect-[2/3] rounded-lg overflow-hidden mb-4">
                  <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-bold text-emerald-900 font-amiri text-center">{book.title}</h4>
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
                    <img src={selectedBook.coverUrl} alt={selectedBook.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gold-400/20 rounded-full blur-3xl -z-10"></div>
                </div>
                
                <div className="flex flex-col">
                  <div className="mb-6">
                    <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full mb-4">
                      {categories.find(c => c.id === selectedBook.category)?.name}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 font-amiri mb-4">{selectedBook.title}</h2>
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
                    <h4 className="text-emerald-900 font-bold mb-2">عن الكتاب:</h4>
                    <p className="text-emerald-800/80 leading-relaxed text-lg">
                      {selectedBook.description} هذا الكتاب يعد من أبرز مؤلفات الشيخ في هذا الباب، حيث يتناول المسائل بعمق وتأصيل شرعي دقيق، مع مراعاة الواقع المعاصر وتقديم حلول عملية للمشكلات التي تواجه المسلم اليوم.
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

const MostPopularSection = () => {
  return (
    <section className="py-12 md:py-20 bg-ivory">
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeader title="الأكثر مشاهدة" subtitle="المحتوى الأكثر طلباً وتفاعلاً من الزوار" />
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Books */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-emerald-50">
            <div className="flex items-center gap-3 mb-8">
              <BookOpen className="w-6 h-6 text-gold-500" />
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-emerald-900 font-amiri">الكتب الأكثر قراءة</h3>
            </div>
            <ul className="space-y-6">
              {[
                { title: "فقه القلوب", views: "15.2k" },
                { title: "نور اليقين", views: "12.2k" },
                { title: "منهاج المسلم المعاصر", views: "12.2k" },
              ].map((item, i) => (
                <li key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <span className="text-gold-500 font-bold text-base md:text-lg">{i + 1}.</span>
                    <span className="text-base md:text-lg text-emerald-800 group-hover:text-gold-600 transition-colors">{item.title}</span>
                  </div>
                  <span className="text-sm md:text-base text-emerald-400 font-medium">{item.views}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Videos */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-emerald-50">
            <div className="flex items-center gap-3 mb-8">
              <Video className="w-6 h-6 text-gold-500" />
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-emerald-900 font-amiri">المرئيات الأكثر مشاهدة</h3>
            </div>
            <ul className="space-y-6">
              {[
                { title: "خطبة: فضل العشر الأواخر", views: "15.2k" },
                { title: "قصص الأنبياء: يوسف", views: "12.2k" },
                { title: "ندوة الشباب", views: "12.2k" },
              ].map((item, i) => (
                <li key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <span className="text-gold-500 font-bold text-base md:text-lg">{i + 1}.</span>
                    <span className="text-base md:text-lg text-emerald-800 group-hover:text-gold-600 transition-colors">{item.title}</span>
                  </div>
                  <span className="text-sm md:text-base text-emerald-400 font-medium">{item.views}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Audio */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-emerald-50">
            <div className="flex items-center gap-3 mb-8">
              <Mic className="w-6 h-6 text-gold-500" />
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-emerald-900 font-amiri">الصوتيات الأكثر استماعاً</h3>
            </div>
            <ul className="space-y-6">
              {[
                { title: "شرح حديث النيات", views: "15.2k" },
                { title: "تفسير سورة الكهف", views: "12.2k" },
                { title: "أحكام الصيام", views: "12.2k" },
              ].map((item, i) => (
                <li key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <span className="text-gold-500 font-bold text-base md:text-lg">{i + 1}.</span>
                    <span className="text-base md:text-lg text-emerald-800 group-hover:text-gold-600 transition-colors">{item.title}</span>
                  </div>
                  <span className="text-sm md:text-base text-emerald-400 font-medium">{item.views}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};

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
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold font-amiri text-white">الشيخ زكريا بن طه شحادة</h3>
            </div>
            <p className="text-emerald-300/80 leading-relaxed mb-6 text-base md:text-lg">
              الموقع الرسمي لفضيلة الشيخ زكريا بن طه شحادة. يهدف إلى نشر العلم الشرعي الصحيح وتوثيق تراث الشيخ العلمي والدعوي.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-gold-600 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-gold-600 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-gold-600 hover:text-white transition-colors">
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Column 2: Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 font-amiri">روابط هامة</h4>
            <ul className="space-y-3">
              {[
                { name: 'الكتب والمؤلفات', id: 'library' },
                { name: 'المحاضرات الصوتية', id: 'audio' },
                { name: 'المرئيات', id: 'video' },
                { name: 'المطويات الدعوية', id: 'pamphlets' },
                { name: 'عن الشيخ', id: 'about' },
                { name: 'اتصل بنا', id: 'contact' }
              ].map((item) => (
                <li key={item.name}>
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); onNavigate?.(item.id); }}
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
            <h4 className="text-lg font-bold text-white mb-6 font-amiri">أحدث المحتويات</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 group cursor-pointer">
                <div className="w-16 h-16 bg-emerald-900 rounded overflow-hidden shrink-0">
                   <img src="https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=100&auto=format&fit=crop" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <h5 className="text-white font-medium text-sm leading-snug mb-1 group-hover:text-gold-400 transition-colors">تفسير قوله تعالى: "والضحى والليل إذا سجى"</h5>
                  <span className="text-xs text-emerald-500">منذ يومين</span>
                </div>
              </li>
              <li className="flex gap-3 group cursor-pointer">
                <div className="w-16 h-16 bg-emerald-900 rounded overflow-hidden shrink-0">
                   <img src="https://images.unsplash.com/photo-1585036156171-384164a8c675?q=80&w=100&auto=format&fit=crop" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <h5 className="text-white font-medium text-sm leading-snug mb-1 group-hover:text-gold-400 transition-colors">محاضرة: الثبات في زمن الفتن</h5>
                  <span className="text-xs text-emerald-500">منذ أسبوع</span>
                </div>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Contact */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 font-amiri">تواصل معنا</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-emerald-300/80">
                <Mail className="w-5 h-5 text-gold-500" />
                <span dir="ltr" className="text-right w-full">info@zakaria196.com</span>
              </li>
              <li className="flex items-center gap-3 text-emerald-300/80">
                <Send className="w-5 h-5 text-gold-500" />
                <span>قناة التيليجرام الرسمية</span>
              </li>
            </ul>
            
            {/* Site Stats Box */}
            <div className="mt-8 p-5 bg-emerald-900/40 rounded-lg border border-emerald-800/50">
              <h5 className="text-white font-bold mb-4 text-sm">إحصائيات الموقع</h5>
              <div className="flex items-center justify-between">
                <span className="text-emerald-300/80 text-sm">عدد الزوار:</span>
                <span className="bg-gold-600 text-white px-3 py-1 rounded text-sm font-bold">51250</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-emerald-900/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-emerald-500/80">
          <p>© 2026 جميع الحقوق محفوظة للشيخ زكريا بن طه شحادة.</p>
          <div className="flex gap-6 items-center">
            <button onClick={() => onNavigate && onNavigate('privacy')} className="hover:text-gold-400 transition-colors">سياسة الخصوصية</button>
            <button onClick={() => onNavigate && onNavigate('terms')} className="hover:text-gold-400 transition-colors">شروط الاستخدام</button>
            {onNavigate && (
              <button 
                onClick={() => onNavigate('admin')}
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

const AboutPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-ivory font-cairo" dir="rtl">
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-20 bg-emerald-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=2000&auto=format&fit=crop" 
            alt="Islamic Architecture" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-emerald-900/80 mix-blend-multiply"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-amiri text-white mb-6">سيرة الشيخ</h1>
          <p className="text-lg md:text-xl lg:text-2xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
            تستعرض هذه الصفحة مسيرة الشيخ العلمية والدعوية، ونشأته، وشيوخه، وإسهاماته في خدمة الإسلام والمسلمين.
          </p>
        </div>
      </section>

      {/* Biography Section */}
      <section className="py-12 md:py-20 relative">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start">
            <div className="md:col-span-5 relative">
              <div className="sticky top-32">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-white relative">
                  <img 
                    src="https://images.unsplash.com/photo-1585036156171-384164a8c675?q=80&w=1000&auto=format&fit=crop" 
                    alt="Sheikh Portrait" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-emerald-900/10"></div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gold-100 rounded-full blur-2xl -z-10"></div>
              </div>
            </div>
            
            <div className="md:col-span-7 space-y-12">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 font-amiri mb-6 flex items-center gap-4">
                  <span className="w-8 h-px bg-gold-500"></span>
                  النشأة والبدايات
                </h2>
                <p className="text-lg md:text-xl lg:text-2xl text-emerald-800/80 leading-relaxed text-justify">
                  ولد الشيخ زكريا بن طه شحادة في بيئة صالحة محبة للعلم والعلماء. نشأ على حب القرآن الكريم والسنة النبوية المطهرة، وبدأ حفظ القرآن في سن مبكرة حتى أتمه. ظهرت عليه علامات النبوغ والذكاء منذ صغره، مما دفع والديه لتوجيهه نحو طلب العلم الشرعي.
                </p>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 font-amiri mb-6 flex items-center gap-4">
                  <span className="w-8 h-px bg-gold-500"></span>
                  المسيرة العلمية
                </h2>
                <p className="text-lg md:text-xl lg:text-2xl text-emerald-800/80 leading-relaxed text-justify">
                  التحق بالمعاهد الشرعية وتدرج في طلب العلم الأكاديمي حتى نال أعلى الدرجات العلمية. لم يكتفِ بالدراسة الأكاديمية، بل جالس كبار العلماء والمشايخ، وقرأ عليهم أمهات الكتب في العقيدة والفقه والحديث والتفسير واللغة العربية، وحصل على إجازات علمية متعددة بأسانيد متصلة.
                </p>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 font-amiri mb-6 flex items-center gap-4">
                  <span className="w-8 h-px bg-gold-500"></span>
                  شيوخه وأساتذته
                </h2>
                <p className="text-lg md:text-xl lg:text-2xl text-emerald-800/80 leading-relaxed text-justify mb-4">
                  تتلمذ الشيخ على يد ثلة من كبار علماء العصر، منهم:
                </p>
                <ul className="list-disc list-inside text-lg md:text-xl lg:text-2xl text-emerald-800/80 space-y-4 marker:text-gold-500">
                  <li>الشيخ العلامة المحدث (اسم الشيخ)</li>
                  <li>الشيخ الفقيه (اسم الشيخ) في الفقه المقارن</li>
                  <li>الشيخ المقرئ (اسم الشيخ) في القراءات والتجويد</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 font-amiri mb-6 flex items-center gap-4">
                  <span className="w-8 h-px bg-gold-500"></span>
                  الجهود الدعوية
                </h2>
                <p className="text-lg md:text-xl lg:text-2xl text-emerald-800/80 leading-relaxed text-justify">
                  كرس الشيخ حياته لنشر العلم والدعوة إلى الله بالحكمة والموعظة الحسنة. تصدى للتدريس في المساجد والمعاهد، وله دروس راتبة في التفسير وشرح الحديث والفقه. يتميز أسلوبه بالوسطية والاعتدال، والحرص على جمع الكلمة وتأليف القلوب، مع العناية الفائقة بتزكية النفوس وربط المسلمين بدينهم.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-12 md:py-20 bg-emerald-50 overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHeader title="محطات في حياة الشيخ" subtitle="أبرز التواريخ والإنجازات في المسيرة العلمية والدعوية" />
          
          <div className="relative mt-16 max-w-4xl mx-auto">
            {/* Vertical Line */}
            <div className="hidden md:block absolute top-0 bottom-0 right-1/2 translate-x-1/2 w-1 bg-emerald-200 rounded-full"></div>
            
            <div className="flex flex-col gap-8 md:gap-12 px-4">
              {[
                { year: "1980", title: "الولادة والنشأة", desc: "ولد الشيخ في بيئة علمية وبدأ حفظ القرآن الكريم." },
                { year: "1998", title: "إتمام حفظ القرآن", desc: "أتم حفظ القرآن الكريم كاملاً مع إتقان أحكام التجويد." },
                { year: "2005", title: "الإجازة العلمية", desc: "حصل على الإجازة العالية في العلوم الشرعية من جامعة (اسم الجامعة)." },
                { year: "2010", title: "بداية التدريس", desc: "بدأ في إلقاء الدروس والمحاضرات في المساجد والمعاهد الشرعية." },
                { year: "2015", title: "أول مؤلفاته", desc: "أصدر كتابه الأول الذي لاقى قبولاً واسعاً بين طلبة العلم." },
              ].map((item, index) => (
                <div key={index} className={`relative flex flex-col md:flex-row items-center gap-8 group ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Timeline Dot */}
                  <div className="hidden md:flex w-8 h-8 absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-emerald-800 rounded-full border-4 border-emerald-50 items-center justify-center z-10 group-hover:scale-110 transition-transform">
                    <div className="w-2.5 h-2.5 bg-gold-400 rounded-full"></div>
                  </div>
                  
                  {/* Content Card */}
                  <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-100 hover:shadow-md transition-shadow text-center md:text-right flex flex-col items-center md:items-start">
                      <span className="inline-block px-6 py-2 bg-gold-100 text-gold-700 rounded-full text-base md:text-lg font-bold mb-6">{item.year}</span>
                      <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-emerald-900 font-amiri mb-4">{item.title}</h3>
                      <p className="text-base md:text-lg text-emerald-700/80 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  <div className="hidden md:block w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Scholarly Contributions */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHeader title="الإسهامات العلمية" subtitle="جهود الشيخ في نشر العلم وخدمة المجتمع" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: BookOpen, title: "المؤلفات والكتب", desc: "عشرات الكتب والرسائل العلمية في مختلف الفنون الشرعية." },
              { icon: Mic, title: "الدروس والمحاضرات", desc: "مئات الساعات الصوتية والمرئية في شرح المتون وتفسير القرآن." },
              { icon: Users, title: "التعليم والتوجيه", desc: "تخريج أجيال من طلبة العلم والدعاة المتميزين." },
              { icon: Heart, title: "الإصلاح المجتمعي", desc: "المشاركة الفاعلة في حل القضايا المجتمعية وإصلاح ذات البين." }
            ].map((item, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-100 text-center hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-600 rotate-3 hover:rotate-0 transition-transform">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-emerald-900 font-amiri mb-4">{item.title}</h3>
                <p className="text-base md:text-lg text-emerald-700/80 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-10 md:py-16 md:py-24 bg-emerald-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="islamic-pattern-quote" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M10 0L20 10L10 20L0 10Z" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              <circle cx="10" cy="10" r="5" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#islamic-pattern-quote)" />
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="w-16 h-16 mx-auto bg-gold-500/20 rounded-full flex items-center justify-center text-gold-400 mb-8">
            <span className="font-amiri text-4xl">❝</span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-amiri text-white leading-relaxed mb-10 max-w-4xl mx-auto">
            "العلم الحقيقي هو الذي يورث صاحبه خشية الله، والتواضع للخلق، والحرص على نفع الأمة في دينها ودنياها."
          </h2>
          <div className="flex items-center justify-center gap-6">
            <div className="h-px w-16 bg-gold-500/50"></div>
            <p className="text-gold-400 font-bold text-lg md:text-xl lg:text-2xl font-amiri">الشيخ زكريا بن طه شحادة</p>
            <div className="h-px w-16 bg-gold-500/50"></div>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-12 md:py-20 bg-emerald-50">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHeader title="معرض الصور" subtitle="لقطات من مجالس العلم والمشاركات الدعوية" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1564121211835-e88c852648ab?q=80&w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?q=80&w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=800&auto=format&fit=crop"
            ].map((img, index) => (
              <div key={index} className="aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group">
                <img 
                  src={img} 
                  alt={`Gallery Image ${index + 1}`} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const AudioPage = ({ onNavigate, audioLectures }: { onNavigate: (page: string) => void, audioLectures: AudioLecture[] }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const categories = [
    { id: 'all', name: 'جميع الدروس' },
    { id: 'العقيدة', name: 'العقيدة والإيمان' },
    { id: 'الآداب والأخلاق', name: 'الآداب والأخلاق' },
    { id: 'الدعوة', name: 'الدعوة' },
    { id: 'خطب الجمعة', name: 'خطب الجمعة' },
  ];

  const filteredLectures = audioLectures.filter(lecture => {
    const matchesSearch = lecture.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         lecture.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || lecture.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedLectures = [...filteredLectures].sort((a, b) => {
    if (sortBy === 'newest') return b.createdAt?.seconds - a.createdAt?.seconds;
    return 0;
  });

  return (
    <div className="min-h-screen bg-ivory font-cairo" dir="rtl">
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-20 bg-emerald-900 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1557127318-19f63283712d?q=80&w=2000&auto=format&fit=crop" 
            alt="Islamic Audio" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-emerald-950/60 mix-blend-multiply"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-amiri text-white mb-6">الدروس الصوتية</h1>
          <p className="text-lg md:text-xl lg:text-2xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
            مكتبة صوتية تضم تسجيلات لدروس ومحاضرات الشيخ، لتكون زاداً للمسلم في طريقه إلى الله.
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
                  placeholder="ابحث عن درس أو موضوع..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-emerald-50/50 border border-emerald-100 rounded-xl py-3.5 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-gold-500/50 transition-all text-base shadow-sm"
                />
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-48">
                  <select 
                    value={activeCategory}
                    onChange={(e) => setActiveCategory(e.target.value)}
                    className="w-full bg-white border border-emerald-100 rounded-xl py-3.5 pr-4 pl-10 text-emerald-800 focus:outline-none focus:ring-2 focus:ring-gold-500/50 text-base font-bold shadow-sm appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23065f46%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[position:left_1rem_center] bg-[length:1.5em_1.5em] bg-no-repeat"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="relative flex-1 md:w-48">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-white border border-emerald-100 rounded-xl py-3.5 pr-4 pl-10 text-emerald-800 focus:outline-none focus:ring-2 focus:ring-gold-500/50 text-base font-bold shadow-sm appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23065f46%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[position:left_1rem_center] bg-[length:1.5em_1.5em] bg-no-repeat"
                  >
                    <option value="newest">الأحدث</option>
                    <option value="listened">الأكثر استماعاً</option>
                    <option value="popular">الأكثر تفاعلاً</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Lecture */}
      <section className="py-10 md:py-16 bg-emerald-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-emerald-100 flex flex-col md:flex-row gap-8 md:gap-12 items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl -z-10"></div>
            
            <div className="flex-1">
              <span className="inline-block px-4 py-1 bg-gold-100 text-gold-700 rounded-full text-sm md:text-base font-bold mb-6">درس مميز</span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-emerald-900 font-amiri mb-4">شرح العقيدة الواسطية - الدرس الأول</h2>
              <p className="text-lg md:text-xl lg:text-2xl text-emerald-700/80 leading-relaxed mb-8">
                مقدمة هامة في دراسة العقيدة الإسلامية، وبيان أهمية التوحيد وأثره في حياة المسلم، مع شرح مبسط لمقدمة الإمام ابن تيمية رحمه الله.
              </p>
              <div className="flex items-center gap-6 text-base md:text-lg text-emerald-600 mb-8">
                <span className="flex items-center gap-2"><Mic className="w-5 h-5" /> العقيدة</span>
                <span className="flex items-center gap-2"><Play className="w-5 h-5" /> 1:15:00</span>
              </div>
              <div className="flex gap-4">
                <Button variant="primary" className="rounded-full px-8">
                  استمع الآن <Play className="mr-2 w-5 h-5 fill-current" />
                </Button>
                <button className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center hover:bg-emerald-100 transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="w-full md:w-1/3 aspect-square bg-emerald-900 rounded-2xl overflow-hidden relative shadow-2xl group cursor-pointer flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=800&auto=format&fit=crop" alt="Featured" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700" />
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 group-hover:bg-gold-500 group-hover:border-gold-500 transition-colors z-10">
                <Play className="w-8 h-8 fill-current ml-2" />
              </div>
              {/* Fake Audio Waveform */}
              <div className="absolute bottom-8 left-8 right-8 h-12 flex items-end justify-between gap-1 opacity-50">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="w-full bg-white rounded-t-sm" style={{ height: `${Math.random() * 100}%` }}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audio List */}
      <section className="py-12 md:py-20 bg-ivory">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-5xl mx-auto space-y-6">
            {sortedLectures.map((audio) => (
              <div key={audio.id} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-emerald-50 hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-center group">
                <a href={audio.soundcloudUrl} target="_blank" rel="noopener noreferrer" className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-800 group-hover:bg-gold-500 group-hover:text-white transition-colors shrink-0">
                  <Play className="w-6 h-6 fill-current ml-1" />
                </a>
                
                <div className="flex-1 text-center md:text-right">
                  <h3 className="font-bold text-emerald-900 mb-2 text-lg md:text-xl lg:text-2xl font-amiri group-hover:text-emerald-700 transition-colors">{audio.title}</h3>
                  <p className="text-base md:text-lg text-emerald-600/80 mb-4 line-clamp-1">{audio.description}</p>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start text-sm md:text-base text-emerald-500 gap-6">
                    <span className="flex items-center gap-2"><Mic className="w-4 h-4" /> {categories.find(c => c.id === audio.category)?.name || audio.category}</span>
                  </div>
                </div>
                
                <div className="flex gap-3 shrink-0">
                  <a href={audio.soundcloudUrl} target="_blank" rel="noopener noreferrer" className="p-3 text-emerald-400 hover:text-emerald-800 transition-colors bg-emerald-50 rounded-full" title="تحميل"><Download className="w-5 h-5" /></a>
                  <button className="p-3 text-emerald-400 hover:text-emerald-800 transition-colors bg-emerald-50 rounded-full" title="مشاركة"><Share2 className="w-5 h-5" /></button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button variant="outline" className="px-12">عرض المزيد</Button>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-10 md:py-16 md:py-24 bg-emerald-950 relative overflow-hidden flex items-center justify-center text-center px-4">
        <div className="islamic-pattern absolute inset-0 opacity-5"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/50 to-transparent"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-gold-500 mb-6 opacity-80">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
              <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-amiri text-white leading-relaxed mb-10">
            "الاستماع إلى مجالس العلم تحفها الملائكة وتغشاها الرحمة، فاجعل لنفسك نصيباً منها لتزكي قلبك وتُنير دربك."
          </h2>
        </div>
      </section>

      {/* Related Lectures */}
      <section className="py-12 md:py-20 bg-ivory">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHeader title="سلاسل علمية مقترحة" subtitle="مجموعات متكاملة من الدروس في مواضيع محددة" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "سلسلة الدار الآخرة", count: 12 },
              { title: "شرح كتاب التوحيد", count: 24 },
              { title: "فقه الأسرة المسلمة", count: 8 },
            ].map((series, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-50 hover:shadow-md transition-all cursor-pointer group text-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6 group-hover:bg-gold-500 group-hover:text-white transition-colors">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h4 className="text-lg md:text-xl lg:text-2xl font-bold text-emerald-900 font-amiri mb-2">{series.title}</h4>
                <p className="text-base md:text-lg text-emerald-500 mb-6">{series.count} محاضرة</p>
                <span className="text-gold-600 font-bold group-hover:text-gold-700 transition-colors">تصفح السلسلة</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const VideoPage = ({ onNavigate, videoLectures }: { onNavigate: (page: string) => void, videoLectures: VideoLecture[] }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const categories = [
    { id: 'all', name: 'جميع المرئيات' },
    { id: 'محاضرات عامة', name: 'محاضرات عامة' },
    { id: 'خطب الجمعة', name: 'خطب الجمعة' },
    { id: 'دروس علمية', name: 'دروس علمية' },
  ];

  const filteredVideos = videoLectures.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         video.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || video.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedVideos = [...filteredVideos].sort((a, b) => {
    if (sortBy === 'newest') return b.createdAt?.seconds - a.createdAt?.seconds;
    return 0;
  });

  return (
    <div className="min-h-screen bg-ivory font-cairo" dir="rtl">
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-20 bg-emerald-900 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2000&auto=format&fit=crop" 
            alt="Islamic Video" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-emerald-950/60 mix-blend-multiply"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-amiri text-white mb-6">الدروس المرئية</h1>
          <p className="text-lg md:text-xl lg:text-2xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
            مكتبة مرئية تضم تسجيلات لخطب ومحاضرات ودروس الشيخ، لنشر العلم وتيسير الوصول إليه.
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
                  placeholder="ابحث عن مقطع مرئي..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-emerald-50/50 border border-emerald-100 rounded-xl py-3.5 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-gold-500/50 transition-all text-base shadow-sm"
                />
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-48">
                  <select 
                    value={activeCategory}
                    onChange={(e) => setActiveCategory(e.target.value)}
                    className="w-full bg-white border border-emerald-100 rounded-xl py-3.5 pr-4 pl-10 text-emerald-800 focus:outline-none focus:ring-2 focus:ring-gold-500/50 text-base font-bold shadow-sm appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23065f46%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[position:left_1rem_center] bg-[length:1.5em_1.5em] bg-no-repeat"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="relative flex-1 md:w-48">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-white border border-emerald-100 rounded-xl py-3.5 pr-4 pl-10 text-emerald-800 focus:outline-none focus:ring-2 focus:ring-gold-500/50 text-base font-bold shadow-sm appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23065f46%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[position:left_1rem_center] bg-[length:1.5em_1.5em] bg-no-repeat"
                  >
                    <option value="newest">الأحدث</option>
                    <option value="viewed">الأكثر مشاهدة</option>
                    <option value="popular">الأكثر تفاعلاً</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Video */}
      <section className="py-10 md:py-16 bg-emerald-50">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHeader title="مقطع مميز" subtitle="اخترنا لكم هذا المقطع من درر الشيخ" />
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-emerald-100 mt-12">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <div className="aspect-video bg-emerald-950 rounded-2xl overflow-hidden relative shadow-inner group">
                  {/* Simulated YouTube Embed */}
                  <img src="https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=1200&auto=format&fit=crop" alt="Featured Video" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:bg-red-700 transition-colors cursor-pointer">
                      <Play className="w-10 h-10 fill-current ml-2" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div className="h-full bg-red-600 w-1/3"></div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-4 flex flex-col justify-center">
                <span className="inline-block px-4 py-1 bg-gold-100 text-gold-700 rounded-full text-sm md:text-base font-bold mb-4 w-fit">الأكثر مشاهدة هذا الأسبوع</span>
                <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 font-amiri mb-4">شرح كتاب التوحيد - الحلقة الأولى</h2>
                <p className="text-lg md:text-xl text-emerald-700/80 leading-relaxed mb-6">
                  مقدمة تأصيلية في أهمية التوحيد وفضله، وشرح لترجمة الإمام محمد بن عبد الوهاب رحمه الله، وبيان مقاصد الكتاب.
                </p>
                <div className="flex items-center gap-6 text-base md:text-lg text-emerald-600 mb-8">
                  <span className="flex items-center gap-2"><Video className="w-5 h-5" /> دروس علمية</span>
                  <span className="flex items-center gap-2"><Users className="w-5 h-5" /> 125k مشاهدة</span>
                </div>
                <Button variant="primary" className="w-full md:w-auto">
                  شاهد السلسلة كاملة <Play className="mr-2 w-5 h-5 fill-current" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Grid */}
      <section className="py-12 md:py-20 bg-ivory">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedVideos.map((video) => (
              <a 
                key={video.id} 
                href={video.youtubeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-emerald-50 hover:shadow-xl transition-all duration-300 group flex flex-col"
              >
                <div className="aspect-video relative overflow-hidden bg-emerald-900 cursor-pointer">
                  <img 
                    src={`https://img.youtube.com/vi/${video.youtubeUrl.split('v=')[1]?.split('&')[0] || video.youtubeUrl.split('/').pop()}/maxresdefault.jpg`} 
                    alt={video.title} 
                    className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                    <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-emerald-900 shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-current ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs md:text-sm font-bold text-gold-600 bg-gold-50 px-3 py-1 rounded-full">
                      {categories.find(c => c.id === video.category)?.name || video.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg md:text-xl lg:text-2xl text-emerald-900 mb-3 font-amiri group-hover:text-emerald-700 transition-colors line-clamp-2">{video.title}</h3>
                  <p className="text-base md:text-lg text-emerald-600/80 mb-6 line-clamp-2 flex-1">{video.description}</p>
                  <div className="flex justify-end items-center pt-4 border-t border-emerald-50">
                    <span className="text-emerald-800 hover:text-gold-600 transition-colors flex items-center gap-2 text-base md:text-lg font-bold">
                      شاهد الآن <Play className="w-4 h-4 fill-current" />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Button variant="outline" className="px-12">تحميل المزيد</Button>
          </div>
        </div>
      </section>

      {/* Related Videos */}
      <section className="py-12 md:py-20 bg-emerald-900 relative overflow-hidden">
        <div className="islamic-pattern absolute inset-0 opacity-5"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 font-amiri">قوائم تشغيل مقترحة</h2>
            <div className="h-1 w-24 bg-gold-400 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "سلسلة السيرة النبوية", count: 30, img: "https://images.unsplash.com/photo-1585036156171-384164a8c675?q=80&w=400&auto=format&fit=crop" },
              { title: "شرح الأربعين النووية", count: 42, img: "https://images.unsplash.com/photo-1564121211835-e88c852648ab?q=80&w=400&auto=format&fit=crop" },
              { title: "فتاوى رمضانية", count: 15, img: "https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?q=80&w=400&auto=format&fit=crop" },
              { title: "دروس العقيدة", count: 25, img: "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=400&auto=format&fit=crop" },
            ].map((playlist, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden aspect-[4/3] group cursor-pointer shadow-lg">
                <img src={playlist.img} alt={playlist.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/60 to-transparent opacity-90"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <div className="flex items-center gap-2 mb-2 text-gold-400">
                    <Video className="w-4 h-4" />
                    <span className="text-sm md:text-base">{playlist.count} مقطع</span>
                  </div>
                  <h4 className="text-lg md:text-xl font-bold font-amiri group-hover:text-gold-400 transition-colors">{playlist.title}</h4>
                </div>
                <div className="absolute top-4 left-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-5 h-5 fill-white ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const ReflectionsPage = ({ onNavigate, reflections }: { onNavigate: (page: string) => void, reflections: Reflection[] }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-ivory font-cairo" dir="rtl">
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-20 bg-emerald-900 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=2000&auto=format&fit=crop" 
            alt="Islamic Reflections" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-emerald-950/70 mix-blend-multiply"></div>
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-amiri text-white mb-6">خواطر الشيخ</h1>
          <p className="text-lg md:text-xl lg:text-2xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
            إشراقات إيمانية ولطائف قرآنية، وخواطر قصيرة سطرها الشيخ حول الإيمان والعلم والحياة، لتكون تذكرة للقلوب.
          </p>
        </div>
      </section>

      {/* Reflections Grid */}
      <section className="py-12 md:py-20 bg-emerald-50/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reflections.map((reflection) => (
              <div key={reflection.id} className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-100 hover:shadow-md transition-all duration-300 group flex flex-col h-full">
                <div className="text-gold-400 mb-6 opacity-50 group-hover:opacity-100 transition-opacity">
                  <span className="font-amiri text-5xl leading-none">❝</span>
                </div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-emerald-900 font-amiri mb-4 group-hover:text-emerald-700 transition-colors">{reflection.title}</h3>
                <p className="text-base md:text-lg text-emerald-700/80 leading-relaxed mb-8 flex-1">
                  {reflection.text}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Button variant="outline" className="px-12">تحميل المزيد من الخواطر</Button>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-10 md:py-16 md:py-24 bg-emerald-950 relative overflow-hidden flex items-center justify-center text-center px-4">
        <div className="islamic-pattern absolute inset-0 opacity-5"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/50 to-transparent"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-amiri text-white leading-relaxed mb-10">
            "الكتابة قيد للعلم، والخاطرة صيد للقلب، فقيّدوا صيدكم بالكتابة لئلا يفر."
          </h2>
          <div className="flex items-center justify-center gap-6">
            <div className="h-px w-16 bg-gold-500/50"></div>
            <p className="text-gold-400 font-bold text-lg md:text-xl lg:text-2xl font-amiri">الشيخ زكريا بن طه شحادة</p>
            <div className="h-px w-16 bg-gold-500/50"></div>
          </div>
        </div>
      </section>

      {/* Related Reflections */}
      <section className="py-12 md:py-20 bg-ivory">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHeader title="مواضيع ذات صلة" subtitle="خواطر أخرى قد تلامس قلبك" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "في رحاب القرآن", desc: "تأملات في آيات الذكر الحكيم وأثرها في هداية القلوب.", page: 'reflections' },
              { title: "أخلاق المسلم", desc: "وقفات مع مكارم الأخلاق التي حث عليها الإسلام.", page: 'reflections' },
              { title: "مناجاة ودعاء", desc: "كلمات رقيقة في التضرع واللجوء إلى الخالق سبحانه.", page: 'reflections' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-50 hover:shadow-md transition-all cursor-pointer group text-center" onClick={() => onNavigate(item.page)}>
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6 group-hover:bg-gold-500 group-hover:text-white transition-colors">
                  <FileText className="w-8 h-8" />
                </div>
                <h4 className="text-lg md:text-xl lg:text-2xl font-bold text-emerald-900 font-amiri mb-4">{item.title}</h4>
                <p className="text-base md:text-lg text-emerald-600/80 mb-6 line-clamp-2">{item.desc}</p>
                <span className="text-gold-600 font-bold group-hover:text-gold-700 transition-colors">تصفح القسم</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-amiri text-white mb-6">المطويات الدعوية</h1>
          <p className="text-lg md:text-xl lg:text-2xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
            مجموعة من المطويات الدعوية والتعليمية التي أعدها فضيلة الشيخ لنشر العلم وتيسير الفهم.
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
                onClick={() => window.open(pamphlet.pdfUrl, '_blank')}
              >
                <div className="aspect-[2/3] bg-emerald-100 rounded-lg mb-4 overflow-hidden relative">
                  <img src={pamphlet.imageUrl} alt={pamphlet.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Download className="text-white w-10 h-10" />
                  </div>
                </div>
                <h3 className="font-bold text-emerald-900 text-lg md:text-xl lg:text-2xl font-amiri">{pamphlet.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const SearchPage = ({ onNavigate, books, audioLectures, videoLectures, reflections, pamphlets }: { 
  onNavigate: (page: string) => void,
  books: Book[],
  audioLectures: AudioLecture[],
  videoLectures: VideoLecture[],
  reflections: Reflection[],
  pamphlets: Pamphlet[]
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filters = [
    { id: 'all', label: 'الكل' },
    { id: 'books', label: 'الكتب' },
    { id: 'audio', label: 'الصوتيات' },
    { id: 'video', label: 'المرئيات' },
    { id: 'reflections', label: 'الخواطر' },
    { id: 'pamphlets', label: 'المطويات' },
  ];

  const allResults = [
    ...books.map(b => ({ ...b, type: 'books', typeLabel: 'كتاب' })),
    ...audioLectures.map(a => ({ ...a, type: 'audio', typeLabel: 'مقطع صوتي' })),
    ...videoLectures.map(v => ({ ...v, type: 'video', typeLabel: 'مقطع مرئي' })),
    ...reflections.map(r => ({ ...r, type: 'reflections', typeLabel: 'خاطرة' })),
    ...pamphlets.map(p => ({ ...p, type: 'pamphlets', typeLabel: 'مطوية' }))
  ];

  const filteredResults = allResults.filter(item => {
    const query = searchQuery.toLowerCase();
    const titleMatch = item.title?.toLowerCase().includes(query);
    const descMatch = (item as any).description?.toLowerCase().includes(query);
    const excerptMatch = (item as any).excerpt?.toLowerCase().includes(query);
    
    const matchesQuery = titleMatch || descMatch || excerptMatch;
    const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
    
    return matchesQuery && matchesFilter;
  });

  return (
    <div className="pt-20 min-h-screen bg-ivory">
      {/* Hero */}
      <section className="bg-emerald-950 py-10 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-5"></div>
        <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold font-amiri text-gold-50 mb-8">البحث في الموقع</h1>
          <div className="max-w-3xl mx-auto relative">
            <input 
              type="text" 
              placeholder="ابحث عن كتاب أو درس أو خاطرة..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white rounded-full py-4 px-6 pr-14 text-emerald-950 focus:outline-none focus:ring-2 focus:ring-gold-500 text-lg shadow-lg"
            />
            <Search className="absolute right-5 top-1/2 transform -translate-y-1/2 text-emerald-600 w-6 h-6" />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-emerald-100 bg-white shadow-sm">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-center">
            <div className="relative w-full md:w-64">
              <select 
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="w-full bg-emerald-50 border border-emerald-100 rounded-xl py-3 pr-4 pl-10 text-emerald-800 focus:outline-none focus:ring-2 focus:ring-gold-500/50 text-base font-bold shadow-sm appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23065f46%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[position:left_1rem_center] bg-[length:1.5em_1.5em] bg-no-repeat"
              >
                {filters.map(filter => (
                  <option key={filter.id} value={filter.id}>{filter.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          {filteredResults.length > 0 ? (
            <div className="space-y-4">
              {filteredResults.map((result, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.05, 0.5) }}
                  key={`${result.type}-${result.id}`} 
                  className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50 hover:shadow-md transition-all flex flex-col sm:flex-row gap-6 items-start sm:items-center"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold px-3 py-1 bg-gold-50 text-gold-700 rounded-full">
                        {result.typeLabel}
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-emerald-950 font-amiri mb-2">{result.title}</h3>
                    <p className="text-emerald-700/80 text-base md:text-lg line-clamp-2">
                      {(result as any).description || (result as any).excerpt || "لا يوجد وصف متاح."}
                    </p>
                  </div>
                  <Button variant="outline" className="shrink-0 w-full sm:w-auto text-sm py-2" onClick={() => {
                    if (result.type === 'books') onNavigate('library');
                    else if (result.type === 'audio') onNavigate('audio');
                    else if (result.type === 'video') onNavigate('video');
                    else if (result.type === 'reflections') onNavigate('reflections');
                    else if (result.type === 'pamphlets') onNavigate('pamphlets');
                  }}>
                    عرض المحتوى
                  </Button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 md:py-20">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-emerald-300" />
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-emerald-900 font-amiri mb-2">لم يتم العثور على نتائج مطابقة</h3>
              <p className="text-emerald-600">حاول البحث بكلمات مختلفة أو تصفح الأقسام مباشرة.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const NotFoundPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 md:pt-32 pb-20 min-h-[85vh] flex items-center justify-center relative overflow-hidden bg-ivory">
      {/* Background Pattern */}
      <div className="absolute inset-0 islamic-pattern opacity-5 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          {/* Visual Element */}
          <div className="relative w-40 h-40 md:w-48 md:h-48 mx-auto mb-8">
            <div className="absolute inset-0 bg-emerald-100 rounded-full transform rotate-6 transition-transform hover:rotate-12"></div>
            <div className="absolute inset-0 bg-gold-100 rounded-full transform -rotate-6 transition-transform hover:-rotate-12"></div>
            <img 
              src="https://images.unsplash.com/photo-1585036156171-384164a8c675?q=80&w=500&auto=format&fit=crop" 
              alt="Islamic Library" 
              className="absolute inset-0 w-full h-full object-cover rounded-full border-4 border-white shadow-md"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* 404 Number */}
          <h1 className="text-7xl md:text-9xl font-bold font-amiri text-emerald-900 mb-2 opacity-90">
            404
          </h1>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold font-amiri text-emerald-800 mb-4">
            الصفحة غير موجودة
          </h2>

          {/* Description */}
          <p className="text-lg text-emerald-700/80 mb-10 max-w-md mx-auto leading-relaxed">
            عذراً، يبدو أن الصفحة التي تبحث عنها غير موجودة أو تم نقلها. يمكنك العودة إلى الصفحة الرئيسية أو تصفح مكتبة الشيخ.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" onClick={() => onNavigate('home')} className="w-full sm:w-auto">
              العودة للرئيسية
            </Button>
            <Button variant="outline" onClick={() => onNavigate('library')} className="w-full sm:w-auto">
              <BookOpen className="ml-2 w-5 h-5 inline" />
              تصفح الكتب
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const ContactPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        createdAt: serverTimestamp(),
        status: 'new'
      });
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error("Error sending message: ", error);
      alert("حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.");
      handleFirestoreError(error, OperationType.CREATE, 'messages');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-ivory">
      {/* Hero Section */}
      <div className="relative py-10 md:py-16 md:py-10 md:py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=2000&auto=format&fit=crop" 
            alt="Contact" 
            className="w-full h-full object-cover blur-sm"
          />
          <div className="absolute inset-0 bg-emerald-900/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/80 to-transparent" />
          <div className="absolute inset-0 islamic-pattern opacity-10"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-amiri text-white mb-6">تواصل معنا</h1>
            <p className="text-lg md:text-xl lg:text-2xl text-emerald-100/80 max-w-2xl mx-auto leading-relaxed">
              نسعد بتواصلكم معنا للإجابة على استفساراتكم المتعلقة بمؤلفات ومحاضرات الشيخ، أو لأي اقتراحات تساهم في تطوير الموقع.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Content */}
      <div className="container mx-auto px-4 md:px-8 py-10 md:py-16">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 max-w-6xl mx-auto">
          
          {/* Contact Info (Right Side in RTL) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-5 space-y-8"
          >
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-50">
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold font-amiri text-emerald-900 mb-6">معلومات التواصل</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center shrink-0 text-emerald-600">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-900 mb-1">البريد الإلكتروني</h4>
                    <p className="text-emerald-700/80 text-sm mb-1">للاستفسارات العامة والمراسلات</p>
                    <a href="mailto:info@zakaria-alheh.com" className="text-gold-600 hover:text-gold-700 font-medium inline-block" dir="ltr">info@zakaria-alheh.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center shrink-0 text-emerald-600">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-900 mb-1">الموقع الرسمي</h4>
                    <p className="text-emerald-700/80 text-sm mb-1">منصة الشيخ زكريا بن طه شحادة</p>
                    <a href="https://www.zakaria-alheh.com" className="text-gold-600 hover:text-gold-700 font-medium inline-block" dir="ltr">www.zakaria-alheh.com</a>
                  </div>
                </div>
              </div>

              <hr className="my-8 border-emerald-100" />

              <h4 className="font-bold text-emerald-900 mb-4">تابعنا على المنصات الاجتماعية</h4>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors">
                  <Send className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Optional Image/Decorative element */}
            <div className="relative h-48 rounded-2xl overflow-hidden shadow-sm hidden md:block">
              <div className="absolute inset-0 bg-emerald-900/20 mix-blend-multiply z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1584286595398-a59f21d313f5?q=80&w=800&auto=format&fit=crop" 
                alt="Islamic Architecture" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          {/* Contact Form (Left Side in RTL) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="md:col-span-7"
          >
            <div className="bg-white p-8 md:p-6 md:p-10 rounded-2xl shadow-sm border border-emerald-50">
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold font-amiri text-emerald-900 mb-6">أرسل رسالة</h3>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                {submitSuccess && (
                  <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-200 mb-6">
                    تم إرسال رسالتك بنجاح. شكراً لتواصلك معنا!
                  </div>
                )}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-emerald-900">الاسم الكريم</label>
                    <input 
                      type="text" 
                      id="name" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-emerald-100 bg-emerald-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-emerald-900">البريد الإلكتروني</label>
                    <input 
                      type="email" 
                      id="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-emerald-100 bg-emerald-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all text-right"
                      placeholder="example@domain.com"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-sm font-medium text-emerald-900">الموضوع</label>
                  <input 
                    type="text" 
                    id="subject" 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-emerald-100 bg-emerald-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
                    placeholder="عنوان الرسالة"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-emerald-900">نص الرسالة</label>
                  <textarea 
                    id="message" 
                    rows={6}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-emerald-100 bg-emerald-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all resize-none"
                    placeholder="اكتب رسالتك هنا..."
                  ></textarea>
                </div>

                <div className="pt-2">
                  <Button variant="primary" className="w-full md:w-auto px-10" disabled={isSubmitting}>
                    {isSubmitting ? 'جاري الإرسال...' : (
                      <>
                        <Send className="ml-2 w-5 h-5 rotate-180" />
                        إرسال الرسالة
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

const TermsOfUsePage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 pb-20 min-h-screen bg-ivory">
      {/* Hero Section */}
      <div className="relative py-10 md:py-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2000&auto=format&fit=crop" 
            alt="Terms" 
            className="w-full h-full object-cover blur-sm"
          />
          <div className="absolute inset-0 bg-emerald-900/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/80 to-transparent" />
          <div className="absolute inset-0 islamic-pattern opacity-10"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-amiri text-white mb-6">شروط الاستخدام</h1>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-8 py-10 md:py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-emerald-50 prose prose-emerald prose-lg rtl:prose-rtl max-w-none"
        >
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold font-amiri text-emerald-900 mb-4">1. قبول الشروط</h2>
          <p className="text-emerald-800/80 mb-8 leading-relaxed">
            مرحباً بك في الموقع الرسمي للشيخ زكريا بن طه شحادة. باستخدامك لهذا الموقع، فإنك توافق على الالتزام بشروط الاستخدام الموضحة أدناه. إذا كنت لا توافق على أي من هذه الشروط، يُرجى عدم استخدام الموقع.
          </p>

          <h2 className="text-lg md:text-xl lg:text-2xl font-bold font-amiri text-emerald-900 mb-4">2. حقوق الملكية الفكرية</h2>
          <p className="text-emerald-800/80 mb-8 leading-relaxed">
            جميع المحتويات المنشورة على هذا الموقع، بما في ذلك المقالات، الكتب، الصوتيات، المرئيات، والتصاميم، هي ملكية فكرية خاصة بالموقع أو مرخصة له. يُسمح بنشر المحتوى ومشاركته للأغراض الدعوية والتعليمية غير الربحية، بشرط الإشارة إلى المصدر وعدم التعديل على المحتوى.
          </p>

          <h2 className="text-lg md:text-xl lg:text-2xl font-bold font-amiri text-emerald-900 mb-4">3. استخدام الموقع</h2>
          <p className="text-emerald-800/80 mb-4 leading-relaxed">
            يتعهد المستخدم بما يلي عند استخدام الموقع:
          </p>
          <ul className="list-disc list-inside text-emerald-800/80 mb-8 space-y-2">
            <li>عدم استخدام الموقع لأي أغراض غير قانونية أو غير مصرح بها.</li>
            <li>عدم محاولة التدخل في عمل الموقع أو تعطيله أو الوصول غير المصرح به إلى أنظمته.</li>
            <li>عدم نشر أي محتوى مسيء، تشهيري، أو ينتهك حقوق الآخرين من خلال أي وسائل تواصل يوفرها الموقع.</li>
          </ul>

          <h2 className="text-lg md:text-xl lg:text-2xl font-bold font-amiri text-emerald-900 mb-4">4. إخلاء المسؤولية</h2>
          <p className="text-emerald-800/80 mb-8 leading-relaxed">
            يتم تقديم المحتوى على هذا الموقع "كما هو" لأغراض تعليمية ودعوية. نبذل قصارى جهدنا لضمان دقة المعلومات، ولكننا لا نتحمل أي مسؤولية قانونية عن أي أخطاء أو سهو، أو عن أي نتائج مترتبة على استخدام هذه المعلومات.
          </p>

          <h2 className="text-lg md:text-xl lg:text-2xl font-bold font-amiri text-emerald-900 mb-4">5. التعديلات على الشروط</h2>
          <p className="text-emerald-800/80 mb-8 leading-relaxed">
            نحتفظ بالحق في تعديل أو تحديث شروط الاستخدام في أي وقت دون إشعار مسبق. يُعتبر استمرارك في استخدام الموقع بعد إجراء أي تغييرات بمثابة قبول منك للشروط المعدلة.
          </p>

          <h2 className="text-lg md:text-xl lg:text-2xl font-bold font-amiri text-emerald-900 mb-4">6. التواصل معنا</h2>
          <p className="text-emerald-800/80 leading-relaxed">
            إذا كان لديك أي أسئلة أو استفسارات حول شروط الاستخدام، يرجى التواصل معنا عبر <button onClick={() => onNavigate('contact')} className="text-gold-600 hover:text-gold-700 underline underline-offset-4">صفحة اتصل بنا</button>.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

const PrivacyPolicyPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 pb-20 min-h-screen bg-ivory">
      {/* Hero Section */}
      <div className="relative py-10 md:py-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1508344928928-7165b67de128?q=80&w=2000&auto=format&fit=crop" 
            alt="Privacy" 
            className="w-full h-full object-cover blur-sm"
          />
          <div className="absolute inset-0 bg-emerald-900/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/80 to-transparent" />
          <div className="absolute inset-0 islamic-pattern opacity-10"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-amiri text-white mb-6">سياسة الخصوصية</h1>
          </motion.div>
        </div>
      </div>
      {/* Content */}
      <div className="container mx-auto px-4 md:px-8 py-10 md:py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-emerald-50 prose prose-emerald prose-lg rtl:prose-rtl max-w-none"
        >
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold font-amiri text-emerald-900 mb-4">مقدمة</h2>
          <p className="text-emerald-800/80 mb-8 leading-relaxed">
            نحن في الموقع الرسمي للشيخ زكريا بن طه شحادة نولي أهمية كبرى لخصوصية زوارنا. توضح سياسة الخصوصية هذه أنواع المعلومات الشخصية التي نجمعها وكيفية استخدامها وحمايتها.
          </p>

          <h2 className="text-lg md:text-xl lg:text-2xl font-bold font-amiri text-emerald-900 mb-4">المعلومات التي نجمعها</h2>
          <p className="text-emerald-800/80 mb-4 leading-relaxed">
            قد نقوم بجمع المعلومات التالية عند زيارتك للموقع أو استخدامك لخدماته:
          </p>
          <ul className="list-disc list-inside text-emerald-800/80 mb-8 space-y-2">
            <li><strong>المعلومات التي تقدمها طواعية:</strong> مثل الاسم والبريد الإلكتروني عند استخدام نموذج "اتصل بنا" أو الاشتراك في النشرة البريدية.</li>
            <li><strong>المعلومات التلقائية:</strong> مثل عنوان بروتوكول الإنترنت (IP)، نوع المتصفح، الصفحات التي تزورها، ووقت وتاريخ الزيارة، وذلك لأغراض إحصائية ولتحسين تجربة المستخدم.</li>
          </ul>

          <h2 className="text-lg md:text-xl lg:text-2xl font-bold font-amiri text-emerald-900 mb-4">كيف نستخدم معلوماتك</h2>
          <p className="text-emerald-800/80 mb-4 leading-relaxed">
            نستخدم المعلومات التي نجمعها للأغراض التالية:
          </p>
          <ul className="list-disc list-inside text-emerald-800/80 mb-8 space-y-2">
            <li>الرد على استفساراتك ورسائلك.</li>
            <li>تحسين جودة الموقع والمحتوى المقدم.</li>
            <li>إرسال تحديثات دورية حول المحاضرات والكتب الجديدة (إذا اخترت الاشتراك).</li>
            <li>تحليل استخدام الموقع لفهم احتياجات الزوار بشكل أفضل.</li>
          </ul>

          <h2 className="text-lg md:text-xl lg:text-2xl font-bold font-amiri text-emerald-900 mb-4">حماية المعلومات</h2>
          <p className="text-emerald-800/80 mb-8 leading-relaxed">
            نحن نتخذ إجراءات أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التعديل أو الإفشاء أو الإتلاف. لا نقوم ببيع أو تأجير أو مشاركة معلوماتك الشخصية مع أطراف ثالثة لأغراض تسويقية.
          </p>

          <h2 className="text-lg md:text-xl lg:text-2xl font-bold font-amiri text-emerald-900 mb-4">ملفات تعريف الارتباط (Cookies)</h2>
          <p className="text-emerald-800/80 mb-8 leading-relaxed">
            قد يستخدم الموقع ملفات تعريف الارتباط لتحسين تجربة التصفح الخاصة بك. يمكنك ضبط إعدادات متصفحك لرفض كل ملفات تعريف الارتباط أو لتنبيهك عند إرسالها. ومع ذلك، قد لا تعمل بعض ميزات الموقع بشكل صحيح إذا قمت بتعطيلها.
          </p>

          <h2 className="text-lg md:text-xl lg:text-2xl font-bold font-amiri text-emerald-900 mb-4">تحديثات سياسة الخصوصية</h2>
          <p className="text-emerald-800/80 mb-8 leading-relaxed">
            قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سيتم نشر أي تغييرات على هذه الصفحة، ونشجعك على مراجعتها بشكل دوري لتبقى على اطلاع بكيفية حماية معلوماتك.
          </p>

          <h2 className="text-lg md:text-xl lg:text-2xl font-bold font-amiri text-emerald-900 mb-4">اتصل بنا</h2>
          <p className="text-emerald-800/80 leading-relaxed">
            إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى <button onClick={() => onNavigate('contact')} className="text-gold-600 hover:text-gold-700 underline underline-offset-4">التواصل معنا</button>.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = (page: string) => {
    if (page === 'home') {
      navigate('/');
    } else {
      navigate(`/${page}`);
    }
  };

  const currentPage = location.pathname === '/' ? 'home' : location.pathname.slice(1);
  const isAdminPage = location.pathname === '/admin';

  const [books, setBooks] = useState<Book[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [audioLectures, setAudioLectures] = useState<AudioLecture[]>([]);
  const [videoLectures, setVideoLectures] = useState<VideoLecture[]>([]);
  const [pamphlets, setPamphlets] = useState<Pamphlet[]>([]);

  useEffect(() => {
    const qBooks = query(collection(db, 'books'), orderBy('createdAt', 'desc'));
    const unsubscribeBooks = onSnapshot(qBooks, (snapshot) => {
      setBooks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book)));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'books');
    });

    const qReflections = query(collection(db, 'reflections'), orderBy('createdAt', 'desc'));
    const unsubscribeReflections = onSnapshot(qReflections, (snapshot) => {
      setReflections(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reflection)));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'reflections');
    });

    const qAudio = query(collection(db, 'audio'), orderBy('createdAt', 'desc'));
    const unsubscribeAudio = onSnapshot(qAudio, (snapshot) => {
      setAudioLectures(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AudioLecture)));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'audio');
    });

    const qVideos = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
    const unsubscribeVideos = onSnapshot(qVideos, (snapshot) => {
      setVideoLectures(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VideoLecture)));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'videos');
    });

    const qPamphlets = query(collection(db, 'pamphlets'), orderBy('createdAt', 'desc'));
    const unsubscribePamphlets = onSnapshot(qPamphlets, (snapshot) => {
      setPamphlets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Pamphlet)));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'pamphlets');
    });

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
      {!isAdminPage && <Navbar currentPage={currentPage} onNavigate={handleNavigate} />}
      
      <AnimatePresence mode="wait">
        {/* @ts-ignore - React Router Routes does accept key in React 19 but types might be outdated */}
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <Hero onNavigate={handleNavigate} />
              <WhatsNewSection onNavigate={handleNavigate} books={books} reflections={reflections} audioLectures={audioLectures} videoLectures={videoLectures} pamphlets={pamphlets} />
              <AboutSection onNavigate={handleNavigate} />
              <BooksSection onNavigate={handleNavigate} books={books} />
              <ReflectionsSection onNavigate={handleNavigate} reflections={reflections} />
              <AudioSection onNavigate={handleNavigate} audioLectures={audioLectures} />
              <VideoSection onNavigate={handleNavigate} videoLectures={videoLectures} />
              <PamphletsSection onNavigate={handleNavigate} pamphlets={pamphlets} />
              <QuoteSection />
              <MostPopularSection />
            </motion.div>
          } />
          <Route path="/library" element={
            <motion.div key="library" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <LibraryPage books={books} />
            </motion.div>
          } />
          <Route path="/audio" element={
            <motion.div key="audio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <AudioPage onNavigate={handleNavigate} audioLectures={audioLectures} />
            </motion.div>
          } />
          <Route path="/video" element={
            <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <VideoPage onNavigate={handleNavigate} videoLectures={videoLectures} />
            </motion.div>
          } />
          <Route path="/reflections" element={
            <motion.div key="reflections" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <ReflectionsPage onNavigate={handleNavigate} reflections={reflections} />
            </motion.div>
          } />
          <Route path="/admin" element={
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <AdminDashboard onNavigate={handleNavigate} />
            </motion.div>
          } />
          <Route path="/pamphlets" element={
            <motion.div key="pamphlets" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <PamphletsPage pamphlets={pamphlets} />
            </motion.div>
          } />
          <Route path="/search" element={
            <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <SearchPage onNavigate={handleNavigate} books={books} reflections={reflections} audioLectures={audioLectures} videoLectures={videoLectures} pamphlets={pamphlets} />
            </motion.div>
          } />
          <Route path="/about" element={
            <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <AboutPage onNavigate={handleNavigate} />
            </motion.div>
          } />
          <Route path="/contact" element={
            <motion.div key="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <ContactPage onNavigate={handleNavigate} />
            </motion.div>
          } />
          <Route path="/privacy" element={
            <motion.div key="privacy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <PrivacyPolicyPage onNavigate={handleNavigate} />
            </motion.div>
          } />
          <Route path="/terms" element={
            <motion.div key="terms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <TermsOfUsePage onNavigate={handleNavigate} />
            </motion.div>
          } />
          <Route path="*" element={
            <motion.div key="notfound" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <NotFoundPage onNavigate={handleNavigate} />
            </motion.div>
          } />
        </Routes>
      </AnimatePresence>
      
      {!isAdminPage && <Footer onNavigate={handleNavigate} />}
    </div>
  );
}
