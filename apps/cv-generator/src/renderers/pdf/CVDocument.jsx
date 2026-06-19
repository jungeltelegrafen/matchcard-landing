import { Document, Page, StyleSheet } from '@react-pdf/renderer'
import { theme } from '../../theme'
import CVHeader from './CVHeader'
import CVExperience from './CVExperience'
import CVEducation from './CVEducation'
import CVSkills from './CVSkills'

const styles = StyleSheet.create({
  page: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fonts.sizes.body,
    color: theme.colors.text,
    paddingTop: theme.spacing.pagePaddingY,
    paddingBottom: theme.spacing.pagePaddingY,
    paddingLeft: theme.spacing.pagePaddingX,
    paddingRight: theme.spacing.pagePaddingX,
    backgroundColor: theme.colors.background,
  },
})

export default function CVDocument({ data }) {
  return (
    <Document>
      <Page size={theme.pageSize} style={styles.page}>
        <CVHeader personal={data.personal} />
        {data.experience.length > 0 && <CVExperience items={data.experience} />}
        {data.education.length > 0 && <CVEducation items={data.education} />}
        {data.skills.length > 0 && <CVSkills items={data.skills} languages={data.languages} />}
      </Page>
    </Document>
  )
}
