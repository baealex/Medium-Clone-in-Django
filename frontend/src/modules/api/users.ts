import request, { serializeObject } from './index';

type GetUserProfileInclude = 'subscribe' | 'profile' | 'social' | 'heatmap' | 'tags' | 'view' | 'most' | 'recent' | 'about';

export interface GetUserProfileResponseData {
    subscribe: {
        hasSubscribe: boolean;
    },
    profile: {
        image: string;
        username: string;
        realname: string;
        bio: string;
    },
    social?: {
        username: string;
        homepage?: string;
        github?: string;
        twitter?: string;
        youtube?: string;
        facebook?: string;
        instagram?: string;
    },
    heatmap?: {
        [key: string]: number;
    };
    tags?: {
        name: string;
        count: number;
    }[],
    view?: {
        today: number;
        yesterday: number;
        total: number;
    },
    most?: {
        url: string;
        title: string;
        image: string;
        readTime: number;
        createdDate: string;
        authorImage: string;
        author: string;
    }[],
    recent?: {
        type: string;
        text: string;
        url: string;
    }[],
    about?: string;
}

export async function getUserProfile(author: string, includes: GetUserProfileInclude[]) {
    return await request<GetUserProfileResponseData>({
        url: `/v1/users/${encodeURIComponent(author)}?includes=${includes.join(',')}`,
        method: 'GET'
    });
}

export interface GetUserAboutResponseData {
    aboutMd: string;
}

export async function getUserAbout(author: string) {
    return await request<GetUserAboutResponseData>({
        url: `/v1/users/${encodeURIComponent(author)}?get=about`,
        method: 'GET'
    });
}

interface PutUserFollowResponseData {
    hasSubscribe: boolean;
}

export async function putUserFollow(author: string) {
    return await request<PutUserFollowResponseData>({
        url: `/v1/users/${encodeURIComponent(author)}`,
        method: 'PUT',
        data: serializeObject({ follow: author })
    });
}

export async function putUserAbout(author: string, aboutMarkdown: string, aboutMarkup: string) {
    return await request<unknown>({
        url: `/v1/users/${encodeURIComponent(author)}`,
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: serializeObject({
            about: author,
            about_md: aboutMarkdown,
            about_html: aboutMarkup
        })
    });
}