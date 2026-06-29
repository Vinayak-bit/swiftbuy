import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Platform,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Layout } from '../constants/layout';
import { CATEGORIES, PRODUCTS } from '../constants/mockData';
import { useNav } from '../navigation';

const TOP = Platform.OS === 'ios' ? 47 : (RNStatusBar.currentHeight ?? 24);

export default function CategoriesScreen() {
  const { goBack, navigate } = useNav();

  function handleCategory(id: string, name: string) {
    navigate({ name: 'productList', categoryId: id, categoryName: name });
  }

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={goBack}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>All Categories</Text>
        <TouchableOpacity style={s.backBtn}>
          <Ionicons name="search-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.body}>
        <View style={s.grid}>
          {CATEGORIES.map(cat => {
            const count = PRODUCTS.filter(p => p.categoryId === cat.id).length;
            return (
              <TouchableOpacity
                key={cat.id}
                style={s.catCard}
                onPress={() => handleCategory(cat.id, cat.name)}
                activeOpacity={0.85}
              >
                <View style={[s.iconWrap, { backgroundColor: cat.bg }]}>
                  <Ionicons name={cat.icon as any} size={36} color={cat.color} />
                </View>
                <Text style={s.catName}>{cat.name}</Text>
                <Text style={s.catCount}>{count} items</Text>
                <View style={[s.arrow, { backgroundColor: cat.bg }]}>
                  <Ionicons name="arrow-forward" size={14} color={cat.color} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* All Products card */}
        <TouchableOpacity
          style={s.allCard}
          onPress={() => navigate({ name: 'productList', categoryId: '', categoryName: 'All Products' })}
          activeOpacity={0.88}
        >
          <View style={s.allLeft}>
            <View style={s.allIcon}>
              <Ionicons name="grid-outline" size={28} color={Colors.light.primary} />
            </View>
            <View>
              <Text style={s.allTitle}>Browse All Products</Text>
              <Text style={s.allSub}>{PRODUCTS.length} products available</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.light.primary} />
        </TouchableOpacity>

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
    gap: Layout.spacing.md,
  },
  backBtn: { padding: 4 },
  headerTitle: {
    flex: 1,
    fontSize: Layout.fontSize.lg,
    fontWeight: Layout.fontWeight.bold,
    color: '#FFFFFF',
    textAlign: 'center',
  },

  body: { padding: Layout.spacing.md, gap: Layout.spacing.md },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layout.spacing.sm,
  },
  catCard: {
    width: '48%',
    backgroundColor: Colors.light.background,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.md,
    gap: Layout.spacing.xs,
    borderWidth: 1,
    borderColor: Colors.light.border,
    position: 'relative',
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: Layout.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  catName:  { fontSize: Layout.fontSize.md, fontWeight: Layout.fontWeight.bold,    color: Colors.light.text },
  catCount: { fontSize: Layout.fontSize.xs, fontWeight: Layout.fontWeight.regular,  color: Colors.light.textMuted },
  arrow: {
    position: 'absolute',
    bottom: Layout.spacing.md,
    right: Layout.spacing.md,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  allCard: {
    backgroundColor: Colors.light.background,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: Colors.light.primary,
  },
  allLeft: { flexDirection: 'row', alignItems: 'center', gap: Layout.spacing.md },
  allIcon: {
    width: 50,
    height: 50,
    borderRadius: Layout.borderRadius.md,
    backgroundColor: Colors.light.primaryDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  allTitle: { fontSize: Layout.fontSize.md, fontWeight: Layout.fontWeight.bold,   color: Colors.light.text },
  allSub:   { fontSize: Layout.fontSize.xs, fontWeight: Layout.fontWeight.regular, color: Colors.light.textMuted },

  bottomPad: { height: Layout.spacing.xl },
});
