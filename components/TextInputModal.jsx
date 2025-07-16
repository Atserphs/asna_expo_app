// components/TextInputModal.jsx
import { useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { height: screenHeight } = Dimensions.get('window');

export default function TextInputModal({ visible, onClose, onSubmit }) {
  const [text, setText] = useState('');

  const handleSubmit = async () => {
    const trimmedText = text.trim();
    if (trimmedText.length === 0) {
      console.warn('Text input is empty. Not submitting.');
      return;
    }

    try {
      if (onSubmit) {
        await onSubmit(trimmedText); // ⬅️ Forward to HomeScreen
        console.log('Text submitted to parent:', trimmedText);
      }
    } catch (error) {
      console.error('❌ Failed to submit text input:', error);
    }

    setText('');
    onClose();
  };

  const handleClose = () => {
    setText('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.modalSheet}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={handleClose}>
              <Text style={styles.icon}>×</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Type your query</Text>

            <TouchableOpacity onPress={handleSubmit}>
              <Text style={styles.icon}>→</Text>
            </TouchableOpacity>
          </View>

          {/* Text Input Box */}
          <TextInput
            style={styles.textInput}
            placeholder="Write here..."
            multiline
            autoFocus
            value={text}
            onChangeText={setText}
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            blurOnSubmit={true}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  modalSheet: {
    backgroundColor: '#fff',
    width: '100%',
    height: screenHeight * 0.25,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 32,
    color: '#000',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    padding: 12,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 10,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
});
