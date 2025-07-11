
import { StyleSheet, Text, View } from 'react-native'
import { Link } from 'expo-router'
// const about = () => {
//   return (
//     <View style={styles.viewObject}>
//         <Text style={[styles.title, {color:'purple'}]}>This is the about page inside about folder</Text>
//         <Link href="/" style={styles.card}>Back Home</Link>
//     </View>
//   )
// }

// export default about

export default function about(){
  return (
    <View style={styles.viewObject}>
        <Text style={[styles.title, {color:'purple'}]}>This is the about page inside about folder</Text>
        <Link href="/contact" style={styles.card}>Goto Contact</Link>
        <Link href="/" style={styles.card}>Back Home</Link>
    </View>
  )
}

const styles = StyleSheet.create({
        viewObject: {
        margin: 20,
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
    }
})


