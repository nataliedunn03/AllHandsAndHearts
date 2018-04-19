import React from 'react';
import {
  TouchableWithoutFeedback,
  StyleSheet,
  Keyboard,
  View
} from 'react-native';
import Colors from '../../constants/Colors';
import StyledButton from '../StyledButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StyledText } from '../../components/StyledText';
import StyledInput from '../../components/StyledInput';
import LabelSelect from 'react-native-label-select';

export default class EditPinModal extends React.Component {
  render() {
    const { data } = this.props;
    const coordsString = `Coordinates: ${parseFloat(data.latitude).toFixed(
      6
    )}, ${parseFloat(data.longitude).toFixed(6)}`;

    const testitem = {
      name: 'Affected Area',
      isSelected: false,
      Id: 111,
      color: 'red'
    };

    //TODO: Wire up delete/edit rights after associating Userid
    //TODO: Need to add address location to Pin__c
    /*
     <StyledText style={styles.styledText}>
     {`Address: Test address`}
     </StyledText>
     */

    return (
      <KeyboardAwareScrollView
        style={{ backgroundColor: Colors.defaultColor.PAPER_COLOR, flex: 1 }}
        resetScrollToCoords={{ x: 0, y: 0 }}
        showsVerticalScrollIndicator={false}
      >
        <StyledText style={styles.styledText}>Location Name</StyledText>
        <StyledInput
          editable={false}
          style={styles.input}
          placeholder={data.Name}
          returnKeyType="next"
          enablesReturnKeyAutomatically
        />
        <StyledText
          style={[
            styles.styledText,
            {
              marginBottom: 10
            }
          ]}
        >
          {coordsString}
        </StyledText>
        <StyledText style={styles.styledText}>Description</StyledText>
        <StyledInput
          editable={false}
          style={styles.inputWide}
          inputRef={element => (this.descriptionRef = element)}
          placeholder={data.Additional_Descriptors__c}
          enablesReturnKeyAutomatically
          multiline
          numberOfLines={4}
        />
        <StyledText style={styles.styledText}>Location Type</StyledText>
        <StyledText style={styles.styledText}>
          {data.PinLocationType__c}
        </StyledText>
      </KeyboardAwareScrollView>
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
