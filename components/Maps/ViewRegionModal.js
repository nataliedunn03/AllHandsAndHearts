import React from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight,
  Animated,
  Text,
  ActivityIndicator,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo';
import { StyledText } from '../../components/StyledText';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';
import { ScrollCard } from '../Card';
import GoogleStaticMap from 'react-native-google-static-map';
import FadeIn from 'react-native-fade-in-image';
import { runAfterInteractions } from '../../utils/utils';

export default class ViewRegionModal extends React.PureComponent {
  _renderRegionCards = () => {
    const { regionData, regionModalIsFull } = this.props;

    //filter out disaster sites that have been archived
    for (var i = regionData.length - 1; i--; ) {
      if (regionData[i].IsArchived__c == true) regionData.splice(i, 1);
    }

    return regionData.map((region, index) => {
      const card = {
        id: region.Id,
        isArchived: region.IsArchived__c,
        name: region.Name,
        latitude: region.Coordinates__Latitude__s,
        longitude: region.Coordinates__Longitude__s,
        type: region.DisasterType__c,
        customName: region.DisasterLocation__c,
        startDate: region.DisasterStart__c,
        endDate: region.DisasterEnd__c
      };

      return (
        <TouchableHighlight
          key={index}
          underlayColor="transparent"
          onPress={() => {
            this.props.onRegionCardPress(card);
          }}
          style={{
            flex: 1,
            flexDirection: 'column',
            height: 190,
            overflow: 'hidden',
            margin: 8,
            marginTop: 0,
            padding: 0,
            borderRadius: 8,
            justifyContent: 'space-between'
          }}
        >
          <Animated.View>
            <Animated.View
              style={[
                styles.mapContent,
                Platform.select({
                  ios: {
                    width: Layout.width - 70,
                    transform: [{ scale: 1 }]
                  },
                  android: {
                    width: regionModalIsFull
                      ? Layout.width - 30
                      : Layout.width - 70
                  }
                })
              ]}
            >
              <FadeIn>
                <GoogleStaticMap
                  latitude={
                    !isNaN(card.latitude)
                      ? card.latitude.toString()
                      : card.latitude
                  }
                  longitude={
                    !isNaN(card.longitude)
                      ? card.longitude.toString()
                      : card.longitude
                  }
                  zoom={14}
                  size={{
                    width: Layout.width - 33,
                    height: 210
                  }}
                  apiKey={''}
                  hasCenterMarker={false}
                />
              </FadeIn>
              <LinearGradient
                colors={[
                  Colors.defaultColor.PRIMARY_COLOR,
                  `rgba(133, 19, 198,0.9)`
                ]}
                style={[
                  styles.linearGradient,
                  Platform.select({
                    ios: {
                      width: Layout.width - 70,
                      transform: [{ scaleX: Layout.width }]
                    },
                    android: {
                      width: regionModalIsFull
                        ? Layout.width - 30
                        : Layout.width - 70
                    }
                  })
                ]}
              />
            </Animated.View>
            <View
              style={[
                styles.textView,
                Platform.select({
                  ios: {
                    width: Layout.width - 70,
                    transform: [{ scale: 1 }]
                  },
                  android: {
                    width: regionModalIsFull
                      ? Layout.width - 70
                      : Layout.width - 30
                  }
                })
              ]}
            >
              <View>
                <StyledText
                  style={{
                    color: 'rgba(255, 255, 255, 70)',
                    fontSize: 15,
                    letterSpacing: -0.24,
                    fontWeight: 'bold'
                  }}
                >
                  {card.type ? card.type.toUpperCase() : card.type}
                </StyledText>
                <Text
                  style={{
                    fontSize: 28,
                    letterSpacing: 0.34,
                    fontWeight: 'bold',
                    color: 'hsl(0, 0%, 97%)'
                  }}
                >
                  {card.name}
                </Text>
              </View>
              <View style={{ justifyContent: 'flex-end' }}>
                <Text style={styles.textShadow}>{card.customName}</Text>
                <Text style={styles.textShadow} />
              </View>
            </View>
          </Animated.View>
        </TouchableHighlight>
      );
    });
  };

  render() {
    const { regionData } = this.props;
    return (
      <View style={styles.modalContent}>
        {!regionData.length > 0 && (
          <ActivityIndicator
            animating={true}
            size="small"
            color={Colors.defaultColor.PRIMARY_COLOR}
          />
        )}
        {regionData.length > 0 && (
          <ScrollCard
            scrollCardRef={element => (this.scrollCardRef = element)}
            horizontal={this.props.regionModalIsFull ? false : true}
            vertical={this.props.regionModalIsFull ? true : false}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            snapToAlignment={'center'}
            decelerationRate={0.99}
            snapToInterval={Layout.width - 33}
            cardStyle={{
              overflow: 'hidden'
            }}
          >
            {this._renderRegionCards()}
          </ScrollCard>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  textView: {
    top: 0,
    left: 0,
    height: 190,
    position: 'absolute',
    padding: 20,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  linearGradient: {
    position: 'absolute',
    opacity: 0.8,
    left: 0,
    right: 0,
    top: 0,
    height: 190
  },
  mapContent: {
    height: 190
  },
  textShadow: {
    color: '#ffffff',
    fontSize: 16,
    letterSpacing: -0.32,
    lineHeight: 21,
    fontWeight: 'bold',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowColor: 'rgba(0, 0, 0, 20)',
    shadowOffset: { width: 0, height: 1 }
  }
});
