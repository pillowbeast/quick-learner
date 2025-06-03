import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
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
  const { goOnboarding, goToSettings } = useNavigationHelper();
  const { state } = useNavigationContext();
  const { colors } = useAppTheme();

  return (
    <SafeAreaWrapper backgroundColor={colors.background}>
      <UnifiedHeader title={i18n.t('app_name')}/>
      <ScrollView
        style={[styles.content, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        <LanguageSelector />
      </ScrollView>
      <UnifiedFooter />
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 8,
  },
  content: {
    flex: 1,
  },
});
