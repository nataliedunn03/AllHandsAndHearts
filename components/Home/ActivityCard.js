import React from 'react';
import { StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native';
import { View, Text } from 'react-native-animatable';
import Colors from '../../constants/Colors';
import { Feather as Icon, Entypo } from '@expo/vector-icons';

const styles = StyleSheet.create({
  card: {
    minHeight: 130,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 8,
    marginBottom: 8,
    flexDirection: 'column',
    position: 'relative',
    backgroundColor: Colors.defaultColor.PAPER_COLOR,
    borderColor: '#EDEDED',
    borderRadius: 10,
    shadowOpacity: 0.8,
    shadowRadius: 5,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 1, height: 1 }
  },
  userLogo: {
    marginTop: 12,
    marginLeft: 12,
    height: 32,
    width: 32,
    borderRadius: 32 / 2,
    backgroundColor: Colors.defaultColor.PRIMARY_COLOR,
    alignItems: 'center'
  },
  icon: {
    backgroundColor: 'transparent',
    alignSelf: 'center',
    marginTop: 6
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
    margin: 10,
    marginBottom: 10,
    marginLeft: 12
  },
  mainBody: {
    flexDirection: 'column',
    height: '100%',
    top: -15
  },
  body: {
    overflow: 'hidden',
    fontSize: 14
  },
  name: {
    backgroundColor: 'transparent',
    color: '#000000',
    fontSize: 17,
    letterSpacing: -0.41,
    lineHeight: 22
  },
  task: {
    backgroundColor: 'transparent',
    color: '#8E8E93',
    fontSize: 13,
    letterSpacing: -0.08,
    lineHeight: 18
  },
  scoreContainer: {
    alignItems: 'center',
    height: '100%',
    top: -28
  },
  score: {
    color: Colors.defaultColor.PRIMARY_COLOR,
    fontSize: 18
  }
});

const ActivityCard = props => {
  //console.log(props);
  const { style, name, taskText, taskDetail, score, pinId, voting } = props;

  return (
    <View style={style}>
      <TouchableHighlight
        underlayColor={'transparent'}
        onPress={() => console.log('clicked')}
      >
        <View style={styles.card}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row'
            }}
          >
            <View style={styles.userLogo}>
              <Icon name="user" color="#ffffff" size={20} style={styles.icon} />
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.Informations}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.task}>{taskText}</Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              margin: 12,
              marginTop: 4,
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <View style={styles.mainBody}>
              <Text
                style={styles.body}
                numberOfLines={6}
                ellipsizeMode="tail"
                selectable
                selectionColor={Colors.defaultColor.PRIMARY_COLOR}
              >
                {taskDetail}
              </Text>
            </View>
            <View style={styles.scoreContainer}>
              <TouchableOpacity style={styles.button}>
                <Entypo
                  name="chevron-with-circle-up"
                  color={Colors.defaultColor.PRIMARY_COLOR}
                  size={20}
                  onPress={() => voting(pinId, 1)}
                />
              </TouchableOpacity>
              <Text style={styles.score}>{score}</Text>
              <TouchableOpacity style={styles.button}>
                <Entypo
                  name="chevron-with-circle-down"
                  color={Colors.defaultColor.PRIMARY_COLOR}
                  size={20}
                  onPress={() => voting(pinId, -1)}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    </View>
  );
};

export default ActivityCard;
