import React, { Fragment, PureComponent } from 'react';
import { TouchableWithoutFeedback, StyleSheet, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Location } from 'expo';
import { GOOGLE_MAPS_API_KEY } from 'react-native-dotenv';
import Colors from '../constants/Colors';
import { StyledText } from '../components/StyledText';
import StyledButton from '../components/StyledButton';
import StyledInput from '../components/StyledInput';

export default class EditPinScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      address: '',
      description: '',
      sourceName: '',
      sourceLink: '',
      pinType: '',
      latitude: null,
      longitude: null,
      regionId: null
    };
    this.locationType = ['Other (title)', 'assitent'];
  }

  _handleOnChangeText = (key, value) => {
    this.setState({
      [key]: value
    });
  };

  _handleEditPinSubmit = () => {
    this.props.setPinByRegion(this.state.regionId, {
      ...this.state
    });
    this.props.navigation.goBack();
  };

  _hideKeyboard = () => {
    Keyboard.dismiss();
  };

  async componentWillMount() {
    let { coords, regionId } = this.props;
    let { latitude, longitude } = coords;
    try {
      Location.setApiKey(GOOGLE_MAPS_API_KEY);
      const decodedLocation = await Location.reverseGeocodeAsync(coords);
      //get the current location info
      let {
        street,
        name,
        region,
        city,
        country,
        postalCode
      } = decodedLocation[0];

      this.setState({
        address: `${name ? name : street}, ${city ? city : region}, ${
          postalCode ? postalCode : null
        } ${country}`,
        latitude,
        longitude,
        regionId
      });
    } catch (e) {
      console.log(e);
    }
  }

  renderEditPinBody = () => {
    const { latitude, longitude, selectedItems } = this.state;
    const coordsString = `Coordinates: ${parseFloat(latitude).toFixed(
      6
    )}, ${parseFloat(longitude).toFixed(6)}`;

    return (
      <KeyboardAwareScrollView
        style={{ backgroundColor: Colors.defaultColor.PAPER_COLOR, flex: 1 }}
        resetScrollToCoords={{ x: 0, y: 0 }}
        showsVerticalScrollIndicator={false}
      >
        <StyledText
          style={{
            color: '#000000',
            fontSize: 28,
            marginTop: 10,
            marginBottom: 16,
            marginLeft: 16,
            fontWeight: '500',
            textAlign: 'left',
            backgroundColor: 'transparent'
          }}
        >
          Add location
        </StyledText>
        <StyledText style={styles.styledText}>Location Name *</StyledText>
        <StyledInput
          style={styles.input}
          placeholder={'Enter location name'}
          returnKeyType="next"
          enablesReturnKeyAutomatically
          inputRef={element => (this.locationNameRef = element)}
          onSubmitEditing={() => this.descriptionRef.focus()}
          onChangeText={value => this._handleOnChangeText('name', value)}
        />
        <StyledText style={styles.styledText}>
          {`Address: ${this.state.address}`}
        </StyledText>
        <StyledText
          style={[
            styles.styledText,
            {
              marginBottom: 10
            }
          ]}
        >
          {latitude && coordsString}
        </StyledText>
        <StyledText style={styles.styledText}>Description *</StyledText>
        <StyledInput
          style={styles.inputWide}
          inputRef={element => (this.descriptionRef = element)}
          placeholder={'Enter description of the area and any relevant details'}
          enablesReturnKeyAutomatically
          multiline
          numberOfLines={4}
          onChangeText={value => this._handleOnChangeText('description', value)}
        />
        <StyledText style={styles.styledText}>Source Name</StyledText>
        <StyledInput
          style={styles.input}
          inputRef={element => (this.sourceNameRef = element)}
          onSubmitEditing={() => this.sourceLinkRef.focus()}
          placeholder={'Enter source name'}
          returnKeyType="next"
          enablesReturnKeyAutomatically
          onChangeText={value => this._handleOnChangeText('sourceName', value)}
        />
        <StyledText style={styles.styledText}>Source Link</StyledText>
        <StyledInput
          style={styles.input}
          inputRef={element => (this.sourceLinkRef = element)}
          onSubmitEditing={() => this.locationTypeRef.focus()}
          returnKeyType="next"
          enablesReturnKeyAutomatically
          placeholder="https://example.com"
          onChangeText={value => this._handleOnChangeText('sourceLink', value)}
        />

        <StyledText style={styles.styledText}>Location Type *</StyledText>

        <StyledInput
          style={styles.input}
          inputRef={element => (this.locationTypeRef = element)}
          onSubmitEditing={this._handleEditPinSubmit}
          returnKeyType="next"
          enablesReturnKeyAutomatically
          placeholder="Location Type"
          onChangeText={value => this._handleOnChangeText('pinType', value)}
        />
        <StyledButton
          style={styles.addPinButton}
          textStyle={styles.addButtonTextStyle}
          text={'Add Pin'}
          onPress={this._handleEditPinSubmit}
        />
      </KeyboardAwareScrollView>
    );
  };

  render() {
    return (
      <TouchableWithoutFeedback
        pointerEvents="box-none"
        style={{
          flex: 1,
          flexDirection: 'column'
        }}
        transparent
        onPress={this._hideKeyboard}
      >
        {this.renderEditPinBody()}
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  styledText: {
    color: '#5a5b59',
    margin: 20,
    marginTop: 10,
    marginBottom: 0
  },
  input: {
    height: 42,
    color: Colors.defaultColor.PRIMARY_COLOR,
    backgroundColor: Colors.defaultColor.PAPER_COLOR,
    borderColor: '#BFBFC0',
    borderWidth: 0.3,
    borderRadius: Colors.Input.BORDER.RADIUS,
    margin: 0,
    marginTop: 4
  },
  inputWide: {
    margin: 0,
    height: 110,
    color: Colors.defaultColor.PRIMARY_COLOR,
    backgroundColor: Colors.defaultColor.PAPER_COLOR,
    borderColor: '#BFBFC0',
    borderWidth: 0.3,
    borderRadius: Colors.Input.BORDER.RADIUS
  },
  addPinButton: {
    height: 42,
    backgroundColor: Colors.defaultColor.PRIMARY_COLOR
  },
  addButtonTextStyle: {
    color: Colors.defaultColor.PAPER_COLOR
  }
});
