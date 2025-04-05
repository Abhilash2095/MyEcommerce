import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WishlistContext = createContext();

export const WishlistProvider = ({children}) => {
  const [wishlist, setWishlist] = useState([]);

  // Load saved wishlist on app start
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const savedWishlist = await AsyncStorage.getItem('@wishlist');
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error('Failed to load wishlist', e);
      }
    };
    loadWishlist();
  }, []);

  // Save wishlist whenever it changes
  useEffect(() => {
    const saveWishlist = async () => {
      try {
        await AsyncStorage.setItem('@wishlist', JSON.stringify(wishlist));
      } catch (e) {
        console.error('Failed to save wishlist', e);
      }
    };
    saveWishlist();
  }, [wishlist]);

  const toggleWishlist = product => {
    setWishlist(prev => {
      const isPresent = prev.some(item => item.id === product.id);
      if (isPresent) {
        Alert.alert('Removed!', `${product.title} removed from wishlist`);
        return prev.filter(item => item.id !== product.id);
      } else {
        Alert.alert('Added!', `${product.title} added to wishlist`);
        return [...prev, product];
      }
    });
  };

  return (
    <WishlistContext.Provider value={{wishlist, toggleWishlist}}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
