const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /const BookCard = \(\{ book, onDetails, categoryName \}: \{ book: any, onDetails\?: \(\) => void, categoryName\?: string \}\) => \(/,
  'const BookCard = ({ book, onDetails, categoryName }: { book: any, onDetails?: () => void, categoryName?: string, key?: React.Key }) => ('
);

fs.writeFileSync('src/App.tsx', content);
