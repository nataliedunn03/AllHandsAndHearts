import React, { Component } from 'react';
import {
  Animated,
  ScrollView,
  RefreshControl,
  TouchableHighlight,
  LayoutAnimation
} from 'react-native';
import { View, Text } from 'react-native-animatable';
import Broadcasts from '../components/Home/Broadcasts';
import BroadcastCard from '../components/Home/BroadcastCard';
import ActivityCard from '../components/Home/ActivityCard';
import Colors from '../constants/Colors';
import { MonoText } from '../components/StyledText';

import StyledButton from '../components/StyledButton';
import StyledInput from '../components/StyledInput';
export default class MarkerViewScreen extends Component {
  state = {
    refresh: false,
    scrollY: 0
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
  render() {
    return (
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: Colors.defaultColor.PAGE_BACKGROUND
        }}
        ref={ref => {
          this.resortInfoCardScrollView = ref;
        }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refresh}
            onRefresh={this._handleRefresh}
          />
        }
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([
          { nativeEvent: { contentOffset: { y: this.state.scrollY } } }
        ])}
      >
        <View
          ref={ref => {
            this.resortInfoCard = ref;
          }}
          style={{
            flex: 1
          }}
        >
          <MonoText
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
          </MonoText>
          <View style={{ flex: 1 }}>
            <StyledInput
              style={{
                height: 200,
                textAlignVertical: 'top'
              }}
              multiline={true}
              numberOfLines={8}
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
      </ScrollView>
    );
  }
}
