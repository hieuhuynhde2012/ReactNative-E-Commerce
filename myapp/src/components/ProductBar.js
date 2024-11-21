// ProductBar.js
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ProductBar = ({ numberOfProducts, totalProducts }) => {
  const barWidth = (numberOfProducts / totalProducts) * 100; // Calculate width percentage

  return (
    <View style={styles.container}>
    <View style={styles.barContainer}>
      <View style={[styles.bar, { width: `${barWidth}%` }]}>
      </View>
      <Text style={styles.title}>
        Remain {numberOfProducts} / {totalProducts}
      </Text>
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 7,
    paddingLeft: 4,
    paddingRight: 2
  },
  title: {
    fontSize: 12,
    color: 'white',
    zIndex: 2,
    marginLeft: 25,
    marginTop: 2
  },
  barContainer: {
    width: '117%',
    height: 20,
    backgroundColor: '#eeCCCC',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
   
  },
  bar: {
    position: 'absolute',
    left: 0,
    height: '100%',
    backgroundColor: '#ee3131',
    zIndex: 1,
  },
});

export default ProductBar;