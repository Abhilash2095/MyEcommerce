import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const Header = ({onMenuPress, title}) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
      <Text style={styles.menuIcon}>☰</Text>
    </TouchableOpacity>
    <Text style={styles.headerTitle}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
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
  menuButton: {marginRight: 15},
  menuIcon: {fontSize: 24, color: '#333'},
  headerTitle: {fontSize: 20, fontWeight: '600', color: '#333'},
});

export default Header;
