export interface WriterProfile {
  bio?: string | null;
  website?: string | null;
  created_at?: string;
  updated_at?: string | null;
}

export interface Writer {
  id: string;
  username: string;
  email?: string;
  first_name: string;
  last_name: string;
  image: string | null;
  issuperadmin?: boolean;
  created_at: string;
  updated_at?: string;
  profile?: WriterProfile | null;
  followers_count?: number;
  following_count?: number;
  posts_count?: number;
  is_following?: boolean;
}
