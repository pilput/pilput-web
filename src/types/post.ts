export interface Post {
  id: string;
  title: string;
  body: string;
  slug: string;
  user: User;
  photo_url: string;
  created_at: string;
  updated_at: string;
  published: boolean;
  view_count: number;
  likes_count?: number;
  comments_count?: number;
  tags: Tags[];
}

export interface PostCreate {
  title: string;
  body: string;
  slug: string;
  photo_url: string;
  tags: Tags[];
}

export interface ErrorCreatePost {
  error: {
    name: string;
    issues: {
      path: string[];
      message: string;
    }[];
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  image: string;
}

interface Tags {
  id: number;
  name: string;
}

interface Comment {
  id: string;
  text: string;
  repies: Comment[];
  created_at: string;
  user: any;
}
