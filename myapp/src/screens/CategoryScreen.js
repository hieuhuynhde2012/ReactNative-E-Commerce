import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CategoryScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Category Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24 },
});

export default CategoryScreen;
