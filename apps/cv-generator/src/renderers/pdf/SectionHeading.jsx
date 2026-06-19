import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { theme } from '../../theme'

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.accent,
    marginBottom: 6,
    paddingBottom: 2,
  },
  text: {
    fontFamily: theme.fonts.heading,
    fontSize: theme.fonts.sizes.sectionHead,
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
})

export default function SectionHeading({ children }) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.text}>{children}</Text>
    </View>
  )
}
