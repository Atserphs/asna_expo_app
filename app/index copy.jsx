import ChatHistory from '@/components/ChatHistory';
import EditClearButton from '@/components/EditClearButton';
import GenerateMessageUI from '@/components/GenerateMessageUI';
import HomeMiddleSection from '@/components/HomeMiddleSection';
import MicInterface from '@/components/MicInterface';
import NotificationMessage from '@/components/NotificationMessage';
import TextInputModal from '@/components/TextInputModal';
import TopLeftToggleIcon from '@/components/TopLeftToggleIcon';
import { handleUserInput } from '@/components/utility/DataManager';
import { Tektur_900Black, useFonts } from '@expo-google-fonts/tektur';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as IntentLauncher from 'expo-intent-launcher';
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
      // console.log('Backend response:', response);

      // Shows the user query of voice recording after trancribe received
      const userQueryMessageUI = (
        <GenerateMessageUI
          userQuery={response.userQuery}
          actionType={response.actionType}
          actionData={null}
        />
      );

      // Upload message to ChatMessages state and show ChatHistory.jsx Component
      setChatMessages(prev => [userQueryMessageUI, ...prev]);
      showChatView();

      // Now pass the transcribed text to handleUserQuery
      await handleUserQuery(response.userQuery); // this goes to vosk
      
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
      // console.log(text);

      //Show user query for text type input
      const userQueryMessageUI = (
        <GenerateMessageUI
          userQuery={text}
          actionType={"user_query_action"}
          actionData={null}
        />
      );

      // Upload message to ChatMessages state and show ChatHistory.jsx Component
      setChatMessages(prev => [userQueryMessageUI, ...prev]);
      showChatView();

      // Handing over data to handleUserQuery
      handleUserQuery(text);


    } catch (err) {
      console.error('Failed to handle text input:', err);
      showNotification('Error processing text input', 'error');
    }
  };

  // Handle user query in index
  const handleUserQuery = async (text) => {
    try {
          // Send to server and get system response and show
          const response = await handleUserInput('text', text);
          // console.log('Backend response from text:', response);
          console.log('number get', response.actionData.custom.receiver_number);

          // 👉 Handle alarm if it's a known command
          if (response.actionType === 'alarm_setup_action' || response.actionData.status_message === 'known_alarm_command') {
            await handleAlarmAction(response.actionData);
          }

          if (response.actionType === 'make_call_name'){
            if (response.actionData.custom.receiver_name != 'None')
            {
              showNotification('Calling app is not opening', 'error');
              // call function which will do following things
              // search for name in contact list and call 
              // check for duplicate and return back message if 
              // check for availability of contact with name retrun back message if 
            }
          }
          else if(response.actionType === 'make_call_number'){
            if (response.actionData.custom.receiver_number != 'None')
            {
              // call for function which will do following things
              // Straightly add receive number 
              number = response.actionData.custom.receiver_number;
              await IntentLauncher.startActivityAsync('android.intent.action.DIAL', {
                  data: `tel:${number}`,
                });
            }
          }

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
          console.error('Failed to handle request to server input:', err);
          showNotification('Error processing request to server', 'error');
    }
  };

  // Handle alarm setup in clock app
  const handleAlarmAction = async (data) => {
    try {
      if (!data || data.status_message === 'unknown_alarm_command') return;

      let alarmDateObj;

      if (data.mode === 'offset') {
        const [year, month, day] = data.date.split('-').map(Number);

        // JavaScript months are 0-indexed (0 = January, 11 = December) 
        const baseDate = new Date(year, month - 1, day); // JavaScript’s Date constructor - new Date(YEAR, MONTH_INDEX, DAY, HOUR, MINUTES, SECONDS)

        alarmDateObj = new Date(baseDate.getTime() + (data.offset || 0) * 60000); 
      } 
      else if (data.mode === 'absolute') {
        const [year, month, day] = data.date.split('-').map(Number);
        console.log('date received:',year,"-",month,"-",day);
        let hour = parseInt(data.time, 10);
        const isPM = data.time_type?.toUpperCase() === 'PM';

        if (isPM && hour < 12) hour += 12;
        if (!isPM && hour === 12) hour = 0;

        alarmDateObj = new Date(year, month - 1, day, hour, 0, 0);
      } else {
        return;
      }

      const hour = alarmDateObj.getHours();
      const minutes = alarmDateObj.getMinutes();

      await IntentLauncher.startActivityAsync('android.intent.action.SET_ALARM', {
        extra: {
          'android.intent.extra.alarm.HOUR': hour,
          'android.intent.extra.alarm.MINUTES': minutes,
          'android.intent.extra.alarm.MESSAGE': 'Alarm from assistant of homepage',
          'android.intent.extra.alarm.SKIP_UI': false,
        },
      });

      showNotification(`Alarm set for ${alarmDateObj.toLocaleTimeString()}`, 'success');

    } catch (error) {
      console.error('Failed to handle alarm action:', error);
      showNotification('Failed to set alarm', 'error');
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
    paddingTop: 30,
    // marginTop: 20,
    height: 70,
    paddingBottom: 7,
    backgroundColor: '#fff',
    // zIndex: 100,
  },
  title: {
    fontSize: 35,
    color: '#333',
    fontFamily: 'Tektur_900Black',
  },
  bottomBar: {
    backgroundColor: '#fff',
  
    paddingVertical: 25,
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
