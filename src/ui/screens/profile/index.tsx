import { HeaderApp } from '@/ui/components/HeaderApp';
import { AccountSection } from '@/ui/screens/profile/components/AccountSection';
import { InstallAppSection } from '@/ui/screens/profile/components/InstallAppSection';
import { LegalSection } from '@/ui/screens/profile/components/LegalSection';
import { PlanSection } from '@/ui/screens/profile/components/PlanSection';
import { ProfileCard } from '@/ui/screens/profile/components/ProfileCard';
import { styles } from '@/ui/screens/profile/styles';
import { useProfile } from '@/ui/screens/profile/useProfile';
import { useFocusEffect } from '@react-navigation/native';
import * as SystemUI from 'expo-system-ui';
import { useCallback } from 'react';
import { Platform, ScrollView, View } from 'react-native';

export function Profile() {
  const { top, bottom, handleSignOut } = useProfile();

  useFocusEffect(
    useCallback(() => {
      if (!(Platform.OS === 'web')) {
        return;
      }

      SystemUI.setBackgroundColorAsync(null);

    }, []),
  );

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <HeaderApp title='Perfil' />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: bottom + 32 }]}>
        <ProfileCard />
        <PlanSection />
        <InstallAppSection />
        <LegalSection />
        <AccountSection onSignOut={handleSignOut} />
      </ScrollView>
    </View>
  );
}
