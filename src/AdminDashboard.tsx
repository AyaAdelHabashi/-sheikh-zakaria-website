import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Mic, 
  Video, 
  FileText, 
  Image as ImageIcon, 
  MessageSquare, 
  LogOut, 
  Bell, 
  User, 
  Plus, 
  Edit, 
  Trash2,
  Upload,
  X,
  Loader2,
  Search,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db, storage, handleFirestoreError, OperationType } from './firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// --- Typography Classes based on user request ---
const typo = {
  h1: "text-4xl md:text-5xl leading-[64px] font-bold",
  h2: "text-2xl md:text-3xl leading-[44px] font-semibold",
  h3: "text-lg md:text-xl lg:text-2xl leading-[34px] font-medium",
  body: "text-base md:text-lg leading-[28px] font-normal",
  small: "text-sm md:text-base leading-[22px] font-normal",
  button: "text-base md:text-lg font-medium",
};

// --- Custom Hook for Firestore ---
function useFirestoreCollection(collectionName: string, setDeleteModal: (data: { id: string, name: string } | null) => void) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(items);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, collectionName);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [collectionName]);

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteModal({ id, name });
  };

  return { data, loading, handleDeleteClick };
}

export default function AdminDashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<any>(null);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ id: string, name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const seedData = async () => {
    try {
      showToast('جاري إضافة البيانات التجريبية...', 'success');
      console.log('Starting seedData...');
      
      // Sample Books
      const booksToSeed = [
        {
          title: "فقه القلوب في طاعة علام الغيوب",
          author: "الشيخ زكريا بن طه شحادة",
          category: "الفقه",
          description: "كتاب جامع يتناول أعمال القلوب وأثرها في السلوك والعبادة، بأسلوب وعظي رقيق يجمع بين الدليل الشرعي واللطائف الإيمانية.",
          imageUrl: "https://images.unsplash.com/photo-1544640808-32ca72ac7f37?q=80&w=1000&auto=format&fit=crop",
          pdfUrl: "#",
          createdAt: serverTimestamp()
        },
        {
          title: "نور اليقين في سيرة سيد المرسلين",
          author: "الشيخ زكريا بن طه شحادة",
          category: "السيرة",
          description: "دراسة تحليلية لسيرة النبي صلى الله عليه وسلم، تركز على الدروس والعبر المستفادة من المواقف النبوية في التربية والدعوة.",
          imageUrl: "https://images.unsplash.com/photo-1585036156171-384164a8c675?q=80&w=1000&auto=format&fit=crop",
          pdfUrl: "#",
          createdAt: serverTimestamp()
        },
        {
          title: "منهاج المسلم المعاصر",
          author: "الشيخ زكريا بن طه شحادة",
          category: "التربية الإسلامية",
          description: "دليل عملي للمسلم في حياته اليومية، يجمع بين الأصالة والمعاصرة في فهم وتطبيق أحكام الإسلام.",
          imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1000&auto=format&fit=crop",
          pdfUrl: "#",
          createdAt: serverTimestamp()
        }
      ];

      for (const book of booksToSeed) {
        await addDoc(collection(db, 'books'), book);
      }
      console.log('Books seeded');

      showToast('تمت إضافة الكتب بنجاح');

      // Sample Audio
      const audioToSeed = [
        {
          title: "سلسلة شرح أسماء الله الحسنى - المقدمة",
          category: "العقيدة",
          description: "الدرس الأول من سلسلة شرح أسماء الله الحسنى، يتناول أهمية معرفة الله وأثرها في حياة المسلم.",
          soundcloudUrl: "https://soundcloud.com/user-123/lecture1",
          createdAt: serverTimestamp()
        },
        {
          title: "خطبة الجمعة: فضل الصبر والاحتساب",
          category: "الرقائق",
          description: "خطبة مؤثرة تتناول فضل الصبر على البلاء وعظيم أجر المحتسبين عند الله تعالى.",
          soundcloudUrl: "https://soundcloud.com/user-123/friday-khutba",
          createdAt: serverTimestamp()
        },
        {
          title: "تفسير سورة الفاتحة - أسرار ولطائف",
          category: "التفسير",
          description: "وقفة تدبرية مع أم الكتاب، نستعرض فيها معانيها العظيمة وأسرارها البديعة.",
          soundcloudUrl: "https://soundcloud.com/user-123/fatiha",
          createdAt: serverTimestamp()
        }
      ];

      for (const audio of audioToSeed) {
        await addDoc(collection(db, 'audio'), audio);
      }
      showToast('تمت إضافة الصوتيات بنجاح');

      // Sample Videos
      const videosToSeed = [
        {
          title: "لقاء تلفزيوني: دور الشباب في بناء المجتمع",
          category: "لقاءات",
          description: "حوار مفتوح حول التحديات التي تواجه الشباب المسلم المعاصر وكيفية استثمار الطاقات في خدمة الدين والوطن.",
          youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          createdAt: serverTimestamp()
        },
        {
          title: "ندوة علمية: مقاصد الشريعة في المعاملات",
          category: "ندوات",
          description: "شرح مفصل لمقاصد الشريعة الإسلامية في باب المعاملات المالية، مع تطبيقات معاصرة.",
          youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          createdAt: serverTimestamp()
        },
        {
          title: "خطبة العيد: الفرح بفضل الله ورحمته",
          category: "خطب",
          description: "خطبة عيد الفطر المبارك، تتناول معاني الفرح المشروعة وأهمية التواصل والتراحم بين المسلمين.",
          youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          createdAt: serverTimestamp()
        }
      ];

      for (const video of videosToSeed) {
        await addDoc(collection(db, 'videos'), video);
      }
      showToast('تمت إضافة المرئيات بنجاح');

      // Sample Reflections
      const reflectionsToSeed = [
        {
          title: "تأملات في قوله تعالى 'واصبر لحكم ربك'",
          text: "إن الصبر على أقدار الله المؤلمة هو أعلى مراتب الإيمان، فالله لا يقضي للمؤمن قضاءً إلا وهو خير له، وإن خفي عليه وجه الحكمة في البداية. فكن مع الله ولا تبالِ.",
          category: "إيمانيات",
          createdAt: serverTimestamp()
        },
        {
          title: "لطيفة قرآنية من سورة يوسف",
          text: "في قصة يوسف عليه السلام نرى كيف تتحول المحن إلى منح، وكيف يمهد الله لأوليائه طريق التمكين عبر الابتلاء. فثق بتدبير الله لك.",
          category: "قرآنيات",
          createdAt: serverTimestamp()
        },
        {
          title: "قيمة الوقت في حياة المسلم",
          text: "الوقت هو رأس مال المسلم، وكل لحظة تمر هي فرصة للتقرب إلى الله. فاحرص على أن لا يمر يومك دون أثر صالح يبقى لك في الآخرة.",
          category: "تربويات",
          createdAt: serverTimestamp()
        }
      ];

      for (const reflection of reflectionsToSeed) {
        await addDoc(collection(db, 'reflections'), reflection);
      }
      showToast('تمت إضافة الخواطر بنجاح');

      // Sample Pamphlets
      const pamphletsToSeed = [
        {
          title: "أذكار الصباح والمساء",
          description: "مطوية جامعة للأذكار الصحيحة الواردة عن النبي صلى الله عليه وسلم في الصباح والمساء.",
          imageUrl: "https://images.unsplash.com/photo-1544640808-32ca72ac7f37?q=80&w=1000&auto=format&fit=crop",
          pdfUrl: "#",
          createdAt: serverTimestamp()
        },
        {
          title: "كيف تستقبل رمضان؟",
          description: "نصائح وتوجيهات عملية لاستثمار شهر رمضان المبارك في الطاعات والتقرب إلى الله.",
          imageUrl: "https://images.unsplash.com/photo-1585036156171-384164a8c675?q=80&w=1000&auto=format&fit=crop",
          pdfUrl: "#",
          createdAt: serverTimestamp()
        },
        {
          title: "حصن المسلم من الأذكار",
          description: "مختصر للأدعية والأذكار التي يحتاجها المسلم في يومه وليله.",
          imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1000&auto=format&fit=crop",
          pdfUrl: "#",
          createdAt: serverTimestamp()
        }
      ];

      for (const pamphlet of pamphletsToSeed) {
        await addDoc(collection(db, 'pamphlets'), pamphlet);
      }
      showToast('تمت إضافة المطويات بنجاح');
      showToast('تمت إضافة جميع البيانات التجريبية بنجاح');

      showToast('تم إضافة البيانات التجريبية بنجاح لكافة الأقسام', 'success');
    } catch (error) {
      console.error('Error seeding data:', error);
      showToast('حدث خطأ أثناء إضافة البيانات التجريبية', 'error');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleConfirmDelete = async () => {
    if (!deleteModal) return;
    
    setIsDeleting(true);
    const collectionMap: { [key: string]: string } = {
      'books': 'books',
      'audio': 'audio',
      'video': 'videos',
      'reflections': 'reflections',
      'pamphlets': 'pamphlets',
      'messages': 'messages'
    };
    try {
      const firestoreCollection = activeTab === 'overview' ? '' : collectionMap[activeTab];
      if (firestoreCollection) {
        await deleteDoc(doc(db, firestoreCollection, deleteModal.id));
        showToast("تم الحذف بنجاح");
      }
      setDeleteModal(null);
    } catch (error) {
      console.error("Delete failed", error);
      showToast("فشل في عملية الحذف", "error");
      const firestoreCollection = activeTab === 'overview' ? '' : collectionMap[activeTab];
      handleFirestoreError(error, OperationType.DELETE, `${firestoreCollection}/${deleteModal?.id}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onNavigate('home');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] font-cairo">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center relative font-cairo" dir="rtl">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=2000&auto=format&fit=crop" 
            alt="Islamic Background" 
            className="w-full h-full object-cover blur-sm"
          />
          <div className="absolute inset-0 bg-emerald-950/80 mix-blend-multiply" />
          <div className="absolute inset-0 islamic-pattern opacity-5"></div>
        </div>

        {/* Login Card */}
        <div className="relative z-10 bg-white p-6 md:p-10 md:p-12 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-w-[480px] w-full mx-4 flex flex-col items-center">
          
          {/* Top Icon */}
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <BookOpen className="w-10 h-10 text-emerald-700" />
          </div>

          {/* Titles */}
          <h1 className="text-2xl md:text-3xl font-semibold text-emerald-950 mb-3 text-center font-cairo">الدخول إلى لوحة الإدارة</h1>
          <p className="text-base md:text-lg text-emerald-600 mb-8 text-center leading-relaxed font-cairo">
            يرجى تسجيل الدخول للوصول إلى لوحة التحكم وإدارة محتوى الموقع من كتب ودروس ومحاضرات.
          </p>

          {/* Form */}
          <form className="w-full space-y-5" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <div className="space-y-2">
              <label className="block text-[14px] text-emerald-800 font-medium">البريد الإلكتروني</label>
              <input 
                type="email" 
                placeholder="أدخل البريد الإلكتروني"
                className="w-full bg-emerald-50/30 border border-emerald-100 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[14px] text-emerald-800 font-medium">كلمة المرور</label>
              <input 
                type="password" 
                placeholder="أدخل كلمة المرور"
                className="w-full bg-emerald-50/30 border border-emerald-100 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>

            <div className="pt-4 space-y-4">
              <button 
                type="button"
                onClick={() => alert("يرجى استخدام تسجيل الدخول بواسطة Google حالياً")}
                className="w-full bg-emerald-800 text-white py-3.5 rounded-xl hover:bg-emerald-900 transition-all duration-300 font-semibold text-base shadow-md hover:shadow-lg"
              >
                تسجيل الدخول
              </button>
              
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-emerald-100"></div>
                <span className="flex-shrink-0 mx-4 text-emerald-400 text-sm">أو</span>
                <div className="flex-grow border-t border-emerald-100"></div>
              </div>

              <button 
                type="button"
                onClick={handleLogin}
                className="w-full bg-white border-2 border-emerald-100 text-emerald-800 py-3.5 rounded-xl hover:bg-emerald-50 transition-all duration-300 font-semibold text-base flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                تسجيل الدخول باستخدام Google
              </button>
            </div>
          </form>

          {/* Links */}
          <div className="mt-8 flex flex-col items-center gap-4">
            <button 
              onClick={() => onNavigate('home')}
              className="text-emerald-600 hover:text-emerald-800 text-sm md:text-base transition-colors font-medium hover:underline underline-offset-4"
            >
              العودة إلى الصفحة الرئيسية
            </button>
            <p className="text-emerald-400 text-[13px]">
              © جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'overview', label: 'لوحة القيادة', icon: LayoutDashboard },
    { id: 'books', label: 'إدارة الكتب', icon: BookOpen },
    { id: 'audio', label: 'إدارة الصوتيات', icon: Mic },
    { id: 'video', label: 'إدارة المرئيات', icon: Video },
    { id: 'reflections', label: 'إدارة الخواطر', icon: FileText },
    { id: 'pamphlets', label: 'إدارة المطويات', icon: ImageIcon },
    { id: 'messages', label: 'الرسائل', icon: MessageSquare },
  ];

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    setIsAdding(false);
    setItemToEdit(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-cairo flex" dir="rtl">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-72 bg-emerald-950 text-white flex flex-col fixed right-0 h-full z-30 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
        <div 
          onClick={() => onNavigate('home')}
          className="p-6 flex items-center justify-between gap-3 border-b border-emerald-800/50 cursor-pointer hover:bg-emerald-900/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-800 rounded-full flex items-center justify-center text-gold-400 font-bold text-xl border border-gold-500/30">
              ز
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold leading-tight">لوحة الإدارة</h2>
              <p className="text-sm md:text-base text-emerald-400">موقع الشيخ زكريا</p>
            </div>
          </div>
          <button 
            className="md:hidden text-emerald-200 hover:text-white"
            onClick={(e) => { e.stopPropagation(); setIsMobileMenuOpen(false); }}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                handleTabChange(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                ? 'bg-emerald-800 text-gold-400 shadow-md' 
                : 'text-emerald-100 hover:bg-emerald-900/50 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className={typo.body}>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-emerald-800/50">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-emerald-200 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className={typo.body}>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:mr-72 flex flex-col min-h-screen w-full overflow-x-hidden">
        {/* Top Bar */}
        <header className="h-20 bg-white shadow-sm px-4 md:px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3 md:gap-4">
            <button 
              className="md:hidden text-emerald-950 hover:bg-emerald-50 p-2 rounded-lg"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl md:text-3xl font-bold text-emerald-950 truncate">
              {menuItems.find(m => m.id === activeTab)?.label}
            </h1>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <button 
              onClick={() => onNavigate('home')}
              className="hidden sm:block text-emerald-600 hover:text-emerald-900 transition-colors font-medium ml-2 text-sm md:text-base"
            >
              العودة للموقع
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-emerald-600 hover:text-emerald-900 transition-colors"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-emerald-100 overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-emerald-50 bg-emerald-50/50">
                      <h3 className="font-bold text-emerald-950">الإشعارات</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <div className="p-4 border-b border-emerald-50 hover:bg-emerald-50/30 transition-colors cursor-pointer">
                        <p className="text-sm text-emerald-900 font-medium mb-1">رسالة جديدة من زائر</p>
                        <p className="text-xs text-emerald-500">منذ ساعتين</p>
                      </div>
                      <div className="p-4 border-b border-emerald-50 hover:bg-emerald-50/30 transition-colors cursor-pointer">
                        <p className="text-sm text-emerald-900 font-medium mb-1">تم تسجيل دخول جديد للوحة التحكم</p>
                        <p className="text-xs text-emerald-500">منذ 5 ساعات</p>
                      </div>
                    </div>
                    <div className="p-3 text-center border-t border-emerald-50">
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="text-sm text-emerald-600 hover:text-emerald-800 font-medium"
                      >
                        إغلاق
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button 
              onClick={seedData}
              className="hidden md:block ml-4 text-xs bg-emerald-800/30 hover:bg-emerald-800/50 px-3 py-1 rounded-full transition-colors border border-emerald-700/30"
            >
              إضافة بيانات تجريبية
            </button>
            <div className="hidden md:flex items-center gap-3 px-4 border-x border-emerald-100">
              <div className="text-left">
                <p className="text-base md:text-lg font-bold text-emerald-950 leading-tight">{user.displayName || 'المدير العام'}</p>
                <p className="text-sm md:text-base text-emerald-500">{user.email}</p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 overflow-hidden">
                {user.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : <User className="w-5 h-5" />}
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="hidden md:flex text-emerald-600 hover:text-red-500 transition-colors items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              <span className={typo.button}>خروج</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 md:p-8 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (isAdding ? '-add' : '-list')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && <OverviewTab setDeleteModal={setDeleteModal} />}
              
              {activeTab === 'books' && !isAdding && <BooksList onAdd={() => { setIsAdding(true); setItemToEdit(null); }} onEdit={(item) => { setIsAdding(true); setItemToEdit(item); }} setDeleteModal={setDeleteModal} />}
              {activeTab === 'books' && isAdding && <AddBookForm onCancel={() => { setIsAdding(false); setItemToEdit(null); }} itemToEdit={itemToEdit} showToast={showToast} />}
              
              {activeTab === 'audio' && !isAdding && <AudioList onAdd={() => { setIsAdding(true); setItemToEdit(null); }} onEdit={(item) => { setIsAdding(true); setItemToEdit(item); }} setDeleteModal={setDeleteModal} />}
              {activeTab === 'audio' && isAdding && <AddAudioForm onCancel={() => { setIsAdding(false); setItemToEdit(null); }} itemToEdit={itemToEdit} showToast={showToast} />}
              
              {activeTab === 'video' && !isAdding && <VideoList onAdd={() => { setIsAdding(true); setItemToEdit(null); }} onEdit={(item) => { setIsAdding(true); setItemToEdit(item); }} setDeleteModal={setDeleteModal} />}
              {activeTab === 'video' && isAdding && <AddVideoForm onCancel={() => { setIsAdding(false); setItemToEdit(null); }} itemToEdit={itemToEdit} showToast={showToast} />}
              
              {activeTab === 'reflections' && !isAdding && <ReflectionsList onAdd={() => { setIsAdding(true); setItemToEdit(null); }} onEdit={(item) => { setIsAdding(true); setItemToEdit(item); }} setDeleteModal={setDeleteModal} />}
              {activeTab === 'reflections' && isAdding && <AddReflectionForm onCancel={() => { setIsAdding(false); setItemToEdit(null); }} itemToEdit={itemToEdit} showToast={showToast} />}
              
              {activeTab === 'pamphlets' && !isAdding && <PamphletsList onAdd={() => { setIsAdding(true); setItemToEdit(null); }} onEdit={(item) => { setIsAdding(true); setItemToEdit(item); }} setDeleteModal={setDeleteModal} />}
              {activeTab === 'pamphlets' && isAdding && <AddPamphletForm onCancel={() => { setIsAdding(false); setItemToEdit(null); }} itemToEdit={itemToEdit} showToast={showToast} />}
              
              {activeTab === 'messages' && <MessagesList setDeleteModal={setDeleteModal} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => !isDeleting && setDeleteModal(null)}
                className="absolute inset-0 bg-emerald-950/60 backdrop-blur-sm"
              ></motion.div>
              
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 relative z-10 text-center"
              >
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                <h3 className={typo.h2 + " text-emerald-950 mb-2"}>تأكيد الحذف</h3>
                <p className={typo.body + " text-emerald-600 mb-8"}>
                  هل أنت متأكد من رغبتك في حذف <span className="font-bold text-emerald-900">"{deleteModal.name}"</span>؟ هذه العملية لا يمكن التراجع عنها.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleConfirmDelete}
                    disabled={isDeleting}
                    className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                    نعم، احذف
                  </button>
                  <button 
                    onClick={() => setDeleteModal(null)}
                    disabled={isDeleting}
                    className="flex-1 bg-emerald-50 text-emerald-800 py-3 rounded-xl font-bold hover:bg-emerald-100 transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 ${
                toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                {toast.type === 'success' ? '✓' : '!'}
              </div>
              <span className="font-bold">{toast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- Tab Components ---

const OverviewTab = ({ setDeleteModal }: { setDeleteModal: (data: { id: string, name: string } | null) => void }) => {
  const { data: books } = useFirestoreCollection('books', setDeleteModal);
  const { data: audio } = useFirestoreCollection('audio', setDeleteModal);
  const { data: videos } = useFirestoreCollection('videos', setDeleteModal);
  const { data: reflections } = useFirestoreCollection('reflections', setDeleteModal);
  const { data: pamphlets } = useFirestoreCollection('pamphlets', setDeleteModal);

  const stats = [
    { title: 'إجمالي الكتب', count: books.length.toString(), icon: BookOpen, color: 'bg-blue-50 text-blue-600' },
    { title: 'الدروس الصوتية', count: audio.length.toString(), icon: Mic, color: 'bg-emerald-50 text-emerald-600' },
    { title: 'الدروس المرئية', count: videos.length.toString(), icon: Video, color: 'bg-red-50 text-red-600' },
    { title: 'الخواطر', count: reflections.length.toString(), icon: FileText, color: 'bg-gold-50 text-gold-600' },
    { title: 'المطويات', count: pamphlets.length.toString(), icon: ImageIcon, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-emerald-50 flex items-center gap-4">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.color}`}>
            <stat.icon className="w-7 h-7" />
          </div>
          <div>
            <p className={typo.small + " text-emerald-600 mb-1"}>{stat.title}</p>
            <h3 className={typo.h2 + " text-emerald-950 leading-none"}>{stat.count}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Shared Table Components ---

const TableHeader = ({ title, onAdd }: { title: string, onAdd: () => void }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
    <h3 className={typo.h3 + " text-emerald-950"}>{title}</h3>
    <button 
      onClick={onAdd}
      className={`w-full sm:w-auto justify-center bg-emerald-800 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-900 transition-colors flex items-center gap-2 ${typo.button}`}
    >
      <Plus className="w-5 h-5" />
      إضافة جديد
    </button>
  </div>
);

const ActionButtons = ({ onDelete, onEdit }: { onDelete?: () => void, onEdit?: () => void }) => (
  <div className="flex items-center gap-2">
    <button onClick={onEdit} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
      <Edit className="w-4 h-4" />
    </button>
    <button onClick={onDelete} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
      <Trash2 className="w-4 h-4" />
    </button>
  </div>
);

// --- Lists ---

const BooksList = ({ onAdd, onEdit, setDeleteModal }: { onAdd: () => void, onEdit: (item: any) => void, setDeleteModal: (data: { id: string, name: string } | null) => void }) => {
  const { data: books, loading, handleDeleteClick } = useFirestoreCollection('books', setDeleteModal);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('الكل');

  if (loading) return <div className="p-8 text-center text-emerald-600">جاري التحميل...</div>;

  const categories = ['الكل', 'العقيدة', 'الفقه', 'الحديث', 'التفسير', 'السيرة', 'التربية الإسلامية'];
  
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (book.author && book.author.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === 'الكل' || book.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (date: any) => {
    if (!date) return '---';
    try {
      if (date.toDate) {
        return date.toDate().toLocaleDateString('ar-SA');
      }
      return new Date(date).toLocaleDateString('ar-SA');
    } catch (e) {
      return '---';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-emerald-50 p-4 md:p-6">
      <TableHeader title="قائمة الكتب" onAdd={onAdd} />
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
        <div className="relative w-full flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="ابحث بالعنوان أو المؤلف..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-emerald-50/50 border border-emerald-100 rounded-xl py-2.5 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <select 
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 pr-4 pl-10 text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm font-bold shadow-sm appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23065f46%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[position:left_1rem_center] bg-[length:1.25em_1.25em] bg-no-repeat"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <table className="w-full text-right min-w-max">
          <thead>
            <tr className="border-b border-emerald-100 text-emerald-600">
              <th className={`pb-4 font-medium whitespace-nowrap px-2 ${typo.body}`}>الغلاف</th>
              <th className={`pb-4 font-medium whitespace-nowrap px-2 ${typo.body}`}>عنوان الكتاب</th>
              <th className={`pb-4 font-medium whitespace-nowrap px-2 ${typo.body}`}>المؤلف</th>
              <th className={`pb-4 font-medium whitespace-nowrap px-2 ${typo.body}`}>التصنيف</th>
              <th className={`pb-4 font-medium whitespace-nowrap px-2 ${typo.body}`}>تاريخ الرفع</th>
              <th className={`pb-4 font-medium whitespace-nowrap px-2 ${typo.body}`}>الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50">
            {filteredBooks.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center text-emerald-500">لا توجد نتائج مطابقة للبحث.</td></tr>
            ) : (
              filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-emerald-50/50 transition-colors">
                  <td className="py-4 px-2">
                    <div className="w-12 h-16 bg-emerald-100 rounded overflow-hidden">
                      <img src={book.imageUrl} alt="cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  </td>
                  <td className={`py-4 px-2 text-emerald-950 whitespace-nowrap ${typo.body}`}>{book.title}</td>
                  <td className={`py-4 px-2 text-emerald-600 whitespace-nowrap ${typo.body}`}>{book.author || '---'}</td>
                  <td className={`py-4 px-2 text-emerald-600 whitespace-nowrap ${typo.body}`}>{book.category}</td>
                  <td className={`py-4 px-2 text-emerald-600 whitespace-nowrap ${typo.body}`}>{formatDate(book.createdAt)}</td>
                  <td className="py-4 px-2 whitespace-nowrap"><ActionButtons onDelete={() => handleDeleteClick(book.id, book.title)} onEdit={() => onEdit(book)} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AudioList = ({ onAdd, onEdit, setDeleteModal }: { onAdd: () => void, onEdit: (item: any) => void, setDeleteModal: (data: { id: string, name: string } | null) => void }) => {
  const { data: audio, loading, handleDeleteClick } = useFirestoreCollection('audio', setDeleteModal);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('الكل');

  if (loading) return <div className="p-8 text-center text-emerald-600">جاري التحميل...</div>;

  const categories = ['الكل', 'العقيدة', 'الآداب والأخلاق', 'خطب الجمعة', 'دروس علمية'];

  const filteredAudio = audio.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'الكل' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (date: any) => {
    if (!date) return '---';
    try {
      if (date.toDate) {
        return date.toDate().toLocaleDateString('ar-SA');
      }
      return new Date(date).toLocaleDateString('ar-SA');
    } catch (e) {
      return '---';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-emerald-50 p-4 md:p-6">
      <TableHeader title="قائمة الصوتيات" onAdd={onAdd} />
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
        <div className="relative w-full flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="ابحث عن درس صوتي..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-emerald-50/50 border border-emerald-100 rounded-xl py-2.5 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <select 
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 pr-4 pl-10 text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm font-bold shadow-sm appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23065f46%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[position:left_1rem_center] bg-[length:1.25em_1.25em] bg-no-repeat"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <table className="w-full text-right min-w-max">
          <thead>
            <tr className="border-b border-emerald-100 text-emerald-600">
              <th className={`pb-4 font-medium whitespace-nowrap px-2 ${typo.body}`}>عنوان الدرس</th>
              <th className={`pb-4 font-medium whitespace-nowrap px-2 ${typo.body}`}>التصنيف</th>
              <th className={`pb-4 font-medium whitespace-nowrap px-2 ${typo.body}`}>التاريخ</th>
              <th className={`pb-4 font-medium whitespace-nowrap px-2 ${typo.body}`}>الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50">
            {filteredAudio.length === 0 ? (
              <tr><td colSpan={4} className="py-8 text-center text-emerald-500">لا توجد نتائج مطابقة للبحث.</td></tr>
            ) : (
              filteredAudio.map((item) => (
                <tr key={item.id} className="hover:bg-emerald-50/50 transition-colors">
                  <td className={`py-4 px-2 text-emerald-950 whitespace-nowrap ${typo.body}`}>{item.title}</td>
                  <td className={`py-4 px-2 text-emerald-600 whitespace-nowrap ${typo.body}`}>{item.category}</td>
                  <td className={`py-4 px-2 text-emerald-600 whitespace-nowrap ${typo.body}`}>{formatDate(item.createdAt)}</td>
                  <td className="py-4 px-2 whitespace-nowrap"><ActionButtons onDelete={() => handleDeleteClick(item.id, item.title)} onEdit={() => onEdit(item)} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const VideoList = ({ onAdd, onEdit, setDeleteModal }: { onAdd: () => void, onEdit: (item: any) => void, setDeleteModal: (data: { id: string, name: string } | null) => void }) => {
  const { data: videos, loading, handleDeleteClick } = useFirestoreCollection('videos', setDeleteModal);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('الكل');

  if (loading) return <div className="p-8 text-center text-emerald-600">جاري التحميل...</div>;

  const categories = ['الكل', 'محاضرات عامة', 'خطب الجمعة', 'دروس علمية'];

  const filteredVideos = videos.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'الكل' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (date: any) => {
    if (!date) return '---';
    try {
      if (date.toDate) {
        return date.toDate().toLocaleDateString('ar-SA');
      }
      return new Date(date).toLocaleDateString('ar-SA');
    } catch (e) {
      return '---';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-emerald-50 p-4 md:p-6">
      <TableHeader title="قائمة المرئيات" onAdd={onAdd} />
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
        <div className="relative w-full flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="ابحث عن مقطع مرئي..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-emerald-50/50 border border-emerald-100 rounded-xl py-2.5 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <select 
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 pr-4 pl-10 text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm font-bold shadow-sm appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23065f46%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[position:left_1rem_center] bg-[length:1.25em_1.25em] bg-no-repeat"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <table className="w-full text-right min-w-max">
          <thead>
            <tr className="border-b border-emerald-100 text-emerald-600">
              <th className={`pb-4 font-medium whitespace-nowrap px-2 ${typo.body}`}>عنوان المقطع</th>
              <th className={`pb-4 font-medium whitespace-nowrap px-2 ${typo.body}`}>التصنيف</th>
              <th className={`pb-4 font-medium whitespace-nowrap px-2 ${typo.body}`}>التاريخ</th>
              <th className={`pb-4 font-medium whitespace-nowrap px-2 ${typo.body}`}>الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50">
            {filteredVideos.length === 0 ? (
              <tr><td colSpan={4} className="py-8 text-center text-emerald-500">لا توجد نتائج مطابقة للبحث.</td></tr>
            ) : (
              filteredVideos.map((item) => (
                <tr key={item.id} className="hover:bg-emerald-50/50 transition-colors">
                  <td className={`py-4 px-2 text-emerald-950 whitespace-nowrap ${typo.body}`}>{item.title}</td>
                  <td className={`py-4 px-2 text-emerald-600 whitespace-nowrap ${typo.body}`}>{item.category}</td>
                  <td className={`py-4 px-2 text-emerald-600 whitespace-nowrap ${typo.body}`}>{formatDate(item.createdAt)}</td>
                  <td className="py-4 px-2 whitespace-nowrap"><ActionButtons onDelete={() => handleDeleteClick(item.id, item.title)} onEdit={() => onEdit(item)} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ReflectionsList = ({ onAdd, onEdit, setDeleteModal }: { onAdd: () => void, onEdit: (item: any) => void, setDeleteModal: (data: { id: string, name: string } | null) => void }) => {
  const { data: reflections, loading, handleDeleteClick } = useFirestoreCollection('reflections', setDeleteModal);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('الكل');

  if (loading) return <div className="p-8 text-center text-emerald-600">جاري التحميل...</div>;

  const categories = ['الكل', 'إيمانيات', 'قرآنيات', 'تربويات', 'أخلاقيات'];

  const filteredReflections = reflections.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'الكل' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (date: any) => {
    if (!date) return '---';
    try {
      if (date.toDate) {
        return date.toDate().toLocaleDateString('ar-SA');
      }
      return new Date(date).toLocaleDateString('ar-SA');
    } catch (e) {
      return '---';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-emerald-50 p-4 md:p-6">
      <TableHeader title="قائمة الخواطر" onAdd={onAdd} />
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
        <div className="relative w-full flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="ابحث في الخواطر..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-emerald-50/50 border border-emerald-100 rounded-xl py-2.5 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <select 
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 pr-4 pl-10 text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm font-bold shadow-sm appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23065f46%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[position:left_1rem_center] bg-[length:1.25em_1.25em] bg-no-repeat"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <table className="w-full text-right min-w-max">
          <thead>
            <tr className="border-b border-emerald-100 text-emerald-600">
              <th className={`pb-4 font-medium whitespace-nowrap px-2 ${typo.body}`}>عنوان الخاطرة</th>
              <th className={`pb-4 font-medium whitespace-nowrap px-2 ${typo.body}`}>التصنيف</th>
              <th className={`pb-4 font-medium whitespace-nowrap px-2 ${typo.body}`}>التاريخ</th>
              <th className={`pb-4 font-medium whitespace-nowrap px-2 ${typo.body}`}>الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50">
            {filteredReflections.length === 0 ? (
              <tr><td colSpan={4} className="py-8 text-center text-emerald-500">لا توجد نتائج مطابقة للبحث.</td></tr>
            ) : (
              filteredReflections.map((item) => (
                <tr key={item.id} className="hover:bg-emerald-50/50 transition-colors">
                  <td className={`py-4 px-2 text-emerald-950 whitespace-nowrap ${typo.body}`}>{item.title}</td>
                  <td className={`py-4 px-2 text-emerald-600 whitespace-nowrap ${typo.body}`}>{item.category || '---'}</td>
                  <td className={`py-4 px-2 text-emerald-600 whitespace-nowrap ${typo.body}`}>{formatDate(item.createdAt)}</td>
                  <td className="py-4 px-2 whitespace-nowrap"><ActionButtons onDelete={() => handleDeleteClick(item.id, item.title)} onEdit={() => onEdit(item)} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PamphletsList = ({ onAdd, onEdit, setDeleteModal }: { onAdd: () => void, onEdit: (item: any) => void, setDeleteModal: (data: { id: string, name: string } | null) => void }) => {
  const { data: pamphlets, loading, handleDeleteClick } = useFirestoreCollection('pamphlets', setDeleteModal);
  const [searchQuery, setSearchQuery] = useState('');

  if (loading) return <div className="p-8 text-center text-emerald-600">جاري التحميل...</div>;

  const filteredPamphlets = pamphlets.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: any) => {
    if (!date) return '---';
    try {
      if (date.toDate) {
        return date.toDate().toLocaleDateString('ar-SA');
      }
      return new Date(date).toLocaleDateString('ar-SA');
    } catch (e) {
      return '---';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-emerald-50 p-4 md:p-6">
      <TableHeader title="قائمة المطويات" onAdd={onAdd} />
      
      {/* Search */}
      <div className="mb-8">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="ابحث عن مطوية..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-emerald-50/50 border border-emerald-100 rounded-xl py-2.5 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <table className="w-full text-right min-w-max">
          <thead>
            <tr className="border-b border-emerald-100 text-emerald-600">
              <th className={`pb-4 font-medium whitespace-nowrap px-2 ${typo.body}`}>صورة العرض</th>
              <th className={`pb-4 font-medium whitespace-nowrap px-2 ${typo.body}`}>عنوان المطوية</th>
              <th className={`pb-4 font-medium whitespace-nowrap px-2 ${typo.body}`}>التاريخ</th>
              <th className={`pb-4 font-medium whitespace-nowrap px-2 ${typo.body}`}>الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50">
            {filteredPamphlets.length === 0 ? (
              <tr><td colSpan={4} className="py-8 text-center text-emerald-500">لا توجد نتائج مطابقة للبحث.</td></tr>
            ) : (
              filteredPamphlets.map((item) => (
                <tr key={item.id} className="hover:bg-emerald-50/50 transition-colors">
                  <td className="py-4 px-2">
                    <div className="w-16 h-12 bg-emerald-100 rounded overflow-hidden">
                      <img src={item.imageUrl} alt="preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  </td>
                  <td className={`py-4 px-2 text-emerald-950 whitespace-nowrap ${typo.body}`}>{item.title}</td>
                  <td className={`py-4 px-2 text-emerald-600 whitespace-nowrap ${typo.body}`}>{formatDate(item.createdAt)}</td>
                  <td className="py-4 px-2 whitespace-nowrap"><ActionButtons onDelete={() => handleDeleteClick(item.id, item.title)} onEdit={() => onEdit(item)} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const MessagesList = ({ setDeleteModal }: { setDeleteModal: (data: { id: string, name: string } | null) => void }) => {
  const { data: messages, loading, handleDeleteClick } = useFirestoreCollection('messages', setDeleteModal);

  if (loading) return <div className="p-8 text-center text-emerald-600">جاري التحميل...</div>;

  const formatDate = (date: any) => {
    if (!date) return '---';
    try {
      if (date.toDate) {
        return date.toDate().toLocaleDateString('ar-SA');
      }
      return new Date(date).toLocaleDateString('ar-SA');
    } catch (e) {
      return '---';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-emerald-50 p-4 md:p-6">
      <h3 className={typo.h3 + " text-emerald-950 mb-6"}>رسائل الزوار</h3>
      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <table className="w-full text-right min-w-max">
          <thead>
            <tr className="border-b border-emerald-100 text-emerald-600">
              <th className={`pb-4 font-medium whitespace-nowrap px-2 ${typo.body}`}>اسم المرسل</th>
              <th className={`pb-4 font-medium whitespace-nowrap px-2 ${typo.body}`}>البريد الإلكتروني</th>
              <th className={`pb-4 font-medium whitespace-nowrap px-2 ${typo.body}`}>الرسالة</th>
              <th className={`pb-4 font-medium whitespace-nowrap px-2 ${typo.body}`}>التاريخ</th>
              <th className={`pb-4 font-medium whitespace-nowrap px-2 ${typo.body}`}>الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50">
            {messages.length === 0 ? (
              <tr><td colSpan={5} className="py-8 text-center text-emerald-500">لا توجد رسائل بعد.</td></tr>
            ) : (
              messages.map((msg) => (
                <tr key={msg.id} className="hover:bg-emerald-50/50 transition-colors">
                  <td className={`py-4 px-2 text-emerald-950 whitespace-nowrap ${typo.body}`}>{msg.name}</td>
                  <td className={`py-4 px-2 text-emerald-600 whitespace-nowrap ${typo.body}`} dir="ltr">{msg.email}</td>
                  <td className={`py-4 px-2 text-emerald-600 whitespace-nowrap ${typo.body} max-w-xs truncate`}>{msg.message}</td>
                  <td className={`py-4 px-2 text-emerald-600 whitespace-nowrap ${typo.body}`}>{formatDate(msg.createdAt)}</td>
                  <td className="py-4 px-2 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="عرض">
                        <FileText className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteClick(msg.id, msg.name)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="حذف">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Forms ---

const FormWrapper = ({ title, onCancel, onSubmit, loading, children }: { title: string, onCancel: () => void, onSubmit: (e: React.FormEvent) => void, loading?: boolean, children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-emerald-50 p-4 md:p-8 max-w-4xl mx-auto">
    <div className="flex justify-between items-center mb-6 md:mb-8 pb-4 border-b border-emerald-50">
      <h3 className={typo.h3 + " text-emerald-950"}>{title}</h3>
      <button onClick={onCancel} className="p-2 text-emerald-400 hover:text-emerald-900 transition-colors rounded-full hover:bg-emerald-50">
        <X className="w-6 h-6" />
      </button>
    </div>
    <form className="space-y-6" onSubmit={onSubmit}>
      {children}
      <div className="pt-6 flex flex-col sm:flex-row gap-4">
        <button disabled={loading} type="submit" className={`w-full sm:w-auto justify-center bg-emerald-800 text-white px-8 py-3 rounded-xl hover:bg-emerald-900 transition-colors flex items-center gap-2 ${typo.button} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          نشر وحفظ
        </button>
        <button type="button" onClick={onCancel} className={`w-full sm:w-auto justify-center bg-emerald-50 text-emerald-800 px-8 py-3 rounded-xl hover:bg-emerald-100 transition-colors ${typo.button}`}>
          إلغاء
        </button>
      </div>
    </form>
  </div>
);

const Input = ({ label, type = "text", placeholder, value, onChange, required }: { label: string, type?: string, placeholder?: string, value?: string, onChange?: (e: any) => void, required?: boolean }) => (
  <div>
    <label className={`block text-emerald-900 mb-2 ${typo.body}`}>{label}</label>
    <input 
      type={type} 
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full bg-emerald-50/50 border border-emerald-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${typo.body}`}
    />
  </div>
);

const Textarea = ({ label, placeholder, rows = 4, value, onChange, required }: { label: string, placeholder?: string, rows?: number, value?: string, onChange?: (e: any) => void, required?: boolean }) => (
  <div>
    <label className={`block text-emerald-900 mb-2 ${typo.body}`}>{label}</label>
    <textarea 
      rows={rows}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full bg-emerald-50/50 border border-emerald-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${typo.body}`}
    ></textarea>
  </div>
);

const Select = ({ label, options, value, onChange, required }: { label: string, options: string[], value?: string, onChange?: (e: any) => void, required?: boolean }) => (
  <div>
    <label className={`block text-emerald-900 mb-2 ${typo.body}`}>{label}</label>
    <select value={value} onChange={onChange} required={required} className={`w-full bg-emerald-50/50 border border-emerald-100 rounded-xl pr-4 pl-10 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23065f46%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[position:left_0.75rem_center] bg-[length:1.25em_1.25em] bg-no-repeat ${typo.body}`}>
      <option value="">اختر...</option>
      {options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const FileUpload = ({ label, accept, onChange, file }: { label: string, accept?: string, onChange?: (file: File | null) => void, file?: File | null }) => (
  <div>
    <label className={`block text-emerald-900 mb-2 ${typo.body}`}>{label}</label>
    <div className="relative border-2 border-dashed border-emerald-200 rounded-xl p-8 text-center hover:bg-emerald-50/50 transition-colors cursor-pointer overflow-hidden">
      <Upload className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
      <p className={`text-emerald-600 ${typo.body}`}>
        {file ? file.name : 'اضغط هنا لرفع الملف أو قم بسحبه وإفلاته'}
      </p>
      <input 
        type="file" 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
        accept={accept} 
        onChange={(e) => onChange && onChange(e.target.files ? e.target.files[0] : null)}
      />
    </div>
  </div>
);

const AddBookForm = ({ onCancel, itemToEdit, showToast }: { onCancel: () => void, itemToEdit?: any, showToast: (msg: string, type?: 'success' | 'error') => void }) => {
  const [title, setTitle] = useState(itemToEdit?.title || '');
  const [author, setAuthor] = useState(itemToEdit?.author || '');
  const [category, setCategory] = useState(itemToEdit?.category || '');
  const [description, setDescription] = useState(itemToEdit?.description || '');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !description || (!itemToEdit && (!coverFile || !pdfFile))) {
      showToast('يرجى تعبئة جميع الحقول وإرفاق الملفات المطلوبة.', 'error');
      return;
    }

    setLoading(true);
    try {
      let coverUrl = itemToEdit?.imageUrl || '';
      let pdfUrl = itemToEdit?.pdfUrl || '';

      if (coverFile) {
        const coverRef = ref(storage, `books/covers/${Date.now()}_${coverFile.name}`);
        await uploadBytes(coverRef, coverFile);
        coverUrl = await getDownloadURL(coverRef);
      }

      if (pdfFile) {
        const pdfRef = ref(storage, `books/pdfs/${Date.now()}_${pdfFile.name}`);
        await uploadBytes(pdfRef, pdfFile);
        pdfUrl = await getDownloadURL(pdfRef);
      }

      const bookData = {
        title,
        author,
        category,
        description,
        imageUrl: coverUrl,
        pdfUrl: pdfUrl,
      };

      if (itemToEdit) {
        await updateDoc(doc(db, 'books', itemToEdit.id), bookData);
        showToast('تم تحديث الكتاب بنجاح');
      } else {
        await addDoc(collection(db, 'books'), {
          ...bookData,
          createdAt: serverTimestamp(),
        });
        showToast('تمت إضافة الكتاب بنجاح');
      }

      onCancel();
    } catch (error: any) {
      console.error('Error saving book:', error);
      let errorMsg = 'حدث خطأ أثناء حفظ الكتاب. يرجى المحاولة مرة أخرى.';
      
      if (error.code === 'permission-denied') {
        errorMsg = 'ليس لديك صلاحية للقيام بهذه العملية. يرجى التأكد من تسجيل الدخول بحساب المشرف.';
      } else if (error.message) {
        errorMsg = `خطأ: ${error.message}`;
      }
      
      showToast(errorMsg, 'error');
      handleFirestoreError(error, itemToEdit ? OperationType.UPDATE : OperationType.CREATE, `books/${itemToEdit?.id || ''}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper title={itemToEdit ? "تعديل كتاب" : "إضافة كتاب جديد"} onCancel={onCancel} onSubmit={handleSubmit} loading={loading}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Input label="عنوان الكتاب" placeholder="أدخل عنوان الكتاب..." value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Input label="اسم المؤلف" placeholder="أدخل اسم المؤلف..." value={author} onChange={(e) => setAuthor(e.target.value)} />
      </div>
      <Select label="التصنيف" options={['العقيدة', 'الفقه', 'الحديث', 'التفسير', 'السيرة', 'التربية الإسلامية']} value={category} onChange={(e) => setCategory(e.target.value)} required />
      <Textarea label="وصف الكتاب" placeholder="نبذة مختصرة عن محتوى الكتاب..." value={description} onChange={(e) => setDescription(e.target.value)} required />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <FileUpload label="صورة الغلاف" accept="image/*" onChange={setCoverFile} file={coverFile} />
        <FileUpload label="ملف الكتاب (PDF)" accept=".pdf" onChange={setPdfFile} file={pdfFile} />
      </div>
    </FormWrapper>
  );
};

const AddAudioForm = ({ onCancel, itemToEdit, showToast }: { onCancel: () => void, itemToEdit?: any, showToast: (msg: string, type?: 'success' | 'error') => void }) => {
  const [title, setTitle] = useState(itemToEdit?.title || '');
  const [category, setCategory] = useState(itemToEdit?.category || '');
  const [soundcloudUrl, setSoundcloudUrl] = useState(itemToEdit?.soundcloudUrl || '');
  const [description, setDescription] = useState(itemToEdit?.description || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !soundcloudUrl || !description) {
      showToast('يرجى تعبئة جميع الحقول.', 'error');
      return;
    }

    setLoading(true);
    try {
      const audioData = {
        title,
        category,
        description,
        soundcloudUrl,
      };

      if (itemToEdit) {
        await updateDoc(doc(db, 'audio', itemToEdit.id), audioData);
        showToast('تم تحديث الدرس الصوتي بنجاح');
      } else {
        await addDoc(collection(db, 'audio'), {
          ...audioData,
          createdAt: serverTimestamp(),
        });
        showToast('تمت إضافة الدرس الصوتي بنجاح');
      }
      onCancel();
    } catch (error) {
      console.error('Error saving audio:', error);
      showToast('حدث خطأ أثناء حفظ الدرس الصوتي.', 'error');
      handleFirestoreError(error, itemToEdit ? OperationType.UPDATE : OperationType.CREATE, `audio/${itemToEdit?.id || ''}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper title={itemToEdit ? "تعديل صوتية" : "إضافة درس صوتي جديد"} onCancel={onCancel} onSubmit={handleSubmit} loading={loading}>
      <Input label="عنوان الدرس" placeholder="أدخل عنوان الدرس الصوتي..." value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Select label="التصنيف" options={['العقيدة', 'الآداب والأخلاق', 'خطب الجمعة', 'دروس علمية']} value={category} onChange={(e) => setCategory(e.target.value)} required />
      <Input label="رابط SoundCloud" placeholder="https://soundcloud.com/..." value={soundcloudUrl} onChange={(e) => setSoundcloudUrl(e.target.value)} required />
      <Textarea label="وصف الدرس" placeholder="نبذة مختصرة عن محتوى الدرس..." value={description} onChange={(e) => setDescription(e.target.value)} required />
    </FormWrapper>
  );
};

const AddVideoForm = ({ onCancel, itemToEdit, showToast }: { onCancel: () => void, itemToEdit?: any, showToast: (msg: string, type?: 'success' | 'error') => void }) => {
  const [title, setTitle] = useState(itemToEdit?.title || '');
  const [category, setCategory] = useState(itemToEdit?.category || '');
  const [youtubeUrl, setYoutubeUrl] = useState(itemToEdit?.youtubeUrl || '');
  const [description, setDescription] = useState(itemToEdit?.description || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !youtubeUrl || !description) {
      showToast('يرجى تعبئة جميع الحقول.', 'error');
      return;
    }

    setLoading(true);
    try {
      const videoData = {
        title,
        category,
        description,
        youtubeUrl,
      };

      if (itemToEdit) {
        await updateDoc(doc(db, 'videos', itemToEdit.id), videoData);
        showToast('تم تحديث المقطع المرئي بنجاح');
      } else {
        await addDoc(collection(db, 'videos'), {
          ...videoData,
          createdAt: serverTimestamp(),
        });
        showToast('تمت إضافة المقطع المرئي بنجاح');
      }
      onCancel();
    } catch (error) {
      console.error('Error saving video:', error);
      showToast('حدث خطأ أثناء حفظ المقطع المرئي.', 'error');
      handleFirestoreError(error, itemToEdit ? OperationType.UPDATE : OperationType.CREATE, `videos/${itemToEdit?.id || ''}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper title={itemToEdit ? "تعديل مقطع مرئي" : "إضافة مقطع مرئي جديد"} onCancel={onCancel} onSubmit={handleSubmit} loading={loading}>
      <Input label="عنوان المقطع" placeholder="أدخل عنوان المقطع المرئي..." value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Select label="التصنيف" options={['محاضرات عامة', 'خطب الجمعة', 'دروس علمية']} value={category} onChange={(e) => setCategory(e.target.value)} required />
      <Input label="رابط YouTube" placeholder="https://youtube.com/watch?v=..." value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} required />
      <Textarea label="وصف المقطع" placeholder="نبذة مختصرة عن محتوى المقطع..." value={description} onChange={(e) => setDescription(e.target.value)} required />
    </FormWrapper>
  );
};

const AddReflectionForm = ({ onCancel, itemToEdit, showToast }: { onCancel: () => void, itemToEdit?: any, showToast: (msg: string, type?: 'success' | 'error') => void }) => {
  const [title, setTitle] = useState(itemToEdit?.title || '');
  const [category, setCategory] = useState(itemToEdit?.category || 'إيمانيات');
  const [text, setText] = useState(itemToEdit?.text || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !text) {
      showToast('يرجى تعبئة جميع الحقول.', 'error');
      return;
    }

    setLoading(true);
    try {
      const reflectionData = {
        title,
        category,
        text,
      };

      if (itemToEdit) {
        await updateDoc(doc(db, 'reflections', itemToEdit.id), reflectionData);
        showToast('تم تحديث الخاطرة بنجاح');
      } else {
        await addDoc(collection(db, 'reflections'), {
          ...reflectionData,
          createdAt: serverTimestamp(),
        });
        showToast('تمت إضافة الخاطرة بنجاح');
      }
      onCancel();
    } catch (error: any) {
      console.error('Error saving reflection:', error);
      if (error.code === 'permission-denied') {
        showToast('ليس لديك صلاحية للقيام بهذه العملية.', 'error');
      } else {
        showToast('حدث خطأ أثناء حفظ الخاطرة.', 'error');
      }
      handleFirestoreError(error, itemToEdit ? OperationType.UPDATE : OperationType.CREATE, `reflections/${itemToEdit?.id || ''}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper title={itemToEdit ? "تعديل خاطرة" : "إضافة خاطرة جديدة"} onCancel={onCancel} onSubmit={handleSubmit} loading={loading}>
      <Input label="عنوان الخاطرة" placeholder="أدخل عنوان الخاطرة..." value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Select label="التصنيف" options={['إيمانيات', 'قرآنيات', 'تربويات', 'أخلاقيات']} value={category} onChange={(e) => setCategory(e.target.value)} required />
      <Textarea label="نص الخاطرة" placeholder="اكتب نص الخاطرة هنا..." rows={8} value={text} onChange={(e) => setText(e.target.value)} required />
    </FormWrapper>
  );
};

const AddPamphletForm = ({ onCancel, itemToEdit, showToast }: { onCancel: () => void, itemToEdit?: any, showToast: (msg: string, type?: 'success' | 'error') => void }) => {
  const [title, setTitle] = useState(itemToEdit?.title || '');
  const [description, setDescription] = useState(itemToEdit?.description || '');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || (!itemToEdit && (!coverFile || !pdfFile))) {
      showToast('يرجى تعبئة جميع الحقول وإرفاق الملفات المطلوبة.', 'error');
      return;
    }

    setLoading(true);
    try {
      let coverUrl = itemToEdit?.imageUrl || '';
      let pdfUrl = itemToEdit?.pdfUrl || '';

      if (coverFile) {
        const coverRef = ref(storage, `pamphlets/covers/${Date.now()}_${coverFile.name}`);
        await uploadBytes(coverRef, coverFile);
        coverUrl = await getDownloadURL(coverRef);
      }

      if (pdfFile) {
        const pdfRef = ref(storage, `pamphlets/pdfs/${Date.now()}_${pdfFile.name}`);
        await uploadBytes(pdfRef, pdfFile);
        pdfUrl = await getDownloadURL(pdfRef);
      }

      const pamphletData = {
        title,
        description,
        imageUrl: coverUrl,
        pdfUrl: pdfUrl,
      };

      if (itemToEdit) {
        await updateDoc(doc(db, 'pamphlets', itemToEdit.id), pamphletData);
        showToast('تم تحديث المطوية بنجاح');
      } else {
        await addDoc(collection(db, 'pamphlets'), {
          ...pamphletData,
          createdAt: serverTimestamp(),
        });
        showToast('تمت إضافة المطوية بنجاح');
      }

      onCancel();
    } catch (error) {
      console.error('Error saving pamphlet:', error);
      showToast('حدث خطأ أثناء حفظ المطوية.', 'error');
      handleFirestoreError(error, itemToEdit ? OperationType.UPDATE : OperationType.CREATE, `pamphlets/${itemToEdit?.id || ''}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper title={itemToEdit ? "تعديل مطوية" : "إضافة مطوية جديدة"} onCancel={onCancel} onSubmit={handleSubmit} loading={loading}>
      <Input label="عنوان المطوية" placeholder="أدخل عنوان المطوية..." value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Textarea label="وصف المطوية" placeholder="نبذة مختصرة عن المطوية..." value={description} onChange={(e) => setDescription(e.target.value)} required />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <FileUpload label="صورة العرض (Preview)" accept="image/*" onChange={setCoverFile} file={coverFile} />
        <FileUpload label="ملف المطوية (PDF)" accept=".pdf" onChange={setPdfFile} file={pdfFile} />
      </div>
    </FormWrapper>
  );
};
