import ChatHistory from '@/components/ChatHistory';
import EditClearButton from '@/components/EditClearButton';
import GenerateMessageUI from '@/components/GenerateMessageUI';
import HomeMiddleSection from '@/components/HomeMiddleSection';
import MicInterface from '@/components/mic_interface';
import TextInputModal from '@/components/TextInputModal';
import TopLeftToggleIcon from '@/components/TopLeftToggleIcon';
import { handleUserInput } from '@/components/utility/dataManager';

import NotificationMessage from '@/components/notification_message';

import { Tektur_900Black, useFonts } from '@expo-google-fonts/tektur';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Animated, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    Tektur_900Black,
  });

  // Input interfaces
  const [showMicModal, setShowMicModal] = useState(false);
  const [showTextInputModal, setShowTextInputModal] = useState(false);

  // Chat history toggle and data
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);

  // Animated values
  const homeOpacity = useRef(new Animated.Value(1)).current;
  const chatOpacity = useRef(new Animated.Value(0)).current;

  // Backend response state
  const [GetBackendResponse, setGetBackendResponse] = useState(null);

  // Notification state
  const [notification, setNotification] = useState({
    visible: false,
    message: '',
    type: 'success',
  });

  // Animation helpers
  const showChatView = () => {
    Animated.parallel([
      Animated.timing(homeOpacity, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(chatOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setShowChatHistory(true));
  };

  const hideChatView = () => {
    Animated.parallel([
      Animated.timing(chatOpacity, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(homeOpacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => setShowChatHistory(false));
  };

  // Clear chat and switch to Home view
  const handleClearChat = () => {
    setChatMessages([]);
    if (showChatHistory) {
      hideChatView();
    }
    showNotification('Chat cleared', 'success');
  };

  // Handle audio recording complete
const handleRecordingComplete = async ({ input_type, input_data }) => {
  try {
    showNotification('Sending audio to server...', 'info');

    const response = await handleUserInput(input_type, input_data);
    console.log('Backend response:', response);

    const messageUI = (
      <GenerateMessageUI
        userQuery={response.userQuery}
        actionType={response.actionType}
        actionData={response.actionData}
      />
    );

    setChatMessages(prev => [messageUI, ...prev]);
    showChatView();
    setGetBackendResponse(response);

  } catch (error) {
    console.error('Error processing recording:', error);
    showNotification('Failed to process recording.', 'error');
  }
};

  // Handle text input submit
  const handleTextSubmit = async (text) => {
    try {
      showNotification('Sending text to server...', 'info');

      const response = await handleUserInput('text', text);
      console.log('Backend response from text:', response);

      // // Example: open WhatsApp
      // Linking.openURL('whatsapp://send?text=Hello').catch(() => {
      //   showNotification('Unable to open WhatsApp. Make sure it is installed.', 'error');
      // });
      SendIntentAndroid.openApp('whatsapp');  

      const messageUI = (
        <GenerateMessageUI
          userQuery={response.userQuery}
          actionType={response.actionType}
          actionData={response.actionData}
        />
      );

      setChatMessages(prev => [messageUI, ...prev]);
      showChatView();

      setGetBackendResponse(response);
    } catch (err) {
      console.error('Failed to handle text input:', err);
      showNotification('Error processing text input', 'error');
    }
  };

  // Toggle between Home and Chat views with animation
  const toggleView = () => {
    if (showChatHistory) {
      hideChatView();
    } else {
      showChatView();
    }
  };

  if (!fontsLoaded) {
    return null; // or a loading spinner
  }

  function showNotification(msg, type = 'success') {
    setNotification({ visible: true, message: msg, type });
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Top Navigation Bar */}
      <View style={styles.topBar}>
        <TopLeftToggleIcon showChatHistory={showChatHistory} toggleView={toggleView} />
        <Text style={styles.title}>ASNA</Text>
        <EditClearButton onPress={handleClearChat} />
      </View>

      {/* Middle Section with Animated Fade Transition */}
      <>
        <Animated.View style={[styles.animatedView, { opacity: homeOpacity, flex: 1 }]}>
          <HomeMiddleSection />
        </Animated.View>

        <Animated.View
          style={[
            styles.animatedView,
            {
              opacity: chatOpacity,
              flex: 1,
              position: 'absolute',
              top: 70,
              left: 0,
              right: 0,
              bottom: 150,
            },
          ]}
          pointerEvents={showChatHistory ? 'auto' : 'none'}
        >
          <ChatHistory messages={chatMessages} />
        </Animated.View>
      </>

      {/* Bottom Input Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.micButton} onPress={() => setShowMicModal(true)}>
          <Ionicons name="mic" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.keyboardIcon} onPress={() => setShowTextInputModal(true)}>
          <MaterialCommunityIcons name="keyboard" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Mic Interface */}
      <MicInterface
        visible={showMicModal}
        onClose={() => setShowMicModal(false)}
        onFinish={handleRecordingComplete}
      />

      {/* TextInput Interface */}
      <TextInputModal
        visible={showTextInputModal}
        onClose={() => setShowTextInputModal(false)}
        onSubmit={handleTextSubmit}
      />

      {/* Notification Message */}
      <NotificationMessage
        visible={notification.visible}
        message={notification.message}
        type={notification.type}
        onHide={() => setNotification({ visible: false, message: '', type: '' })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 7,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 35,
    color: '#333',
    fontFamily: 'Tektur_900Black',
  },
  bottomBar: {
    backgroundColor: '#fff',
    paddingVertical: 30,
    paddingHorizontal: 20,
    paddingBottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0057ff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0057ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  keyboardIcon: {
    position: 'absolute',
    right: 20,
    bottom: 25,
    color: 'red',
    backgroundColor: 'transparent',
  },
  animatedView: {
    // Common animated view styles if needed
  },
});
