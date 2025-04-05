import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, Alert} from 'react-native';
import ProductCard from '../Component/ProductCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';

const WishList = ({navigation, route}) => {
  const [wishlist, setWishlist] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const savedWishlist = await AsyncStorage.getItem('@wishlist');
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error('Failed to load wishlist', e);
      }
    };
    if (isFocused) loadWishlist();
  }, [isFocused]);

  const handleRemove = async product => {
    try {
      const newWishlist = wishlist.filter(item => item.id !== product.id);
      await AsyncStorage.setItem('@wishlist', JSON.stringify(newWishlist));
      setWishlist(newWishlist);
      Alert.alert('Removed!', `${product.title} removed from wishlist`);
    } catch (e) {
      console.error('Failed to remove item', e);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={wishlist}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <ProductCard
            product={item}
            onPress={() =>
              navigation.navigate('ProductDetail', {product: item})
            }
            isWishlisted={true}
            toggleWishlist={handleRemove}
            showRemove={true}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Wishlist is empty</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 10},
});

export default WishList;
