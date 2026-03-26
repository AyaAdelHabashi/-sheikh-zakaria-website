export interface Book {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  pdfUrl: string;
  category: string;
  createdAt: any;
}

export interface AudioLecture {
  id: string;
  title: string;
  description: string;
  category: string;
  soundcloudUrl: string;
  createdAt: any;
}

export interface VideoLecture {
  id: string;
  title: string;
  description: string;
  category: string;
  youtubeUrl: string;
  createdAt: any;
}

export interface Reflection {
  id: string;
  title: string;
  text: string;
  createdAt: any;
}

export interface Pamphlet {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  pdfUrl: string;
  createdAt: any;
}

export interface Message {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: any;
  status?: string;
}
