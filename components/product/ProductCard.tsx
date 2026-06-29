import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import { Product } from '../../types';

const { width: W } = Dimensions.get('window');
export const CARD_WIDTH    = (W - Layout.spacing.sm * 3) / 2;
export const COMPACT_WIDTH = 160;

interface Props {
  product: Product;
  onPress: () => void;
  compact?: boolean;
}

function fmtPrice(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}
function fmtCount(n: number) {
  return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n);
}
function discPct(price: number, orig: number) {
  return Math.round((1 - price / orig) * 100);
}

function Stars({ rating }: { rating: number }) {
  return (
    <View style={s.stars}>
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
          size={11}
          color="#FFB800"
        />
      ))}
    </View>
  );
}

function BadgeChip({ label }: { label: string }) {
  const bg =
    label === 'Best Seller' ? Colors.light.accent :
    label === 'Deal'        ? Colors.light.error  :
    label === 'New'         ? '#2E7D32'           :
                              '#7B2FBE';
  return (
    <View style={[s.badgeChip, { backgroundColor: bg }]}>
      <Text style={s.badgeChipText}>{label}</Text>
    </View>
  );
}

export default function ProductCard({ product, onPress, compact }: Props) {
  const [imgErr, setImgErr] = useState(false);
  const [added, setAdded]   = useState(false);

  const disc  = discPct(product.price, product.originalPrice);
  const imgH  = compact ? 120 : 160;
  const cardW = compact ? COMPACT_WIDTH : CARD_WIDTH;

  function handleAddToCart() {
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <TouchableOpacity
      style={[s.card, { width: cardW }]}
      onPress={onPress}
      activeOpacity={0.88}
    >
      <View style={[s.imgWrapper, { height: imgH }]}>
        {imgErr ? (
          <View style={[s.imgFallback, { height: imgH }]}>
            <Ionicons name="image-outline" size={36} color={Colors.light.border} />
          </View>
        ) : (
          <Image
            source={{ uri: `https://picsum.photos/seed/${product.id}/300/300` }}
            style={[s.img, { height: imgH }]}
            resizeMode="cover"
            onError={() => setImgErr(true)}
          />
        )}
        {product.badge && (
          <View style={s.badgeOverlay}>
            <BadgeChip label={product.badge} />
          </View>
        )}
        {disc > 0 && (
          <View style={s.discOverlay}>
            <Text style={s.discText}>-{disc}%</Text>
          </View>
        )}
      </View>

      <View style={s.info}>
        <Text
          style={compact ? s.titleCompact : s.title}
          numberOfLines={2}
        >
          {product.title}
        </Text>

        {!compact && (
          <View style={s.ratingRow}>
            <Stars rating={product.rating} />
            <Text style={s.ratingCount}>({fmtCount(product.reviewCount)})</Text>
          </View>
        )}

        <View style={s.priceRow}>
          <Text style={s.price}>{fmtPrice(product.price)}</Text>
          {!compact && product.originalPrice > product.price && (
            <Text style={s.origPrice}>{fmtPrice(product.originalPrice)}</Text>
          )}
        </View>

        {!compact && product.stock <= 10 && (
          <Text style={s.lowStock}>Only {product.stock} left!</Text>
        )}

        {!compact && (
          <TouchableOpacity
            style={[s.addBtn, added && s.addBtnActive]}
            onPress={handleAddToCart}
            activeOpacity={0.8}
          >
            <Ionicons
              name={added ? 'checkmark' : 'cart-outline'}
              size={13}
              color={added ? '#FFFFFF' : Colors.light.primary}
            />
            <Text style={[s.addBtnText, added && s.addBtnTextActive]}>
              {added ? 'Added!' : 'Add to Cart'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.background,
    borderRadius: Layout.borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  imgWrapper: {
    width: '100%',
    backgroundColor: Colors.light.surface,
    position: 'relative',
  },
  img: {
    width: '100%',
  },
  imgFallback: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.surface,
  },
  badgeOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  badgeChip: {
    borderRadius: Layout.borderRadius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeChipText: {
    fontSize: 9,
    fontWeight: Layout.fontWeight.bold,
    color: '#FFFFFF',
  },
  discOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.light.error,
    borderRadius: Layout.borderRadius.sm,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  discText: {
    fontSize: 9,
    fontWeight: Layout.fontWeight.bold,
    color: '#FFFFFF',
  },
  info: {
    padding: Layout.spacing.sm,
    gap: 4,
  },
  title: {
    fontSize: Layout.fontSize.sm,
    fontWeight: Layout.fontWeight.medium,
    color: Colors.light.text,
    lineHeight: 18,
  },
  titleCompact: {
    fontSize: 12,
    fontWeight: Layout.fontWeight.medium,
    color: Colors.light.text,
    lineHeight: 16,
  },
  stars: {
    flexDirection: 'row',
    gap: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingCount: {
    fontSize: Layout.fontSize.xs,
    color: Colors.light.textMuted,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    flexWrap: 'wrap',
  },
  price: {
    fontSize: Layout.fontSize.md,
    fontWeight: Layout.fontWeight.bold,
    color: Colors.light.text,
  },
  origPrice: {
    fontSize: Layout.fontSize.xs,
    color: Colors.light.textMuted,
    textDecorationLine: 'line-through',
  },
  lowStock: {
    fontSize: Layout.fontSize.xs,
    color: Colors.light.error,
    fontWeight: Layout.fontWeight.medium,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 1.5,
    borderColor: Colors.light.primary,
    borderRadius: Layout.borderRadius.sm,
    paddingVertical: 7,
    marginTop: 2,
  },
  addBtnActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: Layout.fontWeight.semibold,
    color: Colors.light.primary,
  },
  addBtnTextActive: {
    color: '#FFFFFF',
  },
});
