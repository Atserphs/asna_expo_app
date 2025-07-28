import ComponentMessageContact from '@/components/actions/ComponentMessageContact';
import ComponentMultipleContact from '@/components/actions/ComponentMultipleContact';
import ComponentPickContact from '@/components/actions/ComponentPickContact';
import ComponentSendMessageCard from '@/components/actions/ComponentSendMessageCard';
import ChatHistory from '@/components/ChatHistory';
import EditClearButton from '@/components/EditClearButton';
import GenerateMessageUI from '@/components/GenerateMessageUI';
import HomeMiddleSection from '@/components/HomeMiddleSection';
import MicInterface from '@/components/MicInterface';
import NotificationMessage from '@/components/NotificationMessage';
import TextInputModal from '@/components/TextInputModal';
import TopLeftToggleIcon from '@/components/TopLeftToggleIcon';
import { useContact } from '@/components/utility/ContactContext'; // Global context provider
import { handleUserInput } from '@/components/utility/DataManager';
import { Tektur_900Black, useFonts } from '@expo-google-fonts/tektur';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';
import * as IntentLauncher from 'expo-intent-launcher';
import { useEffect, useRef, useState } from 'react';
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
  
  // // Flag to show selectedContact
  // const [isWaitingForContactSelection, setIsWaitingForContactSelection] = useState(false);

  // Inside your functional component
  const { contactSelectedFlag, selectedContact, setContactSelectedFlag } = useContact();

  // Backend response state
  const [GetBackendResponse, setGetBackendResponse] = useState(null);

  // Notification state
  const [notification, setNotification] = useState({
    visible: false,
    message: '',
    type: 'success',
  });

  // 🧠 When contact is picked, show message contact UI
  useEffect(() => {
    if (contactSelectedFlag && selectedContact) {
      const messageContactUI = <ComponentMessageContact />;
      setChatMessages(prev => [messageContactUI, ...prev]);
      setContactSelectedFlag(false);
    }
  }, [contactSelectedFlag, selectedContact]);

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

          // Generating system response from Rasa to chathistory  
          const messageUI = (
            <GenerateMessageUI
              userQuery={response.userQuery}
              actionType={response.actionType}
              actionData={response.actionData}
            />
          );

          setChatMessages(prev => [messageUI, ...prev]);
          showChatView();

          // 👉 Handle alarm if it's a known command
          if (response.actionType === 'alarm_setup_action' || response.actionData.status_message === 'known_alarm_command') {
            await handleAlarmAction(response.actionData);
          }

          // 👉 Handle calling with name
          if (response.actionType === 'make_call_name'){
            if (response.actionData.custom.receiver_name != 'None')
            {
              received_name = response.actionData.custom.receiver_name;
              // call function which will do following things
              // search for name in contact list and call 
              // check for duplicate and return back message if 
              // check for availability of contact with name retrun back message if 
              const get_new_json_rasa = await findAndContactByName(received_name);

              // For multiple record case
              if (get_new_json_rasa.actionType === 'multiple_contact_record_case' && get_new_json_rasa != ''){
                // Secondary ui for rasa response
                // console.log("downmessage:", response);
                const downMessageUI1 = (
                  <GenerateMessageUI
                    userQuery={get_new_json_rasa.userQuery}
                    actionType={get_new_json_rasa.actionType}
                    actionData={get_new_json_rasa.actionData}
                  />
                );
                setChatMessages(prev => [downMessageUI1, ...prev]);
                showChatView();
              }

              // Now it's safe to use contactsToShow
              if (get_new_json_rasa.contactsToShow) {
                // console.log('contactsToShow', get_new_json_rasa.contactsToShow);
                const contactUI = (
                  <ComponentMultipleContact contacts={get_new_json_rasa.contactsToShow} />
                );
                setChatMessages(prev => [contactUI, ...prev]);
                showChatView();
              }


              // For no record case
              if (get_new_json_rasa.actionType === 'no_contact_record_case' && get_new_json_rasa != ''){
                // Secondary ui for rasa response
                // console.log("downmessage:", response);
                const downMessageUI2 = (
                  <GenerateMessageUI
                    userQuery={get_new_json_rasa.userQuery}
                    actionType={get_new_json_rasa.actionType}
                    actionData={get_new_json_rasa.actionData}
                  />
                );
                setChatMessages(prev => [downMessageUI2, ...prev]);
                showChatView();
              }              
            }
          }

          // 👉 Handle calling with number
          if(response.actionType === 'make_call_number'){
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

          // 👉 Handle sending message
          if(response.actionType === 'send_message' && response.actionData.custom?.fallback_action != 'action_default_fallback'){

                // Handle contact and message to send
                if (response.actionData.custom?.message_status === 'ask_message_receiver_name'){

                  // UI showing of pickup contact and selected contact
                      const pickUpContactUI = (
                        <ComponentPickContact
                          onContactPicked={async (contact) => {
                            // Show the selected contact UI
                            const contactUI = <ComponentMessageContact data={contact} />;
                            setChatMessages((prev) => [contactUI, ...prev]);
                            showChatView();

                            // Send contact name to Rasa via handleUserInput
                            const contact_data_for_server = 'message_receiver_name_content ' + contact.name;
                            const rasaResponse = await handleUserInput('text', contact_data_for_server);

                            // Rasa response of write message
                            const messageUI = (
                              <GenerateMessageUI
                                userQuery={rasaResponse.userQuery}
                                actionType={rasaResponse.actionType}
                                actionData={rasaResponse.actionData}
                              />
                            );
                            setChatMessages(prev => [messageUI, ...prev]);
                            showChatView();

                            // UI showing about enter data 
                              // If Rasa now wants us to ask user to enter the message text
                            if (rasaResponse.actionData.custom?.message_status === 'ask_message_send_text') {
                              const messageInputUI = (
                                <ComponentSendMessageCard
                                  contact={contact}

                                  // On send case
                                  onSend={async (messageText) => {
                                    const userInput = 'message_send_text_content ' + messageText;
                                    const rasaFinalResponse = await handleUserInput('text', userInput);

                                    const finalUI = (
                                      <GenerateMessageUI
                                        userQuery={rasaFinalResponse.userQuery}
                                        actionType={rasaFinalResponse.actionType}
                                        actionData={rasaFinalResponse.actionData}
                                      />
                                    );
                                    setChatMessages(prev => [finalUI, ...prev]);
                                    showChatView();
                                  }}

                                  // On cancel case
                                  onCancel={async() => {
                                    const userInput = 'stop';
                                    const rasaFinalResponse = await handleUserInput('text', userInput);

                                    const finalUI = (
                                      <GenerateMessageUI
                                        userQuery={rasaFinalResponse.userQuery}
                                        actionType={rasaFinalResponse.actionType}
                                        actionData={rasaFinalResponse.actionData}
                                      />
                                    );
                                    setChatMessages(prev => [finalUI, ...prev]);
                                    showChatView();
                                  }}
                                />
                              );

                              setChatMessages(prev => [messageInputUI, ...prev]);
                              showChatView();
                            }
                            
                          }}
                        />
                      );

                  setChatMessages((prev) => [pickUpContactUI, ...prev]);
                  showChatView();
                }

                // // Handle message only to send
                // if (response.actionData.custom?.message_status === 'ask_message_send_text') {
                //   const contactName = response.actionData.custom?.message_receiver_name;

                //   // 🔍 Fetch all contacts
                //   const { data: contacts } = await Contacts.getContactsAsync({
                //     fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Image],
                //   });

                //   // 🔎 Find the first contact that matches the name exactly
                //   const matchedContact = contacts.find(contact => contact.name === contactName);

                //   // ⚠️ If no match found or no number, skip rendering
                //   if (!matchedContact || !matchedContact.phoneNumbers || matchedContact.phoneNumbers.length === 0) {
                //     console.warn("No valid contact found for", contactName);
                //     return;
                //   }

                //   // 🧠 Get first phone number only
                //   const contactForComponent = {
                //     name: matchedContact.name,
                //     number: matchedContact.phoneNumbers[0].number,
                //     image: matchedContact.imageAvailable ? matchedContact.image : null,
                //   };

                //   // ✅ Render component with contact
                //   const messageInputUI = (
                //     <ComponentSendMessageCard
                //       contact={contactForComponent}

                //       // On send case
                //       onSend={async (messageText) => {
                //         const userInput = 'message_send_text_content ' + messageText;
                //         const rasaFinalResponse = await handleUserInput('text', userInput);

                //         const finalUI = (
                //           <GenerateMessageUI
                //             userQuery={rasaFinalResponse.userQuery}
                //             actionType={rasaFinalResponse.actionType}
                //             actionData={rasaFinalResponse.actionData}
                //           />
                //         );
                //         setChatMessages(prev => [finalUI, ...prev]);
                //         showChatView();
                //       }}

                //       // On cancel case
                //       onCancel={async () => {
                //         const userInput = 'stop';
                //         const rasaFinalResponse = await handleUserInput('text', userInput);

                //         const finalUI = (
                //           <GenerateMessageUI
                //             userQuery={rasaFinalResponse.userQuery}
                //             actionType={rasaFinalResponse.actionType}
                //             actionData={rasaFinalResponse.actionData}
                //           />
                //         );
                //         setChatMessages(prev => [finalUI, ...prev]);
                //         showChatView();
                //       }}
                //     />
                //   );

                //   setChatMessages(prev => [messageInputUI, ...prev]);
                //   showChatView();
                // }

                
          }

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

  // Handle contact 
  const findAndContactByName = async (name) => {
    try {
      console.log('Searching contact name:', name);

      // Code for handling contact permission
      const { status } = await Contacts.requestPermissionsAsync();
      console.log('Contact permission status:', status);

      // To check if granted or not and show in notification box
      if (status !== 'granted') {
        showNotification('Permission to access contacts was denied', 'error');
        return;
      }


      // Main code which will fetch data from contact
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      console.log('Total contacts found:', data.length);

      // Handle no contact found case
      if (!data || data.length === 0) {
        // Show notification in app
        showNotification(`No contact found with name "${name}"`, 'error');
        return('');
      }

      // Main codes to handle multiple contact initial cases
      const matchedContacts = data.filter(contact =>
        contact.name?.toLowerCase().includes(name.toLowerCase()) &&
        contact.phoneNumbers?.length > 0
      );

      console.log('Matched contactsss:', matchedContacts);

      // Check if there is multiple contact or not and do required action
      // Contact not found case
      if (matchedContacts.length === 0) {

        // Handover "contact not found" case to datamanager for request to RASA
        const no_contact_text = "no_contact_record_case";
        const response = await handleUserInput('text', no_contact_text);

        if (response.actionType === 'no_contact_record_case'){
          return(response)
        }

        // Show notification in app
        showNotification(`No contact found with name "${name}"`, 'error');
      } 

      // Multiple contact case
      else if (matchedContacts.length > 1) {

        // Handover "Multiple contact case" to datamanager for request to RASA
        // Create message with all contact names and numbers
        let multiple_contact_text = "multiple_contact_records";

        // Log the message
        // e.g. Matched contacts: [{"contactType": "person", "firstName": "राम", "id": "1", "imageAvailable": false, "isFavorite": false, "lookupKey": "0r1-69807A", "name": "राम", "phoneNumbers": [[Object]]},
        //  {"contactType": "person", "firstName": "राम", "id": "2", "imageAvailable": false, "isFavorite": false, "lookupKey": "0r2-69807A", "name": "राम", "phoneNumbers": [[Object]]}]  
        console.log("multiple_contact_text:", multiple_contact_text); 
        
        const response = await handleUserInput('text', multiple_contact_text);

        // Returning the response and array of contact 
        if (response.actionType === 'multiple_contact_record_case') {
          return {
            ...response,
            contactsToShow: matchedContacts.map(c => ({
              name: c.name,
              number: c.phoneNumbers?.[0]?.number
            }))
          };
        }

        const names = matchedContacts.map(c => c.name).join(', ');
        showNotification(`Multiple contacts found: ${names}`, 'error');
      } 

      // If all good, go to dialer
      else {
        const number = matchedContacts[0].phoneNumbers[0].number;
        console.log('📞 Dialing number:', number);

        await IntentLauncher.startActivityAsync('android.intent.action.DIAL', {
          data: `tel:${number}`,
        });

        const returning_data = {
          contactsToShow: matchedContacts.map(c => ({
            name: c.name,
            number: c.phoneNumbers?.[0]?.number,
          }))
        };
        return returning_data;
      }


    } catch (err) {
      console.error('❗ Error while accessing contacts or dialing:', err);
      showNotification('Failed to search or dial contact', 'error');
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
