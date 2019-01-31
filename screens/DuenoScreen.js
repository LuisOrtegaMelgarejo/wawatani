import React from 'react';
import { ExpoLinksView } from '@expo/samples';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View, FlatList,ActivityIndicator,Picker,Button ,TextInput,Alert
} from 'react-native';
import PushNotification from 'react-native-push-notification';

export default class DuenoScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props){
    super(props);
    this.state = {isLoading: true,text: '',direccion: ''}
  }
  componentDidMount(){
    this.textInput.clear()
    this.textInput2.clear()
  }

  onPressLearnMore(direccion,tipo){
    peru = direccion + ' , PE'
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(peru)}&key=AIzaSyDTJFBvclGDClXsdQXDDJWdNribc9kJAtY`)
    .then((response) =>{
      var respuesta = JSON.parse(response['_bodyInit'])
      if(respuesta.status=='ZERO_RESULTS'){
        Alert.alert(
          'ERROR',
          'Direccion no valida',
          {cancelable: true},
        );
      }else{
        console.log(respuesta.results[0])
        data = JSON.stringify({
          name: tipo,
          direccion: respuesta.results[0].formatted_address,
          pointx: respuesta.results[0].geometry.location.lat,
          pointy: respuesta.results[0].geometry.location.lng
        });
       fetch('http://40.87.47.203:8080/rimac/api/dueno', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body:data
        }).then(res => {
            Alert.alert(
              '',
              'Dueño guardado con exito',
              [
                {text: 'OK', onPress: () => this.componentDidMount()},
              ],
              {cancelable: false},
            );
          }).catch((error) =>{
            console.error(error);
          });

      }
    });
    
  }

  render() {

    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.title}>Agregar mascota</Text>
          </View>
          <View style={styles.welcomeContainer}>
            <Text style={styles.othertext}>Nombre</Text>
            <TextInput  ref={input => { this.textInput = input }}
              editable = {true}
              maxLength = {40}
              style={{height: 50, width: 300}}
              placeholder= 'Ingrese nombre'
              underlineColorAndroid = '#D3D3D3'
              selectionColor = '#428AF8'
              onChangeText={(text) => this.setState({text})}
            />
          </View>
          <View style={styles.welcomeContainer}>
            <Text style={styles.othertext}>Direccion</Text>
            <TextInput ref={input => { this.textInput2 = input }}
              editable = {true}
              maxLength = {40}
              style={{height: 50, width: 300}}
              placeholder= 'Ingrese nombre'
              underlineColorAndroid = '#D3D3D3'
              selectionColor = '#428AF8'
              onChangeText={(direccion) => this.setState({direccion})}
            />
          </View>
          <View style={styles.welcomeContainer}>
            <Button
                onPress={() => this.onPressLearnMore(this.state.direccion,this.state.text)}
                title="Registrar dueño"
                color="#841584"
                disabled={this.state.text=='' || this.state.direccion==''}
              />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
