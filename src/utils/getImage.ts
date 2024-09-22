import { storagebaseurl } from "./getCofig";

function isFullUrl(url: string): boolean {
    return url.startsWith('http://') || url.startsWith('https://');
}
export function getProfilePicture(path: string): string {
    path = path ?? '';
    if (isFullUrl(path)) {
        return path;
    } else {
        return storagebaseurl + path
    }
}
export function getUrlImage(path: string): string {
    path = path ?? '';
    if (isFullUrl(path)) {
        return path;
    } else {
        return storagebaseurl + path
    }
}