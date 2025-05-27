import { StyleSheet } from 'react-native';

export const entryStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '100%',
  },
  card: {
    flexDirection: 'column', // Main content in a column
    alignItems: 'flex-start', // Align content to the start
    justifyContent: 'center',
    height: 72,
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 32,
    paddingRight: 32,
    marginVertical: 8,
    marginHorizontal: 0,
  },
  cardContent: {
    width: '100%',
    flexDirection: 'row', // For icon/flag and text content
    alignItems: 'center',
    justifyContent: 'space-between', // Pushes actions to the right
  },
  infoContainer: { // Container for flag/icon and text
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Allow this to take available space
    marginRight: 8, // Space before action buttons
  },
  textContainer: { // For Name/Title and Subtitle/Description
    flexDirection: 'column',
    marginLeft: 12, // Space after flag/icon
    flex: 1, // Allow text to take available space and wrap
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    // Add other title styles
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    // Add other subtitle styles
  },
  actionsContainer: { // For buttons like View, Edit, Delete
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 8,
  },
  iconButton: {
    margin: 0,
    padding: 0,
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