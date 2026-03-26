const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace h3 text-[24px] with text-[20px] md:text-[22px]
content = content.replace(/text-\[24px\]/g, 'text-[20px] md:text-[22px]');
content = content.replace(/text-2xl/g, 'text-[20px] md:text-[22px]');

// Replace p text-[16px] with text-[15px] md:text-[16px]
content = content.replace(/text-\[16px\]/g, 'text-[15px] md:text-[16px]');

// Replace h2 text-[32px] md:text-[40px] with text-[28px] md:text-[32px]
content = content.replace(/text-\[32px\] md:text-\[40px\]/g, 'text-[28px] md:text-[32px]');
content = content.replace(/text-\[40px\] md:text-\[48px\]/g, 'text-[32px] md:text-[40px]');
content = content.replace(/text-\[48px\] md:text-\[64px\]/g, 'text-[36px] md:text-[48px]');

fs.writeFileSync('src/App.tsx', content);

let adminContent = fs.readFileSync('src/AdminDashboard.tsx', 'utf8');
adminContent = adminContent.replace(/text-\[24px\]/g, 'text-[20px] md:text-[22px]');
adminContent = adminContent.replace(/text-\[16px\]/g, 'text-[15px] md:text-[16px]');
fs.writeFileSync('src/AdminDashboard.tsx', adminContent);

console.log("Fonts fixed");
