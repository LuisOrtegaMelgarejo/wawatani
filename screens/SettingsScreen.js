import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View, FlatList,ActivityIndicator,Picker,Button,TextInput,Alert
} from 'react-native';
import {Constants, Permissions, ImagePicker } from 'expo';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props){
    super(props);
    this.state = {isLoading: true,items: []}
  }
  componentDidMount(){
    this.subs = [
      this.props.navigation.addListener('didFocus', () => this.isFocused()),
    ];
  }

  isFocused(){

    this.setState({
      isLoading: true,
      items: [],
    });

    fetch('http://40.87.47.203:8080/rimac/api/dueno')
      .then((response) => response.json())
      .then((responseJson) => {

        var array = {}
        for(let pet of responseJson) {
          array[pet.id]= pet.name
        }

        this.setState({
          isLoading: false,
          items: array,
          image: null,
          tipo: 0,
          dueno: 0,
          text: ''
        }, function(){
          this.textInput.clear()

        });

      })
      .catch((error) =>{
        console.error(error);
      });
  }
  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
  }

  onPressLearnMore(nombre,tipo,dueno,image){
    data = JSON.stringify({
      name: nombre,
      type: tipo,
      dueno_id: dueno
    });
    
    fetch('http://40.87.47.203:8080/rimac/api/mascotas', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body:data
    })
    .then((response)=>{
        var mascota = response       
        const data = new FormData();
        data.append('file', {
          uri: image,
          type: 'image/jpeg', // or photo.type
          name: JSON.parse(mascota['_bodyInit']).id+'.jpg'
        }); 
        fetch('http://40.87.47.203:8080/rimac/storage/save', {
          method: 'post',
          body: data
        }).then(res => {
          Alert.alert(
            '',
            'Mascota guardada con exito',
            [
              {text: 'OK', onPress: () => this.componentDidMount()},
            ],
            {cancelable: false},
          );
        }).catch((error) =>{
          console.error(error);
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

    let { image } = this.state;

    let serviceItems = Object.keys(this.state.items).map( (s, i) => {
      return <Picker.Item key={s} value={s} label={this.state.items[s]} />
    });

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
          <Text style={styles.othertext}>Tipo</Text>
          <Picker
              selectedValue={this.state.tipo}
              style={{height: 50, width: 300}}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({tipo: itemValue})
              }>
              <Picker.Item label="Seleccione" value="0" />
              <Picker.Item label="Perro" value="Perro" />
              <Picker.Item label="Gato" value="Gato" />
          </Picker>
          <Text style={styles.othertext}>Seleccionar dueño: </Text>
          <Picker
            selectedValue={this.state.dueno}
            style={{height: 50, width: 300}}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({dueno: itemValue})
            }>
            <Picker.Item label="Seleccione" value="0" />
            {serviceItems}
          </Picker>
        </View>
        <View style={styles.welcomeContainer}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button
              title="Escoge una imagen de la galeria"
              onPress={this._pickImage}
            />
            <Text style={styles.getStartedText}>o</Text>
            <Button
              title="Toma una foto"
              onPress={this._takephoto}
            />
          </View>
        </View>
        <View style={styles.welcomeContainer}>
          <Text style={styles.othertext}>Foto</Text>
          {image &&
            <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        </View>
        <View style={styles.welcomeContainer}>
           <Button
              onPress={() => this.onPressLearnMore(this.state.text,this.state.tipo,this.state.dueno,image)}
              title="Guardar mascota"
              color="#841584"
              disabled={image==null || this.state.dueno==0  || this.state.tipo==0 || this.state.text==''}
            />
         </View>
      </ScrollView>
    </View>)
  }
  
  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality : 0.2

    });

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  _takephoto = async () => {
    const per =  await Promise.all([
      Permissions.askAsync(Permissions.CAMERA),
      Permissions.askAsync(Permissions.CAMERA_ROLL),

    ]);
   
    if(per.some(({status})=> status !== 'granted')){
      return
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality : 0.2
    });


    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };
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
