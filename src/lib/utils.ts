import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Filters out empty or whitespace-only strings from an array
 * @param urls - Array of URL strings
 * @returns Array with non-empty strings only
 */
export function filterValidUrls(urls: (string | null | undefined)[]): string[] {
  return urls.filter(
    (url): url is string =>
      url !== null && url !== undefined && url.trim() !== ''
  );
}

/**
 * Gets the first valid URL from an array, or returns a fallback
 * @param urls - Array of URL strings
 * @param fallback - Fallback URL to return if no valid URLs found
 * @returns First valid URL or fallback
 */
export function getFirstValidUrl(
  urls: (string | null | undefined)[] | null | undefined,
  fallback: string
): string {
  if (!urls || !Array.isArray(urls)) return fallback;
  const validUrls = filterValidUrls(urls);
  return validUrls.length > 0 ? validUrls[0] : fallback;
}
