import React from 'react';
import { Platform, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabNavigator, TabBarBottom, StackNavigator } from 'react-navigation';

import MarkerViewScreen from '../screens/MarkerViewScreen';
import ProfileScreenContainer from '../containers/ProfileContainer';
import HomeScreenContainer from '../containers/HomeScreenContainer';
import MapScreenContainer from '../containers/MapScreenContainers';
import Colors from '../constants/Colors';

const MainTabNavigator = TabNavigator(
  {
    Home: {
      screen: HomeScreenContainer,
      path: '/',
      navigationOptions: {
        headerTitle: 'HOME',
        tabBarLabel: 'Home'
      }
    },
    Maps: {
      screen: MapScreenContainer,
      path: '/',
      navigationOptions: {
        headerTitle: 'MAPS',
        tabBarLabel: 'Maps'
      }
    },
    Profile: {
      screen: ProfileScreenContainer,
      path: '/profile',
      navigationOptions: {
        headerTitle: 'PROFILE',
        tabBarLabel: 'Profile'
      }
    }
  },
  {
    navigationOptions: ({ navigation }) => ({
      headerTitleStyle: {
        color: Colors.defaultColor.PAPER_COLOR,
        fontWeight: '600',
        justifyContent: 'space-between',
        textAlign: 'center'
      },
      headerStyle: {
        backgroundColor: Colors.defaultColor.PRIMARY_COLOR,
        borderBottomColor: '#F2F2F2'
      },
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch (routeName) {
          case 'Home':
            iconName =
              Platform.OS === 'ios'
                ? `ios-home${focused ? '' : '-outline'}`
                : 'md-home';
            break;
          case 'Maps':
            iconName =
              Platform.OS === 'ios'
                ? `ios-map${focused ? '' : '-outline'}`
                : 'md-map';
            break;
          /* case 'Notification':
					iconName =
							Platform.OS === 'ios'
								? `ios-notifications${focused ? '' : '-outline'}`
								: 'md-notifications';
					break; */
          case 'Profile':
            iconName =
              Platform.OS === 'ios'
                ? `ios-contact${focused ? '' : '-outline'}`
                : 'md-contact';
        }
        return (
          <Ionicons
            name={iconName}
            size={28}
            style={{ marginBottom: -3 }}
            color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
        );
      }
    }),
    tabBarComponent: props => (
      <TabBarBottom {...props} style={styles.tabBarBottom} />
    ),
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: Colors.tabIconSelected
    },
    animationEnabled: true,
    configureTransition: () => ({
      timing: Animated.spring,
      tension: 1,
      friction: 35
    }),
    swipeEnabled: false
  }
);

const styles = StyleSheet.create({
  tabBarBottom: {
    backgroundColor: Colors.MainNavigation.BACKGROUND.COLOR,
    borderTopColor: Colors.MainNavigation.BORDER.COLOR
  }
});

const MainModalNavigator = StackNavigator(
  {
    MainTabNavigator: {
      screen: MainTabNavigator
    },
    EditMarker: {
      screen: MarkerViewScreen,
      path: '/editMarker/:name',
      navigationOptions: ({ navigation }) => ({
        headerTitleStyle: {
          color: Colors.defaultColor.PAPER_COLOR,
          fontWeight: '600',
          justifyContent: 'space-between',
          textAlign: 'center'
        },
        headerStyle: {
          backgroundColor: Colors.defaultColor.PRIMARY_COLOR,
          borderBottomColor: '#F2F2F2'
        }
      })
    },
    EditRegion: {
      screen: MarkerViewScreen,
      path: '/editRegion/:name',
      navigationOptions: ({ navigation }) => ({
        headerTitleStyle: {
          color: Colors.defaultColor.PAPER_COLOR,
          fontWeight: '600',
          justifyContent: 'space-between',
          textAlign: 'center'
        },
        headerStyle: {
          backgroundColor: Colors.defaultColor.PRIMARY_COLOR,
          borderBottomColor: '#F2F2F2'
        }
      })
    }
  },
  { headerMode: 'none', mode: 'screen' }
);

export default MainModalNavigator;
