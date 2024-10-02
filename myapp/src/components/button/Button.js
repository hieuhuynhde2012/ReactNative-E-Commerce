import React, { memo } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ children, handleOnClick, style, fw, type = 'button' }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        style,
        fw ? styles.fullWidth : styles.fitWidth,
      ]}
      onPress={() => {
        handleOnClick && handleOnClick();
      }}
    >
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#1E90FF', // Màu chính của bạn
  },
  text: {
    color: 'white',
    fontWeight: '600', // Thay đổi theo font bạn dùng
  },
  fullWidth: {
    width: '100%',
  },
  fitWidth: {
    width: 'auto',
  },
});

export default memo(Button);
