// components/actions/ComponentSingleContact.jsx
import { Feather } from '@expo/vector-icons';
import * as IntentLauncher from 'expo-intent-launcher';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ComponentSingleContact({ number }) {
  const handleDial = async () => {
    try {
      await IntentLauncher.startActivityAsync('android.intent.action.DIAL', {
        data: `tel:${number}`,
      });
    } catch (err) {
      console.error('Error launching dialer:', err);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handleDial}>
      <View style={styles.row}>
        <Feather name="phone" size={24} color="#000" style={styles.icon} />
        <View style={styles.info}>
          <Text style={styles.number}>{number}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 20,
    margin: 16,
    borderRadius: 12,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  number: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});
