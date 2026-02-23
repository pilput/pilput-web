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

/**
 * Format raw number string with thousand separators for input display (e.g. "1000000" -> "1,000,000").
 * Preserves trailing dot and decimal part for typing.
 */
export function formatThousandsForInput(raw: string): string {
  if (raw === "" || raw === ".") return raw;
  const stripped = raw.replace(/,/g, "");
  const dotIdx = stripped.indexOf(".");
  const hasTrailingDot = stripped.endsWith(".");
  const intPart = dotIdx === -1 ? stripped : stripped.slice(0, dotIdx);
  const decPart = dotIdx === -1 ? "" : stripped.slice(dotIdx + 1);
  const intNum = parseInt(intPart || "0", 10);
  if (isNaN(intNum) && intPart !== "" && intPart !== "-") return raw;
  const formattedInt = intNum.toLocaleString("en-US", { maximumFractionDigits: 0 });
  const decimal = decPart ? "." + decPart : hasTrailingDot ? "." : "";
  return formattedInt + decimal;
}

/**
 * Get color classes for a platform badge based on the platform name.
 * Platforms use a "Brand Tag" style: slightly more saturated, visible border.
 */
export function getPlatformColor(platformName: string): string {
  const colors: Record<string, string> = {
    Ajaib: "bg-blue-100/80 text-blue-800 border-blue-300 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-700/50",
    Stockbit: "bg-emerald-100/80 text-emerald-800 border-emerald-300 dark:bg-emerald-900/50 dark:text-emerald-200 dark:border-emerald-700/50",
    "Bank Jago": "bg-amber-100/80 text-amber-800 border-amber-300 dark:bg-amber-900/50 dark:text-amber-200 dark:border-amber-700/50",
    "Bank BSI": "bg-cyan-100/80 text-cyan-800 border-cyan-300 dark:bg-cyan-900/50 dark:text-cyan-200 dark:border-cyan-700/50",
    Bareksa: "bg-green-100/80 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-200 dark:border-green-700/50",
    Bibit: "bg-lime-100/80 text-lime-800 border-lime-300 dark:bg-lime-900/50 dark:text-lime-200 dark:border-lime-700/50",
    Growin: "bg-indigo-100/80 text-indigo-800 border-indigo-300 dark:bg-indigo-900/50 dark:text-indigo-200 dark:border-indigo-700/50",
    Pluang: "bg-orange-100/80 text-orange-800 border-orange-300 dark:bg-orange-900/50 dark:text-orange-200 dark:border-orange-700/50",
    Others: "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  };
  const normalized = platformName.trim();
  return colors[normalized] || "bg-muted text-muted-foreground border-border";
}

/**
 * Get color classes for a holding type.
 * Returns only text color classes for a cleaner, non-badge look.
 */
export function getHoldingTypeColor(typeName: string): string {
  const colors: Record<string, string> = {
    // Financial Instruments
    Stock: "text-blue-600 dark:text-blue-400",
    Crypto: "text-orange-600 dark:text-orange-400",
    Bond: "text-emerald-600 dark:text-emerald-400",
    ETF: "text-purple-600 dark:text-purple-400",
    "Mutual Fund": "text-indigo-600 dark:text-indigo-400",
    
    // Commodities & Physical Assets
    Commodity: "text-amber-600 dark:text-amber-400",
    Gold: "text-yellow-700 dark:text-yellow-500",
    Silver: "text-slate-600 dark:text-slate-400",
    "Real Estate": "text-rose-600 dark:text-rose-400",
    
    // Cash & Equivalents
    Cash: "text-slate-600 dark:text-slate-400",
    Savings: "text-cyan-600 dark:text-cyan-400",
    Deposit: "text-sky-600 dark:text-sky-400",
    Deposito: "text-sky-600 dark:text-sky-400",
    
    // Retirement & Long-term
    Pension: "text-stone-600 dark:text-stone-400",
    Insurance: "text-teal-600 dark:text-teal-400",
    
    // Alternative & Specialized
    Collectibles: "text-pink-600 dark:text-pink-400",
    Venture: "text-lime-600 dark:text-lime-400",
    "Private Equity": "text-violet-600 dark:text-violet-400",
    Debt: "text-red-600 dark:text-red-400",
  };

  const normalizedTypeName = typeName.trim();
  return colors[normalizedTypeName] || "text-muted-foreground";
}

/**
 * Parse displayed input (with thousand separators) back to raw number string for storage.
 */
export function parseThousandsFromInput(display: string): string {
  return display.replace(/,/g, "");
}