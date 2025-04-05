import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';

const ProductCard = ({
  product,
  onPress,
  isWishlisted,
  toggleWishlist,
  index,
  showRemove,
}) => {
  return (
    <Animatable.View
      animation="fadeInUp"
      delay={index * 100}
      style={styles.cardContainer}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={styles.card}>
        <Image
          source={{uri: product.image}}
          style={styles.image}
          resizeMode="contain"
        />

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        />

        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {product.title}
          </Text>
          <Text style={styles.price}>${product.price}</Text>
        </View>
        <Animatable.View
          animation="fadeIn"
          duration={500}
          style={styles.wishlistButton}>
          <TouchableOpacity onPress={() => toggleWishlist(product)}>
            <Text
              style={[
                styles.wishlistText,
                isWishlisted && styles.activeWishlist,
              ]}>
              {isWishlisted ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
        </Animatable.View>
      </TouchableOpacity>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  card: {
    height: 160,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  price: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  wishlistButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 8,
  },
  wishlistText: {
    fontSize: 25,
    color: '#666',
  },
  activeWishlist: {
    color: '#ff4757',
  },
});

export default ProductCard;
