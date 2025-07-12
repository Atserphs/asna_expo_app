// components/actions/YouTubeComponent.jsx
import { Text, View } from 'react-native';

export default function YouTubeComponent({ data }) {
  return (
    <View>
      <Text style={{ fontWeight: 'bold' }}>▶️ YouTube Search</Text>
      {data.videos?.map((video, idx) => (
        <Text key={idx}>• {video}</Text>
      )) || <Text>No videos found.</Text>}
    </View>
  );
}
