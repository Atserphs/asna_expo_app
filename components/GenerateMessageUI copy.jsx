// components/GenerateMessageUI.jsx
import { Text } from 'react-native';
import AlarmComponent from './actions/ComponentAlarm';
import DateComponent from './actions/ComponentDate';
import ComponentWebSearch from './actions/ComponentWebSearch';
import YoutubeSearchComponent from './actions/ComponentYoutube';

export default function GenerateMessageUI({ userQuery, actionType, actionData }) {
  console.log('GenerateMessageUI :', { userQuery, actionType, actionData });

  switch (actionType) {
    // case 'alarm_setup_action':
    //   return <Text style={{ padding: 10, color: 'green' }}>hello this is the text</Text>;

    case 'alarm_setup_action':
      return <AlarmComponent/>;

    case 'date_view_action':
      return <DateComponent/>;

    case 'youtube_search_action':
      return <YoutubeSearchComponent/>

    case 'web_search_action':
      return <ComponentWebSearch/>;

    default:
      return <Text style={{ padding: 10, color: 'red' }}>Unknown action: {actionType}</Text>;
  }
}

