import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
// import Logo from '../assets/favicon.png'

// const RootLayout = () => {
//   return (
//       // <View style={{flex:1}}>
//       //   {/* this include index page to render in which folder you will go */}
//       //   {/* <Slot></Slot> */}
//       //   <Stack></Stack>
//       //   <Text>Footer</Text>
//       // </View>

//       <Stack>
//           <Stack.Screen name="index" options={{ title:'Home' }} />
//           <Stack.Screen name="about" options={{ title:'About'}} />
//       </Stack>
//   )
// }

const RootLayout = () => {
  return (
    <Stack>
      {/* Optional: Customize specific screens
      <Stack.Screen name="index" options={{ title: 'Homee', headerShown: true }} />
      <Stack.Screen name="about/index" options={{ title: 'About' }} /> */}
    </Stack>
  );
};


export default RootLayout

const styles = StyleSheet.create({
    viewObject: {
        borderWidth: 2,
        borderColor: 'red',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title:{
        fontWeight: 'bold',
        fontSize: 20
    },
    card:{
        backgroundColor: '#eee',
        padding: 15,
        borderRadius: 10,
        boxShadow:'4px 4px rgba(0,0,0,0.1)'
    },
    img:{
        marginVertical:15
    }
})