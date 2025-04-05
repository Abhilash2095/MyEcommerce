import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import ProductList from './src/Screens/ProductList';
import ProductDetail from './src/Screens/ProductDetails';
import WishList from './src/Screens/WishList';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ProductList">
        <Stack.Screen name="ProductList" component={ProductList} />
        <Stack.Screen name="ProductDetail" component={ProductDetail} />
        <Stack.Screen name="WishList" component={WishList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
