import { Config } from "./getConfig";

function isAbsoluteUrl(url: string): boolean {
    if (!url) return false;
    return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//');
}

function isHostnameUrl(url: string): boolean {
    if (!url) return false;
    if (isAbsoluteUrl(url)) return false;
    const DOMAIN_REGEX = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}/i;
    return DOMAIN_REGEX.test(url);
}

function getImageUrl(path: string, defaultPath: string): string {
    path = path ?? '';
    if (isAbsoluteUrl(path)) {
        return path;
    }
    if (isHostnameUrl(path)) {
        return `//${path}`;
    }

    if (!path) {
        return defaultPath;
    }

    if (path.startsWith('/')) {
        path = path.substring(1);
    }
    return `${Config.storagebaseurl}/${path}`;
}

export function getProfilePicture(path: string): string {
    return getImageUrl(path, '/ai-avatar.png');
}

export function getUrlImage(path: string): string {
    return getImageUrl(path, '');
}