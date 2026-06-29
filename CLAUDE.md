# CLAUDE.md — SwiftBuy (E-Commerce App)

## Overview

SwiftBuy is a full-featured mobile e-commerce app (Amazon/Flipkart style) built with React Native Expo.
Tagline: **Fast. Seamless. Shopping.**
Users can browse products by category, manage a cart and wishlist, place orders, and manage their profile.
The app supports dark/light themes, image uploads, and push notifications.

Backend: Supabase (Auth, PostgreSQL, Storage).

---

## Goals

- Let users discover, browse, and purchase products with a smooth native experience.
- Enable account management: orders, addresses, profile, settings.
- Support dark/light theme with persisted preference.
- Provide a solid, maintainable codebase that is easy to extend feature by feature.

---

## User Rules

- Use npm exclusively — never pnpm or yarn.
- Use available MCP servers for knowledge and understanding before guessing.
- Fetch and surface console logs when debugging.
- Suggest performance improvements when you spot them.
- Point out security issues and propose concrete fixes.
- Do not install packages unless explicitly asked.
- Prefer iteration and modularization over duplication.
- All new UI primitives go in components/ui/ first, then compose up.
- Components are grouped by use-case in subdirectories under components/.

---

## Project Rules

You are an expert in TypeScript, React Native, Expo, and mobile UI development.

