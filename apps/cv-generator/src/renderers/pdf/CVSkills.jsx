import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { theme } from '../../theme'
import SectionHeading from './SectionHeading'

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: theme.spacing.itemGap },
  category: { fontFamily: theme.fonts.heading, fontSize: theme.fonts.sizes.body, marginRight: 6 },
  items: { fontSize: theme.fonts.sizes.body, color: theme.colors.muted },
})

export default function CVSkills({ items, languages }) {
  return (
    <View style={{ marginBottom: theme.spacing.sectionGap }}>
      <SectionHeading>Skills</SectionHeading>
      {items.map((group, i) => (
        <View key={i} style={styles.row}>
          <Text style={styles.category}>{group.category}:</Text>
          <Text style={styles.items}>{group.items.join(', ')}</Text>
        </View>
      ))}
      {languages?.length > 0 && (
        <View style={styles.row}>
          <Text style={styles.category}>Languages:</Text>
          <Text style={styles.items}>
            {languages.map(l => `${l.language} (${l.proficiency})`).join(', ')}
          </Text>
        </View>
      )}
    </View>
  )
}
