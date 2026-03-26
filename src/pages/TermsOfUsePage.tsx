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
import { Video } from "lucide-react";

const TermsOfUsePage = ({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) => {
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-amiri text-white mb-6">
              شروط الاستخدام
            </h1>
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
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold font-amiri text-emerald-900 mb-4">
            1. قبول الشروط
          </h2>
          <p className="text-emerald-800/80 mb-8 leading-relaxed">
            مرحباً بك في الموقع الرسمي للشيخ زكريا بن طه شحادة. باستخدامك لهذا
            الموقع، فإنك توافق على الالتزام بشروط الاستخدام الموضحة أدناه. إذا
            كنت لا توافق على أي من هذه الشروط، يُرجى عدم استخدام الموقع.
          </p>

          <h2 className="text-lg md:text-xl lg:text-2xl font-bold font-amiri text-emerald-900 mb-4">
            2. حقوق الملكية الفكرية
          </h2>
          <p className="text-emerald-800/80 mb-8 leading-relaxed">
            جميع المحتويات المنشورة على هذا الموقع، بما في ذلك المقالات، الكتب،
            الصوتيات، المرئيات، والتصاميم، هي ملكية فكرية خاصة بالموقع أو مرخصة
            له. يُسمح بنشر المحتوى ومشاركته للأغراض الدعوية والتعليمية غير
            الربحية، بشرط الإشارة إلى المصدر وعدم التعديل على المحتوى.
          </p>

          <h2 className="text-lg md:text-xl lg:text-2xl font-bold font-amiri text-emerald-900 mb-4">
            3. استخدام الموقع
          </h2>
          <p className="text-emerald-800/80 mb-4 leading-relaxed">
            يتعهد المستخدم بما يلي عند استخدام الموقع:
          </p>
          <ul className="list-disc list-inside text-emerald-800/80 mb-8 space-y-2">
            <li>عدم استخدام الموقع لأي أغراض غير قانونية أو غير مصرح بها.</li>
            <li>
              عدم محاولة التدخل في عمل الموقع أو تعطيله أو الوصول غير المصرح به
              إلى أنظمته.
            </li>
            <li>
              عدم نشر أي محتوى مسيء، تشهيري، أو ينتهك حقوق الآخرين من خلال أي
              وسائل تواصل يوفرها الموقع.
            </li>
          </ul>

          <h2 className="text-lg md:text-xl lg:text-2xl font-bold font-amiri text-emerald-900 mb-4">
            4. إخلاء المسؤولية
          </h2>
          <p className="text-emerald-800/80 mb-8 leading-relaxed">
            يتم تقديم المحتوى على هذا الموقع "كما هو" لأغراض تعليمية ودعوية.
            نبذل قصارى جهدنا لضمان دقة المعلومات، ولكننا لا نتحمل أي مسؤولية
            قانونية عن أي أخطاء أو سهو، أو عن أي نتائج مترتبة على استخدام هذه
            المعلومات.
          </p>

          <h2 className="text-lg md:text-xl lg:text-2xl font-bold font-amiri text-emerald-900 mb-4">
            5. التعديلات على الشروط
          </h2>
          <p className="text-emerald-800/80 mb-8 leading-relaxed">
            نحتفظ بالحق في تعديل أو تحديث شروط الاستخدام في أي وقت دون إشعار
            مسبق. يُعتبر استمرارك في استخدام الموقع بعد إجراء أي تغييرات بمثابة
            قبول منك للشروط المعدلة.
          </p>

          <h2 className="text-lg md:text-xl lg:text-2xl font-bold font-amiri text-emerald-900 mb-4">
            6. التواصل معنا
          </h2>
          <p className="text-emerald-800/80 leading-relaxed">
            إذا كان لديك أي أسئلة أو استفسارات حول شروط الاستخدام، يرجى التواصل
            معنا عبر{" "}
            <button
              onClick={() => onNavigate("contact")}
              className="text-gold-600 hover:text-gold-700 underline underline-offset-4"
            >
              صفحة اتصل بنا
            </button>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export { TermsOfUsePage };
