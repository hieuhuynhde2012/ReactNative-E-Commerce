import React, { memo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const SelectQuantity = ({ quantity, handleQuantity, handleChangeQuantity }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handleChangeQuantity('minus')} style={styles.button}>
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={quantity.toString()}
        onChangeText={handleQuantity}
      />
      <TouchableOpacity onPress={() => handleChangeQuantity('plus')} style={styles.button}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    padding: 10,
    borderColor: 'black',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
  },
  input: {
    paddingVertical: 10,
    textAlign: 'center',
    width: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default memo(SelectQuantity);
