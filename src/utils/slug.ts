
/**
 * Converts a string to a URL-friendly slug
 * 
 * @param text - The input string to convert to a slug
 * @returns A URL-friendly slug string
 * 
 * @example
 * convertToSlug("Hello World!") // returns "hello-world"
 * convertToSlug("Café au Lait") // returns "cafe-au-lait"
 * convertToSlug("  Some  Text  ") // returns "some-text"
 */
export function convertToSlug(text: string): string {
    if (!text || typeof text !== 'string') {
        return '';
    }

    return text
        .trim()
        .toLowerCase()
        // Replace special characters and accents
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        // Replace spaces and other separators with hyphens
        .replace(/[\s\W-]+/g, '-')
        // Remove leading/trailing hyphens
        .replace(/^-+|-+$/g, '')
        // Collapse multiple hyphens into one
        .replace(/-+/g, '-');
}