export default function WebSearchComponent({ data }) {
  return (
    <View>
      <Text style={{ fontWeight: 'bold' }}>🔍 Web Search</Text>
      {data.results.map((item, index) => (
        <Text key={index}>• {item}</Text>
      ))}
    </View>
  );
}
