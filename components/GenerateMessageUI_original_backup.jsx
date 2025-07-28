// components/GenerateMessageUI.jsx
import { Text, View } from 'react-native';
import ComponentAlarm from './actions/ComponentAlarm';
import DateComponent from './actions/ComponentDate';
import ComponentSingleContact from './actions/ComponentSingleContact';
import ComponentSystemMessage from './actions/ComponentSystemMessage';
import ComponentTime from './actions/ComponentTime';
import ComponentUserMessage from './actions/ComponentUserMessage';
import ComponentWebSearch from './actions/ComponentWebSearch';
import YoutubeSearchComponent from './actions/ComponentYoutube';

export default function GenerateMessageUI({ userQuery, actionType, actionData }) {
  console.log('GenerateMessageUII :', { userQuery, actionType, actionData });

  switch (actionType) {
    case 'no_contact_record_case':
      // Passing userQuery as prop here:
      return ( 
        <View>
          <ComponentSystemMessage sampleMessage={actionData.text || "Something went wrong."}/>
          <ComponentSingleContact actionData={actionData} actionType={actionType}/>
        </View>
      );

    case 'multiple_contact_record_case':
      // Passing userQuery as prop here:
      return <ComponentSystemMessage sampleMessage={actionData.text || "Something went wrong."}/>;
    
    case 'single_contact_record_case':
      // Passing userQuery as prop here:
      return <ComponentSingleContact actionData={actionData} actionType={actionType}/>;
    
    case 'make_call_name':
      // Passing userQuery as prop here:
      return <ComponentSystemMessage sampleMessage={actionData.text || "Something went wrong."}/>;

    case 'make_call_number':
      // Passing userQuery as prop here:
      return ( 
        <View>
          <ComponentSystemMessage sampleMessage={actionData.text || "Something went wrong."}/>
          <ComponentSingleContact actionData={actionData} actionType={actionType}/>
        </View>
      );

    case 'alarm_setup_action':
      return (
        <View>
          {/* customMessage to send t0 <ComponentSystemMessage/ > */}
          <ComponentSystemMessage sampleMessage={actionData.system_response || "Something went wrong."}/>

          {(actionData.status_message === 'known_alarm_command' && 
            (actionData.mode === 'offset' || actionData.mode === 'absolute')) && (
              <ComponentAlarm sampleMessage={actionData} />
          )}
        </View>
      );

    case 'time_ask_action':
      return (
        <View>
          <ComponentSystemMessage/>
          <ComponentTime/>
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
          <YoutubeSearchComponent />
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
      //console.log(actionData.message);
      return <ComponentSystemMessage sampleMessage={actionData.system_response || "Sorry, I don't understand."}/>;

    default:
      return <Text style={{ padding: 10, color: 'red' }}>Unknown action: {actionType}</Text>;
  }
}
