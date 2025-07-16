// components/EditClearButton.js
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function EditClearButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.iconContainer}>
      <FontAwesome6 name="pen-to-square" size={20} color="#333" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    padding: 4,
  },
});
