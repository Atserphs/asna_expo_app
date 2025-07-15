// components/MicInterface.jsx
import { Audio, Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { height: screenHeight } = Dimensions.get('window');

export default function MicInterface({ visible, onClose, onFinish }) {
  const [recording, setRecording] = useState(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (visible) {
      startRecording();
    } else {
      stopAndDeleteRecording(); // Cleanup if closed early
    }
  }, [visible]);

  useEffect(() => {
    if (visible && videoLoaded) {
      videoRef.current?.playAsync();
    } else {
      videoRef.current?.pauseAsync();
    }
  }, [visible, videoLoaded]);

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

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await newRecording.startAsync();
      setRecording(newRecording);
    } catch (error) {
      console.error('Start recording failed:', error);
    }
  };

  const stopAndDeleteRecording = async () => {
    try {
      if (!recording) return;

      const status = await recording.getStatusAsync();
      if (status.isRecording) {
        await recording.stopAndUnloadAsync();
      }

      const uri = recording.getURI();
      if (uri) {
        await FileSystem.deleteAsync(uri, { idempotent: true });
        console.log('Recording discarded.');
      }
    } catch (error) {
      console.error('Failed to discard recording:', error);
    } finally {
      setRecording(null);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const destPath = FileSystem.documentDirectory + `recording-${Date.now()}.m4a`;

      await FileSystem.moveAsync({ from: uri, to: destPath });
      console.log('Recording saved to:', destPath);

      // Just return input_type and input_data to parent
      if (onFinish) onFinish({ input_type: 'audio', input_data: destPath });

      setRecording(null);
      onClose();

    } catch (error) {
      console.error('Recording submit error:', error);
      Alert.alert('Error', 'Failed to process your audio.');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.micSheet}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={async () => {
              await stopAndDeleteRecording();
              onClose();
            }}>
              <Text style={styles.icon}>×</Text>
            </TouchableOpacity>

            <Text style={styles.micTitle}>Listening...</Text>

            <TouchableOpacity onPress={handleSubmit}>
              <Text style={styles.icon}>→</Text>
            </TouchableOpacity>
          </View>

          {/* Mic Animation */}
          <View style={styles.videoContainer}>
            <Video
              ref={videoRef}
              source={require('../assets/mic_animation.mp4')}
              style={styles.video}
              resizeMode="contain"
              isLooping
              shouldPlay={visible}
              useNativeControls={false}
              onLoad={() => setVideoLoaded(true)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'flex-end',
  },
  micSheet: {
    backgroundColor: '#fff',
    width: '100%',
    height: screenHeight * 0.25,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
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
    marginBottom: 20,
  },
  icon: {
    fontSize: 32,
    color: '#000',
    paddingHorizontal: 10,
  },
  micTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  videoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  video: {
    width: 200,
    height: 200,
  },
});
