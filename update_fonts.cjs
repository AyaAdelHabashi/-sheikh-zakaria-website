const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  path.join(__dirname, 'src', 'App.tsx'),
  path.join(__dirname, 'src', 'AdminDashboard.tsx')
];

const replacements = [
  { regex: /text-\[48px\] md:text-\[64px\]/g, replacement: 'text-4xl md:text-5xl lg:text-6xl' },
  { regex: /text-\[32px\] md:text-\[36px\]/g, replacement: 'text-2xl md:text-3xl lg:text-4xl' },
  { regex: /text-\[22px\] md:text-\[24px\]/g, replacement: 'text-lg md:text-xl lg:text-2xl' },
  { regex: /text-\[16px\] md:text-\[18px\]/g, replacement: 'text-base md:text-lg' },
  { regex: /text-\[64px\]/g, replacement: 'text-5xl md:text-6xl' },
  { regex: /text-\[48px\]/g, replacement: 'text-4xl md:text-5xl' },
  { regex: /text-\[40px\]/g, replacement: 'text-3xl md:text-4xl' },
  { regex: /text-\[36px\]/g, replacement: 'text-3xl md:text-4xl' },
  { regex: /text-\[32px\]/g, replacement: 'text-2xl md:text-3xl' },
  { regex: /text-\[24px\]/g, replacement: 'text-xl md:text-2xl' },
  { regex: /text-\[22px\]/g, replacement: 'text-lg md:text-xl' },
  { regex: /text-\[20px\]/g, replacement: 'text-lg md:text-xl' },
  { regex: /text-\[18px\]/g, replacement: 'text-base md:text-lg' },
  { regex: /text-\[16px\]/g, replacement: 'text-base' },
  { regex: /text-\[15px\]/g, replacement: 'text-sm md:text-base' },
  { regex: /text-\[12px\]/g, replacement: 'text-xs md:text-sm' },
  // Also fix some paddings and margins for mobile
  { regex: /py-20/g, replacement: 'py-12 md:py-20' },
  { regex: /py-24/g, replacement: 'py-16 md:py-24' },
  { regex: /py-16/g, replacement: 'py-10 md:py-16' },
  { regex: /mb-16/g, replacement: 'mb-10 md:mb-16' },
  { regex: /mb-12/g, replacement: 'mb-8 md:mb-12' },
  { regex: /gap-16/g, replacement: 'gap-10 md:gap-16' },
  { regex: /gap-12/g, replacement: 'gap-8 md:gap-12' },
  { regex: /p-10/g, replacement: 'p-6 md:p-10' },
  { regex: /pt-32/g, replacement: 'pt-24 md:pt-32' },
];

filesToUpdate.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;
    
    replacements.forEach(({ regex, replacement }) => {
      content = content.replace(regex, replacement);
    });
    
    if (content !== originalContent) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated ${file}`);
    } else {
      console.log(`No changes needed in ${file}`);
    }
  } else {
    console.log(`File not found: ${file}`);
  }
});
