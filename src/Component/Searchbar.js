import React from 'react';
import {View, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import * as Animatable from 'react-native-animatable';

const SearchBar = ({value, onChangeText, onFilterPress}) => (
  <Animatable.View
    animation="fadeInDown"
    duration={800}
    style={styles.container}>
    <TextInput
      style={styles.searchBar}
      placeholder="Search products..."
      placeholderTextColor="#888"
      value={value}
      onChangeText={onChangeText}
    />
    <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
      <Text style={styles.filterText}>Filter</Text>
    </TouchableOpacity>
  </Animatable.View>
);

const styles = StyleSheet.create({
  container: {
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
  filterText: {color: 'white', fontWeight: '600'},
});

export default SearchBar;
