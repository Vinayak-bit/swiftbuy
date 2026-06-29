import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from './constants/colors';
import AppNavigator from './navigation';
import OnboardingScreen from './screens/OnboardingScreen';
import SplashScreen from './screens/SplashScreen';

type Screen = 'splash' | 'onboarding' | 'main';

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {screen === 'splash' && (
        <SplashScreen onFinish={() => setScreen('onboarding')} />
      )}

      {screen === 'onboarding' && (
        <OnboardingScreen onDone={() => setScreen('main')} />
      )}

      {screen === 'main' && <AppNavigator />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
