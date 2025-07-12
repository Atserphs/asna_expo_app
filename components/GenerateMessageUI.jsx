// components/GenerateMessageUI.jsx
import { Text } from 'react-native';

export default function GenerateMessageUI({ userQuery, actionType, actionData }) {
  console.log('GenerateMessageUI :', { userQuery, actionType, actionData });

  switch (actionType) {
    case 'alarm_setup_action':
      return <Text style={{ padding: 10, color: 'green' }}>hello this is the text</Text>;
    case 'youtube_search_action':
      return <Text style={{ padding: 10, color: 'green' }}>hello this from text input model</Text>;
    case 'web_search_action':
      return <Text style={{ padding: 10, color: 'green' }}>search</Text>;

    default:
      return <Text style={{ padding: 10, color: 'red' }}>Unknown action: {actionType}</Text>;
  }
}

