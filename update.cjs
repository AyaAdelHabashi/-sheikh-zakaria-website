const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Remove breadcrumbs
content = content.replace(/<div className="inline-flex items-center gap-2 text-gold-400 mb-6 text-\[16px\]">\s*<button onClick=\{[^}]+\} className="hover:text-gold-300 transition-colors">الرئيسية<\/button>\s*<span>\/<\/span>\s*<span className="text-emerald-200">[^<]+<\/span>\s*<\/div>\s*/g, '');
content = content.replace(/<div className="flex items-center justify-center gap-2 text-gold-400 mb-4 text-sm font-medium">\s*<button onClick=\{[^}]+\} className="hover:text-gold-300 transition-colors">الرئيسية<\/button>\s*<span>\/<\/span>\s*<span className="text-emerald-300">[^<]+<\/span>\s*<\/div>\s*/g, '');

// Update images
// Library
content = content.replace(
  /<img \s*src="https:\/\/images\.unsplash\.com\/photo-1584551246679-0daf3d275d0f\?q=80&w=2000&auto=format&fit=crop" \s*alt="Islamic Architecture" \s*className="w-full h-full object-cover blur-sm"\s*\/>\s*<div className="absolute inset-0 bg-emerald-900\/80 mix-blend-multiply" \/>\s*<div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900\/80 to-transparent" \/>\s*<div className="container mx-auto px-4 md:px-8 relative z-10 text-center">\s*<h1 className="text-\[40px\] md:text-\[56px\] font-bold font-amiri text-white mb-6">المكتبة المقروءة<\/h1>/,
  `<img 
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop" 
            alt="Library" 
            className="w-full h-full object-cover blur-sm"
          />
          <div className="absolute inset-0 bg-emerald-900/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/80 to-transparent" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <h1 className="text-[40px] md:text-[56px] font-bold font-amiri text-white mb-6">المكتبة المقروءة</h1>`
);

// Audio
content = content.replace(
  /<img \s*src="https:\/\/images\.unsplash\.com\/photo-1584551246679-0daf3d275d0f\?q=80&w=2000&auto=format&fit=crop" \s*alt="Islamic Architecture" \s*className="w-full h-full object-cover blur-sm"\s*\/>\s*<div className="absolute inset-0 bg-emerald-900\/80 mix-blend-multiply" \/>\s*<div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900\/80 to-transparent" \/>\s*<div className="container mx-auto px-4 md:px-8 relative z-10 text-center">\s*<h1 className="text-\[40px\] md:text-\[56px\] font-bold font-amiri text-white mb-6">الدروس الصوتية<\/h1>/,
  `<img 
            src="https://images.unsplash.com/photo-1589903308904-1010c2294adc?q=80&w=2000&auto=format&fit=crop" 
            alt="Audio Library" 
            className="w-full h-full object-cover blur-sm"
          />
          <div className="absolute inset-0 bg-emerald-900/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/80 to-transparent" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <h1 className="text-[40px] md:text-[56px] font-bold font-amiri text-white mb-6">الدروس الصوتية</h1>`
);

// Video
content = content.replace(
  /<img \s*src="https:\/\/images\.unsplash\.com\/photo-1584551246679-0daf3d275d0f\?q=80&w=2000&auto=format&fit=crop" \s*alt="Islamic Architecture" \s*className="w-full h-full object-cover blur-sm"\s*\/>\s*<div className="absolute inset-0 bg-emerald-900\/80 mix-blend-multiply" \/>\s*<div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900\/80 to-transparent" \/>\s*<div className="container mx-auto px-4 md:px-8 relative z-10 text-center">\s*<h1 className="text-\[40px\] md:text-\[56px\] font-bold font-amiri text-white mb-6">المكتبة المرئية<\/h1>/,
  `<img 
            src="https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=2000&auto=format&fit=crop" 
            alt="Video Library" 
            className="w-full h-full object-cover blur-sm"
          />
          <div className="absolute inset-0 bg-emerald-900/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/80 to-transparent" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <h1 className="text-[40px] md:text-[56px] font-bold font-amiri text-white mb-6">المكتبة المرئية</h1>`
);

// Reflections
content = content.replace(
  /<img \s*src="https:\/\/images\.unsplash\.com\/photo-1584551246679-0daf3d275d0f\?q=80&w=2000&auto=format&fit=crop" \s*alt="Islamic Architecture" \s*className="w-full h-full object-cover blur-sm"\s*\/>\s*<div className="absolute inset-0 bg-emerald-900\/80 mix-blend-multiply" \/>\s*<div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900\/80 to-transparent" \/>\s*<div className="container mx-auto px-4 md:px-8 relative z-10 text-center">\s*<h1 className="text-\[40px\] md:text-\[56px\] font-bold font-amiri text-white mb-6">تأملات ومقالات<\/h1>/,
  `<img 
            src="https://images.unsplash.com/photo-1455390582262-044cdead2708?q=80&w=2000&auto=format&fit=crop" 
            alt="Reflections" 
            className="w-full h-full object-cover blur-sm"
          />
          <div className="absolute inset-0 bg-emerald-900/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/80 to-transparent" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <h1 className="text-[40px] md:text-[56px] font-bold font-amiri text-white mb-6">تأملات ومقالات</h1>`
);

