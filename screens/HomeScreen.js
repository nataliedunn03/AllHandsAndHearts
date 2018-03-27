'use strict';
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  Animated,
  LayoutAnimation
} from 'react-native';
import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';
//import BroadcastsContainer from '../containers/BroadcastsContainer';

import Broadcasts from '../components/Home/Broadcasts';
import Activities from '../components/Home/Activities';
import Colors from '../constants/Colors';
export default class HomeScreen extends React.Component {
  state = {
    scrollY: 0
  };
  _handleRefresh = async () => {
    try {
      await this.props.getBroadcastCards();
      //LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    } catch (e) {
      console.log(e);
    }
  };
  render() {
    console.log(this.props);
    return (
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: Colors.defaultColor.PAGE_BACKGROUND
        }}
        ref={ref => {
          this.homeScreenComponentRef = ref;
        }}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={this._handleRefresh} />
        }
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([
          { nativeEvent: { contentOffset: { y: this.state.scrollY } } }
        ])}
      >
        {this.props.broadcast && (
          <Broadcasts
            broadcast={this.props.broadcast}
            removeBroadcastCard={this.props.removeBroadcastCard}
          />
        )}
        {this.props.activity && <Activities activity={this.props.activity} />}
      </ScrollView>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Alright FFG!!! We'll come back to 'Home' at some point! Go here to
          master expo. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/development-mode'
    );
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center'
  },
  contentContainer: {
    paddingTop: 15
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50
  },
  homeScreenFilename: {
    marginVertical: 7
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)'
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center'
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 20
      }
    }),
    alignItems: 'center',
    backgroundColor: 'red',
    paddingVertical: 20
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center'
  },
  navigationFilename: {
    marginTop: 5
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center'
  },
  helpLink: {
    paddingVertical: 15
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7'
  }
});
