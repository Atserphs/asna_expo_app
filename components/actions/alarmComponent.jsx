// components/actions/AlarmComponent.jsx
import { Text, View } from 'react-native';

export default function AlarmComponent({ data }) {
  return (
    <View>
      <Text style={{ fontWeight: 'bold' }}>⏰ Alarm Setup</Text>
      <Text>{data.message || 'Alarm set successfully.'}</Text>
    </View>
  );
}