// Contact
content = content.replace(
  /<img \s*src="https:\/\/images\.unsplash\.com\/photo-1584551246679-0daf3d275d0f\?q=80&w=2000&auto=format&fit=crop" \s*alt="Islamic Architecture" \s*className="w-full h-full object-cover blur-sm"\s*\/>\s*<div className="absolute inset-0 bg-emerald-900\/80 mix-blend-multiply" \/>\s*<div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900\/80 to-transparent" \/>\s*<div className="container mx-auto px-4 md:px-8 relative z-10 text-center">\s*<h1 className="text-\[40px\] md:text-\[56px\] font-bold font-amiri text-white mb-6">تواصل معنا<\/h1>/,
  `<img 
            src="https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=2000&auto=format&fit=crop" 
            alt="Contact" 
            className="w-full h-full object-cover blur-sm"
          />
          <div className="absolute inset-0 bg-emerald-900/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/80 to-transparent" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <h1 className="text-[40px] md:text-[56px] font-bold font-amiri text-white mb-6">تواصل معنا</h1>`
);

// About
content = content.replace(
  /<img \s*src="https:\/\/images\.unsplash\.com\/photo-1584551246679-0daf3d275d0f\?q=80&w=2000&auto=format&fit=crop" \s*alt="Islamic Architecture" \s*className="w-full h-full object-cover blur-sm"\s*\/>\s*<div className="absolute inset-0 bg-emerald-900\/80 mix-blend-multiply" \/>\s*<div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900\/80 to-transparent" \/>\s*<div className="container mx-auto px-4 md:px-8 relative z-10 text-center">\s*<h1 className="text-\[40px\] md:text-\[56px\] font-bold font-amiri text-white mb-6">عن الشيخ<\/h1>/,
  `<img 
            src="https://images.unsplash.com/photo-1585036156171-384164a8c675?q=80&w=2000&auto=format&fit=crop" 
            alt="About" 
            className="w-full h-full object-cover blur-sm"
          />
          <div className="absolute inset-0 bg-emerald-900/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/80 to-transparent" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <h1 className="text-[40px] md:text-[56px] font-bold font-amiri text-white mb-6">عن الشيخ</h1>`
);

// Terms
content = content.replace(
  /<img \s*src="https:\/\/images\.unsplash\.com\/photo-1584551246679-0daf3d275d0f\?q=80&w=2000&auto=format&fit=crop" \s*alt="Islamic Architecture" \s*className="w-full h-full object-cover blur-sm"\s*\/>\s*<div className="absolute inset-0 bg-emerald-900\/80 mix-blend-multiply" \/>\s*<div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900\/80 to-transparent" \/>\s*<div className="container mx-auto px-4 md:px-8 relative z-10 text-center">\s*<h1 className="text-\[40px\] md:text-\[56px\] font-bold font-amiri text-white mb-6">شروط الاستخدام<\/h1>/,
  `<img 
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2000&auto=format&fit=crop" 
            alt="Terms" 
            className="w-full h-full object-cover blur-sm"
          />
          <div className="absolute inset-0 bg-emerald-900/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/80 to-transparent" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <h1 className="text-[40px] md:text-[56px] font-bold font-amiri text-white mb-6">شروط الاستخدام</h1>`
);

// Privacy
content = content.replace(
  /<img \s*src="https:\/\/images\.unsplash\.com\/photo-1584551246679-0daf3d275d0f\?q=80&w=2000&auto=format&fit=crop" \s*alt="Islamic Architecture" \s*className="w-full h-full object-cover blur-sm"\s*\/>\s*<div className="absolute inset-0 bg-emerald-900\/80 mix-blend-multiply" \/>\s*<div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900\/80 to-transparent" \/>\s*<div className="container mx-auto px-4 md:px-8 relative z-10 text-center">\s*<h1 className="text-\[40px\] md:text-\[56px\] font-bold font-amiri text-white mb-6">سياسة الخصوصية<\/h1>/,
  `<img 
            src="https://images.unsplash.com/photo-1508344928928-7165b67de128?q=80&w=2000&auto=format&fit=crop" 
            alt="Privacy" 
            className="w-full h-full object-cover blur-sm"
          />
          <div className="absolute inset-0 bg-emerald-900/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/80 to-transparent" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <h1 className="text-[40px] md:text-[56px] font-bold font-amiri text-white mb-6">سياسة الخصوصية</h1>`
);

fs.writeFileSync('src/App.tsx', content);
console.log('Breadcrumbs removed and images updated');
