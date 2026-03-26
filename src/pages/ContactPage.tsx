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

const ContactPage = ({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
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
      await addDoc(collection(db, "messages"), {
        ...formData,
        createdAt: serverTimestamp(),
        status: "new",
      });
      setSubmitSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error("Error sending message: ", error);
      alert("حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.");
      handleFirestoreError(error, OperationType.CREATE, "messages");
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-amiri text-white mb-6">
              تواصل معنا
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-emerald-100/80 max-w-2xl mx-auto leading-relaxed">
              نسعد بتواصلكم معنا للإجابة على استفساراتكم المتعلقة بمؤلفات
              ومحاضرات الشيخ، أو لأي اقتراحات تساهم في تطوير الموقع.
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
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold font-amiri text-emerald-900 mb-6">
                معلومات التواصل
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center shrink-0 text-emerald-600">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-900 mb-1">
                      البريد الإلكتروني
                    </h4>
                    <p className="text-emerald-700/80 text-sm mb-1">
                      للاستفسارات العامة والمراسلات
                    </p>
                    <a
                      href="mailto:info@zakaria-alheh.com"
                      className="text-gold-600 hover:text-gold-700 font-medium inline-block"
                      dir="ltr"
                    >
                      info@zakaria-alheh.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center shrink-0 text-emerald-600">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-900 mb-1">
                      الموقع الرسمي
                    </h4>
                    <p className="text-emerald-700/80 text-sm mb-1">
                      منصة الشيخ زكريا بن طه شحادة
                    </p>
                    <a
                      href="https://www.zakaria-alheh.com"
                      className="text-gold-600 hover:text-gold-700 font-medium inline-block"
                      dir="ltr"
                    >
                      www.zakaria-alheh.com
                    </a>
                  </div>
                </div>
              </div>

              <hr className="my-8 border-emerald-100" />

              <h4 className="font-bold text-emerald-900 mb-4">
                تابعنا على المنصات الاجتماعية
              </h4>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors"
                >
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
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold font-amiri text-emerald-900 mb-6">
                أرسل رسالة
              </h3>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {submitSuccess && (
                  <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-200 mb-6">
                    تم إرسال رسالتك بنجاح. شكراً لتواصلك معنا!
                  </div>
                )}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-emerald-900"
                    >
                      الاسم الكريم
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-emerald-100 bg-emerald-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-emerald-900"
                    >
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-emerald-100 bg-emerald-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all text-right"
                      placeholder="example@domain.com"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-emerald-900"
                  >
                    الموضوع
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-emerald-100 bg-emerald-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
                    placeholder="عنوان الرسالة"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-emerald-900"
                  >
                    نص الرسالة
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-emerald-100 bg-emerald-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all resize-none"
                    placeholder="اكتب رسالتك هنا..."
                  ></textarea>
                </div>

                <div className="pt-2">
                  <Button
                    variant="primary"
                    className="w-full md:w-auto px-10"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "جاري الإرسال..."
                    ) : (
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

export { ContactPage };
import { Button } from "../components/Button";
import { Mail, Globe, Facebook, Youtube, Send, Video } from "lucide-react";
