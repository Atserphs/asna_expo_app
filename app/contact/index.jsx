import {StyleSheet, View, Text} from 'react-native'
import {Link} from 'expo-router'

const contact = () => {
    return (

        <View style={styles.View}>
            <Text style={styles.title}>Contact Page</Text>
        </View>
    )
}

export default contact

const styles = StyleSheet.create({
    View:{
        flex: 1,
        borderWidth:1,
        justifyContent:'center',
        alignItems:'center'
    },
    title:{
        color:'red',
        fontSize: 25,
        fontWeight: 'bold'
    }
})