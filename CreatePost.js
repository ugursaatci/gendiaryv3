import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

class CreatePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedImage: null,
      descriptionHeight: 40,
      base64Image: '', // Base64 görüntüyü saklamak için state
      deneme: 'www.bombabomba.com',
    };
  }

  pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Galeri erişim izni reddedildi!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true, // Base64 olarak alınması için base64: true
      
    });

    if (!result.cancelled) {
      const base64Image = result.base64; // Alınan resmin base64 verisi
      this.setState({ selectedImage: result.uri, base64Image }); // Resmi ve base64'ü state'e kaydet
      console.log('Selected Image URL:', result.uri);
      //console.log('Base64 Image:', base64Image);
    }
  };

  handleDescriptionChange = (event) => {
    const { height } = event.nativeEvent.contentSize;
    const newHeight = Math.min(Math.max(40, height), 120);
    this.setState({ descriptionHeight: newHeight });
  };

  handleSubmit = async () => {
    const { selectedImage, base64Image } = this.state;

    const userToken = await AsyncStorage.getItem('userToken');
    const post = { deneme: this.state.deneme, userToken };

    if (selectedImage && userToken) {
      try {
        const response = await fetch('http://192.168.169.6:8089/post', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(post),
        });

        if (response.ok) {
          console.log('Veri gönderildi!');
          // İşlemlerinizi burada devam ettirebilirsiniz
        } else {
          console.error('Veri gönderme hatası:', response.status);
        }
      } catch (error) {
        console.error('Veri gönderme hatası:', error);
      }
    } else {
      console.warn('Lütfen bir resim seçin ve giriş yapın!');
    }
  };

  render() {
    const { selectedImage, descriptionHeight } = this.state;
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0' }}>
        <TouchableOpacity style={styles.photoContainer} onPress={this.pickImage}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={{ width: 330, height: 330, borderRadius: 8 }} />
          ) : (
            <Text>Select a Photo</Text>
          )}
        </TouchableOpacity>

        <View style={styles.themeContainer}>
          <Text>Today's theme: </Text>
        </View>

        <View style={[styles.descriptionContainer, { height: descriptionHeight }]}>
          <TextInput
            placeholder="Description"
            multiline
            onContentSizeChange={this.handleDescriptionChange}
            style={{ flex: 1 }}
          />
        </View>

        <View style={styles.submitContainer}>
          <TouchableOpacity onPress={this.handleSubmit}>
            <Text style={{ textAlign: 'center' }}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default CreatePost;

const styles = StyleSheet.create({
  photoContainer: {
    marginTop: 25,
    borderWidth: 1,
    borderColor: 'black',
    width: 330,
    height: 330,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    position: 'relative',
  },
  themeContainer: {
    marginTop: 10,
  },
  descriptionContainer: {
    marginTop: 30,
    borderWidth: 1,
    width: 330,
    borderRadius: 8,
  },
  submitContainer: {
    marginTop: 50,
    borderWidth: 1,
    borderRadius: 8,
    width: 100,
  },
});
