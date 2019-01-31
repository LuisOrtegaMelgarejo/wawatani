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
    console.log(mascota);
    
    return fetch('http://40.87.47.203:8080/rimac/mascotas/'+mascota.id)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);

        this.setState({
          isLoading: false,
          dataSource: responseJson.movies,
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

    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.getStartedText}>Detalle de </Text>
          </View>
        </ScrollView>

      </View>
    );
  }

}