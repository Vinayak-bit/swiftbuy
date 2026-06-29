import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../constants/colors';
import { CATEGORIES } from '../constants/mockData';
import { Layout } from '../constants/layout';
import { useNav } from '../navigation';
import { Product } from '../types';

const { width: W } = Dimensions.get('window');
const TOP = Platform.OS === 'ios' ? 47 : (RNStatusBar.currentHeight ?? 24);

function fmtPrice(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}
function discPct(price: number, orig: number) {
  return Math.round((1 - price / orig) * 100);
}

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <View style={sd.stars}>
      {[1, 2, 3, 4, 5].map(i => (
        <Ionicons
          key={i}
          name={
            i <= Math.floor(rating)
              ? 'star'
              : i - 0.5 <= rating
              ? 'star-half'
              : 'star-outline'
          }
          size={size}
          color="#FFB800"
        />
      ))}
    </View>
  );
}

interface Props {
  product: Product;
}

const IMG_SUFFIXES = ['', 'a', 'b'];

export default function ProductDetailScreen({ product }: Props) {
  const { goBack } = useNav();
  const [imgIdx, setImgIdx]     = useState(0);
  const [qty, setQty]           = useState(1);
  const [wishlisted, setWished] = useState(false);
  const [added, setAdded]       = useState(false);
  const [descExpanded, setDesc] = useState(false);
  const galleryRef              = useRef<ScrollView>(null);

  const disc     = discPct(product.price, product.originalPrice);
  const savings  = product.originalPrice - product.price;
  const category = CATEGORIES.find(c => c.id === product.categoryId);

  function handleAddToCart() {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function onGalleryScroll(e: any) {
    setImgIdx(Math.round(e.nativeEvent.contentOffset.x / W));
  }

  function goThumb(i: number) {
    galleryRef.current?.scrollTo({ x: i * W, animated: true });
    setImgIdx(i);
  }

  return (
    <View style={sd.root}>

      {/* ────── Scrollable Content ────── */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={sd.body}>

        {/* Image Gallery */}
        <View style={sd.galleryOuter}>
          <ScrollView
            ref={galleryRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onMomentumScrollEnd={onGalleryScroll}
          >
            {IMG_SUFFIXES.map((sfx, i) => (
              <Image
                key={sfx}
                source={{ uri: `https://picsum.photos/seed/${product.id}${sfx}/500/500` }}
                style={sd.galleryImg}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Back button overlay */}
          <TouchableOpacity style={sd.backBtn} onPress={goBack}>
            <Ionicons name="arrow-back" size={20} color="#111" />
          </TouchableOpacity>

          {/* Wishlist overlay */}
          <TouchableOpacity style={sd.wishBtn} onPress={() => setWished(w => !w)}>
            <Ionicons
              name={wishlisted ? 'heart' : 'heart-outline'}
              size={20}
              color={wishlisted ? Colors.light.error : '#333'}
            />
          </TouchableOpacity>

          {/* Dot indicators */}
          <View style={sd.imgDots}>
            {IMG_SUFFIXES.map((_, i) => (
              <TouchableOpacity key={i} onPress={() => goThumb(i)}>
                <View style={[sd.imgDot, i === imgIdx && sd.imgDotActive]} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Thumbnail strip */}
        <View style={sd.thumbRow}>
          {IMG_SUFFIXES.map((sfx, i) => (
            <TouchableOpacity key={sfx} onPress={() => goThumb(i)} activeOpacity={0.8}>
              <Image
                source={{ uri: `https://picsum.photos/seed/${product.id}${sfx}/120/120` }}
                style={[sd.thumb, i === imgIdx && sd.thumbActive]}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Product Info */}
        <View style={sd.infoCard}>
          {/* Category breadcrumb */}
          {category && (
            <View style={sd.breadcrumb}>
              <Ionicons name={category.icon as any} size={12} color={category.color} />
              <Text style={[sd.breadcrumbText, { color: category.color }]}>{category.name}</Text>
            </View>
          )}

          <Text style={sd.title}>{product.title}</Text>
          <Text style={sd.subtitle}>{product.subtitle}</Text>

          {/* Rating row */}
          <View style={sd.ratingRow}>
            <View style={sd.ratingBadge}>
              <Text style={sd.ratingNum}>{product.rating}</Text>
              <Ionicons name="star" size={11} color="#FFF" />
            </View>
            <Stars rating={product.rating} />
            <Text style={sd.reviewCount}>
              {product.reviewCount.toLocaleString('en-IN')} ratings
            </Text>
            <View style={[sd.stockBadge, product.stock <= 5 && sd.stockBadgeLow]}>
              <Text style={sd.stockText}>
                {product.stock <= 5 ? `Only ${product.stock} left!` : 'In Stock'}
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View style={sd.divider} />

          {/* Pricing */}
          <View style={sd.priceSection}>
            <Text style={sd.price}>{fmtPrice(product.price)}</Text>
            <View style={sd.priceRight}>
              <View style={sd.discBadge}>
                <Text style={sd.discText}>{disc}% OFF</Text>
              </View>
              <Text style={sd.origPrice}>M.R.P. {fmtPrice(product.originalPrice)}</Text>
            </View>
          </View>
          <Text style={sd.savingsText}>You save {fmtPrice(savings)} on this order</Text>

          {/* Inclusive of taxes */}
          <Text style={sd.taxNote}>Inclusive of all taxes | Free delivery</Text>

          {/* Divider */}
          <View style={sd.divider} />

          {/* Delivery */}
          <View style={sd.deliveryRow}>
            <Ionicons name="cube-outline" size={18} color={Colors.light.primary} />
            <View style={sd.deliveryInfo}>
              <Text style={sd.deliveryTitle}>Free Delivery</Text>
              <Text style={sd.deliverySub}>Estimated delivery: 2–4 business days</Text>
            </View>
          </View>
          <View style={sd.deliveryRow}>
            <Ionicons name="refresh-outline" size={18} color={Colors.light.primary} />
            <View style={sd.deliveryInfo}>
              <Text style={sd.deliveryTitle}>10-Day Easy Returns</Text>
              <Text style={sd.deliverySub}>No questions asked return policy</Text>
            </View>
          </View>

          <View style={sd.divider} />

          {/* Quantity */}
          <View style={sd.qtyRow}>
            <Text style={sd.qtyLabel}>Quantity</Text>
            <View style={sd.qtyControl}>
              <TouchableOpacity
                style={[sd.qtyBtn, qty <= 1 && sd.qtyBtnDisabled]}
                onPress={() => setQty(q => Math.max(1, q - 1))}
                disabled={qty <= 1}
              >
                <Ionicons name="remove" size={18} color={qty <= 1 ? Colors.light.border : Colors.light.text} />
              </TouchableOpacity>
              <Text style={sd.qtyNum}>{qty}</Text>
              <TouchableOpacity
                style={[sd.qtyBtn, qty >= product.stock && sd.qtyBtnDisabled]}
                onPress={() => setQty(q => Math.min(product.stock, q + 1))}
                disabled={qty >= product.stock}
              >
                <Ionicons name="add" size={18} color={qty >= product.stock ? Colors.light.border : Colors.light.text} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={sd.divider} />

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <View style={sd.tagsRow}>
              {product.tags.map(tag => (
                <View key={tag} style={sd.tag}>
                  <Text style={sd.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={sd.divider} />

          {/* Description */}
          <Text style={sd.sectionLabel}>About this item</Text>
          <Text
            style={sd.description}
            numberOfLines={descExpanded ? undefined : 4}
          >
            {product.description}
          </Text>
          <TouchableOpacity onPress={() => setDesc(d => !d)} style={sd.expandBtn}>
            <Text style={sd.expandText}>{descExpanded ? 'Show less ↑' : 'Read more ↓'}</Text>
          </TouchableOpacity>
        </View>

        <View style={sd.bottomPad} />
      </ScrollView>

      {/* ────── Sticky Footer ────── */}
      <View style={sd.footer}>
        <TouchableOpacity
          style={[sd.cartBtn, added && sd.cartBtnAdded]}
          onPress={handleAddToCart}
          activeOpacity={0.85}
        >
          <Ionicons
            name={added ? 'checkmark-circle' : 'cart-outline'}
            size={18}
            color={added ? '#FFFFFF' : Colors.light.primary}
          />
          <Text style={[sd.cartBtnText, added && sd.cartBtnTextAdded]}>
            {added ? 'Added to Cart!' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={sd.buyBtn} activeOpacity={0.88}>
          <Ionicons name="flash" size={16} color="#FFFFFF" />
          <Text style={sd.buyBtnText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const sd = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.light.surface },
  body: { paddingBottom: 90 },

  /* Gallery */
  galleryOuter: { position: 'relative', height: W * 0.9, backgroundColor: Colors.light.surface },
  galleryImg:   { width: W, height: W * 0.9, backgroundColor: Colors.light.surface },
  backBtn: {
    position: 'absolute',
    top: TOP,
    left: Layout.spacing.md,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  wishBtn: {
    position: 'absolute',
    top: TOP,
    right: Layout.spacing.md,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  imgDots: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  imgDot:       { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.22)' },
  imgDotActive: { width: 18, backgroundColor: Colors.light.primary },

  /* Thumbnails */
  thumbRow: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    backgroundColor: Colors.light.background,
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
  },
  thumbActive: {
    borderColor: Colors.light.primary,
    borderWidth: 2,
  },

  /* Info card */
  infoCard: {
    backgroundColor: Colors.light.background,
    marginTop: Layout.spacing.sm,
    padding: Layout.spacing.md,
    gap: Layout.spacing.md,
  },
  breadcrumb: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  breadcrumbText: { fontSize: Layout.fontSize.xs, fontWeight: Layout.fontWeight.semibold },
  title:    { fontSize: Layout.fontSize.lg, fontWeight: Layout.fontWeight.bold,   color: Colors.light.text, lineHeight: 26 },
  subtitle: { fontSize: Layout.fontSize.sm, color: Colors.light.textMuted },

  /* Rating */
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: Layout.spacing.sm, flexWrap: 'wrap' },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#2E7D32',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingNum:   { fontSize: 12, fontWeight: Layout.fontWeight.bold, color: '#FFF' },
  stars:       { flexDirection: 'row', gap: 1 },
  reviewCount: { fontSize: Layout.fontSize.xs, color: Colors.light.textMuted },
  stockBadge: {
    backgroundColor: '#E8FAF7',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  stockBadgeLow: { backgroundColor: '#FFEBEE' },
  stockText: { fontSize: Layout.fontSize.xs, color: '#0E9F88', fontWeight: Layout.fontWeight.semibold },

  divider: { height: 1, backgroundColor: Colors.light.border },

  /* Price */
  priceSection: { flexDirection: 'row', alignItems: 'center', gap: Layout.spacing.md },
  price:        { fontSize: Layout.fontSize.xxl, fontWeight: Layout.fontWeight.heavy, color: Colors.light.text },
  priceRight:   { gap: 4 },
  discBadge: {
    backgroundColor: Colors.light.error,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  discText:   { fontSize: 11, fontWeight: Layout.fontWeight.bold, color: '#FFF' },
  origPrice:  { fontSize: Layout.fontSize.xs, color: Colors.light.textMuted, textDecorationLine: 'line-through' },
  savingsText:{ fontSize: Layout.fontSize.sm, color: '#2E7D32', fontWeight: Layout.fontWeight.semibold },
  taxNote:    { fontSize: Layout.fontSize.xs, color: Colors.light.textMuted },

  /* Delivery */
  deliveryRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: Layout.spacing.sm },
  deliveryInfo: { flex: 1, gap: 2 },
  deliveryTitle:{ fontSize: Layout.fontSize.sm, fontWeight: Layout.fontWeight.semibold, color: Colors.light.text },
  deliverySub:  { fontSize: Layout.fontSize.xs, color: Colors.light.textMuted },

  /* Quantity */
  qtyRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  qtyLabel:  { fontSize: Layout.fontSize.md, fontWeight: Layout.fontWeight.semibold, color: Colors.light.text },
  qtyControl:{ flexDirection: 'row', alignItems: 'center', gap: Layout.spacing.md },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnDisabled: { borderColor: Colors.light.border, opacity: 0.4 },
  qtyNum: { fontSize: Layout.fontSize.lg, fontWeight: Layout.fontWeight.bold, color: Colors.light.text, minWidth: 28, textAlign: 'center' },

  /* Tags */
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Layout.spacing.sm },
  tag: {
    backgroundColor: Colors.light.primaryDim,
    borderRadius: Layout.borderRadius.full,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: 4,
  },
  tagText: { fontSize: Layout.fontSize.xs, color: Colors.light.primary, fontWeight: Layout.fontWeight.medium },

  /* Description */
  sectionLabel: { fontSize: Layout.fontSize.md, fontWeight: Layout.fontWeight.bold, color: Colors.light.text },
  description:  { fontSize: Layout.fontSize.sm, color: Colors.light.textMuted, lineHeight: 22 },
  expandBtn:    { alignSelf: 'flex-start' },
  expandText:   { fontSize: Layout.fontSize.sm, color: Colors.light.primary, fontWeight: Layout.fontWeight.semibold },

  bottomPad: { height: Layout.spacing.xl },

  /* Sticky Footer */
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: Layout.spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 28 : Layout.spacing.md,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    gap: Layout.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  cartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Layout.spacing.sm,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.md,
  },
  cartBtnAdded: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  cartBtnText: {
    fontSize: Layout.fontSize.md,
    fontWeight: Layout.fontWeight.bold,
    color: Colors.light.primary,
  },
  cartBtnTextAdded: { color: '#FFFFFF' },
  buyBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Layout.spacing.sm,
    backgroundColor: Colors.light.accent,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.md,
  },
  buyBtnText: {
    fontSize: Layout.fontSize.md,
    fontWeight: Layout.fontWeight.bold,
    color: '#FFFFFF',
  },
});
