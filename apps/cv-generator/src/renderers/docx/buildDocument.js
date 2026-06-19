import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx'
import { saveAs } from 'file-saver'
import { theme } from '../../theme'
import { buildHeader } from './buildHeader'
import { buildExperience } from './buildExperience'
import { buildEducation } from './buildEducation'
import { buildSkills } from './buildSkills'

// Converts a hex color string to the format docx expects (no #)
function hex(color) {
  return color.replace('#', '')
}

export async function downloadDocx(data, filename = 'cv.docx') {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Calibri',         // TODO: update with brand font when provided
            size: 20,                // half-points: 20 = 10pt
            color: hex(theme.colors.text),
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 900, right: 900 }, // twips
          },
        },
        children: [
          ...buildHeader(data.personal),
          ...buildExperience(data.experience),
          ...buildEducation(data.education),
          ...buildSkills(data.skills, data.languages),
        ],
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  saveAs(blob, filename)
}
