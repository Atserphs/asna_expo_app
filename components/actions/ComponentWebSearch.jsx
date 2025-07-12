// components/actions/ComponentWebSearch.jsx
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

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Sample web search results data
const sampleWebResults = [
  {
    id: '1',
    url: 'https://school.careers360.com',
    displayUrl: 'school.careers360.com',
    title: 'AP Open Inter Results 2025 Out, Check APOSS Intermediate Result Here',
    snippet:
      'Jun 13, 2025 – The Andhra Pradesh Open School Society (APOSS) has released the AP Open Inter Results (May Session) on June 13, 2025.',
    date: 'Jun 13, 2025',
  },
  {
    id: '2',
    url: 'https://www.google.com',
    displayUrl: 'google.com',
    title: 'Google Search Engine - Home',
    snippet: "Search the world's information, including webpages, images, videos and more.",
    date: 'July 2025',
  },
  {
    id: '3',
    url: 'https://www.careers360.com',
    displayUrl: 'careers360.com',
    title: 'Careers360 - Education, Exam Updates & Career Guidance',
    snippet: 'Latest education news, exam dates, results and career counseling in India.Latest education news, exam dates, results and career counseling in India.Latest education news, exam dates, results and career counseling in India.',
    date: 'July 2025',
  },
  {
    id: '4',
    url: 'https://www.careers360.com',
    displayUrl: 'careers360.com',
    title: 'Careers360 - Education, Exam Updates & Career Guidance',
    snippet: 'Latest education news, exam dates, results and career counseling in India.Latest education news, exam dates, results and career counseling in India.Latest education news, exam dates, results and career counseling in India.',
    date: 'July 2025',
  },
];

// Utility: Get favicon from domain
const getFaviconUrl = (url) => {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return null;
  }
};

export default function ComponentWebSearch({ results = sampleWebResults }) {
  const handleCardPress = (url) => {
    Linking.openURL(url).catch((err) => {
      console.error('Failed to open URL:', err);
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12 }}>
        {results.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card} activeOpacity={0.9} onPress={() => handleCardPress(item.url)}>
            <View style={styles.topSection}>
              <Image
                source={{ uri: getFaviconUrl(item.url) || '' }}
                style={styles.favicon}
              />
              <Text style={styles.urlText} numberOfLines={1}>
                {item.displayUrl}
              </Text>
            </View>

            <Text style={styles.titleText} numberOfLines={2}>
              {item.title}
            </Text>

            <Text style={styles.snippetText} numberOfLines={5}>
              {item.snippet}
            </Text>

            <Text style={styles.dateText}>{item.date}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  card: {
    width: screenWidth * 0.7,
    height: screenHeight * 0.18,
    backgroundColor: '#fff',
    borderRadius: 14,
    marginHorizontal: 8,
    marginBottom: 10,
    padding: 12,
    justifyContent: 'space-between',

    // Soft bottom shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 4,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  favicon: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 6,
  },
  urlText: {
    flex: 1,
    fontSize: 12,
    color: '#666',
  },
  titleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
    marginBottom: 2,
  },
  snippetText: {
    fontSize: 12.5,
    color: '#555',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 11,
    color: '#aaa',
    marginTop: 2,
  },
});
