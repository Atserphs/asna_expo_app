// components/actions/ComponentAlarm.jsx
import { Dimensions, ImageBackground, StyleSheet, Text, View } from 'react-native';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');
const CARD_WIDTH = deviceWidth * 0.4;
const CARD_HEIGHT = deviceHeight * 0.08;

const getTheme = (hour) => {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 21) return 'evening';
  return 'night';
};

const themeAssets = {
  morning: require('../../assets/alarm/morning_alarm_theme.jpg'),
  afternoon: require('../../assets/alarm/afternoon_alarm_theme.jpg'),
  evening: require('../../assets/alarm/evening_alarm_theme.jpg'),
  night: require('../../assets/alarm/night_alarm_theme.jpg'),
};

const themeFontColors = {
  morning: '#333333',
  afternoon: '#fff',
  evening: '#FCF8E8',
  night: '#F0E68C',
};

export default function AlarmComponentDynamic() {
  const now = new Date();

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const hour12 = hours % 12 || 12;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedTime = `${hour12}:${paddedMinutes} ${ampm}`;

  const weekday = now.toLocaleString('default', { weekday: 'short' });
  const month = now.toLocaleString('default', { month: 'short' });
  const day = now.getDate();
  const formattedDate = `${weekday}, ${month} ${day}`;

  const theme = getTheme(hours);
  const backgroundImage = themeAssets[theme];
  const fontColor = themeFontColors[theme];

  return (
    <View style={styles.wrapper}>
      <ImageBackground source={backgroundImage} resizeMode="cover" style={[styles.card, { height: CARD_HEIGHT }]}>
        <Text style={[styles.timeText, { color: fontColor }]}>
          {`${hour12}:${paddedMinutes}`}
          <Text style={[styles.amPmText, { color: fontColor }]}> {ampm}</Text>
        </Text>
        <Text style={[styles.dateText, { color: fontColor }]}>{formattedDate}</Text>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 6,
    marginLeft: 10,
    maxWidth: CARD_WIDTH,
    alignSelf: 'flex-start',
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  timeText: {
    fontSize: CARD_HEIGHT * 0.40,
    fontWeight: 'bold',
    top: CARD_HEIGHT * 0.1
  },
  amPmText: {
    fontSize: CARD_HEIGHT * 0.20,
    fontWeight: 'bold',
  },
  dateText: {
    position: 'absolute',
    top: CARD_HEIGHT * 0.12,
    right: 25,
    fontSize: CARD_HEIGHT * 0.115,
    fontWeight:'bold'
  },
});
