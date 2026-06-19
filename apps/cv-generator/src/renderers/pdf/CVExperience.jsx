import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { theme } from '../../theme'
import SectionHeading from './SectionHeading'

const styles = StyleSheet.create({
  item: { marginBottom: theme.spacing.itemGap },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  role: { fontFamily: theme.fonts.heading, fontSize: theme.fonts.sizes.body },
  company: { fontSize: theme.fonts.sizes.body, color: theme.colors.muted },
  date: { fontSize: theme.fonts.sizes.small, color: theme.colors.muted },
  bullet: { fontSize: theme.fonts.sizes.body, marginTop: 2, marginLeft: 10 },
})

export default function CVExperience({ items }) {
  return (
    <View style={{ marginBottom: theme.spacing.sectionGap }}>
      <SectionHeading>Experience</SectionHeading>
      {items.map((item, i) => (
        <View key={i} style={styles.item}>
          <View style={styles.row}>
            <Text style={styles.role}>{item.role}</Text>
            <Text style={styles.date}>{item.startDate} – {item.endDate}</Text>
          </View>
          <Text style={styles.company}>{item.company}{item.location ? `, ${item.location}` : ''}</Text>
          {item.bullets.map((b, j) => (
            <Text key={j} style={styles.bullet}>• {b}</Text>
          ))}
        </View>
      ))}
    </View>
  )
}
