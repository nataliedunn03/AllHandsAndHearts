import React, { Component } from 'react';
import { Location } from 'expo';
import { GOOGLEMAPS_API_KEY } from 'react-native-dotenv';
import {
  Animated,
  ScrollView,
  RefreshControl,
  TouchableHighlight,
  Modal
} from 'react-native';
import { View, Text } from 'react-native-animatable';

import Colors from '../constants/Colors';
import { StyledText } from '../components/StyledText';
import StyledButton from '../components/StyledButton';
import StyledInput from '../components/StyledInput';
import SlidingModal from '../components/Modal';

export default class EditPinScreen extends Component {
  state = {
    refresh: false,
    scrollY: 0,
    show: false,
    name: ''
  };

  componentDidMount() {
    //let { state: { params: { name } } } = this.props.navigation;
    //this._getLocationName(name);

    console.log(this.props);
  }

  _handleClose = () => {
    this.setState({
      show: false
    });
  };

  _handleRefresh = async () => {
    this.setState({ refresh: true });
    await setTimeout(() => {
      this.setState(prevState => ({
        refresh: false
      }));
      this.props.navigation.goBack(null);
    }, 500);
  };

  _getLocationName = async coord => {
    try {
      Location.setApiKey(GOOGLEMAPS_API_KEY);
      const decodedLocation = await Location.reverseGeocodeAsync(coord);
      this.setState({
        name: decodedLocation[0].name
      });
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <View
        ref={ref => {
          this.resortInfoCard = ref;
        }}
        style={{
          flex: 1
        }}
      >
        <StyledText
          style={{
            color: '#000000',
            fontSize: 28,
            marginTop: 10,
            marginLeft: 16,
            fontWeight: '500',
            marginBottom: 10,
            textAlign: 'left',
            backgroundColor: 'transparent'
          }}
        >
          Enter details
        </StyledText>
        <View style={{ flex: 1 }}>
          <StyledInput
            style={{
              height: 200,
              textAlignVertical: 'top'
            }}
            multiline={true}
            numberOfLines={8}
            placeholder={this.state.name}
          />
          <StyledButton
            text="Save"
            onPress={() => {
              //LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
              this.props.navigation.goBack(null);
            }}
            style={{
              height: 42,
              backgroundColor: Colors.defaultColor.PRIMARY_COLOR
            }}
          />
        </View>
      </View>
    );
  }
}
