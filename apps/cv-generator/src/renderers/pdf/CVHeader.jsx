import { View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import { theme } from '../../theme'

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sectionGap,
    paddingBottom: theme.spacing.itemGap,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.accent,
  },
  left: { flex: 1 },
  name: {
    fontSize: theme.fonts.sizes.name,
    fontFamily: theme.fonts.heading,
    color: theme.colors.primary,
  },
  jobTitle: {
    fontSize: theme.fonts.sizes.title,
    color: theme.colors.accent,
    marginTop: 4,
  },
  contact: {
    fontSize: theme.fonts.sizes.small,
    color: theme.colors.muted,
    marginTop: 2,
  },
  logo: {
    width: 80,
    height: 40,
    objectFit: 'contain',
  },
})

export default function CVHeader({ personal }) {
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <Text style={styles.name}>{personal.firstName} {personal.lastName}</Text>
        <Text style={styles.jobTitle}>{personal.title}</Text>
        <Text style={styles.contact}>
          {[personal.email, personal.phone, personal.location].filter(Boolean).join('  ·  ')}
        </Text>
        {personal.linkedin && (
          <Text style={styles.contact}>{personal.linkedin}</Text>
        )}
      </View>
      {/* TODO: replace logo-placeholder.png with actual logo from branding */}
      <Image style={styles.logo} src={theme.logoPath} />
    </View>
  )
}
