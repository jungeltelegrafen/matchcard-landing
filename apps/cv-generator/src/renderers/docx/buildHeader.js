import { Paragraph, TextRun, AlignmentType, BorderStyle } from 'docx'
import { theme } from '../../theme'

function hex(c) { return c.replace('#', '') }

export function buildHeader(personal) {
  return [
    new Paragraph({
      children: [
        new TextRun({
          text: `${personal.firstName} ${personal.lastName}`,
          bold: true,
          size: 48,              // 24pt
          color: hex(theme.colors.primary),
        }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: personal.title,
          size: 24,
          color: hex(theme.colors.accent),
        }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: [personal.email, personal.phone, personal.location].filter(Boolean).join('  ·  '),
          size: 18,
          color: hex(theme.colors.muted),
        }),
      ],
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 6, color: hex(theme.colors.accent) },
      },
      spacing: { after: 200 },
    }),
  ]
}
