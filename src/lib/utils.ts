import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as currency with proper decimal places and thousand separators
 * @param value - The number to format
 * @param currency - Currency code (e.g., 'IDR', 'USD', 'EUR')
 * @param options - Optional formatting options
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number | string,
  currency: string = "IDR",
  options?: {
    showSymbol?: boolean;
    decimals?: number;
    locale?: string;
  }
): string {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return "-";
  }

  const {
    showSymbol = true,
    decimals = 2,
    locale = "en-US",
  } = options || {};

  // Currency symbol mapping
  const currencySymbols: Record<string, string> = {
    IDR: "Rp",
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    SGD: "S$",
    MYR: "RM",
    THB: "฿",
    PHP: "₱",
    VND: "₫",
  };

  const symbol = showSymbol ? (currencySymbols[currency] || currency) : "";
  
  // Format number with thousand separators and decimal places
  const formatted = numValue.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  // For IDR, symbol goes before the number
  if (currency === "IDR" && showSymbol) {
    return `${symbol} ${formatted}`;
  }
  
  // For other currencies, add symbol prefix
  if (showSymbol && symbol) {
    return `${symbol}${formatted}`;
  }

  return formatted;
}

/**
 * Format a number with thousand separators (for non-currency values like units)
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted number string
 */
export function formatNumber(
  value: number | string,
  decimals: number = 2
): string {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return "-";
  }

  return numValue.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}