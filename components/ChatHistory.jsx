import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function ChatHistory({ messages }) {
  // If no messages, show a placeholder text
  if (!messages || messages.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No messages yet</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={messages}
      keyExtractor={(_, index) => index.toString()} // Using index as key because messages are React elements
      inverted={true} // newest messages at bottom, auto-scroll to bottom
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <View style={styles.messageWrapper}>
          {item}
        </View>
      )}
      keyboardShouldPersistTaps="handled"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexGrow: 1,
    justifyContent: 'flex-start', // ensure messages start from bottom
    // borderColor:'yellow',
    // borderWidth:1
  },
  messageWrapper: {
    marginVertical: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: 'gray',
    fontSize: 16,
  },
});
