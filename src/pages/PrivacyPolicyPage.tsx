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

const PrivacyPolicyPage = ({
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-amiri text-white mb-6">
              سياسة الخصوصية
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
            مقدمة
          </h2>
          <p className="text-emerald-800/80 mb-8 leading-relaxed">
            نحن في الموقع الرسمي للشيخ زكريا بن طه شحادة نولي أهمية كبرى لخصوصية
            زوارنا. توضح سياسة الخصوصية هذه أنواع المعلومات الشخصية التي نجمعها
            وكيفية استخدامها وحمايتها.
          </p>

          <h2 className="text-lg md:text-xl lg:text-2xl font-bold font-amiri text-emerald-900 mb-4">
            المعلومات التي نجمعها
          </h2>
          <p className="text-emerald-800/80 mb-4 leading-relaxed">
            قد نقوم بجمع المعلومات التالية عند زيارتك للموقع أو استخدامك
            لخدماته:
          </p>
          <ul className="list-disc list-inside text-emerald-800/80 mb-8 space-y-2">
            <li>
              <strong>المعلومات التي تقدمها طواعية:</strong> مثل الاسم والبريد
              الإلكتروني عند استخدام نموذج "اتصل بنا" أو الاشتراك في النشرة
              البريدية.
            </li>
            <li>
              <strong>المعلومات التلقائية:</strong> مثل عنوان بروتوكول الإنترنت
              (IP)، نوع المتصفح، الصفحات التي تزورها، ووقت وتاريخ الزيارة، وذلك
              لأغراض إحصائية ولتحسين تجربة المستخدم.
            </li>
          </ul>

          <h2 className="text-lg md:text-xl lg:text-2xl font-bold font-amiri text-emerald-900 mb-4">
            كيف نستخدم معلوماتك
          </h2>
          <p className="text-emerald-800/80 mb-4 leading-relaxed">
            نستخدم المعلومات التي نجمعها للأغراض التالية:
          </p>
          <ul className="list-disc list-inside text-emerald-800/80 mb-8 space-y-2">
            <li>الرد على استفساراتك ورسائلك.</li>
            <li>تحسين جودة الموقع والمحتوى المقدم.</li>
            <li>
              إرسال تحديثات دورية حول المحاضرات والكتب الجديدة (إذا اخترت
              الاشتراك).
            </li>
            <li>تحليل استخدام الموقع لفهم احتياجات الزوار بشكل أفضل.</li>
          </ul>

          <h2 className="text-lg md:text-xl lg:text-2xl font-bold font-amiri text-emerald-900 mb-4">
            حماية المعلومات
          </h2>
          <p className="text-emerald-800/80 mb-8 leading-relaxed">
            نحن نتخذ إجراءات أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير
            المصرح به أو التعديل أو الإفشاء أو الإتلاف. لا نقوم ببيع أو تأجير أو
            مشاركة معلوماتك الشخصية مع أطراف ثالثة لأغراض تسويقية.
          </p>

          <h2 className="text-lg md:text-xl lg:text-2xl font-bold font-amiri text-emerald-900 mb-4">
            ملفات تعريف الارتباط (Cookies)
          </h2>
          <p className="text-emerald-800/80 mb-8 leading-relaxed">
            قد يستخدم الموقع ملفات تعريف الارتباط لتحسين تجربة التصفح الخاصة بك.
            يمكنك ضبط إعدادات متصفحك لرفض كل ملفات تعريف الارتباط أو لتنبيهك عند
            إرسالها. ومع ذلك، قد لا تعمل بعض ميزات الموقع بشكل صحيح إذا قمت
            بتعطيلها.
          </p>

          <h2 className="text-lg md:text-xl lg:text-2xl font-bold font-amiri text-emerald-900 mb-4">
            تحديثات سياسة الخصوصية
          </h2>
          <p className="text-emerald-800/80 mb-8 leading-relaxed">
            قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سيتم نشر أي تغييرات
            على هذه الصفحة، ونشجعك على مراجعتها بشكل دوري لتبقى على اطلاع بكيفية
            حماية معلوماتك.
          </p>

          <h2 className="text-lg md:text-xl lg:text-2xl font-bold font-amiri text-emerald-900 mb-4">
            اتصل بنا
          </h2>
          <p className="text-emerald-800/80 leading-relaxed">
            إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى{" "}
            <button
              onClick={() => onNavigate("contact")}
              className="text-gold-600 hover:text-gold-700 underline underline-offset-4"
            >
              التواصل معنا
            </button>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export { PrivacyPolicyPage };
