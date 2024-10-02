import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { HashLoader } from 'react-spinners';

const Loading = () => {
  return (
    <View style={styles.container}>
      <HashLoader color='#ee3131' />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default memo(Loading);
