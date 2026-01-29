export interface Profile {
  id: number;
  user_id: string;
  created_at: string;
  updated_at: string | null;
  bio: string | null;
  website: string | null;
  phone: string | null;
  location: string | null;
}

export interface User {
  id: string;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  first_name: string;
  last_name: string;
  email: string;
  image: string | null;
  is_super_admin: boolean;
  username: string;
  github_id: string | null;
  followers_count: number;
  following_count: number;
  last_logged_at: string | null;
  profiles?: Profile[];
}