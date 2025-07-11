import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { height: screenHeight } = Dimensions.get('window');

export default function MicInterface({ visible, onClose }) {
  const [recording, setRecording] = useState(null);

  useEffect(() => {
    if (visible) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [visible]);

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission Denied', 'Microphone access is required');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      const destPath = FileSystem.documentDirectory + `recording-${Date.now()}.m4a`;
      await FileSystem.moveAsync({
        from: uri,
        to: destPath,
      });

      console.log('Audio saved to:', destPath);
      setRecording(null);
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.micSheet}>
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <Text style={{ fontSize: 24, color: '#000' }}>×</Text>
          </TouchableOpacity>
          <Text style={styles.micTitle}>Listening...</Text>

          <View style={styles.voiceContainer}>
            <View style={styles.voiceIndicator} />
            <TouchableOpacity style={styles.sendButton} disabled>
              <Ionicons name="send" size={26} color="#ccc" />
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
