import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';


export default class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {data: [], currentComp: '', currentMatch: '', blueTeams: [], redTeams: []}
  }

  onSuccess(e) {
    let raw = e.data.split(",");
    let match = raw[2].substring(2, raw[2].length);
    let data = this.state.data;
    let comp = raw[5].substring(2, raw[5].length);
    let alliance = raw[3].substring(2, raw[3].length);
    let teamArray = this.state[`${alliance}Teams`];
    let team = raw[0].substring(3, raw[0].length);
    (match == this.state.currentMatch || this.state.currentMatch == '') ? '' : this.setState({data: [], currentComp: '', currentMatch: '', blueTeams: [], redTeams: []});
    if (!data.includes(e.data)) {
      if (!teamArray.includes(team)) {
        teamArray.push(team);
        data.push(e.data);
      } else {
        data.splice(teamArray.indexOf(team), 1, e.data)
      }
      this.setState({data: data, [alliance+"Teams"]: teamArray})
    }
    this.setState({currentComp: comp, currentMatch: match})
  }
  
  render() {
    return (
      <QRCodeScanner
        reactivate={true}
        reactivateTimeout={2500}
        onRead={this.onSuccess.bind(this)}
        topViewStyle={{display: 'none'}}
        bottomContent={
          <View style={{flex: 1, margin: 20, width: '90%'}}>
            <View style={{flex: 0.75}}>
              <View style={{flex: 0.585, flexDirection: 'row'}}>
                <View style={{flex: 0.5}}>
                  <Text style={[styles.Font, {textAlign: 'center'}]}>Blue Teams</Text>
                    {this.state.blueTeams.map(team => (
                      <Text style={[styles.Font, {marginTop: 6, textAlign: 'center'}]}>{team}</Text>
                    ))}
                </View>
                <View style={{flex: 0.5}}>
                  <Text style={[styles.Font, {textAlign: 'center'}]}>Red Teams</Text>
                    {this.state.redTeams.map(team => (
                      <Text style={[styles.Font, {marginTop: 6, textAlign: 'center'}]}>{team}</Text>
                    ))}
                </View>
              </View>
              <View style={{flex: 0.015, backgroundColor: '#d4d4d4'}}></View> 
              <View style={{flex: 0.4, marginTop: 10}}>
                <View style={{flex: 1}}><Text style={styles.Font}>Competition: {this.state.currentComp}</Text></View>
                <View style={{flex: 1}}><Text style={styles.Font}>Match: {this.state.currentMatch}</Text></View>
              </View>
            </View>
            <View style={{flex: 0.25}}>
              <TouchableOpacity onPress={this._uploadData} style={styles.UploadButton}>
                <View style={styles.Center}>
                  <Text style={[styles.Font ,{color: 'white'}]}>Upload Data</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        }
      />
    );
  }

  _uploadData = () => {
    let data = this.state.data;
    if (data.length != 0) {
      fetch('137.184.6.244/upload_data/bogus/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({data})
      }).then((response) => response.text()).then((res) => {
          alert(res);
      });
    } 
    this.setState({data: [], currentComp: '', currentMatch: '', blueTeams: [], redTeams: []});
  }
}

const styles = StyleSheet.create({
  Font: {
    fontFamily: 'Helvetica-Light',
    fontSize: 17
  },
  UploadButton: {
    flex: 1,
    backgroundColor: '#24a2b6',
    borderRadius: 10,
    borderBottomWidth: 5,
    borderColor: '#13616d'
  },
  Center: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
});