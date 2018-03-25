import React from "react";
import {
  StyleSheet,
  TouchableHighlight,
  LayoutAnimation,
  Animated
} from "react-native";
import { View, Text } from "react-native-animatable";
import { Ionicons as Icon } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
const styles = StyleSheet.create({
  container: {
    height: "100%",
    padding: 20,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderColor: "#EDEDED",
    borderRadius: 3,
    shadowOpacity: 0.8,
    shadowRadius: 5,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 1, height: 1 }
  },
  mainBody: {
    flex: 1
  },
  body: {
    fontSize: 16,
    color: "#383539"
  },
  subText: {
    color: "#9B9B9B",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5
  },
  remove: {
    position: "absolute",
    right: 10,
    top: 10,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99
  }
});

// destructre in JS
// look this up on google
const RemoveComponent = ({ cardKey, onClosePress }) => (
  <View style={styles.remove}>
    <TouchableHighlight
      onPress={() => onClosePress(cardKey)}
      hitSlop={{ top: 16, left: 16, bottom: 16, right: 16 }}
      underlayColor="transparent"
    >
      <View style={{ flex: 1 }}>
        <Icon name="ios-close-circle-outline" size={20} color="#9B9B9B" />
      </View>
    </TouchableHighlight>
  </View>
);

class BroadcastCard extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidUpdate() {
    //LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }

  render() {
    const { style, title, body, cardKey, onClosePress, onPress } = this.props;
    return (
      <View style={[style]}>
        <TouchableHighlight
          underlayColor={"transparent"}
          onPress={onPress ? onPress : () => console.log("Card is clicked")}
        >
          <View style={styles.container}>
            {/* You want to pass the on press button down to your remove component right? SO you press the function down with props*/}
            {onClosePress ? (
              <RemoveComponent cardKey={cardKey} onClosePress={onClosePress} />
            ) : null}
            <View style={styles.mainBody}>
              <Text style={styles.subText}>{title.toUpperCase()}</Text>
              <Text style={styles.body}>{body}</Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

export default BroadcastCard;
