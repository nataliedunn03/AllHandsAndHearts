import React, { Fragment } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import Colors from '../../constants/Colors';
import { StyledText } from '../../components/StyledText';
import StyledButton from '../StyledButton';

const Separator = ({ style }) => {
  return (
    <View
      style={[
        {
          borderBottomColor: '#f5f7fa',
          borderBottomWidth: 2,
          marginTop: 10
        },
        style
      ]}
    />
  );
};

export default class ViewPinModal extends React.Component {
  render() {
    const { data, currentUserId, onDelete, onEdit } = this.props;

    if (!data) return null;

    const coordsString = `${parseFloat(data.latitude).toFixed(6)}, ${parseFloat(
      data.longitude
    ).toFixed(6)}`;

    const isOwner = data.UserId__c === currentUserId;
    const showButton = (
      <Fragment>
        <Separator />
        <StyledButton
          style={[styles.editPinButton, { marginTop: 40 }]}
          textStyle={styles.buttonTextStyle}
          text={'Edit Location'}
          onPress={() => onEdit()}
        />
        <StyledButton
          style={styles.deletePinButton}
          textStyle={styles.buttonTextStyle}
          text={'Delete Location'}
          onPress={() => {
            onDelete(data.Id);
          }}
        />
      </Fragment>
    );

    return (
      <ScrollView
        style={{
          backgroundColor: Colors.defaultColor.PAPER_COLOR,
          flex: 1,
          top: -15
        }}
        showsVerticalScrollIndicator={false}
      >
        <StyledText style={styles.styledText}>NAME</StyledText>
        <StyledText style={styles.styledTextValue}>{data.Name}</StyledText>
        <Separator />
        {data &&
          data.Address__c && (
            <Fragment>
              <StyledText style={styles.styledText}>ADDRESS</StyledText>
              <StyledText style={styles.styledTextValue}>
                {data.Address__c}
              </StyledText>
              <Separator />
            </Fragment>
          )}
        <StyledText style={styles.styledText}>COORDINATES</StyledText>
        <StyledText style={styles.styledTextValue}>{coordsString}</StyledText>
        <Separator />
        <StyledText style={styles.styledText}>DESCRIPTION</StyledText>
        <StyledText style={styles.styledTextValue}>
          {data.Additional_Descriptors__c}
        </StyledText>
        <Separator />
        <StyledText style={styles.styledText}>TYPE</StyledText>
        <StyledText style={styles.styledTextValue}>
          {data.PinLocationType__c}
        </StyledText>
        {isOwner ? showButton : ''}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  styledText: {
    color: '#1D2C3C',
    margin: 20,
    marginTop: 10,
    marginBottom: 2,
    fontSize: 14
  },
  styledTextValue: {
    color: '#1D2C3C',
    margin: 20,
    marginTop: 10,
    marginBottom: 0,
    fontSize: 14
  },
  buttonTextStyle: {
    color: Colors.defaultColor.PAPER_COLOR
  },
  editPinButton: {
    top: 10,
    height: 42,
    backgroundColor: Colors.defaultColor.PRIMARY_COLOR
  },
  deletePinButton: {
    height: 42,
    backgroundColor: Colors.defaultColor.WARNING_COLOR
  }
});
