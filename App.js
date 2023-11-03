import { StatusBar } from 'expo-status-bar';
import {Alert, Button, Platform, StyleSheet, Text, View} from 'react-native';
import * as Notifications from 'expo-notifications';
import {useEffect} from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowAlert: true
    };
  }
});
export default function App() {
  useEffect(() => {
    async function configurePushNotification(){
      const {status} = await Notifications.getPermissionsAsync();
      let finalStatus = status;
      if(finalStatus !== 'granted') {
        const {status} = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if(finalStatus !== 'granted') {
        Alert.alert('Permission required',
            'Push notification need the appropriate permissions.');
        return;
      }

      const pushToken = await Notifications.getExpoPushTokenAsync();
      console.log(pushToken);

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
    }
    configurePushNotification();
  },[])
  useEffect(() => {
    const subscription1 = Notifications.addNotificationReceivedListener((notification) => {
      console.log('notification received');
      console.log(notification);
      const userName = notification.request.content.data.username;
      console.log(userName)
    });
    const subscription2 = Notifications.addNotificationResponseReceivedListener((response)=>{
      console.log('notification response');
      console.log(response);
      const userName = response.notification.request.content.data.username;
      console.log(userName)
    })
    return () => {
      subscription1.remove();
      subscription2.remove();
    };

  },[]);
  function scheduleNotificationHandler(){
    Notifications.scheduleNotificationAsync({
      content: {
        title: 'My first local notification',
        body: 'this is the body of the notification',
        data: { username: 'Mouna'}
      },
      trigger: {
        seconds: 5
      }
    });
  }

  function sendPushNotificationHandler(){
      fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: "ExponentPushToken[xxxxxx]",
          title:"Test - sent from a device!",
          body: "this is a test!"
        })
      });
  }
  return (
    <View style={styles.container}>
      <Text>Hello World!!!!</Text>
      <Button title='Schedule Notification' onPress={scheduleNotificationHandler}/>
      <Button title='Send Push Notification' onPress={sendPushNotificationHandler}/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
