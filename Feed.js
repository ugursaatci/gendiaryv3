import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Text } from 'react-native';
import PostTemplate from './PostTemplate';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Feed extends Component {
  componentDidMount() {
    this.checkUserAuthentication();
  }

  checkUserAuthentication = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');

      if (userToken) {
       

        console.log('User is authenticated:', userToken);
      } else {
       
        console.log('User is not authenticated');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  render() {
    handleClick = (e) => {
      e.preventDefault();
      const { email, password } = this.state;
      const user = { email, password };
    
      fetch("http://192.168.169.6:8089/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          if (data.token) {
            console.log('Login successful!');
            this.props.navigation.navigate("Feed")
            // Redirect to the next screen or perform other actions
          } else {
            console.log('Invalid username or password');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    };
    return (
      <View style={styles.container}>
        <View style={styles.fixedTopMenu}>
          <View style={styles.topMenu}>
            <TouchableOpacity>
              <Image style={styles.icon} source={require('./assets/friends.png')} />
            </TouchableOpacity>
            <Image source={require('./assets/gendiary.png')} style={styles.logo} />
            <TouchableOpacity onPress={()=>this.props.navigation.navigate("MyProfile")}style={styles.profile_button}>
              <Image style={styles.profile_button} source={require('./assets/images/stockprofile.png')} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Add Photo Top Menu Start*/}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <View style={styles.bigPlusContainer}>
          <TouchableOpacity onPress={()=>this.props.navigation.navigate("CreatePost")} style={[styles.smallBox, { left: '10%' }]}>
            <Text style={styles.plus}>+</Text>
          </TouchableOpacity>
          <View style={{ height: '100%', width: 1, backgroundColor: 'black', position: 'absolute', left: '50%' }}></View>
          <View style={[styles.smallBox, { left: '60%' }]}></View>
        </View>
      </View>
          {/* Add Photo Top Menu End*/}


        <PostTemplate
          username="ugursaatcii"
          description={"Bugün Müq"}
          image={require('./assets/images/post1.jpeg')}
          pimage={require('./assets/images/stockprofile.png')}
        />
        <PostTemplate
          username="ilayda.ddmrl"
          description={"İnanılmaz bir gün"}
          image={require('./assets/images/post2.jpeg')} 
          pimage={require('./assets/images/stockprofile2.jpeg')}
        />
        <PostTemplate
          username="selamin"
          image={require('./assets/images/post3.jpeg')} 
          pimage={require('./assets/images/stockprofile3.jpeg')}
          description={"Benden başka bir şey istemiyorsan yatıyorum"}
        />

        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fixedTopMenu: {
    position: 'absolute',
    width: '100%',
    zIndex: 1,
  },
  topMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    alignItems: 'center',
    backgroundColor: '#f0f0f0', 
  },
  scrollContainer: {
    paddingTop: 50, 
   
  },
  icon: {
    marginTop: 5,
  },
  logo: {
    height: 35,
  },
  profile_button: {
    backgroundColor: '#09333f',
    padding: 10,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#effaf6',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigPlusContainer: {
    marginTop: 25,
    borderWidth: 2,
    borderColor: 'black',
    width: 330,
    height: 165,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    position: 'relative',
  },
  smallBox: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    position: 'absolute',
  },
  plus:{
    fontSize:50,
    textAlign:'center',
    marginTop:10,
    fontWeight: 'bold',
  }
});

export default Feed;
