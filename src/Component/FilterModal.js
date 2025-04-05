import React from 'react';
import {View, Text, TouchableOpacity, Modal, StyleSheet} from 'react-native';

const FilterModal = ({
  visible,
  onClose,
  selectedRating,
  setSelectedRating,
  priceSort,
  setPriceSort,
  showWishlistOnly,
  setShowWishlistOnly,
}) => (
  <Modal transparent visible={visible} onRequestClose={onClose}>
    <View style={styles.modalOverlay}>
      <View style={styles.filterContainer}></View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({});

export default FilterModal;
