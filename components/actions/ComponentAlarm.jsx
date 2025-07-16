// components/ComponentAlarm.jsx
import { MaterialIcons } from '@expo/vector-icons';
import { useRef } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const CARD_WIDTH = deviceWidth * 0.4;
const CARD_HEIGHT = deviceHeight * 0.08;

const sampleData = {
  mode: 'offset',
  time: '11:57',
  time_type: 'PM',
  date: '2025-07-13',
  offset: 5,
};

export default function ComponentAlarm({ sampleMessage }) {


  const data = sampleMessage || sampleData;
  console.log('print from component', sampleMessage);

  const lastAlarmTime = useRef(null);

  if (!data || data.status_message === 'unknown_alarm_command') {
    return null;
  }

  let alarmDateObj;

  if (data.mode === 'offset') {
    const now = new Date();
    alarmDateObj = new Date(now.getTime() + (data.offset || 0) * 60000);
  } else if (data.mode === 'absolute') {
    const [year, month, day] = data.date.split('-').map(Number);
    const hourRaw = parseInt(data.time, 10);
    let hour = hourRaw;
    if (data.time_type?.toUpperCase() === 'PM' && hour < 12) hour += 12;
    if (data.time_type?.toUpperCase() === 'AM' && hour === 12) hour = 0;

    alarmDateObj = new Date(year, month - 1, day, hour, 0, 0);
  }

  const hours24 = alarmDateObj.getHours();
  const hours12 = ((hours24 + 11) % 12) + 1;
  const minutesStr = alarmDateObj.getMinutes().toString().padStart(2, '0');
  const meridian = hours24 >= 12 ? 'PM' : 'AM';
  const finalTime = `${hours12}:${minutesStr} ${meridian}`;
  const finalDate = alarmDateObj.toDateString().split(' ').slice(0, 3).join(', ');
  const [hourMinute, mer] = finalTime.split(' ');

  console.log('Final Alarm Time:', finalTime);
  console.log('Final Alarm Date:', finalDate);



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
