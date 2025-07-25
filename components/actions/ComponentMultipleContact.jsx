// components/ComponentMultipleContact.jsx
import { Feather } from '@expo/vector-icons';
import * as IntentLauncher from 'expo-intent-launcher';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ComponentMultipleContact({ contacts = [] }) {
  const handleDial = async (number) => {
    try {
      await IntentLauncher.startActivityAsync('android.intent.action.DIAL', {
        data: `tel:${number}`,
      });
    } catch (error) {
      console.error('Error launching dialer:', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.contactCard} onPress={() => handleDial(item.number)}>
      <Feather name="phone" size={27} color="black" style={styles.icon} />
      <View style={styles.contactInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.number}>{item.number}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        keyExtractor={(item, index) => `${item.number}-${index}`}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff', // light gray background
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginHorizontal:17,
    borderRadius: 12,
    // Soft bottom shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 4,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 12,
  },
  icon: {
    marginTop:10,
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    color: '#000',
  },
  number: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  },
});
