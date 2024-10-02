import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Countdown = ({ unit, number }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.number}>{number}</Text>
      <Text style={styles.unit}>{unit}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '30%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    borderRadius: 10,
  },
  number: {
    fontSize: 18,
    color: '#4A4A4A',
  },
  unit: {
    fontSize: 12,
    color: '#7A7A7A',
  },
});

export default memo(Countdown);
