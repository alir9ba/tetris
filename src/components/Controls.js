import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft, ArrowRight, RotateCw } from 'lucide-react-native';

const Controls = ({ onLeft, onRight, onRotate }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btn} onPress={onLeft}>
        <ArrowLeft color="black" size={32} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.btn} onPress={onRotate}>
        <RotateCw color="black" size={32} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.btn} onPress={onRight}>
        <ArrowRight color="black" size={32} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginTop: 30,
  },
  btn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default Controls;