### Code Style
- Write concise, typed TypeScript. No any without a comment explaining why.
- Functional components only — no classes.
- Declarative patterns; avoid imperative side-effect soup.
- Descriptive variable names with auxiliary verbs: isLoading, hasError, canCheckout.
- File structure order: exported component -> subcomponents -> helpers -> static content -> types.
- Follow Expo docs (https://docs.expo.dev/) for all Expo-specific setup and config.

### Components
- All reusable primitives (Button, Input, Card, Badge, Skeleton, etc.) live in components/ui/.
- Build new components by composing from components/ui/ — never bypass it with one-off inline styles.
- Group feature components by use-case: components/product/, components/cart/, components/home/, etc.
- No inline styles ever — always StyleSheet.create().
- Every component that fetches data must handle: loading state, empty state, error state.

### Data & API
- All Supabase calls go in lib/api/*.ts — never call Supabase directly inside a component.
- Custom hooks in hooks/ wrap store access + API logic. Components call hooks, not stores directly.
- Zustand stores in store/ hold client state (cart, wishlist, theme, auth session).
- Sync Supabase with Zustand on auth state change.

### Security
- Never hardcode secrets. All keys go in .env with EXPO_PUBLIC_ prefix for client-safe values.
- .env is in .gitignore. Always.
- Enable Row Level Security (RLS) on every Supabase table. Users only access their own rows.
- Validate all user input before sending to Supabase (length, format, sanitize).
- Use upsert over unguarded insert where possible to prevent duplicate records.

### Performance
- Use FlashList (@shopify/flash-list) for all scrollable product lists — not FlatList.
- Memoize expensive computations with useMemo; stable callbacks with useCallback.
- Lazy-load screens outside the initial tab navigator using Expo Router lazy loading.
- Cache Supabase image URLs; do not re-fetch signed URLs on every render.
- Paginate all product/order list queries (limit/offset or cursor-based).

---

## Tech Stack

| Layer         | Choice                                          |
|---------------|-------------------------------------------------|
| Framework     | React Native + Expo SDK 52                      |
| Navigation    | Expo Router (file-based, app/ dir)              |
| Backend       | Supabase (Auth, PostgreSQL, Storage)            |
| State         | Zustand                                         |
| Lists         | @shopify/flash-list                             |
| Icons         | @expo/vector-icons (Ionicons)                   |
| Image Picker  | expo-image-picker                               |
| Notifications | expo-notifications                              |
| Fonts         | expo-font                                       |
| Local Storage | @react-native-async-storage/async-storage       |

---

## Folder Structure

```
app/
  _layout.tsx              # Root layout: auth listener, theme provider
  index.tsx                # Splash / session redirect
  (auth)/
    _layout.tsx
    login.tsx
    signup.tsx
    forgot-password.tsx
  (tabs)/
    _layout.tsx            # Bottom tab navigator
    index.tsx              # Home
    categories.tsx
    cart.tsx
    wishlist.tsx
    profile.tsx
  product/
    [id].tsx               # Product Details
  search.tsx
  checkout.tsx
  orders/
    index.tsx              # Order History
    [id].tsx               # Order Detail
  address/
    index.tsx              # Address List
    add.tsx                # Add / Edit Address
  settings.tsx
  edit-profile.tsx

components/
  ui/                      # Primitives: Button, Input, Card, Badge, Skeleton, Divider, EmptyState, Loader
  product/                 # ProductCard, ProductGrid, RatingStars, PriceTag, DiscountBadge
  home/                    # HeroBanner, CategoryRow, FeaturedSection, DealsSection
  cart/                    # CartItem, CartSummary, QuantitySelector
  order/                   # OrderCard, OrderStatusBadge, OrderItemRow
  common/                  # Header, SearchBar, FilterSheet, SortSheet, ScreenWrapper

store/
  authStore.ts             # session, user, login/logout actions
  cartStore.ts             # items, add/remove/update, total
  wishlistStore.ts         # ids, toggle, isWishlisted
  themeStore.ts            # mode (light|dark), toggle, persist

lib/
  supabase.ts              # Supabase client singleton
  api/
    auth.ts
    products.ts
    categories.ts
    orders.ts
    addresses.ts
    cart.ts
    wishlist.ts
    profile.ts
    storage.ts             # image upload helpers

hooks/
  useAuth.ts
  useTheme.ts
  useCart.ts
  useWishlist.ts
  useProducts.ts           # paginated product fetching
  useOrders.ts

constants/
  colors.ts                # Light + dark theme tokens
  layout.ts                # spacing, borderRadius, fontSizes
  config.ts                # pagination limits, storage bucket names

types/
  index.ts                 # All shared types: Product, Category, User, Order, Address, CartItem

assets/
  images/
  fonts/
```

---

## Supabase Schema

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  phone text,
  push_token text,
  updated_at timestamptz default now()
);

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  image_url text
);

create table products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  price numeric(10,2) not null,
  discount_price numeric(10,2),
  category_id uuid references categories(id),
  images text[],
  rating numeric(2,1) default 0,
  review_count int default 0,
  stock int default 0,
  created_at timestamptz default now()
);

create table addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  label text,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  pincode text not null,
  is_default boolean default false
);

create table cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  qty int default 1,
  unique(user_id, product_id)
);

create table wishlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  unique(user_id, product_id)
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  address_id uuid references addresses(id),
  total numeric(10,2) not null,
  status text default 'placed',
  created_at timestamptz default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  qty int not null,
  price_at_purchase numeric(10,2) not null
);
```

Enable RLS on every table. Example policies:

```sql
alter table profiles enable row level security;
create policy "Users read own profile"   on profiles for select using (auth.uid() = id);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);
-- Repeat pattern for cart_items, wishlist, orders, order_items, addresses
```

---

## Environment Variables

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Add .env to .gitignore immediately. Never commit secrets.

---

## Key Code Patterns

### Supabase client (lib/supabase.ts)
```ts
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
)
```

### Theme tokens (constants/colors.ts)
```ts
// Brand: blue (#1A5CB8) primary, orange (#F47920) accent — from SwiftBuy logo
export const Colors = {
  light: {
    background:  '#FFFFFF',
    surface:     '#F5F7FA',
    primary:     '#1A5CB8',   // brand blue
    primaryDim:  '#1A5CB820',
    accent:      '#F47920',   // brand orange
    accentDim:   '#F4792020',
    text:        '#111111',
    textMuted:   '#666666',
    border:      '#E0E0E0',
    error:       '#E53935',
  },
  dark: {
    background:  '#0F1117',
    surface:     '#1C2030',
    primary:     '#3A7FDB',   // lighter blue for dark mode readability
    primaryDim:  '#3A7FDB30',
    accent:      '#F47920',
    accentDim:   '#F4792030',
    text:        '#F5F5F5',
    textMuted:   '#AAAAAA',
    border:      '#2E3347',
    error:       '#EF5350',
  },
}
```

### Auth redirect pattern (app/_layout.tsx)
```ts
// 1. On mount: supabase.auth.getSession() -> router.replace based on result
// 2. supabase.auth.onAuthStateChange -> update authStore -> router.replace
// 3. Wrap app in ThemeProvider reading themeStore
```

### Paginated product fetch (lib/api/products.ts)
```ts
export async function getProducts({ page = 0, limit = 20, categoryId }: ProductQuery) {
  let q = supabase.from('products').select('*').range(page * limit, (page + 1) * limit - 1)
  if (categoryId) q = q.eq('category_id', categoryId)
  const { data, error } = await q
  if (error) throw error
  return data
}
```

### Image upload (lib/api/storage.ts)
```ts
export async function uploadAvatar(userId: string, uri: string): Promise<string> {
  const ext = uri.split('.').pop()
  const path = `${userId}/avatar.${ext}`
  const file = { uri, name: path, type: `image/${ext}` } as any
  const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
  if (error) throw error
  return supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl
}
```

---

## Build Order

Work through phases in sequence. Complete each item fully before moving to the next.

```
Phase 1 — Foundation
  1.  Project init, folder scaffold, .env, .gitignore
  2.  types/index.ts + constants (colors, layout, config)
  3.  Supabase project: tables, RLS policies, storage buckets
  4.  lib/supabase.ts + authStore (Zustand)
  5.  Auth screens: Login, Signup, Forgot Password
  6.  _layout.tsx: auth listener + redirect logic

Phase 2 — Core Shopping
  7.  Tab navigator shell (empty placeholder screens)
  8.  Home screen: HeroBanner + CategoryRow + FeaturedSection (static data first)
  9.  Categories screen connected to Supabase
  10. Product Listing with FlashList + pagination
  11. Product Details screen

Phase 3 — User Actions
  12. Search screen + debounced Supabase query
  13. Filter sheet + Sort sheet (bottom sheets)
  14. Wishlist: store + Supabase sync + toggle UI
  15. Cart: store + Supabase sync + quantity controls
  16. Checkout flow + address selection

Phase 4 — Account
  17. Address Management (list, add, edit, set default)
  18. Order placement + Order History list
  19. Order Detail screen
  20. User Profile screen + Edit Profile screen
  21. Settings screen + Dark/Light theme toggle (persisted)

Phase 5 — Platform Features
  22. Image Upload: avatar via Camera or Gallery
  23. Push Notifications: token save to profiles, local trigger test
  24. Responsive UI audit (small phones + tablets)

Phase 6 — Polish
  25. Skeleton loaders on every data screen
  26. Empty states and error states everywhere
  27. Performance pass: memoization, FlashList tuning, image URL caching
  28. Security audit: RLS verification, input validation, no exposed secrets
```

---

## Init Commands

```bash
npx create-expo-app@latest shopnative --template blank-typescript
cd shopnative
npm install expo-router @supabase/supabase-js \
  @react-native-async-storage/async-storage \
  zustand @shopify/flash-list \
  expo-image-picker expo-notifications \
  expo-font @expo-google-fonts/inter
```
