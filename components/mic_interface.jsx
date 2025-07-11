import { Audio, Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { uploadAudio } from './utility/uploadData_mob_to_pc';

const { height: screenHeight } = Dimensions.get('window');

export default function MicInterface({ visible, onClose, onFinish }) {
  const [recording, setRecording] = useState(null);
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    if (visible && videoLoaded) {
      videoRef.current?.playAsync();
    } else {
      videoRef.current?.pauseAsync();
    }
  }, [visible, videoLoaded]);

  useEffect(() => {
    if (visible) {
      startRecording();
    } else {
      stopAndDeleteRecording(); // cleanup if closed directly
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

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await newRecording.startAsync();
      setRecording(newRecording);
    } catch (error) {
      console.error('Failed to start recording', error);
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

    // Delete file if it exists
    if (uri) {
      await FileSystem.deleteAsync(uri, { idempotent: true });
      console.log('Recording discarded.');
    }

  } catch (error) {
    console.error('Failed to discard recording', error);
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

      await uploadAudio(destPath);
      console.log('Audio uploaded:', destPath);

      if (onFinish) onFinish(destPath);
      setRecording(null);
      onClose(); // close modal
    } catch (error) {
      console.error('Failed to stop/upload recording', error);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.micSheet}>

          {/* Header Row: Cross - Listening - Submit */}
          <View style={styles.headerRow}>
            <TouchableOpacity
                onPress={async () => {
                  await stopAndDeleteRecording();
                  onClose();
                }}
              >
              <Text style={styles.icon}>×</Text>
            </TouchableOpacity>

            <Text style={styles.micTitle}>Listening...</Text>

            <TouchableOpacity onPress={handleSubmit}>
              <Text style={styles.icon}>→</Text>
            </TouchableOpacity>
          </View>

          {/* Mic animation */}
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
    backgroundColor: 'rgba(0,0,0,0.2)',
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
    marginBottom: 16,
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
