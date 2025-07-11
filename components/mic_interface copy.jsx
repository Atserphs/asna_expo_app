import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { height: screenHeight } = Dimensions.get('window');

export default function MicInterface({ visible, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.micSheet}>
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <Text style={{ fontSize: 24, color: '#000' }}>×</Text>
          </TouchableOpacity>
          <Text style={styles.micTitle}>How can I Help?.</Text>

          <View style={styles.voiceContainer}>
            <View style={styles.voiceIndicator} />
            <TouchableOpacity style={styles.sendButton}>
              <Ionicons name="send" size={26} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
  },
  micSheet: {
    backgroundColor: '#fff',
    width: '100%',
    height: screenHeight * 0.32,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  micTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeIcon: {
    position: 'absolute',
    top: 18,
    right: 20,
    zIndex: 2,
  },
  voiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  voiceIndicator: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 100, 150, 0.3)',
  },
  sendButton: {
    marginLeft: 30,
  },
});
