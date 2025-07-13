// components/GenerateMessageUI.jsx
import { Text, View } from 'react-native';
import AlarmComponent from './actions/ComponentAlarm';
import DateComponent from './actions/ComponentDate';
import ComponentSystemMessage from './actions/ComponentSystemMessage';
import ComponentUserMessage from './actions/ComponentUserMessage';
import ComponentWebSearch from './actions/ComponentWebSearch';
import YoutubeSearchComponent from './actions/ComponentYoutube';

export default function GenerateMessageUI({ userQuery, actionType, actionData }) {
  console.log('GenerateMessageUI :', { userQuery, actionType, actionData });

  switch (actionType) {
    case 'alarm_setup_action':
      return (
        <View>
          <ComponentSystemMessage/>
          <AlarmComponent/>
        </View>
      );

    case 'date_view_action':
      return (
        <View>
          <ComponentSystemMessage/>
          <DateComponent/>
        </View>
      );

    case 'youtube_search_action':
      return (
        <View>
          <ComponentSystemMessage/>
          <YoutubeSearchComponent/>
        </View>
      );

    case 'web_search_action':
      return (
        <View>
          <ComponentSystemMessage/>
          <ComponentWebSearch/>
        </View>
      );
    
    case 'user_query_action':
      // Passing userQuery as prop here:
      return <ComponentUserMessage sampleMessage={userQuery} />;

    case 'system_response_action':
      return <ComponentSystemMessage/>

    default:
      return <Text style={{ padding: 10, color: 'red' }}>Unknown action: {actionType}</Text>;
  }
}

