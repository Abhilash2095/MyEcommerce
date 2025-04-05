import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductDetail = ({route, navigation}) => {
  const {product} = route.params;
  const [wishlist, setWishlist] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let errors = {};
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.message) errors.message = 'Message is required';
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      Alert.alert(
        'Form Submitted',
        'Your inquiry has been submitted successfully',
      );
      ClearFields();
      console.log('Form submitted:', formData);
    }
  };
  const ClearFields = () => {
    setFormData({
      name: '',
      email: '',
      message: '',
    });
    setErrors({});
  };

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

  // Toggle wishlist function
  const toggleWishlist = async () => {
    try {
      let newWishlist;
      const isPresent = wishlist.some(item => item.id === product.id);

      if (isPresent) {
        newWishlist = wishlist.filter(item => item.id !== product.id);
        Alert.alert('Removed!', `${product.title} removed from wishlist`);
      } else {
        newWishlist = [...wishlist, product];
        Alert.alert('Added!', `${product.title} added to wishlist`);
      }

      await AsyncStorage.setItem('@wishlist', JSON.stringify(newWishlist));
      setWishlist(newWishlist);
    } catch (e) {
      console.error('Failed to update wishlist', e);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}>
      <Animatable.View
        animation="fadeIn"
        duration={800}
        style={styles.imageContainer}>
        <Image source={{uri: product.image}} style={styles.image} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        />
        <Text style={styles.price}>${product.price}</Text>
      </Animatable.View>

      <TouchableOpacity style={styles.wishlistButton} onPress={toggleWishlist}>
        <Text style={styles.wishlistIcon}>
          {wishlist.some(item => item.id === product.id) ? '❤️' : '🤍'}
        </Text>
      </TouchableOpacity>

      <Animatable.View
        animation="fadeInUp"
        duration={600}
        delay={300}
        style={styles.content}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#999"
            value={formData.name}
            onChangeText={text => setFormData({...formData, name: text})}
          />
          {errors.name && <Text style={styles.error}>{errors.name}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={text => setFormData({...formData, email: text})}
          />
          {errors.email && <Text style={styles.error}>{errors.email}</Text>}

          <TextInput
            style={[styles.input, styles.messageInput]}
            placeholder="Message"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            value={formData.message}
            onChangeText={text => setFormData({...formData, message: text})}
          />
          {errors.message && <Text style={styles.error}>{errors.message}</Text>}

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.9}>
            <LinearGradient
              colors={['#4c669f', '#3b5998', '#192f6a']}
              style={styles.gradientButton}>
              <Text style={styles.buttonText}>Submit Inquiry</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  wishlistButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 2,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 10,
  },
  wishlistIcon: {
    fontSize: 24,
  },
  imageContainer: {
    height: 400,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '40%',
  },
  price: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 5,
  },
  content: {
    padding: 25,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -5},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    minHeight: 500,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 15,
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    marginBottom: 25,
  },
  input: {
    height: 50,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 20,

    // backgroundColor: '#4c669f',
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: 'center',
    height: 80,
    width: '80%',
    borderRadius: 12,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  error: {
    color: '#ff4757',
    marginBottom: 15,
    marginLeft: 10,
  },
  formContainer: {
    marginTop: 20,
  },
});

export default ProductDetail;
