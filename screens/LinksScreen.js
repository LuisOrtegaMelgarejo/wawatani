import React from 'react';
import { ExpoLinksView } from '@expo/samples';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View, FlatList,ActivityIndicator,Picker,Button,Alert
} from 'react-native';
import PushNotification from 'react-native-push-notification';

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props){
    super(props);
    this.state = {isLoading: true,items: []}
  }

  onPressLearnMore(mascota,tipo){
    if(mascota==0 || tipo==0){
      return;
    }
    data = JSON.stringify({
      mascota_id: mascota,
      type: tipo
    });

    return fetch('http://40.87.47.203:8080/rimac/api/mascotas/visita', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body:data
    })
    .then((response)=>{
      Alert.alert(
        '',
        'Visita agendada con exito',
        [
          {text: 'OK', onPress: () => this.componentDidMount()},
        ],
        {cancelable: false},
      );
    })
    .catch((error) =>{
      console.error(error);
    });
  }

  componentDidMount(){

    return fetch('http://40.87.47.203:8080/rimac/api/mascotas')
      .then((response) => response.json())
      .then((responseJson) => {

        var array = {}
        for(let pet of responseJson) {
          array[pet.id]=pet.name+' de '+pet.dueno.name+' ('+pet.type+')'
        }
        this.setState({
          isLoading: false,
          items: array,
          mascota: 0,
          tipo: 0
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });
  }

  render() {
 
    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

    let serviceItems = Object.keys(this.state.items).map( (s, i) => {
      return <Picker.Item key={s} value={s} label={this.state.items[s]} />
    });

    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.title}>Agregar Visita</Text>
          </View>
         <View style={styles.welcomeContainer}>
            <Text style={styles.othertext}>Seleccionar mascota: </Text>
            <Picker
              selectedValue={this.state.mascota}
              style={{height: 50, width: 300}}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({mascota: itemValue})
              }>
              <Picker.Item label="Seleccione" value="0" />
              {serviceItems}
            </Picker>
         </View>
         <View style={styles.welcomeContainer}>
          <Text style={styles.othertext}>Razon de la visita: </Text>
            <Picker
                selectedValue={this.state.tipo}
                style={{height: 50, width: 300}}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({tipo: itemValue})
                }>
                <Picker.Item label="Seleccione" value="0" />
                <Picker.Item label="Baño" value="Baño" />
                <Picker.Item label="Vacuna" value="Vacuna" />
            </Picker>
         </View>
         <View style={styles.welcomeContainer}>
           <Button
              onPress={() => this.onPressLearnMore(this.state.mascota,this.state.tipo)}
              title="Agendar visita"
              color="#841584"
              disabled={this.state.tipo==0 || this.state.mascota==0}
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
  },title:{
    fontSize: 18,
    color: '#2e78b7',

  },othertext:{
    fontSize: 14,
  }
});
