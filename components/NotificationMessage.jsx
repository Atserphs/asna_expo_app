// components/NotificationMessage.jsx
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text } from 'react-native';

const { width } = Dimensions.get('window');

export default function NotificationMessage({ message, visible, onHide, duration = 3000, type = 'success' }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Fade out after duration
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onHide && onHide();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

   const backgroundColor = type === 'error' ? '#ff4d4d' : '#4CAF50'; // red or green

  return (
    <Animated.View style={[styles.container, { backgroundColor, opacity: fadeAnim }]}>
      <Text style={styles.messageText}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    left: '50%',
    transform: [{ translateX: '-50%' }],
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    maxWidth: width * 0.7,
    zIndex: 9999, // make sure it's above everything
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 10,
  },
  messageText: {
    color: '#fff',
    fontSize: 14,
  },
});
