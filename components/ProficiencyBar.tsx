import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ProficiencyBarProps {
  proficiency: number;
  isKnown: boolean;
}

const ProficiencyBar = ({ proficiency, isKnown }: ProficiencyBarProps) => {
  const getStatusColor = () => {
    if (proficiency === 0) return '#9E9E9E'; // Gray for unanswered
    return isKnown === true ? '#4CAF50' : '#F44336'; // Green for correct, Red for wrong
  };

  const getBarColor = () => {
    const progress = proficiency / 100;
    if (progress < 0.5) {
      const redToGray = progress * 2;
      const red = Math.floor(244 * (1 - redToGray) + 158 * redToGray);
      const green = Math.floor(67 * (1 - redToGray) + 158 * redToGray);
      const blue = Math.floor(54 * (1 - redToGray) + 158 * redToGray);
      return `rgb(${red}, ${green}, ${blue})`;
    } else {
      const grayToGreen = (progress - 0.5) * 2;
      const red = Math.floor(158 * (1 - grayToGreen) + 76 * grayToGreen);
      const green = Math.floor(158 * (1 - grayToGreen) + 175 * grayToGreen);
      const blue = Math.floor(158 * (1 - grayToGreen) + 80 * grayToGreen);
      return `rgb(${red}, ${green}, ${blue})`;
    }
  };

  return (
    <View style={styles.proficiencyContainer}>
      <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
      <View style={styles.proficiencyBarContainer}>
        <View style={[styles.proficiencyBar, { 
          width: `${proficiency}%`,
          backgroundColor: getBarColor()
        }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  proficiencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 2,
    marginRight: 6,
  },
  proficiencyBarContainer: {
    flex: 1,
    height: 3,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  proficiencyBar: {
    height: '100%',
    borderRadius: 2,
  },
});

export default ProficiencyBar; 