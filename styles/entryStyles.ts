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
    flexDirection: 'column', // Main content in a column
    alignItems: 'flex-start', // Align content to the start
    justifyContent: 'center',
    height: 72,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 32,
    paddingRight: 32,
  },
  cardContent: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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