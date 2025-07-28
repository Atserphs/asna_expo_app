import { MaterialIcons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View } from 'react-native';

const ComponentMessageContact = ({ data }) => {
  if (!data) return null;

  const { name, number, image } = data;

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        {image ? (
          <Image source={{ uri: image }} style={styles.avatar} />
        ) : (
          <MaterialIcons name="person" size={36} color="#ccc" style={styles.icon} />
        )}
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.number}>{number}</Text>
        </View>
      </View>
    </View>
  );
};

export default ComponentMessageContact;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    gap: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 11,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 12,
  },
  icon: {
    marginRight: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  info: {
    flexShrink: 1,
  },
  name: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  number: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 2,
  },
});
