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
      videoRef.current?.playAsync();
    } else {
      stopRecording();
      videoRef.current?.pauseAsync();
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

  const stopRecording = async () => {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      // Optionally move the file
      const destPath = FileSystem.documentDirectory + `recording-${Date.now()}.m4a`;
      await FileSystem.moveAsync({ from: uri, to: destPath });

      // Upload the audio file here
      await uploadAudio(destPath);

      console.log('Audio saved to:', destPath);
      setRecording(null);

      if (onFinish) onFinish(destPath);
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.micSheet}>
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <Text style={{ fontSize: 40, color: '#000' }}>×</Text>
          </TouchableOpacity>
          <Text style={styles.micTitle}>Listening...</Text>

          <View style={styles.videoContainer}>
            <Video
              ref={videoRef}
              source={require('../assets/mic_animation.mp4')} // Animation video file
              style={styles.video}
              resizeMode="contain"
              isLooping
              shouldPlay={visible}
              useNativeControls={false}
              onLoad={() => setVideoLoaded(true)} // To load video first
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
  videoContainer: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  video: {
    width: 200,
    height: 200,
  },
});
