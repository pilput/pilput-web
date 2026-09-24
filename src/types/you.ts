export interface Auth {
  id?: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  image: string;
  is_super_admin?: boolean;
}