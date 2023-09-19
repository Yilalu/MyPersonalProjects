import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Animated } from 'react-native';
import Torch from 'react-native-torch';

const App = () => {
  const [flashlightOn, setFlashlightOn] = useState(false);
  const colorAnim = useRef(new Animated.Value(0)).current;

  const toggleFlashlight = () => {
    const newState = !flashlightOn;
    setFlashlightOn(newState);
    Torch.switchState(newState);

    // Start color animation when flashlight is on, and reset it when it's off
    if (newState) {
      Animated.loop(
        Animated.timing(colorAnim, {
          toValue: 1,
          duration: 10000, // 10 colors over 10 seconds, adjust as required
          useNativeDriver: false,
        })
      ).start();
    } else {
      colorAnim.setValue(0);
    }
  };

  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    outputRange: [
      'red',
      'orange',
      'yellow',
      'green',
      'blue',
      'indigo',
      'violet',
      'pink',
      'cyan',
      'lime',
      'brown',
    ],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <TouchableOpacity onPress={toggleFlashlight} style={styles.button}>
        <Text style={styles.buttonText}>
          {flashlightOn ? 'Turn Off' : 'Turn On'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
  },
});

export default App;
