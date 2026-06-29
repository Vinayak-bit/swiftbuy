import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Layout } from '../constants/layout';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    key: 'discover',
    icon: 'grid' as const,
    iconColor: Colors.light.primary,
    illustrationBg: '#EEF4FF',
    title: 'Discover Products',
    subtitle:
      'Explore thousands of products across electronics, fashion, home & more — all in one place.',
  },
  {
    key: 'fast',
    icon: 'flash' as const,
    iconColor: Colors.light.accent,
    illustrationBg: '#FFF3E8',
    title: 'Fast. Seamless. Shopping.',
    subtitle:
      'Lightning-fast browsing, one-tap checkout, and reliable delivery right to your door.',
  },
  {
    key: 'secure',
    icon: 'shield-checkmark' as const,
    iconColor: Colors.light.primary,
    illustrationBg: '#EEF4FF',
    title: 'Safe & Secure',
    subtitle:
      'Your payments and personal data are always protected with bank-grade security.',
  },
];

interface Props {
  onDone: () => void;
}

export default function OnboardingScreen({ onDone }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const buttonScale = useRef(new Animated.Value(1)).current;

  const isLast = activeIndex === SLIDES.length - 1;

  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  }

  function handleNext() {
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.94, duration: 80, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1,    duration: 80, useNativeDriver: true }),
    ]).start();

    if (isLast) {
      onDone();
    } else {
      scrollRef.current?.scrollTo({ x: (activeIndex + 1) * width, animated: true });
    }
  }

  return (
    <View style={styles.root}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        {SLIDES.map((slide) => (
          <View key={slide.key} style={styles.slide}>
            {/* Illustration area */}
            <View style={[styles.illustration, { backgroundColor: slide.illustrationBg }]}>
              <View style={[styles.iconCircle, { backgroundColor: '#FFFFFF' }]}>
                <Ionicons name={slide.icon} size={72} color={slide.iconColor} />
              </View>
            </View>

            {/* Text area */}
            <View style={styles.content}>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.subtitle}>{slide.subtitle}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((s, i) => (
            <View
              key={s.key}
              style={[
                styles.dot,
                i === activeIndex
                  ? styles.dotActive
                  : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* CTA button */}
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={[styles.button, isLast && styles.buttonAccent]}
            onPress={handleNext}
            activeOpacity={0.9}
          >
            <Text style={[styles.buttonText, isLast && styles.buttonTextAccent]}>
              {isLast ? 'Get Started' : 'Next'}
            </Text>
            {!isLast && (
              <Ionicons
                name="arrow-forward"
                size={18}
                color={Colors.light.primary}
                style={{ marginLeft: 6 }}
              />
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Skip */}
        {!isLast && (
          <TouchableOpacity onPress={onDone} style={styles.skip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },

  /* Slides */
  slide: {
    width,
    flex: 1,
  },
  illustration: {
    height: height * 0.52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 148,
    height: 148,
    borderRadius: 74,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  content: {
    paddingHorizontal: Layout.spacing.xl,
    paddingTop: Layout.spacing.xl,
    flex: 1,
  },
  title: {
    fontSize: Layout.fontSize.xxl,
    fontWeight: Layout.fontWeight.bold,
    color: Colors.light.text,
    marginBottom: Layout.spacing.sm,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: Layout.fontSize.md,
    color: Colors.light.textMuted,
    lineHeight: 24,
  },

  /* Bottom bar */
  bottomBar: {
    paddingHorizontal: Layout.spacing.xl,
    paddingBottom: Layout.spacing.xxl,
    paddingTop: Layout.spacing.lg,
    alignItems: 'center',
    gap: Layout.spacing.md,
  },
  dots: {
    flexDirection: 'row',
    gap: Layout.spacing.xs,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.light.primary,
  },
  dotInactive: {
    width: 8,
    backgroundColor: Colors.light.border,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.light.primary,
    borderRadius: Layout.borderRadius.full,
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.xxl,
    minWidth: 200,
  },
  buttonAccent: {
    backgroundColor: Colors.light.accent,
    borderColor: Colors.light.accent,
  },
  buttonText: {
    fontSize: Layout.fontSize.lg,
    fontWeight: Layout.fontWeight.bold,
    color: Colors.light.primary,
  },
  buttonTextAccent: {
    color: '#FFFFFF',
  },
  skip: {
    paddingVertical: Layout.spacing.xs,
  },
  skipText: {
    fontSize: Layout.fontSize.md,
    color: Colors.light.textMuted,
    fontWeight: Layout.fontWeight.medium,
  },
});
