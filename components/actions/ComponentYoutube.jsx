// components/actions/ComponentYoutube.jsx
import { Entypo } from '@expo/vector-icons';
import {
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

// 🔹 Sample data stored in this file (real YouTube video IDs)
const sampleYoutubeVideos = [
  {
    id: 'dQw4w9WgXcQ',
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    videoTitle: 'Never Gonna Give You Up',
    artistName: 'Rick Astley',
  },
  {
    id: '3JZ_D3ELwOQ',
    thumbnailUrl: 'https://img.youtube.com/vi/3JZ_D3ELwOQ/hqdefault.jpg',
    videoTitle: 'Faded',
    artistName: 'Alan Walker',
  },
  {
    id: '9bZkp7q19f0',
    thumbnailUrl: 'https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg',
    videoTitle: 'Gangnam Style',
    artistName: 'PSY',
  },
];

// 🔹 Main wrapper component
export default function YoutubeResultList({ videos = null }) {
  // Use passed videos or fallback to sample
  const videoData = videos || sampleYoutubeVideos;

  const handlePlayPress = (video) => {
    const url = `https://www.youtube.com/watch?v=${video.id}`;
    Linking.openURL(url).catch((err) =>
      console.error('Failed to open YouTube video:', err)
    );
  };

  const handleYouTubeLogoPress = (video) => {
    const url = `https://www.youtube.com/watch?v=${video.id}`;
    Linking.openURL(url).catch((err) =>
      console.error('Failed to open YouTube logo link:', err)
    );
  };

  return (
    <View style={{ paddingVertical: 10 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {videoData.map((video) => (
          <View key={video.id} style={{ marginHorizontal: 8 }}>
            <YouTubeVideoCard
              thumbnailUrl={video.thumbnailUrl}
              videoTitle={video.videoTitle}
              artistName={video.artistName}
              onPlayPress={() => handlePlayPress(video)}
              onYouTubeLogoPress={() => handleYouTubeLogoPress(video)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// 🔹 Single video card component
function YouTubeVideoCard({
  thumbnailUrl,
  videoTitle,
  artistName,
  onPlayPress,
  onYouTubeLogoPress,
}) {
  const cardWidth = screenWidth * 0.65;
  const cardHeight = cardWidth / 1.65;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPlayPress}
      style={[styles.card, { width: cardWidth, height: cardHeight }]}
    >
      <Image
        source={{ uri: thumbnailUrl }}
        style={styles.thumbnail}
        resizeMode="cover"
      />

      <View style={styles.overlay}>
        <View style={styles.topInfoContainer}>


          <View style={styles.smallWhiteLine} />

          <View style={styles.textsContainer}>
            <Text numberOfLines={1} style={styles.videoTitle}>
              {videoTitle}
            </Text>
            <Text numberOfLines={1} style={styles.artistName}>
              {artistName}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onYouTubeLogoPress}
          style={styles.youtubeLogoContainer}
        >

          <Text style={styles.youtubeText1}>Watch on</Text>
          <View style={styles.youtubePlayIcon}>
            <Entypo
              name="controller-play"
              size={14}
              color="white"
              style={{ marginLeft: 2 }}
            />
          </View>
          <Text style={styles.youtubeText2}>YouTube</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={onPlayPress}
        activeOpacity={0.8}
        style={styles.playButtonContainer}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <View style={styles.playButton}>
          <Entypo
            name="controller-play"
            size={28}
            color="white"
            style={{ marginLeft: 2 }}
          />
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  thumbnail: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  topInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallWhiteLine: {
    width: 3,
    height: 20,
    backgroundColor: 'white',
    borderRadius: 2,
    marginRight: 8,
  },
  textsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  videoTitle: {
    color: 'white',
    fontWeight: '700',
    fontSize: 15,
  },
  artistName: {
    color: 'white',
    fontSize: 11,
    marginTop: 2,
  },
  youtubeLogoContainer: {
    position: 'absolute',
    bottom: 10,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  youtubePlayIcon: {
    backgroundColor: '#FF0000',
    width: 30,
    height: 20,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  youtubeText1: {
    color: 'white',
    fontWeight: '100',
    fontSize: 12,
    marginRight:2
  },
  youtubeText2: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  playButtonContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -32,
    marginTop: -20,
  },
  playButton: {
    width: 64,
    height: 45,
    borderRadius: 9,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    // elevation: 5,
    // shadowColor: '#FF0000',
    // // shadowOpacity: 0.7,
    // shadowRadius: 6,
    // shadowOffset: { width: 0, height: 3 },
  },
});
