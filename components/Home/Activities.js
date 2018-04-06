import React, { Component } from 'react';
import { View } from 'react-native-animatable';
import { LayoutAnimation } from 'react-native';
import ActivityCard from './ActivityCard';
import { StyledText } from '../../components/StyledText';

export default class Activities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }
  componentDidUpdate() {
    setTimeout(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, 5);
  }
  _renderCards = cards => {
    return cards.map((card, index) => {
      return (
        <ActivityCard
          key={index}
          name={card.name}
          taskText={card.location}
          taskDetail={card.detail}
        />
      );
    });
  };

  render() {
    let { style, activity: { activityCards } } = this.props;
    return (
      activityCards &&
      activityCards.length > 0 && (
        <View
          ref={ref => {
            this.activitiesRef = ref;
          }}
          style={{
            flex: 1
          }}
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
            Activities
          </StyledText>
          {this._renderCards(activityCards)}
        </View>
      )
    );
  }
}
