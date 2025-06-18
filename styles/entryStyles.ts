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
    backgroundColor: 'red',
  },
  cardRowContent: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
    backgroundColor: 'blue',
  },
  cardColumnContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
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
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 8,
  },
  addButtonText: {
    fontSize: 16,
    marginLeft: 8,
  },
  // Specific to Word entries
  wordCardTextContainer: {
    flex: 1, // Allow text to take up space before proficiency/actions
    flexDirection: 'column',
  },
  wordTranslation: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  wordOriginal: {
    fontSize: 15,
    color: '#444',
  },
  wordProficiencyContainer: {
    marginTop: 6,
  }
}); 