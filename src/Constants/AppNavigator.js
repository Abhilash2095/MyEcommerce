import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';

import {TouchableOpacity, Text} from 'react-native';
import WishList from '../Screens/WishList';
import ProductDetail from '../Screens/ProductDetails';
import ProductList from '../Screens/ProductList';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const ProductStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="ProductList"
      component={ProductList}
      options={({navigation}) => ({
        headerLeft: () => (
          <TouchableOpacity
            style={{marginLeft: 15}}
            onPress={() => navigation.toggleDrawer()}>
            <Text style={{fontSize: 20}}>☰</Text>
          </TouchableOpacity>
        ),
      })}
    />
    <Stack.Screen name="ProductDetail" component={ProductDetail} />
  </Stack.Navigator>
);

const AppNavigator = () => (
  <Drawer.Navigator
    screenOptions={{
      drawerActiveTintColor: '#4c669f',
      drawerLabelStyle: {marginLeft: -15},
    }}>
    <Drawer.Screen
      name="Products"
      component={ProductStack}
      options={{headerShown: false}}
    />
    <Drawer.Screen
      name="Wishlist"
      component={WishList}
      options={{
        headerTitle: 'My Wishlist',
        headerTitleStyle: {color: '#333'},
      }}
    />
  </Drawer.Navigator>
);

export default AppNavigator;
