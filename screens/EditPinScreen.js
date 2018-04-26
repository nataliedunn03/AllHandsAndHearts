import React, { Fragment, PureComponent } from 'react';
import {
  TouchableWithoutFeedback,
  StyleSheet,
  Keyboard,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LabelSelect from 'react-native-label-select';
import { Location } from 'expo';
import { GOOGLE_MAPS_API_KEY } from 'react-native-dotenv';
import Colors from '../constants/Colors';
import { StyledText } from '../components/StyledText';
import StyledButton from '../components/StyledButton';
import StyledInput from '../components/StyledInput';
import Layout from '../constants/Layout';
export default class EditPinScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      address: '',
      description: '',
      sourceName: '',
      sourceLink: '',
      latitude: null,
      longitude: null,
      regionId: null,
      pinType: [
        {
          name: 'Affected Area',
          isSelected: false,
          Id: 111,
          color: 'red'
        },
        {
          name: 'Airport',
          isSelected: false,
          Id: 211,
          color: 'purple'
        },
        {
          name: 'Health Facility',
          isSelected: false,
          Id: 311,
          color: '#66eb4b'
        },
        {
          name: 'IDP Camp',
          isSelected: false,
          Id: 411,
          color: 'green'
        },
        {
          name: 'Point of Interest',
          isSelected: false,
          Id: 511,
          color: 'blue'
        },
        {
          name: 'Risk Assessment',
          isSelected: false,
          Id: 711,
          color: 'orange'
        },
        {
          name: 'Partner Locations',
          isSelected: false,
          Id: 622,
          color: 'brown'
        },
        {
          name: 'Other',
          isSelected: false,
          Id: 76661,
          color: 'grey'
        }
      ],
      showToAddLocationQ: 'Press to choose a location type',
      enableLocationTypeButton: true
    };
  }

  _generatePayload = () => {
    const { Id } = this.props;
    const selectedPinType = this.state.pinType.filter(
      item => item.isSelected === true
    )[0];
    const payload = {
      ...this.state,
      pinType: selectedPinType,
      id: Id ? Id : ''
    };
    return payload;
  };
  componentDidUpdate() {
    let selectedItems = this.state.pinType.filter(
      item => item.isSelected === true
    );
    let size = selectedItems ? selectedItems.length : 0;
    this.setState({
      showToAddLocationQ: size < 1 ? 'Press to choose a location type' : '',
      enableLocationTypeButton: size < 1 ? true : false
    });
  }

  async componentWillMount() {
    let {
      coords,
      regionId,
      PinLocationType__c,
      Name,
      Additional_Descriptors__c
    } = this.props;
    let { pinType } = this.state;
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

      if (PinLocationType__c) {
        var newPinList = pinType.map(pin => {
          return pin.name === PinLocationType__c
            ? { ...pin, isSelected: true }
            : pin;
        });
      }

      this.setState({
        name: Name ? Name : this.state.name,
        address: `${name ? name : street}, ${city ? city : ''} ${region}, ${
          postalCode ? postalCode : ''
        } ${country}`,
        latitude,
        longitude,
        regionId,
        pinType: newPinList,
        description: Additional_Descriptors__c ? Additional_Descriptors__c : ''
      });
    } catch (e) {
      console.log(e);
    }
  }

  selectConfirm = list => {
    let pinType = this.state.pinType.map((item, index) => {
      let foundItem = list.find(ele => ele.Id === item.Id);
      return foundItem ? { ...foundItem, isSelected: true } : item;
    });
    this.setState({
      pinType
    });
  };

  deleteItem = item => {
    let { pinType } = this.state;
    var newItems = pinType.map(pin => {
      return pin.Id === item.Id ? { ...pin, isSelected: false } : pin;
    });
    this.setState({
      pinType: newItems
    });
  };

  _handleOnChangeText = (key, value) => {
    this.setState({
      [key]: value
    });
  };

  _handleEditPinSubmit = () => {
    const payload = this._generatePayload();
    if (!payload || !payload.name || !payload.description || !payload.pinType) {
      alert('All * marked inputs are required');
      return;
    }
    this.props.setPinByRegion(this.state.regionId, {
      ...payload
    });
    this.props.navigation.goBack();
  };

  _hideKeyboard = () => {
    Keyboard.dismiss();
  };

  renderLocationType = () => {
    return (
      <View>
        <LabelSelect
          title="Choose a type"
          ref={element => (this.select = element)}
          style={styles.labelSelect}
          onConfirm={this.selectConfirm}
          addButtonText={this.state.showToAddLocationQ}
          customStyle={{
            addButtonText: {
              color: '#5d0e8b',
              padding: 6,
              fontSize: 14,
              lineHeight: 20,
              maxWidth: 300
            },
            addButton: {
              padding: 9
            }
          }}
          enableAddBtn={this.state.enableLocationTypeButton}
        >
          {this.state.pinType
            .filter(item => item.isSelected)
            .map((item, index) => (
              <LabelSelect.Label
                key={'label-' + index}
                data={item}
                onCancel={() => {
                  this.deleteItem(item);
                }}
                customStyle={{
                  text: {
                    color: '#5d0e8b',
                    padding: 6,
                    fontSize: 14,
                    lineHeight: 20,
                    maxWidth: 300
                  }
                }}
              >
                {item.name}
              </LabelSelect.Label>
            ))}
          {this.state.pinType
            .filter(item => !item.isSelected)
            .map((item, index) => {
              return (
                <LabelSelect.ModalItem
                  key={'modal-item-' + index}
                  data={item}
                  customStyle={{
                    innerCircle: {
                      backgroundColor: Colors.defaultColor.PRIMARY_COLOR
                    }
                  }}
                >
                  {item.name}
                </LabelSelect.ModalItem>
              );
            })}
        </LabelSelect>
      </View>
    );
  };

  renderNewPinBody = () => {
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
            marginBottom: 10,
            marginLeft: 16,
            fontWeight: '500',
            textAlign: 'left',
            backgroundColor: 'transparent'
          }}
        >
          Add Location
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
          placeholder={'Enter description and any relevant details of the area'}
          enablesReturnKeyAutomatically
          multiline
          numberOfLines={4}
          onChangeText={value => this._handleOnChangeText('description', value)}
        />

        <StyledText style={styles.styledText}>Location Type *</StyledText>

        {this.renderLocationType()}

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
          returnKeyType="next"
          enablesReturnKeyAutomatically
          placeholder="https://example.com"
          onChangeText={value => this._handleOnChangeText('sourceLink', value)}
        />

        <StyledButton
          style={styles.addPinButton}
          textStyle={styles.addButtonTextStyle}
          text={'Save location'}
          onPress={this._handleEditPinSubmit}
        />
      </KeyboardAwareScrollView>
    );
  };

  renderEditPinBody = () => {
    const { latitude, longitude, Address__c } = this.props;
    const { name, description } = this.state;
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
            marginBottom: 10,
            marginLeft: 16,
            fontWeight: '500',
            textAlign: 'left',
            backgroundColor: 'transparent'
          }}
        >
          Edit Location
        </StyledText>
        <StyledText style={styles.styledText}>Location Name *</StyledText>
        <StyledInput
          style={styles.input}
          value={name ? name : 'Enter location name'}
          returnKeyType="next"
          enablesReturnKeyAutomatically
          inputRef={element => (this.locationNameRef = element)}
          onSubmitEditing={() => this.descriptionRef.focus()}
          onChangeText={value => this._handleOnChangeText('name', value)}
        />
        <StyledText style={styles.styledText}>
          {`Address: ${Address__c}`}
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
          value={
            description
              ? description
              : 'Enter description and any relevant details of the area'
          }
          enablesReturnKeyAutomatically
          multiline
          numberOfLines={4}
          onChangeText={value => this._handleOnChangeText('description', value)}
        />

        <StyledText style={styles.styledText}>Location Type *</StyledText>
        {this.renderLocationType()}
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
          returnKeyType="next"
          enablesReturnKeyAutomatically
          placeholder="https://example.com"
          onChangeText={value => this._handleOnChangeText('sourceLink', value)}
        />

        <StyledButton
          style={styles.addPinButton}
          textStyle={styles.addButtonTextStyle}
          text={'Update location'}
          onPress={this._handleEditPinSubmit}
        />
      </KeyboardAwareScrollView>
    );
  };

  render() {
    const { hasPinData } = this.props;
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback
          pointerEvents="box-none"
          style={{
            flex: 1
          }}
          transparent
          onPress={this._hideKeyboard}
        >
          {hasPinData ? this.renderEditPinBody() : this.renderNewPinBody()}
        </TouchableWithoutFeedback>
      </View>
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
  },
  labelSelect: {
    flex: 1,
    marginTop: 5,
    marginLeft: 20,
    marginRight: 20,
    padding: 2.5,
    borderColor: '#BFBFC0',
    borderWidth: 0.3,
    borderRadius: Colors.Input.BORDER.RADIUS
  }
});
