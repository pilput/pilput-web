interface Post {
    id: string;
    title: string;
    body: string;
    slug: string;
    creator: any;
    photo_url: string;
    created_at: string;
    updated_at: string;
}

interface Comment {
    id: string;
    text: string;
    repies: Comment;
    created_at: string;
    creator: any;
}