import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View, FlatList,ActivityIndicator
} from 'react-native';
import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';
import { ListItem } from 'react-native-elements'
import MapView, { Marker } from 'react-native-maps';

export default class DetailScreen extends React.Component {

  constructor(props){
    super(props);
    this.state = {isLoading: true}
  }

  static navigationOptions = {
    header: null,
  };


  componentDidMount(){
    const { navigation } = this.props;
    const mascota = navigation.getParam('mascota', 'null');
    
    return fetch('http://40.87.47.203:8080/rimac/api/mascotas/'+mascota.id)
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isMapReady: false,
          isLoading: false,
          dataSource: responseJson,
          coordinate: {
            latitude: parseFloat(responseJson.dueno.pointx),
            longitude: parseFloat(responseJson.dueno.pointy),
          }
        }, function(){

        });
        
      })
      .catch((error) =>{
        console.error(error);
      });
  }

  onMapLayout = () => {
    this.setState({ isMapReady: true });
  }

  render() {

    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.titleprincipal}>{this.state.dataSource.name}</Text>
          </View>
          <View style={styles.welcomeContainer}>
            <Text style={styles.othertext}>Tipo de mascota: {this.state.dataSource.type}</Text>
          </View>
          <View style={styles.getStartedContainer}>
            <Text style={styles.title}>Citas Registradas</Text>
          </View>
          <View style={{flex: 1, paddingTop:5}}>
            <FlatList
              data={this.state.dataSource.citas}
              renderItem={({item}) => <ListItem roundAvatar title={item.type} 
                                                subtitle={item.hora} 
                                                leftAvatar={{ source: { uri: 'http://40.87.47.203:8080/rimac/storage/files/'+item.id+'.jpg' } }}
                                                />}
            />
          </View>
          <View style={styles.welcomeContainer}>
            <Text style={styles.title}>Datos del dueño</Text>
          </View>
          <View style={styles.getStartedContainer}>
            <Text style={styles.othertext}>Nombre: {this.state.dataSource.dueno.name}</Text>
            <Text style={styles.othertext}>Direccion: {this.state.dataSource.dueno.direccion}</Text>
          </View>

          <MapView
            style = {styles.map}
            initialRegion={{
              latitude: parseFloat(this.state.dataSource.dueno.pointx),
              longitude: parseFloat(this.state.dataSource.dueno.pointy),
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onLayout={this.onMapLayout}
          >
            { this.state.isMapReady &&
             <Marker coordinate={this.state.coordinate}/>
            }
          </MapView>

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
  map: {
    height: 300,
    marginTop: 15,
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
  titleprincipal:{
    fontSize: 24,
    color: '#2e78b7',

  },
  title:{
    fontSize: 18,
    color: '#2e78b7',

  },othertext:{
    fontSize: 14,
  }
});
