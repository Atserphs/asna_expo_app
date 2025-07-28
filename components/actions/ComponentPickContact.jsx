// components/actions/ComponentPickContact.jsx
import { Feather } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Contacts from 'expo-contacts';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ComponentPickContact = ({ onContactPicked }) => {
  const openContactPicker = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') return;

    const contact = await Contacts.presentContactPickerAsync();

    if (contact) {
      const name = contact.name || `${contact.firstName || ''} ${contact.lastName || ''}`.trim();
      const number = contact.phoneNumbers?.[0]?.number || '';
      const image = contact.imageAvailable ? contact.image?.uri : null;

      // 🟢 Call parent-provided handler
      onContactPicked({ name, number, image });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Message who?</Text>
        <TouchableOpacity style={styles.row} onPress={openContactPicker}>
          <FontAwesome name="user-circle-o" size={24} color="black" />
          <Text style={styles.text}>Pick a contact</Text>
          <Feather name="chevron-down" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ComponentPickContact;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#f0f0f0',
    marginVertical: 8,
    marginHorizontal: 12,
    borderRadius: 12,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    color: 'black',
    fontSize: 16,
    marginBottom: 12,
  },
  row: {
    backgroundColor: '#fff',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    justifyContent: 'space-between',
  },
  text: {
    flex: 1,
    marginLeft: 12,
    color: 'black',
    fontSize: 16,
  },
});
