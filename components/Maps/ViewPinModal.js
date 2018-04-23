import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import Colors from '../../constants/Colors';
import { StyledText } from '../../components/StyledText';

const Separator = () => {
  return (
    <View
      style={{
        borderBottomColor: '#c2c2c2',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginTop: 10
      }}
    />
  );
};

export default class ViewPinModal extends React.Component {
  render() {
    const { data } = this.props;
    const coordsString = `${parseFloat(data.latitude).toFixed(6)}, ${parseFloat(
      data.longitude
    ).toFixed(6)}`;

    //TODO: Wire up delete/edit rights after associating Userid
    /*
     <StyledText style={styles.styledText}>
     {`Address: Test address`}
     </StyledText>
     */
    return (
      <ScrollView
        style={{
          backgroundColor: Colors.defaultColor.PAPER_COLOR,
          flex: 1,
          top: -15
        }}
        showsVerticalScrollIndicator={false}
      >
        <StyledText style={styles.styledText}>LOCATION NAME</StyledText>
        <StyledText style={styles.styledTextValue}>{data.Name}</StyledText>
        <Separator />
        <StyledText style={styles.styledText}>ADDRESS</StyledText>
        <StyledText style={styles.styledTextValue}>
          {data.Address__c}
        </StyledText>
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
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
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
  }
});
