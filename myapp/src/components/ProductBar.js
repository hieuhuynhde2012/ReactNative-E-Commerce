// ProductBar.js
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ProductBar = ({ numberOfProducts, totalProducts }) => {
  const barWidth = (numberOfProducts / totalProducts) * 100; // Calculate width percentage

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Remain {numberOfProducts} / {totalProducts}</Text>
      <View style={styles.barContainer}>
        <View style={[styles.bar, { width: `${barWidth}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 20,
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
  },
  barContainer: {
    width: '100%',
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: '#ee3131',
  },
});

export default ProductBar;