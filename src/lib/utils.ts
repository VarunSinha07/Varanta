import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateAccountNumber(): string {
  // Format: XXXX-XXXX-XXXX (where X is a digit)
  const part1 = Math.floor(1000 + Math.random() * 9000).toString()
  const part2 = Math.floor(1000 + Math.random() * 9000).toString()
  const part3 = Math.floor(1000 + Math.random() * 9000).toString()
  
  return `${part1}-${part2}-${part3}`
}