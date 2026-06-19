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

export function buildSkills(items, languages) {
  if (!items?.length && !languages?.length) return []
  return [
    sectionHeading('Skills'),
    ...(items || []).map(group =>
      new Paragraph({
        children: [
          new TextRun({ text: `${group.category}: `, bold: true }),
          new TextRun({ text: group.items.join(', '), color: hex(theme.colors.muted) }),
        ],
        spacing: { after: 60 },
      })
    ),
    ...(languages?.length
      ? [new Paragraph({
          children: [
            new TextRun({ text: 'Languages: ', bold: true }),
            new TextRun({
              text: languages.map(l => `${l.language} (${l.proficiency})`).join(', '),
              color: hex(theme.colors.muted),
            }),
          ],
        })]
      : []),
  ]
}
