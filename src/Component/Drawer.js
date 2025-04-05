import React from 'react';
import {Animated, View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const Drawer = ({drawerAnim, isDrawerOpen, onWishlistPress, wishlistCount}) => (
  <Animated.View style={[styles.drawer, {left: drawerAnim}]}>
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.drawerGradient}>
      <TouchableOpacity style={styles.drawerItem} onPress={onWishlistPress}>
        <Text style={styles.drawerText}>❤️ Wishlist ({wishlistCount})</Text>
      </TouchableOpacity>
    </LinearGradient>
  </Animated.View>
);

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    width: '60%',
    height: '100%',
    zIndex: 100,
    top: 0,
    backgroundColor: 'white',
  },
  drawerGradient: {flex: 1, padding: 10},
  drawerText: {
    color: 'white',
    fontSize: 18,
    marginVertical: 15,
    fontWeight: '500',
  },
});

export default Drawer;
