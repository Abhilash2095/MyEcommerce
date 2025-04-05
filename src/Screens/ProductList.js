import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  Alert,
  Modal,
} from 'react-native';
import axios from 'axios';
import ProductCard from '../Component/ProductCard';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';

const {width} = Dimensions.get('window');

const ProductList = ({navigation}) => {
  const isFocused = useIsFocused();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerAnim = useRef(new Animated.Value(-width * 0.7)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const [priceSort, setPriceSort] = useState(null);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

  const fadeAnim = useState(new Animated.Value(0))[0];
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
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://fakestoreapi.com/products');
        setProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

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

  const toggleWishlist = async product => {
    const isPresent = wishlist.some(item => item.id === product.id);
    let newWishlist;

    if (isPresent) {
      newWishlist = wishlist.filter(item => item.id !== product.id);
      Alert.alert('Removed!', `${product.title} removed from wishlist`);
    } else {
      newWishlist = [...wishlist, product];
      Alert.alert('Added!', `${product.title} added to wishlist`);
    }

    try {
      await AsyncStorage.setItem('@wishlist', JSON.stringify(newWishlist));
      setWishlist(newWishlist);
    } catch (e) {
      console.error('Failed to update wishlist', e);
    }
  };

  const navigateToWishlist = () => {
    toggleDrawer();
    navigation.navigate('WishList', {
      wishlist,
      toggleWishlist: handleWishlistAction,
    });
  };

  const handleWishlistAction = product => {
    Alert.alert(
      'Remove Item',
      `Are you sure to remove ${product.title} from wishlist?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Remove', onPress: () => toggleWishlist(product)},
      ],
    );
  };

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesRating = selectedRating
        ? product.rating.rate >= selectedRating
        : true;
      const inWishlist = showWishlistOnly
        ? wishlist.some(item => item.id === product.id)
        : true;
      return matchesSearch && matchesRating && inWishlist;
    })
    .sort((a, b) => {
      if (priceSort === 'asc') return a.price - b.price;
      if (priceSort === 'desc') return b.price - a.price;
      return 0;
    });

  const toggleDrawer = () => {
    Animated.parallel([
      Animated.timing(drawerAnim, {
        toValue: isDrawerOpen ? -width * 0.7 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(overlayAnim, {
        toValue: isDrawerOpen ? 0 : 0.4,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => setIsDrawerOpen(!isDrawerOpen));
  };

  const renderDrawer = () => (
    <Animated.View style={[styles.drawer, {left: drawerAnim}]}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.drawerGradient}>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={navigateToWishlist}>
          <Text style={styles.drawerText}>❤️ Wishlist ({wishlist.length})</Text>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );

  const renderOverlay = () => (
    <Animated.View
      style={[styles.overlay, {opacity: overlayAnim}]}
      pointerEvents={isDrawerOpen ? 'auto' : 'none'}>
      <TouchableOpacity
        style={styles.overlayTouchable}
        activeOpacity={1}
        onPress={toggleDrawer}
      />
    </Animated.View>
  );

  const renderFilterModal = () => (
    <Modal
      transparent={true}
      visible={showFilterModal}
      animationType="slide"
      onRequestClose={() => setShowFilterModal(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.filterContainer}>
          <Text style={styles.filterHeader}>Filter Options</Text>

          {/* Rating Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Minimum Rating</Text>
            {[3, 4, 4.5].map(rating => (
              <TouchableOpacity
                key={rating}
                style={styles.optionRow}
                onPress={() =>
                  setSelectedRating(selectedRating === rating ? null : rating)
                }>
                <View style={styles.radio}>
                  {selectedRating === rating && (
                    <View style={styles.radioSelected} />
                  )}
                </View>
                <Text style={styles.optionText}>{rating}+ Stars</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Price Sort */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Sort by Price</Text>
            {['Low to High', 'High to Low'].map(option => (
              <TouchableOpacity
                key={option}
                style={styles.optionRow}
                onPress={() => {
                  const value = option === 'Low to High' ? 'asc' : 'desc';
                  setPriceSort(priceSort === value ? null : value);
                }}>
                <View style={styles.radio}>
                  {priceSort ===
                    (option === 'Low to High' ? 'asc' : 'desc') && (
                    <View style={styles.radioSelected} />
                  )}
                </View>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Wishlist Filter */}
          <View style={styles.filterSection}>
            <TouchableOpacity
              style={styles.optionRow}
              onPress={() => setShowWishlistOnly(!showWishlistOnly)}>
              <View style={styles.radio}>
                {showWishlistOnly && <View style={styles.radioSelected} />}
              </View>
              <Text style={styles.optionText}>Show Wishlist Only</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                setSelectedRating(null);
                setPriceSort(null);
                setShowWishlistOnly(false);
              }}>
              <Text style={styles.buttonText}>Reset Filters</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setShowFilterModal(false)}>
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <LinearGradient colors={['#ffffff', '#f6f6f6']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleDrawer} style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Products</Text>
      </View>

      {renderOverlay()}
      {renderDrawer()}

      <Animatable.View
        animation="fadeInDown"
        duration={800}
        style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search products..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}>
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </Animatable.View>

      {renderFilterModal()}

      <Animated.FlatList
        style={{opacity: fadeAnim}}
        data={filteredProducts}
        keyExtractor={item => item.id.toString()}
        renderItem={({item, index}) => (
          <ProductCard
            product={item}
            index={index}
            onPress={() =>
              navigation.navigate('ProductDetail', {product: item})
            }
            isWishlisted={wishlist.some(p => p.id === item.id)}
            toggleWishlist={toggleWishlist}
          />
        )}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
    marginBottom: 10,
  },
  searchBar: {
    flex: 1,
    height: 50,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: 'white',
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  filterButton: {
    marginLeft: 10,
    paddingHorizontal: 20,
    height: 50,
    backgroundColor: '#4c669f',
    borderRadius: 25,
    justifyContent: 'center',
    elevation: 3,
  },
  filterText: {
    color: 'white',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  filterContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  filterHeader: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  filterSection: {
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4c669f',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4c669f',
  },
  optionText: {
    fontSize: 16,
    color: '#444',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  resetButton: {
    backgroundColor: '#ff6b6b',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  doneButton: {
    backgroundColor: '#4c669f',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  menuButton: {
    marginRight: 15,
  },
  menuIcon: {
    fontSize: 24,
    color: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  drawer: {
    position: 'absolute',
    width: '60%',
    height: '100%',
    zIndex: 100,
    top: 0,
    backgroundColor: 'white',
  },
  drawerGradient: {
    flex: 1,
    padding: 10,
  },
  drawerText: {
    color: 'white',
    fontSize: 18,
    marginVertical: 15,
    fontWeight: '500',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 99,
  },
  overlayTouchable: {
    flex: 1,
  },
});

export default ProductList;
