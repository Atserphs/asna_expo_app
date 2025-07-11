import MicInterface from '@/components/mic_interface';
import NotificationMessage from '@/components/notification_message';
import { Tektur_900Black, useFonts } from '@expo-google-fonts/tektur';
import { Entypo, Feather, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function HomeScreen() {
    const [fontsLoaded] = useFonts({
        Tektur_900Black,
    });

    const [showMicModal, setShowMicModal] = useState(false);

    const [notification, setNotification] = useState({
      visible: false,
      message: '',
      type: 'success', // or 'error'
    });


    if (!fontsLoaded) {
        return null; // or show a loading spinner
    }

    // Helper function for Notification Message
    function showNotification(msg, type = 'success') {
      setNotification({ visible: true, message: msg, type });
    }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Top Navigation Bar */}
      <View style={styles.topBar}>
        <FontAwesome6 name="bars-staggered" size={20} color="#333" style={styles.menuIcon} />
        <Text style={styles.title}>ASNA</Text>
        <FontAwesome6 name="pen-to-square" size={20} color="#333" style={styles.editIcon} />
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <Text style={styles.prompt}>What can I help with?</Text>

        <View style={styles.row}>
          <ActionChip icon={<FontAwesome5 name="image" size={16} color="#333" />} label="Create image" />
          <ActionChip icon={<Entypo name="gift" size={16} color="#333" />} label="Surprise me" />
        </View>

        <View style={styles.row}>
          <ActionChip icon={<FontAwesome6 name="pen-to-square" size={16} color="#333" />} label="Help me write" />
          <ActionChip icon={<Feather name="zap" size={16} color="#333" />} label="Brainstorm" />
          <ActionChip label="More" />
        </View>
      </View>

      {/* Bottom Input Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.micButton} onPress={() => setShowMicModal(true)}>
          <Ionicons name="mic" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.keyboardIcon}>
          <MaterialCommunityIcons name="keyboard" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Mic Interface */}
      <MicInterface visible={showMicModal} onClose={() => setShowMicModal(false)} />


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

const ActionChip = ({ icon, label }) => (
  <TouchableOpacity style={styles.chip} >
    {icon && <View style={styles.chipIcon}>{icon}</View>}
    <Text style={styles.chipText}>{label}</Text>
  </TouchableOpacity>
);

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
    paddingTop: 10,
    paddingBottom: 7,
    backgroundColor: '#fff',
    // borderBottomWidth: 0.3,
    // borderBottomColor: '#ddd',
  },
  menuIcon: {
    padding: 4,
  },
  editIcon: {
    padding: 4,
  },
  title: {
    fontSize: 35,
    color: '#333',
    fontFamily: 'Tektur_900Black'
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  prompt: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 32,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginHorizontal: 4,
  },
  chipIcon: {
    marginRight: 6,
  },
  chipText: {
    fontSize: 14,
    color: '#333',
  },
  bottomBar: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    paddingBottom:40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth:.3
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
});
