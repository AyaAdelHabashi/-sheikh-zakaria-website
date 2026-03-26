const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// The Button component ends with:
//     text: "bg-transparent text-emerald-800 hover:text-emerald-950 underline-offset-4 hover:underline p-0"
//   };
//   return (
//     <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
//       {Icon && <Icon className="w-5 h-5 ml-2" />}
//       {children}
//     </button>
//   );
// };

const bookCardComponent = `
const BookCard = ({ book, onDetails, categoryName }: { book: any, onDetails?: () => void, categoryName?: string }) => (
  <motion.div 
    layout
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    whileHover={{ y: -10 }}
    className="bg-white rounded-xl overflow-hidden shadow-lg border border-emerald-50 hover:shadow-2xl transition-all duration-300 group flex flex-col h-full"
  >
    <div className="aspect-[2/3] overflow-hidden relative bg-emerald-100">
      <img 
        src={book.coverUrl} 
        alt={book.title} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      {categoryName && (
        <div className="absolute top-4 right-4 bg-gold-500 text-emerald-950 text-[12px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
          {categoryName}
        </div>
      )}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
        <button className="p-3 bg-white rounded-full text-emerald-900 hover:bg-gold-400 transition-colors shadow-lg" title="قراءة">
          <BookOpen className="w-5 h-5" />
        </button>
        <button className="p-3 bg-white rounded-full text-emerald-900 hover:bg-gold-400 transition-colors shadow-lg" title="تحميل">
          <Download className="w-5 h-5" />
        </button>
      </div>
    </div>
    <div className="p-6 flex flex-col flex-1">
      <h3 className="font-bold text-[24px] text-emerald-900 mb-3 font-amiri line-clamp-1">{book.title}</h3>
      <p className="text-emerald-700/80 text-[16px] mb-6 line-clamp-2 leading-relaxed flex-1">{book.description}</p>
      <div className="flex justify-between items-center pt-4 border-t border-emerald-50 mt-auto">
        <span className="text-[16px] text-emerald-500 font-medium">PDF متوفر</span>
        <button onClick={onDetails} className="text-gold-600 hover:text-gold-700 text-[16px] font-bold flex items-center transition-colors">
          التفاصيل <ChevronLeft className="w-5 h-5 mr-1" />
        </button>
      </div>
    </div>
  </motion.div>
);
`;

content = content.replace(
  /const Button = \(\{ children, variant = 'primary', className = '', icon: Icon, onClick \}: \{ children: React\.ReactNode, variant\?: 'primary' \| 'secondary' \| 'outline' \| 'text', className\?: string, icon\?: any, onClick\?: \(\) => void \}\) => \{[\s\S]*?return \([\s\S]*?<\/button>\s*\);\s*\};/,
  (match) => match + '\n' + bookCardComponent
);

// Home page book cards
content = content.replace(
  /<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">\s*\{BOOKS\.map\(\(book\) => \(\s*<motion\.div[\s\S]*?<\/motion\.div>\s*\)\)\}\s*<\/div>/,
  `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {BOOKS.slice(0, 4).map((book) => (
            <BookCard key={book.id} book={book} onDetails={() => onNavigate('library')} />
          ))}
        </div>`
);

// Library page book cards
content = content.replace(
  /<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">\s*\{filteredBooks\.map\(\(book\) => \(\s*<motion\.div[\s\S]*?<\/motion\.div>\s*\)\)\}\s*<\/div>/,
  `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredBooks.map((book) => (
                <BookCard 
                  key={book.id} 
                  book={book} 
                  categoryName={categories.find(c => c.id === book.category)?.name}
                  onDetails={() => setSelectedBook(book)} 
                />
              ))}
            </div>`
);

fs.writeFileSync('src/App.tsx', content);
console.log('Book cards unified');
