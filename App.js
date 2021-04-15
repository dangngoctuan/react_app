import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, LogBox, AsyncStorage } from 'react-native';
import * as Facebook from 'expo-facebook';
import axios from 'axios';
LogBox.ignoreAllLogs(true)

export default function App() {

  const [isLoggedin, setLoggedinStatus] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isImageLoading, setImageLoadStatus] = useState(false);
  facebookLogIn = async () => {
    try {
      await Facebook.initializeAsync({
        appId: '343110089528497',
      });
      const {
        type,
        token,
        expirationDate,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile'],
      });
      if (type === 'success') {
        fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture.height(500)`)
          .then(response => response.json())
          .then(data => {
            AsyncStorage.setItem('ACCESS_TOKEN', token)
            axios.post('https://fc948931aba9.ngrok.io/api/v1/login', {
              data: data,
              access_token: token,
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
              },
              responseType: 'json'
            })
            .then(response => {
              setUserData(data);
              setLoggedinStatus(true);
            })
            .catch(error => {
              console.log(error);
            });
          })
          .catch(e => console.log(e))
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }

  logout = () => {
    AsyncStorage.getItem('ACCESS_TOKEN').then(value =>
      axios.delete(`https://fc948931aba9.ngrok.io/api/v1/logout?access_token=${value}`)
      .then(response => {
        setLoggedinStatus(false);
        setUserData(null);
        setImageLoadStatus(false);
      })
      .catch(error => {
        console.log(error);
      })
    );
  }

  return (
    isLoggedin ?
      userData ?
        <View style={styles.container}>
          <Image
            style={{ width: 200, height: 200, borderRadius: 50 }}
            source={{ uri: userData.picture.data.url }}
            onLoadEnd={() => setImageLoadStatus(true)} />
          <ActivityIndicator size="large" color="#0000ff" animating={!isImageLoading} style={{ position: "absolute" }} />
          <Text style={{ fontSize: 22, marginVertical: 10 }}>Hi {userData.name}!</Text>
          <TouchableOpacity style={styles.logoutBtn} onPress={this.logout}>
            <Text style={{ color: "#fff" }}>Logout</Text>
          </TouchableOpacity>
        </View> :
        null
      :
      <View style={styles.container}>
        <Image
          style={{ width: 200, height: 200, borderRadius: 50, marginVertical: 20 }}
          source={require("./assets/icon.png")} />
        <TouchableOpacity style={styles.loginBtn} onPress={this.facebookLogIn}>
          <Text style={{ color: "#fff" }}>Login with Facebook</Text>
        </TouchableOpacity>
      </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9ebee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtn: {
    backgroundColor: '#4267b2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20
  },
  logoutBtn: {
    backgroundColor: '#ffa31a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    position: "absolute",
    bottom: 20
  },
});
