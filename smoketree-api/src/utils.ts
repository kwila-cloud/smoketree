// Utility for segment estimation and month formatting
export function estimateSegments(content: string): number {
  return Math.ceil(content.length / 140);
}

export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}
