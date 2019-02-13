import React from 'react';
import { View, Alert, Button } from 'react-native';
import Colors from '../constants/Colors';
import StyledButton from '../components/StyledButton';
import StyledInput from '../components/StyledInput';
import { StyledText } from '../components/StyledText';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { delayExec } from '../utils/utils';
export default class MapUtilScreen extends React.PureComponent {
  constructor(props){
    super(props);
    this.state={
    name: '',
    coordinates_Latitude: '',
    coordinates_Longitude: '',
    location: '',
    start: '',
    end: '',
    type: ''
  };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth && nextProps.auth.passwordChangeStatus) {
      if (nextProps.auth.passwordChangeStatus.length > 0)
        Alert.alert(nextProps.auth.passwordChangeStatus);
    }
  }

  _handleOnChangeText = (key, value) => {
    this.setState({
      [key]: value
    });
  };

  handlePaswordChange = async () => {
      this.props.setRegionList(this.state.name, this.state.coordinates_Latitude, this.state.coordinates_Longitude, this.state.location, this.state.start, this.state.end, this.state.type)
    };

  render() {
    return (
      <KeyboardAwareScrollView
        style={{
          backgroundColor: Colors.defaultColor.PAGE_BACKGROUND,
          flex: 1
        }}
        resetScrollToCoords={{ x: 0, y: 0 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flex: 1,
          alignItems: 'stretch',
          justifyContent: 'space-around'
        }}
      >
        <View>
          <StyledText
            style={{
              color: '#5a5b59',
              margin: 20,
              marginTop: 10,
              marginBottom: 0
            }}
          >
            CREATE A NEW DISASTER SITE
          </StyledText>
          <StyledInput
            clearTextOnFocus
            returnKeyType="done"
            style={{
              height: 42,
              color: Colors.defaultColor.PRIMARY_COLOR,
              backgroundColor: Colors.defaultColor.PAPER_COLOR,
              borderColor: '#BFBFC0',
              borderWidth: 0.3,
              borderRadius: Colors.Input.BORDER.RADIUS
            }}
            placeholder="Disaster Name"
            enablesReturnKeyAutomatically
            inputRef={element => (this.passwordRef = element)}
            onChangeText={value =>
              this._handleOnChangeText('name', value)
            }
            value={this.state.name}
          />
          <StyledInput
            clearTextOnFocus
            returnKeyType="done"
            style={{
              height: 42,
              color: Colors.defaultColor.PRIMARY_COLOR,
              backgroundColor: Colors.defaultColor.PAPER_COLOR,
              borderColor: '#BFBFC0',
              borderWidth: 0.3,
              borderRadius: Colors.Input.BORDER.RADIUS
            }}
            placeholder="Coordinates (Latitude)"
            enablesReturnKeyAutomatically
            inputRef={element => (this.passwordRef = element)}
            onChangeText={value =>
              this._handleOnChangeText('coordinates_Latitude', value)
            }
            value={this.state.coordinates_Latitude}
          />
          <StyledInput
            clearTextOnFocus
            returnKeyType="done"
            style={{
              height: 42,
              color: Colors.defaultColor.PRIMARY_COLOR,
              backgroundColor: Colors.defaultColor.PAPER_COLOR,
              borderColor: '#BFBFC0',
              borderWidth: 0.3,
              borderRadius: Colors.Input.BORDER.RADIUS
            }}
            placeholder="Coordinates (Longitude)"
            enablesReturnKeyAutomatically
            inputRef={element => (this.passwordRef = element)}
            onChangeText={value =>
              this._handleOnChangeText('coordinatesLongitude', value)
            }
            value={this.state.coordinates_Longitude}
          />
          <StyledInput
            clearTextOnFocus
            returnKeyType="done"
            style={{
              height: 42,
              color: Colors.defaultColor.PRIMARY_COLOR,
              backgroundColor: Colors.defaultColor.PAPER_COLOR,
              borderColor: '#BFBFC0',
              borderWidth: 0.3,
              borderRadius: Colors.Input.BORDER.RADIUS
            }}
            placeholder="Location"
            enablesReturnKeyAutomatically
            inputRef={element => (this.passwordRef = element)}
            onChangeText={value =>
              this._handleOnChangeText('location', value)
            }
            value={this.state.location}
          />
          <StyledInput
            clearTextOnFocus
            returnKeyType="done"
            style={{
              height: 42,
              color: Colors.defaultColor.PRIMARY_COLOR,
              backgroundColor: Colors.defaultColor.PAPER_COLOR,
              borderColor: '#BFBFC0',
              borderWidth: 0.3,
              borderRadius: Colors.Input.BORDER.RADIUS
            }}
            placeholder="Disaster Type"
            enablesReturnKeyAutomatically
            inputRef={element => (this.passwordRef = element)}
            onChangeText={value =>
              this._handleOnChangeText('type', value)
            }
            value={this.state.type}
          />
          <StyledInput
            clearTextOnFocus
            returnKeyType="done"
            style={{
              height: 42,
              color: Colors.defaultColor.PRIMARY_COLOR,
              backgroundColor: Colors.defaultColor.PAPER_COLOR,
              borderColor: '#BFBFC0',
              borderWidth: 0.3,
              borderRadius: Colors.Input.BORDER.RADIUS
            }}
            placeholder="Start Date"
            enablesReturnKeyAutomatically
            inputRef={element => (this.passwordRef = element)}
            onChangeText={value =>
              this._handleOnChangeText('start', value)
            }
            value={this.state.start}
          />
          <StyledInput
            clearTextOnFocus
            returnKeyType="done"
            style={{
              height: 42,
              color: Colors.defaultColor.PRIMARY_COLOR,
              backgroundColor: Colors.defaultColor.PAPER_COLOR,
              borderColor: '#BFBFC0',
              borderWidth: 0.3,
              borderRadius: Colors.Input.BORDER.RADIUS
            }}
            placeholder="End Date"
            enablesReturnKeyAutomatically
            inputRef={element => (this.passwordRef = element)}
            onChangeText={value =>
              this._handleOnChangeText('end', value)
            }
            value={this.state.end}
          />
          <Button
            onPress={this.handlePaswordChange}
            title="Create Disaster Site!"
            color="#841584"
            />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}
