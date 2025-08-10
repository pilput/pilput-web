interface Writer {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    image: string;
    issuperadmin: boolean;
    created_at: string;
    updated_at: string;
    profile: profile;
}

interface profile {
    bio: string;
    website: string;
    created_at: string;
    updated_at: string;
}