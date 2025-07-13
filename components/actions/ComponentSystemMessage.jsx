// components/actions/ComponentSystemMessage.jsx
import { StyleSheet, Text, View } from 'react-native';

const ComponentSystemMessage = () => {
  // 🔹 Sample system message
  const sampleMessage = "Here is your result for the hero song search.Here is your result for the hero song search.Here is your result for the hero song search.Here is your result for the hero song search.Here is your result for the hero song search.";

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{sampleMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start', // Aligns to left
    marginVertical: 6,
    paddingHorizontal: 10,
  },
  text: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'left',
  },
});

export default ComponentSystemMessage;
