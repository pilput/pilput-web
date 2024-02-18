import { storagebaseurl } from "./fetch";

function isFullUrl(url: string): boolean {
    return url.startsWith('http://') || url.startsWith('https://');
}
export function getProfilePicture(url: string) {
    if (isFullUrl(url)) {
        return url;
    } else {
        return storagebaseurl + url
    }
}