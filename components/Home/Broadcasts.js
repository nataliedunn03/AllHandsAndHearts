import React, { PureComponent } from 'react';

import {
  StyleSheet,
  ScrollView,
  LayoutAnimation,
  UIManager
} from 'react-native';

import { View } from 'react-native-animatable';
import Layout from '../../constants/Layout';
import BroadcastCard from './BroadcastCard';
import { StyledText } from '../StyledText';
import { human } from 'react-native-typography';
//enable in android
if (Layout.android)
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);

export default class Broadcasts extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }
  componentDidMount() {
    //set this to the -10 which is equivalent to margin 0 as to parent
    setTimeout(() => {
      if (this.scrollViewRef) this.scrollViewRef.scrollTo({ x: -9 });
    }, 0);
  }

  _removeItem = async index => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    await this.props.removeBroadcastCard(index);
  };
  removeBroadcastCard = async index => {
    this._removeItem(index);
  };
  _renderCards = cards => {
    return cards.map((card, index) => {
      return (
        <BroadcastCard
          key={card.Id ? card.Id : index}
          cardKey={index}
          title={card.Broadcast_Type__c}
          body={card.Summary__c}
          style={{
            margin: 10,
            marginTop: 0,
            width: cards.length > 1 ? Layout.width - 80 : Layout.width - 34,
            height: 150
          }}
          onCardPress={() => console.log(`card at ${index} is pressed`)}
          onClosePress={this.removeBroadcastCard}
        />
      );
    });
  };
  render() {
    let {
      style,
      broadcast: { broadcastCards }
    } = this.props;
    if (broadcastCards && broadcastCards.length > 0) {
      return (
        <View
          ref={ref => {
            this.broadcastRef = ref;
          }}
          style={[styles.broadcastContainer]}
        >
          <StyledText style={[styles.monoText, human.title1]}>
            Alerts
          </StyledText>
          <ScrollView
            ref={scrollView => {
              this.scrollViewRef = scrollView;
            }}
            style={[styles.scrollView, style]}
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate={0}
            snapToInterval={Layout.width - 60}
            snapToAlignment={'center'}
            contentInset={{
              top: 0,
              left: 16,
              bottom: 0,
              right: 16
            }}
            alwaysBounceHorizontal
          >
            {this._renderCards(broadcastCards)}
          </ScrollView>
        </View>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  scrollView: {},
  monoText: {
    color: '#000000',
    fontSize: 28,
    marginTop: 10,
    marginBottom: 16,
    marginLeft: 16,
    fontWeight: '500',
    textAlign: 'left',
    backgroundColor: 'transparent'
  },
  broadcastContainer: {
    paddingTop: 10
  }
});
