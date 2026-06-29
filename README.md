# SwiftBuy — Fast. Seamless. Shopping.

A full-featured mobile e-commerce app built with **React Native + Expo**, inspired by Amazon, Flipkart, and eBay.

---

## Features Built So Far

### Splash Screen
- Full-screen branded splash image with fade-in / fade-out animation
- Auto-transitions to Onboarding after 2.4 seconds

### Onboarding
- 3-slide horizontal carousel with smooth page transitions
- Animated progress dots and scale-bounce CTA button
- "Skip" shortcut on all non-final slides

### Home Screen
- **Fixed header** — delivery location picker, notification badge, cart badge, search bar
- **Auto-scrolling hero banner** — 3 gradient slides cycle every 3.5 seconds with dot indicators
- **Shop by Category** — horizontal icon row for all 8 categories with "See All" shortcut
- **Deals of the Day** — live countdown timer to midnight + horizontal deal carousel
- **Perks strip** — Free Delivery · Secure Pay · Easy Returns · Fast Dispatch
- **Top Picks For You** — 2-column featured product grid

### Categories Screen
- 2-column category grid with icon, name, and item count per category
- "Browse All Products" shortcut card at the bottom

### Product Listing Screen
- Filtered by category or shows all products
- **4 sort options** — Relevant / Price Low–High / Price High–Low / Top Rated
- 2-column product grid with empty state

### Product Detail Screen
- **3-image gallery** with swipeable carousel, dot indicators, and thumbnail strip
- Back button and wishlist heart overlaid on the image
- Rating badge (coloured), star display, and review count
- Price section — bold price, crossed-out MRP, discount % badge, savings amount
- Delivery info — free delivery estimate + 10-day returns
- **Quantity selector** with stock-aware limits
- Expandable product description
- Tag chips (e.g. Wireless, Noise Cancelling)
- **Sticky footer** — "Add to Cart" (turns green on tap) + "Buy Now" (orange)

---

## Product Catalogue (Mock Data)

20 products across 8 categories with realistic INR pricing, ratings, and review counts.

| Category | Items |
|----------|-------|
| Electronics | Sony WH-1000XM5, MacBook Air M3, Samsung S24 Ultra, Logitech MX Master 3S, boAt Airdopes, Samsung 55" QLED TV, Noise ColorFit Pro 4, WD 2TB SSD |
| Fashion | Levi's 511 Jeans, Nike Air Max 270, H&M Oversized Blazer |
| Home & Kitchen | Philips Air Fryer XXL, Prestige Induction Cooktop |
| Sports | Boldfit Gym Bag, Decathlon Adjustable Dumbbells, Milton Thermosteel Bottle |
| Books | Atomic Habits — James Clear |
| Beauty | Minimalist 10% Niacinamide Serum |
| Toys | LEGO Classic Creative Bricks |
| Grocery | Organic India Raw Honey |

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React Native + Expo SDK 56 |
| Language | TypeScript |
| Navigation | Custom stack navigator (React Context) |
| Gradient | expo-linear-gradient |
| Icons | @expo/vector-icons (Ionicons) |
| State | React useState / useRef / useMemo |
| Images | picsum.photos (placeholder) |
| Data | Static mock data (Supabase-ready schema) |

---

## Project Structure

```
swiftbuy/
├── App.tsx                        # Root — splash → onboarding → main
├── assets/
│   └── images/splash.png          # Branded splash screen
├── components/
│   └── product/
│       └── ProductCard.tsx        # Reusable card — badge, stars, price, add to cart
├── constants/
│   ├── colors.ts                  # Light/dark theme tokens
│   ├── layout.ts                  # Spacing, fontSize, borderRadius, fontWeight
│   └── mockData.ts                # 8 categories + 20 products
├── navigation/
│   └── index.tsx                  # Stack navigator via React Context
├── screens/
│   ├── SplashScreen.tsx
│   ├── OnboardingScreen.tsx
│   ├── HomeScreen.tsx
│   ├── CategoriesScreen.tsx
│   ├── ProductListingScreen.tsx
│   └── ProductDetailScreen.tsx
└── types/
    └── index.ts                   # Category, Product, HeroBannerSlide
```

---

## Planned (Upcoming Phases)

- [ ] Supabase backend — Auth, PostgreSQL, Row Level Security
- [ ] Login / Signup / Forgot Password screens
- [ ] Bottom tab navigator (Home · Categories · Cart · Wishlist · Profile)
- [ ] Search with debounced Supabase query
- [ ] Wishlist — store + Supabase sync + heart toggle
- [ ] Cart — store + Supabase sync + quantity controls
- [ ] Checkout flow + address selection
- [ ] Order placement + Order History
- [ ] User Profile + Edit Profile + Avatar upload
- [ ] Settings screen + Dark / Light theme toggle (persisted)
- [ ] Push notifications
- [ ] Skeleton loaders + full error / empty states
- [ ] Performance pass — FlashList, memoization, image URL caching

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/Vinayak-bit/swiftbuy.git
cd swiftbuy

# Install dependencies
npm install

# Start the dev server
npx expo start
```

Scan the QR code with **Expo Go** on your phone, or press `i` for iOS simulator / `a` for Android emulator.

---

## Environment Variables

Create a `.env` file in the root (never commit this):

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## Brand

- **Primary** — `#1A5CB8` (SwiftBuy Blue)
- **Accent** — `#F47920` (SwiftBuy Orange)
- **Tagline** — Fast. Seamless. Shopping.
