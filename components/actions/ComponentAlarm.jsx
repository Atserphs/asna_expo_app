// components/actions/ComponentAlarm.jsx
import { MaterialIcons } from '@expo/vector-icons';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const CARD_WIDTH = deviceWidth * 0.4;
const CARD_HEIGHT = deviceHeight * 0.08;

const sampleData = {
  mode: 'offset',       // 'offset' or 'absolute'
  time: '11:57',
  time_type: 'PM',
  date: '2025-07-13',
  offset: 5,            // in minutes, used only if mode === 'offset'
};

export default function ComponentAlarm({ alarmData = null }) {
  const data = alarmData || sampleData;

  // Calculate alarm date/time
  let alarmDateObj;
  if (data.mode === 'offset') {
    const now = new Date();
    alarmDateObj = new Date(now.getTime() + (data.offset || 0) * 60000);
  } else {
    alarmDateObj = new Date(data.date);
    const [hours, minutes] = data.time.split(':');
    let hour = parseInt(hours, 10);
    if (data.time_type.toUpperCase() === 'PM' && hour < 12) hour += 12;
    if (data.time_type.toUpperCase() === 'AM' && hour === 12) hour = 0;
    alarmDateObj.setHours(hour, parseInt(minutes, 10), 0, 0);
  }

  // Format time and date for UI
  const hours24 = alarmDateObj.getHours();
  const hours12 = ((hours24 + 11) % 12) + 1;
  const minutesStr = alarmDateObj.getMinutes().toString().padStart(2, '0');
  const meridian = hours24 >= 12 ? 'PM' : 'AM';
  const finalTime = `${hours12}:${minutesStr} ${meridian}`;
  const finalDate = alarmDateObj.toDateString().split(' ').slice(0, 3).join(', ');

  const [hourMinute, mer] = finalTime.split(' ');

  // useEffect(() => {
  //   async function scheduleAlarmNotification() {
  //     try {
  //       // Request notification permissions
  //       const { status } = await Notifications.requestPermissionsAsync();
  //       if (status !== 'granted') {
  //         Alert.alert('Permission required', 'Please enable notifications to receive alarms.');
  //         return;
  //       }

  //       // Cancel all previously scheduled notifications (optional)
  //       // await Notifications.cancelAllScheduledNotificationsAsync();

  //       // Schedule notification
  //       await Notifications.scheduleNotificationAsync({
  //         content: {
  //           title: 'Alarm',
  //           body: `Alarm set for ${finalTime} on ${finalDate}`,
  //           sound: true,
  //           vibrate: true,
  //           priority: Notifications.AndroidNotificationPriority.HIGH,
  //           sticky: false,
  //           color: '#FF0000',
  //         },
  //         trigger: alarmDateObj,
  //       });

  //       console.log('Alarm notification scheduled for:', alarmDateObj.toString());
  //     } catch (err) {
  //       console.error('Failed to schedule alarm notification:', err);
  //     }
  //   }

  //   scheduleAlarmNotification();
  // }, [alarmData]);

  return (
    <View style={styles.card}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{finalDate}</Text>
      </View>
      <View style={styles.contentContainer}>
        <MaterialIcons name="alarm-on" size={31} color="black" style={styles.icon} />
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{hourMinute}</Text>
          <Text style={styles.meridianText}>{mer}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  dateContainer: {
    position: 'absolute',
    top: 12,
    right: 16,
  },
  dateText: {
    fontSize: 13,
    color: '#555',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  icon: {
    marginRight: 7,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#000',
  },
  meridianText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 4,
    marginBottom: 2,
  },
});
