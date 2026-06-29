import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Platform,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ProductCard from '../components/product/ProductCard';
import { Colors } from '../constants/colors';
import { Layout } from '../constants/layout';
import { CATEGORIES, HERO_SLIDES, PRODUCTS } from '../constants/mockData';
import { useNav } from '../navigation';
import { Category, Product } from '../types';

const { width: W } = Dimensions.get('window');
const TOP = Platform.OS === 'ios' ? 47 : (RNStatusBar.currentHeight ?? 24);

function useCountdown() {
  const [label, setLabel] = useState('00:00:00');
  useEffect(() => {
    function tick() {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = Math.floor((midnight.getTime() - now.getTime()) / 1000);
      const h = Math.floor(diff / 3600).toString().padStart(2, '0');
      const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
      const sec = (diff % 60).toString().padStart(2, '0');
      setLabel(`${h}:${m}:${sec}`);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return label;
}

export default function HomeScreen() {
  const { navigate } = useNav();
  const heroRef      = useRef<ScrollView>(null);
  const [heroIdx, setHeroIdx] = useState(0);
  const countdown    = useCountdown();

  const deals    = PRODUCTS.filter(p => p.isDeal);
  const featured = PRODUCTS.filter(p => p.isFeatured).slice(0, 6);

  useEffect(() => {
    const id = setInterval(() => {
      const next = (heroIdx + 1) % HERO_SLIDES.length;
      heroRef.current?.scrollTo({ x: next * W, animated: true });
      setHeroIdx(next);
    }, 3500);
    return () => clearInterval(id);
  }, [heroIdx]);

  const onHeroScroll = useCallback((e: any) => {
    setHeroIdx(Math.round(e.nativeEvent.contentOffset.x / W));
  }, []);

  function goCategory(cat: Category) {
    navigate({ name: 'productList', categoryId: cat.id, categoryName: cat.name });
  }

  function goProduct(p: Product) {
    navigate({ name: 'productDetail', product: p });
  }

  const rows: Product[][] = [];
  for (let i = 0; i < featured.length; i += 2) rows.push(featured.slice(i, i + 2));

  return (
    <View style={s.root}>

      {/* ──────────── Fixed Header ──────────── */}
      <View style={s.header}>
        <View style={s.headerTop}>
          <TouchableOpacity style={s.locationRow}>
            <Ionicons name="location-sharp" size={15} color={Colors.light.accent} />
            <Text style={s.locationText}>
              Deliver to{' '}
              <Text style={s.locationBold}>Bangalore 560001</Text>
            </Text>
            <Ionicons name="chevron-down" size={13} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
          <View style={s.headerActions}>
            <TouchableOpacity style={s.iconBtn}>
              <Ionicons name="notifications-outline" size={22} color="#FFF" />
              <View style={s.notifDot} />
            </TouchableOpacity>
            <TouchableOpacity style={s.iconBtn}>
              <Ionicons name="cart-outline" size={22} color="#FFF" />
              <View style={s.cartBadge}><Text style={s.cartBadgeText}>2</Text></View>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={s.searchBar}>
          <Ionicons name="search-outline" size={17} color={Colors.light.textMuted} />
          <Text style={s.searchHint}>Search SwiftBuy…</Text>
          <Ionicons name="mic-outline" size={17} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>

      {/* ──────────── Scrollable Body ──────────── */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.body}>

        {/* Hero Banner */}
        <View style={s.heroOuter}>
          <ScrollView
            ref={heroRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onMomentumScrollEnd={onHeroScroll}
          >
            {HERO_SLIDES.map(slide => (
              <LinearGradient
                key={slide.id}
                colors={slide.colors as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={s.heroSlide}
              >
                <View style={s.heroLeft}>
                  <View style={s.heroTagPill}>
                    <Text style={s.heroTagText}>{slide.tag}</Text>
                  </View>
                  <Text style={s.heroTitle}>{slide.title}</Text>
                  <Text style={s.heroSub}>{slide.subtitle}</Text>
                  <TouchableOpacity style={s.heroCta}>
                    <Text style={s.heroCtaText}>{slide.cta}</Text>
                    <Ionicons name="arrow-forward" size={13} color={Colors.light.primary} />
                  </TouchableOpacity>
                </View>
                <View style={s.heroRight}>
                  <Ionicons name={slide.iconName as any} size={88} color="rgba(255,255,255,0.18)" />
                </View>
              </LinearGradient>
            ))}
          </ScrollView>
          <View style={s.heroDots}>
            {HERO_SLIDES.map((sl, i) => (
              <View key={sl.id} style={[s.dot, i === heroIdx && s.dotActive]} />
            ))}
          </View>
        </View>

        {/* Category Row */}
        <View style={s.card}>
          <View style={s.sectionHead}>
            <Text style={s.sectionTitle}>Shop by Category</Text>
            <TouchableOpacity onPress={() => navigate({ name: 'categories' })}>
              <Text style={s.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.catRow}
          >
            {CATEGORIES.map(cat => (
              <TouchableOpacity key={cat.id} style={s.catItem} onPress={() => goCategory(cat)}>
                <View style={[s.catCircle, { backgroundColor: cat.bg }]}>
                  <Ionicons name={cat.icon as any} size={26} color={cat.color} />
                </View>
                <Text style={s.catLabel} numberOfLines={1}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Deals of the Day */}
        <View style={s.card}>
          <View style={s.sectionHead}>
            <View style={s.dealHeadLeft}>
              <Text style={s.sectionTitle}>Deals of the Day</Text>
              <View style={s.timer}>
                <Ionicons name="timer-outline" size={12} color="#FFF" />
                <Text style={s.timerText}>{countdown}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => navigate({ name: 'productList', categoryId: '', categoryName: 'Deals' })}
            >
              <Text style={s.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.dealsRow}
          >
            {deals.map(p => (
              <ProductCard key={p.id} product={p} compact onPress={() => goProduct(p)} />
            ))}
          </ScrollView>
        </View>

        {/* Perks strip */}
        <View style={s.perksStrip}>
          {[
            { icon: 'cube-outline',            label: 'Free Delivery' },
            { icon: 'shield-checkmark-outline', label: 'Secure Pay'   },
            { icon: 'refresh-outline',          label: 'Easy Returns' },
            { icon: 'flash-outline',            label: 'Fast Dispatch'},
          ].map(({ icon, label }) => (
            <View key={label} style={s.perkItem}>
              <Ionicons name={icon as any} size={18} color={Colors.light.primary} />
              <Text style={s.perkLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Top Picks */}
        <View style={s.card}>
          <View style={s.sectionHead}>
            <Text style={s.sectionTitle}>Top Picks For You</Text>
            <TouchableOpacity
              onPress={() => navigate({ name: 'productList', categoryId: '', categoryName: 'All Products' })}
            >
              <Text style={s.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={s.gridPad}>
            {rows.map((row, ri) => (
              <View key={ri} style={s.gridRow}>
                {row.map(p => (
                  <ProductCard key={p.id} product={p} onPress={() => goProduct(p)} />
                ))}
                {row.length === 1 && <View style={s.gridFiller} />}
              </View>
            ))}
          </View>
        </View>

        <View style={s.bottomPad} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.light.surface },

  /* Header */
  header: {
    backgroundColor: Colors.light.primary,
    paddingTop: TOP,
    paddingHorizontal: Layout.spacing.md,
    paddingBottom: Layout.spacing.sm,
    gap: Layout.spacing.sm,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  locationText: {
    fontSize: Layout.fontSize.xs,
    color: 'rgba(255,255,255,0.8)',
  },
  locationBold: {
    fontWeight: Layout.fontWeight.bold,
    color: '#FFFFFF',
  },
  headerActions: { flexDirection: 'row', gap: Layout.spacing.sm },
  iconBtn: { position: 'relative', padding: 4 },
  notifDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.error,
    borderWidth: 1.5,
    borderColor: Colors.light.primary,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.light.accent,
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: { fontSize: 9, fontWeight: Layout.fontWeight.bold, color: '#FFF' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: Layout.spacing.md,
    height: 42,
    gap: Layout.spacing.sm,
  },
  searchHint: { flex: 1, fontSize: Layout.fontSize.sm, color: Colors.light.textMuted },

  /* Body */
  body: { gap: Layout.spacing.sm, paddingBottom: Layout.spacing.xl },

  /* Hero */
  heroOuter: { height: 185, position: 'relative' },
  heroSlide: {
    width: W,
    height: 185,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xl,
    overflow: 'hidden',
  },
  heroLeft: { flex: 1, gap: 6 },
  heroTagPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: Layout.borderRadius.full,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: 3,
  },
  heroTagText: { fontSize: Layout.fontSize.xs, color: '#FFF', fontWeight: Layout.fontWeight.semibold, letterSpacing: 0.3 },
  heroTitle: { fontSize: Layout.fontSize.xl, fontWeight: Layout.fontWeight.heavy, color: '#FFF', lineHeight: 28 },
  heroSub:   { fontSize: Layout.fontSize.sm, color: 'rgba(255,255,255,0.85)' },
  heroCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    borderRadius: Layout.borderRadius.full,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: 6,
  },
  heroCtaText: { fontSize: Layout.fontSize.xs, fontWeight: Layout.fontWeight.bold, color: Colors.light.primary },
  heroRight:   { width: 90, alignItems: 'center', justifyContent: 'center' },
  heroDots: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  dot:       { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.35)' },
  dotActive: { width: 20, backgroundColor: '#FFFFFF' },

  /* White card sections */
  card: { backgroundColor: Colors.light.background },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.md,
    paddingTop: Layout.spacing.md,
    paddingBottom: Layout.spacing.sm,
  },
  sectionTitle: { fontSize: Layout.fontSize.lg, fontWeight: Layout.fontWeight.bold, color: Colors.light.text },
  seeAll:       { fontSize: Layout.fontSize.sm, color: Colors.light.primary, fontWeight: Layout.fontWeight.semibold },

  /* Category */
  catRow:   { paddingHorizontal: Layout.spacing.md, paddingBottom: Layout.spacing.md, gap: Layout.spacing.md },
  catItem:  { alignItems: 'center', gap: 6, width: 62 },
  catCircle:{ width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
  catLabel: { fontSize: Layout.fontSize.xs, color: Colors.light.text, fontWeight: Layout.fontWeight.medium, textAlign: 'center' },

  /* Deals */
  dealHeadLeft: { flexDirection: 'row', alignItems: 'center', gap: Layout.spacing.sm },
  timer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.light.error,
    borderRadius: Layout.borderRadius.full,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: 3,
  },
  timerText: { fontSize: Layout.fontSize.xs, color: '#FFF', fontWeight: Layout.fontWeight.bold },
  dealsRow:  { paddingHorizontal: Layout.spacing.md, paddingBottom: Layout.spacing.md, gap: Layout.spacing.sm },

  /* Perks */
  perksStrip: {
    flexDirection: 'row',
    backgroundColor: Colors.light.primaryDim,
    paddingVertical: Layout.spacing.md,
  },
  perkItem:  { flex: 1, alignItems: 'center', gap: 4 },
  perkLabel: { fontSize: Layout.fontSize.xs, color: Colors.light.primary, fontWeight: Layout.fontWeight.medium },

  /* Grid */
  gridPad: { paddingHorizontal: Layout.spacing.sm, paddingBottom: Layout.spacing.md },
  gridRow: { flexDirection: 'row', gap: Layout.spacing.sm, marginBottom: Layout.spacing.sm },
  gridFiller: { flex: 1 },

  bottomPad: { height: Layout.spacing.lg },
});
