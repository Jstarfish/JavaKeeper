export interface ResponseUser {
    username: string;
    name: string;
    avatar_url: string;
    web_url: string;
}
export interface ResponseIssue {
    iid: number;
    title: string;
    description: string;
    web_url: string;
}
export interface ResponseComment {
    id: number;
    author: ResponseUser;
    body: string;
    body_html?: string;
    created_at: string;
    updated_at: string;
    reactions?: unknown;
}
export interface ResponseReaction {
    name: 'thumbsup' | 'thumbsdown' | 'heart' | string;
}
export interface ResponseMarkdown {
    html: string;
}
