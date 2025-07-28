// components/actions/ComponentSendMessageCard.jsx

import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const ComponentSendMessageCard = ({ contact, onSend, onCancel }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend?.(message, contact);
    }
  };

  return (
    <View style={styles.card}>
      {/* Top: Avatar and Contact Info */}
      <View style={styles.topRow}>
        {contact?.image ? (
          <Image source={{ uri: contact.image }} style={styles.avatar} />
        ) : (
          <MaterialIcons name="person" size={40} color="#bbb" style={styles.avatar} />
        )}
        <View style={styles.contactInfo}>
          <Text style={styles.name}>• {contact?.name || 'Kantipur Blood Bank'}</Text>
          <Text style={styles.number}>{contact?.number || '01-4111692'}</Text>
        </View>
      </View>

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Message</Text>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message..."
          placeholderTextColor="#aaa"
          style={styles.input}
        />
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: message.trim() ? '#444' : '#666' },
          ]}
          onPress={handleSend}
          disabled={!message.trim()}
        >
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ComponentSendMessageCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 11,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  number: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  inputContainer: {
    marginVertical: 12,
  },
  label: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 6,
    fontSize: 16,
    color: '#000',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: '#222',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  cancelText: {
    color: '#fff',
    fontSize: 14,
  },
  sendButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  sendText: {
    color: '#fff',
    fontSize: 14,
  },
});
