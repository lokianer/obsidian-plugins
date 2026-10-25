// Text in the SVG views (world graph, faction view).

/**
 * A generous estimate of a label's width in pixels. Measuring needs a laid-out SVG, which a tab
 * that is still hidden does not have; a little too much room is harmless.
 */
export function textWidth(text: string, size: number, bold = false): number {
  return text.length * size * (bold ? 0.62 : 0.56);
}
