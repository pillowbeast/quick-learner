import React from "react";
import { View, ScrollView, StyleSheet, Button } from "react-native";
import { IconButton } from 'react-native-paper';

import i18n from "@/i18n";
import LanguageSelector from "@/components/LanguageSelector";
import DisplayLanguageSelector from "@/components/DisplayLanguageSelector";
import { useNavigationHelper } from "@/hooks/useNavigation";
import Flag from "@/components/Flag";
import { useNavigationContext } from "@/hooks/useNavigationContext";
import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import UnifiedHeader from "@/components/UnifiedHeader";
import UnifiedFooter from "@/components/UnifiedFooter";
import { entryStyles } from "@/styles/entryStyles";
import { useAppTheme } from "@/styles/ThemeContext";

export default function Home() {
  const { goToOnboarding, goToSettings } = useNavigationHelper();
  const { state } = useNavigationContext();
  const { theme, colors } = useAppTheme();

  return (
    <SafeAreaWrapper backgroundColor={colors.background}>
      <UnifiedHeader 
        title={i18n.t('app_name')}
        backButton={false}
        actions={
            <>
              <IconButton
                icon="help-circle"
                size={24}
                onPress={goToOnboarding}
                iconColor={colors.secondary}>
              </IconButton>
            </>
        } />
      <ScrollView
        style={[styles.content, { backgroundColor: colors.background }]}
      >
        <LanguageSelector />
      </ScrollView>
      <UnifiedFooter />
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});
