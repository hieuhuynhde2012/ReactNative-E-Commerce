import React, { memo } from "react";
import { Image, View, StyleSheet } from "react-native";
import banner from 'assets/banner.png'; // Đảm bảo bạn đã thêm ảnh vào thư mục assets

const Banner = () => {
  return (
    <View style={styles.container}>
      <Image
        source={banner}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  image: {
    height: 393.33,
    width: '100%',
  },
});

export default memo(Banner);
