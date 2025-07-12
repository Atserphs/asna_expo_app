// components/actions/ComponentUserMessage.jsx
import { StyleSheet, Text, View } from 'react-native';

const ComponentUserMessage = ({sampleMessage = "Heello"}) => {

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <Text style={styles.text}>{sampleMessage}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-end', // Aligns message to right
    marginVertical: 6,
    paddingHorizontal: 10,
  },
  bubble: {
    backgroundColor: '#EEEEEE',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    maxWidth: '80%', // prevents overlong bubbles
  },
  text: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
});

export default ComponentUserMessage;
