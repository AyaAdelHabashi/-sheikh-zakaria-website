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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-amiri text-white mb-6">
            سيرة الشيخ
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
            تستعرض هذه الصفحة مسيرة الشيخ العلمية والدعوية، ونشأته، وشيوخه،
            وإسهاماته في خدمة الإسلام والمسلمين.
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
                  ولد الشيخ زكريا بن طه شحادة في بيئة صالحة محبة للعلم والعلماء.
                  نشأ على حب القرآن الكريم والسنة النبوية المطهرة، وبدأ حفظ
                  القرآن في سن مبكرة حتى أتمه. ظهرت عليه علامات النبوغ والذكاء
                  منذ صغره، مما دفع والديه لتوجيهه نحو طلب العلم الشرعي.
                </p>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 font-amiri mb-6 flex items-center gap-4">
                  <span className="w-8 h-px bg-gold-500"></span>
                  المسيرة العلمية
                </h2>
                <p className="text-lg md:text-xl lg:text-2xl text-emerald-800/80 leading-relaxed text-justify">
                  التحق بالمعاهد الشرعية وتدرج في طلب العلم الأكاديمي حتى نال
                  أعلى الدرجات العلمية. لم يكتفِ بالدراسة الأكاديمية، بل جالس
                  كبار العلماء والمشايخ، وقرأ عليهم أمهات الكتب في العقيدة
                  والفقه والحديث والتفسير واللغة العربية، وحصل على إجازات علمية
                  متعددة بأسانيد متصلة.
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
                  كرس الشيخ حياته لنشر العلم والدعوة إلى الله بالحكمة والموعظة
                  الحسنة. تصدى للتدريس في المساجد والمعاهد، وله دروس راتبة في
                  التفسير وشرح الحديث والفقه. يتميز أسلوبه بالوسطية والاعتدال،
                  والحرص على جمع الكلمة وتأليف القلوب، مع العناية الفائقة بتزكية
                  النفوس وربط المسلمين بدينهم.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-12 md:py-20 bg-emerald-50 overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHeader
            title="محطات في حياة الشيخ"
            subtitle="أبرز التواريخ والإنجازات في المسيرة العلمية والدعوية"
          />

          <div className="relative mt-16 max-w-4xl mx-auto">
            {/* Vertical Line */}
            <div className="hidden md:block absolute top-0 bottom-0 right-1/2 translate-x-1/2 w-1 bg-emerald-200 rounded-full"></div>

            <div className="flex flex-col gap-8 md:gap-12 px-4">
              {[
                {
                  year: "1980",
                  title: "الولادة والنشأة",
                  desc: "ولد الشيخ في بيئة علمية وبدأ حفظ القرآن الكريم.",
                },
                {
                  year: "1998",
                  title: "إتمام حفظ القرآن",
                  desc: "أتم حفظ القرآن الكريم كاملاً مع إتقان أحكام التجويد.",
                },
                {
                  year: "2005",
                  title: "الإجازة العلمية",
                  desc: "حصل على الإجازة العالية في العلوم الشرعية من جامعة (اسم الجامعة).",
                },
                {
                  year: "2010",
                  title: "بداية التدريس",
                  desc: "بدأ في إلقاء الدروس والمحاضرات في المساجد والمعاهد الشرعية.",
                },
                {
                  year: "2015",
                  title: "أول مؤلفاته",
                  desc: "أصدر كتابه الأول الذي لاقى قبولاً واسعاً بين طلبة العلم.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row items-center gap-8 group ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                >
                  {/* Timeline Dot */}
                  <div className="hidden md:flex w-8 h-8 absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-emerald-800 rounded-full border-4 border-emerald-50 items-center justify-center z-10 group-hover:scale-110 transition-transform">
                    <div className="w-2.5 h-2.5 bg-gold-400 rounded-full"></div>
                  </div>

                  {/* Content Card */}
                  <div
                    className={`w-full md:w-1/2 ${index % 2 === 0 ? "md:pl-12" : "md:pr-12"}`}
                  >
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-100 hover:shadow-md transition-shadow text-center md:text-right flex flex-col items-center md:items-start">
                      <span className="inline-block px-6 py-2 bg-gold-100 text-gold-700 rounded-full text-base md:text-lg font-bold mb-6">
                        {item.year}
                      </span>
                      <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-emerald-900 font-amiri mb-4">
                        {item.title}
                      </h3>
                      <p className="text-base md:text-lg text-emerald-700/80 leading-relaxed">
                        {item.desc}
                      </p>
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
          <SectionHeader
            title="الإسهامات العلمية"
            subtitle="جهود الشيخ في نشر العلم وخدمة المجتمع"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: BookOpen,
                title: "المؤلفات والكتب",
                desc: "عشرات الكتب والرسائل العلمية في مختلف الفنون الشرعية.",
              },
              {
                icon: Mic,
                title: "الدروس والمحاضرات",
                desc: "مئات الساعات الصوتية والمرئية في شرح المتون وتفسير القرآن.",
              },
              {
                icon: Users,
                title: "التعليم والتوجيه",
                desc: "تخريج أجيال من طلبة العلم والدعاة المتميزين.",
              },
              {
                icon: Heart,
                title: "الإصلاح المجتمعي",
                desc: "المشاركة الفاعلة في حل القضايا المجتمعية وإصلاح ذات البين.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-100 text-center hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-600 rotate-3 hover:rotate-0 transition-transform">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-emerald-900 font-amiri mb-4">
                  {item.title}
                </h3>
                <p className="text-base md:text-lg text-emerald-700/80 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-10 md:py-16 md:py-24 bg-emerald-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <pattern
              id="islamic-pattern-quote"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M10 0L20 10L10 20L0 10Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
              <circle
                cx="10"
                cy="10"
                r="5"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
            <rect
              width="100%"
              height="100%"
              fill="url(#islamic-pattern-quote)"
            />
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="w-16 h-16 mx-auto bg-gold-500/20 rounded-full flex items-center justify-center text-gold-400 mb-8">
            <span className="font-amiri text-4xl">❝</span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-amiri text-white leading-relaxed mb-10 max-w-4xl mx-auto">
            "العلم الحقيقي هو الذي يورث صاحبه خشية الله، والتواضع للخلق، والحرص
            على نفع الأمة في دينها ودنياها."
          </h2>
          <div className="flex items-center justify-center gap-6">
            <div className="h-px w-16 bg-gold-500/50"></div>
            <p className="text-gold-400 font-bold text-lg md:text-xl lg:text-2xl font-amiri">
              الشيخ زكريا بن طه شحادة
            </p>
            <div className="h-px w-16 bg-gold-500/50"></div>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-12 md:py-20 bg-emerald-50">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHeader
            title="معرض الصور"
            subtitle="لقطات من مجالس العلم والمشاركات الدعوية"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1564121211835-e88c852648ab?q=80&w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?q=80&w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=800&auto=format&fit=crop",
            ].map((img, index) => (
              <div
                key={index}
                className="aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group"
              >
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

export { AboutPage };
import { SectionHeader } from "../components/SectionHeader";
import { BookOpen, Mic, Video, Heart, Users, User } from "lucide-react";
