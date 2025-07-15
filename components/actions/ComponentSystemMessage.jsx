// components/actions/ComponentSystemMessage.jsx
import { StyleSheet, Text, View } from 'react-native';

const ComponentSystemMessage = (receivedMessage) => {
  // 🔹 Sample system message
  //console.log('component', receivedMessage);
  const printToMessage = receivedMessage.sampleMessage || "Here is your result for the hero song search.Here is your result for the hero song search.Here is your result for the hero song search.Here is your result for the hero song search.Here is your result for the hero song search."
 
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{printToMessage}</Text>
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
