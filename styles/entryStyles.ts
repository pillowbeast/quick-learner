import { StyleSheet } from 'react-native';
import { typography, spacing, radii } from './tokens';

export const entryStyles = StyleSheet.create({
  // For all Loading Containers
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    flexDirection: 'column',
    width: '100%',
    },
  card: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
    height: "auto",
    borderRadius: radii.sm,
  },
  cardRowContent: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
  },
  cardColumnContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '100%',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  textContainer: {
    flexDirection: 'column',
    marginLeft: 12,
    flex: 1,
  },
}); 