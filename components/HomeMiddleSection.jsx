// components/HomeMiddleSection.jsx
import { Feather, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeMiddleSection() {
  return (
    <View style={styles.mainContent}>
      <Text style={styles.prompt}>What can I help with?</Text>

      <View style={styles.row}>
        <ActionChip icon={<FontAwesome5 name="image" size={16} color="#333" />} label="Create image" />
        <ActionChip icon={<FontAwesome5 name="image" size={16} color="#333" />} label="Surprise me" />
      </View>

      <View style={styles.row}>
        <ActionChip icon={<FontAwesome6 name="pen-to-square" size={16} color="#333" />} label="Help me write" />
        <ActionChip icon={<Feather name="zap" size={16} color="#333" />} label="Brainstorm" />
        <ActionChip label="More" />
      </View>
    </View>
  );
}

const ActionChip = ({ icon, label }) => (
  <TouchableOpacity style={styles.chip}>
    {icon && <View style={styles.chipIcon}>{icon}</View>}
    <Text style={styles.chipText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
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
});
