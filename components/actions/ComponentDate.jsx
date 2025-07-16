// components/actions/ComponentDate.jsx
import { Dimensions, ImageBackground, StyleSheet, Text, View } from 'react-native';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');
const CARD_WIDTH = deviceWidth * 0.60;
const CARD_HEIGHT = deviceHeight * 0.12;

const getTheme = (hour) => {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 21) return 'evening';
  return 'night';
};

const getGreeting = (hour) => {
  if (hour >= 5 && hour < 12) return 'Good Morning 🌅';
  if (hour >= 12 && hour < 18) return 'Good Afternoon ☀️';
  if (hour >= 18 && hour < 21) return 'Good Evening 🌇';
  return 'Good Night 🌙';
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

export default function DateComponent() {
  const now = new Date();

  const weekday = now.toLocaleString('default', { weekday: 'short' });
  const month = now.toLocaleString('default', { month: 'short' });
  const day = now.getDate();
  const formattedDate = `${weekday}, ${month}, ${day}`;

  const hours = now.getHours();
  const theme = getTheme(hours);
  const greeting = getGreeting(hours);
  const backgroundImage = themeAssets[theme];
  const fontColor = themeFontColors[theme];

  return (
    <View style={styles.wrapper}>
      <ImageBackground source={backgroundImage} resizeMode="cover" style={[styles.card, { height: CARD_HEIGHT }]}>
        <Text style={[styles.dateText, { color: fontColor }]}>{formattedDate}</Text>
        <Text style={[styles.greetingText, { color: fontColor }]}>{greeting}</Text>
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
    borderRadius: 16,
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
  dateText: {
    fontSize: CARD_HEIGHT * 0.15,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  greetingText: {
    fontSize: CARD_HEIGHT * 0.20,
    fontWeight: '500',
  },
});
