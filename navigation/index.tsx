import React, { createContext, useContext, useState } from 'react';
import CategoriesScreen from '../screens/CategoriesScreen';
import HomeScreen from '../screens/HomeScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ProductListingScreen from '../screens/ProductListingScreen';
import { Product } from '../types';

type Route =
  | { name: 'home' }
  | { name: 'categories' }
  | { name: 'productList'; categoryId: string; categoryName: string }
  | { name: 'productDetail'; product: Product };

interface NavCtx {
  navigate: (r: Route) => void;
  goBack: () => void;
  canGoBack: boolean;
}

const NavContext = createContext<NavCtx>(null!);
export const useNav = () => useContext(NavContext);

export default function AppNavigator() {
  const [stack, setStack] = useState<Route[]>([{ name: 'home' }]);
  const current = stack[stack.length - 1];

  const navigate = (r: Route) => setStack(s => [...s, r]);
  const goBack   = () => setStack(s => (s.length > 1 ? s.slice(0, -1) : s));

  function renderScreen() {
    switch (current.name) {
      case 'home':
        return <HomeScreen />;
      case 'categories':
        return <CategoriesScreen />;
      case 'productList':
        return (
          <ProductListingScreen
            categoryId={current.categoryId}
            categoryName={current.categoryName}
          />
        );
      case 'productDetail':
        return <ProductDetailScreen product={current.product} />;
    }
  }

  return (
    <NavContext.Provider value={{ navigate, goBack, canGoBack: stack.length > 1 }}>
      {renderScreen()}
    </NavContext.Provider>
  );
}
