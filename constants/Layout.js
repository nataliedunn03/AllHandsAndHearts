'use strict';

import { Dimensions, Platform } from 'react-native';

const { height, width } = Dimensions.get('window');
const android = Platform.OS === 'android';
export default {
	height: android ? height - 24 : height,
	width: width,
	isSmallDevice: width < 375,
	android
};
