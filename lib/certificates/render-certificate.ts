'use client';

/**
 * Renders a certificate to an offscreen canvas and returns a PNG data
 * URL. Deliberately built on the native Canvas API rather than adding
 * a PDF library (jsPDF etc.) as a new dependency — this project has
 * added zero new npm packages across every phase so far, and a
 * downloadable PNG is a perfectly real, shareable certificate without
 * that tradeoff. If a Word/PDF deliverable is ever specifically
 * needed, this is the file to revisit first.
 *
 * Colors match the platform's real design tokens (tailwind.config —
 * vellum/steel/oxide/concrete), not arbitrary certificate-template
 * colors, so a downloaded certificate still looks like it came from
 * this platform.
 */

export interface CertificateContent {
  eyebrow: string; // e.g. "Certificate of Completion"
  recipientName: string;
  bodyLine: string; // e.g. "has successfully completed the course"
  subjectLine: string; // e.g. the course title
  dateLine: string; // pre-formatted, localized date string
  certificateId: string;
  footer: string; // e.g. "EngineX Learn"
}

const COLORS = {
  background: '#FBFAF6', // vellum-50
  border: '#4A7C82', // steel-500
  borderInner: '#8FB8BD', // steel-300
  accent: '#C4632F', // oxide-500
  textDark: '#16263F', // near the platform's dark navy
  textMuted: '#6B655B', // concrete-600
};

export function renderCertificatePng(content: CertificateContent): string {
  const width = 1400;
  const height = 990;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, width, height);

  // Outer border
  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 6;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  // Inner border
  ctx.strokeStyle = COLORS.borderInner;
  ctx.lineWidth = 2;
  ctx.strokeRect(58, 58, width - 116, height - 116);

  // Corner accent ticks (small, restrained — not a busy template)
  const tick = 26;
  ctx.strokeStyle = COLORS.accent;
  ctx.lineWidth = 4;
  [
    [58, 58, tick, 0, 0, tick],
    [width - 58, 58, -tick, 0, 0, tick],
    [58, height - 58, tick, 0, 0, -tick],
    [width - 58, height - 58, -tick, 0, 0, -tick],
  ].forEach(([x, y, dx1, dy1, dx2, dy2]) => {
    ctx.beginPath();
    ctx.moveTo(x + dx1, y + dy1);
    ctx.lineTo(x, y);
    ctx.lineTo(x + dx2, y + dy2);
    ctx.stroke();
  });

  ctx.textAlign = 'center';

  // Footer / platform name (top, small — establishes source before the eye reaches the title)
  ctx.fillStyle = COLORS.textMuted;
  ctx.font = '600 24px Georgia, serif';
  ctx.fillText(content.footer, width / 2, 130);

  // Eyebrow
  ctx.fillStyle = COLORS.accent;
  ctx.font = '600 22px Arial, sans-serif';
  ctx.fillText(content.eyebrow.toUpperCase(), width / 2, 190);

  // Recipient name — the focal point
  ctx.fillStyle = COLORS.textDark;
  ctx.font = '700 56px Georgia, serif';
  ctx.fillText(content.recipientName, width / 2, 290);

  // Underline beneath the name
  const nameWidth = ctx.measureText(content.recipientName).width;
  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - nameWidth / 2 - 20, 315);
  ctx.lineTo(width / 2 + nameWidth / 2 + 20, 315);
  ctx.stroke();

  // Body line
  ctx.fillStyle = COLORS.textMuted;
  ctx.font = '400 26px Arial, sans-serif';
  ctx.fillText(content.bodyLine, width / 2, 375);

  // Subject line (course/achievement) — second focal point
  ctx.fillStyle = COLORS.textDark;
  ctx.font = '700 40px Georgia, serif';
  wrapCenteredText(ctx, content.subjectLine, width / 2, 440, width - 300, 48);

  // Date
  ctx.fillStyle = COLORS.textMuted;
  ctx.font = '400 22px Arial, sans-serif';
  ctx.fillText(content.dateLine, width / 2, 560);

  // Certificate ID, bottom
  ctx.fillStyle = COLORS.textMuted;
  ctx.font = '400 18px Courier New, monospace';
  ctx.fillText(content.certificateId, width / 2, height - 90);

  ctx.font = '400 14px Arial, sans-serif';
  ctx.fillText('Verify at /certificates/verify', width / 2, height - 65);

  return canvas.toDataURL('image/png');
}

function wrapCenteredText(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  startY: number,
  maxWidth: number,
  lineHeight: number
): void {
  const words = text.split(' ');
  let line = '';
  let y = startY;
  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, centerX, y);
      line = word;
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) ctx.fillText(line, centerX, y);
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
