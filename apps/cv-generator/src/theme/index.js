// ─────────────────────────────────────────────────────────────────────────────
// BRANDING — update this file when logo, colors, and fonts are provided.
// Both the PDF renderer and DOCX renderer import from here.
// ─────────────────────────────────────────────────────────────────────────────

export const theme = {
  colors: {
    primary:    '#1A1A2E',   // headings, name — TODO: replace with brand color
    accent:     '#C97B4B',   // section rules, highlights — TODO: replace
    text:       '#2B2B2B',   // body text
    muted:      '#6B6B6B',   // dates, secondary info
    background: '#FFFFFF',
    border:     '#E0E0E0',
  },

  fonts: {
    // PDF renderer uses registered font names (see src/renderers/pdf/fonts.js)
    heading: 'Helvetica-Bold',
    body:    'Helvetica',

    sizes: {
      name:        24,
      title:       12,
      sectionHead: 11,
      body:        10,
      small:       9,
    },
  },

  spacing: {
    pagePaddingX: 40,  // pt
    pagePaddingY: 36,
    sectionGap:   16,
    itemGap:       8,
  },

  // Path to logo asset. Replace with actual file once branding is provided.
  // Logo is shown in the PDF header and optionally in the DOCX header.
  logoPath: '/src/assets/logo-placeholder.png',

  // Page size for PDF output
  pageSize: 'A4',
}
