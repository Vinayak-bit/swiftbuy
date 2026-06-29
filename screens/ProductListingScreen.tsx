import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
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
import { PRODUCTS } from '../constants/mockData';
import { useNav } from '../navigation';
import { Product } from '../types';

const TOP = Platform.OS === 'ios' ? 47 : (RNStatusBar.currentHeight ?? 24);

type SortKey = 'relevant' | 'priceLow' | 'priceHigh' | 'rating';

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'relevant',  label: 'Relevant'    },
  { key: 'priceLow',  label: 'Price: Low ↑' },
  { key: 'priceHigh', label: 'Price: High ↓' },
  { key: 'rating',    label: 'Top Rated'   },
];

interface Props {
  categoryId: string;
  categoryName: string;
}

export default function ProductListingScreen({ categoryId, categoryName }: Props) {
  const { goBack, navigate } = useNav();
  const [sort, setSort] = useState<SortKey>('relevant');

  const products = useMemo<Product[]>(() => {
    let list = categoryId
      ? PRODUCTS.filter(p => p.categoryId === categoryId)
      : PRODUCTS;

    if (categoryName === 'Deals') list = PRODUCTS.filter(p => p.isDeal);

    switch (sort) {
      case 'priceLow':  return [...list].sort((a, b) => a.price - b.price);
      case 'priceHigh': return [...list].sort((a, b) => b.price - a.price);
      case 'rating':    return [...list].sort((a, b) => b.rating - a.rating);
      default:          return list;
    }
  }, [categoryId, categoryName, sort]);

  const rows: Product[][] = [];
  for (let i = 0; i < products.length; i += 2) rows.push(products.slice(i, i + 2));

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={goBack}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={s.headerTitle} numberOfLines={1}>{categoryName}</Text>
        <TouchableOpacity style={s.backBtn}>
          <Ionicons name="search-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={s.backBtn}>
          <Ionicons name="options-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Sort chips */}
      <View style={s.sortBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.sortScroll}>
          {SORTS.map(opt => (
            <TouchableOpacity
              key={opt.key}
              style={[s.chip, sort === opt.key && s.chipActive]}
              onPress={() => setSort(opt.key)}
            >
              <Text style={[s.chipText, sort === opt.key && s.chipTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={s.countWrap}>
          <Text style={s.countText}>{products.length} items</Text>
        </View>
      </View>

      {/* Product Grid */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.body}>
        {products.length === 0 ? (
          <View style={s.emptyState}>
            <Ionicons name="cube-outline" size={56} color={Colors.light.border} />
            <Text style={s.emptyTitle}>No products found</Text>
            <Text style={s.emptySub}>Try a different category or sort</Text>
          </View>
        ) : (
          <>
            {rows.map((row, ri) => (
              <View key={ri} style={s.gridRow}>
                {row.map(p => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onPress={() => navigate({ name: 'productDetail', product: p })}
                  />
                ))}
                {row.length === 1 && <View style={s.gridFiller} />}
              </View>
            ))}
          </>
        )}
        <View style={s.bottomPad} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.light.surface },

  header: {
    backgroundColor: Colors.light.primary,
    paddingTop: TOP,
    paddingHorizontal: Layout.spacing.md,
    paddingBottom: Layout.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  backBtn:     { padding: 4 },
  headerTitle: { flex: 1, fontSize: Layout.fontSize.lg, fontWeight: Layout.fontWeight.bold, color: '#FFFFFF' },

  sortBar: {
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortScroll:  { paddingHorizontal: Layout.spacing.md, paddingVertical: Layout.spacing.sm, gap: Layout.spacing.sm },
  chip: {
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: 6,
    borderRadius: Layout.borderRadius.full,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.background,
  },
  chipActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  chipText:       { fontSize: Layout.fontSize.xs, color: Colors.light.textMuted, fontWeight: Layout.fontWeight.medium },
  chipTextActive: { color: '#FFFFFF', fontWeight: Layout.fontWeight.semibold },
  countWrap: {
    paddingHorizontal: Layout.spacing.md,
    paddingRight: Layout.spacing.md,
  },
  countText: { fontSize: Layout.fontSize.xs, color: Colors.light.textMuted },

  body:       { padding: Layout.spacing.sm, paddingBottom: Layout.spacing.xl },
  gridRow:    { flexDirection: 'row', gap: Layout.spacing.sm, marginBottom: Layout.spacing.sm },
  gridFiller: { flex: 1 },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: Layout.spacing.sm,
  },
  emptyTitle: { fontSize: Layout.fontSize.lg, fontWeight: Layout.fontWeight.semibold, color: Colors.light.text },
  emptySub:   { fontSize: Layout.fontSize.md, color: Colors.light.textMuted },

  bottomPad: { height: Layout.spacing.xl },
});
