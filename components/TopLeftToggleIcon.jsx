// components/TopLeftToggleIcon.jsx
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity } from 'react-native';

export default function TopLeftToggleIcon({ showChatHistory, toggleView }) {
  // Animated opacity values
  const barsOpacity = useRef(new Animated.Value(showChatHistory ? 0 : 1)).current;
  const backOpacity = useRef(new Animated.Value(showChatHistory ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(barsOpacity, {
        toValue: showChatHistory ? 0 : 1,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(backOpacity, {
        toValue: showChatHistory ? 1 : 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, [showChatHistory, barsOpacity, backOpacity]);

  return (
    <TouchableOpacity onPress={toggleView} style={{ width: 30, height: 30 }}>
      {/* Bars icon */}
      <Animated.View style={{ position: 'absolute', opacity: barsOpacity }}>
        <FontAwesome6 name="bars-staggered" size={24} color="#333" style={{ padding: 4 }} />
      </Animated.View>

      {/* Back arrow icon */}
      <Animated.View style={{ position: 'absolute', opacity: backOpacity }}>
        <Ionicons name="arrow-back" size={24} color="#333" style={{ padding: 4 }} />
      </Animated.View>
    </TouchableOpacity>
  );
}
