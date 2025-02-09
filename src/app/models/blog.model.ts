export interface BlogPost {
  id: string;
  author_id: string;
  author_name: string;
  content: string;
  created_at: string;
  likes: number;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  content: string;
  created_at: string;
}