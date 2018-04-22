import React from 'react';
import { StyleSheet, View } from 'react-native';
import Colors from '../../constants/Colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StyledText } from '../../components/StyledText';

const Separator = () => {
  return (
    <View
      style={{
        borderBottomColor: '#c2c2c2',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginTop: 10,
        marginLeft: 20,
        marginRight: 20
      }}
    />
  );
};

export default class EditPinModal extends React.PureComponent {
  render() {
    const { data } = this.props;
    const coordsString = `${parseFloat(data.latitude).toFixed(6)}, ${parseFloat(
      data.longitude
    ).toFixed(6)}`;

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
        <StyledText style={styles.styledText}>LOCATION NAME</StyledText>
        <StyledText style={styles.styledTextValue}>{data.Name}</StyledText>
        <Separator />
        <StyledText style={styles.styledText}>COORDINATES</StyledText>
        <StyledText style={styles.styledTextValue}>{coordsString}</StyledText>
        <Separator />
        <StyledText style={styles.styledText}>DESCRIPTION</StyledText>
        <StyledText style={styles.styledTextValue}>
          {data.Additional_Descriptors__c}
        </StyledText>
        <Separator />
        <StyledText style={styles.styledText}>LOCATION TYPE</StyledText>
        <StyledText style={styles.styledTextValue}>
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
  styledTextValue: {
    color: '#551689',
    margin: 20,
    marginTop: 10,
    marginBottom: 0,
    fontWeight: '500',
    fontSize: 16
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
