import { Paragraph, TextRun, BorderStyle } from 'docx'
import { theme } from '../../theme'

function hex(c) { return c.replace('#', '') }

function sectionHeading(label) {
  return new Paragraph({
    children: [new TextRun({ text: label.toUpperCase(), bold: true, size: 22, color: hex(theme.colors.primary) })],
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: hex(theme.colors.accent) } },
    spacing: { before: 240, after: 100 },
  })
}

export function buildExperience(items) {
  if (!items?.length) return []
  return [
    sectionHeading('Experience'),
    ...items.flatMap(item => [
      new Paragraph({
        children: [
          new TextRun({ text: item.role, bold: true }),
          new TextRun({ text: `  ${item.startDate} – ${item.endDate}`, color: hex(theme.colors.muted), size: 18 }),
        ],
      }),
      new Paragraph({
        children: [new TextRun({ text: `${item.company}${item.location ? ', ' + item.location : ''}`, color: hex(theme.colors.muted) })],
        spacing: { after: 60 },
      }),
      ...item.bullets.map(b =>
        new Paragraph({ text: `• ${b}`, spacing: { after: 40 } })
      ),
    ]),
  ]
}
