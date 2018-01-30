import React, { Component } from 'react';
import { View } from 'react-native-animatable';
import { LayoutAnimation } from 'react-native';
import ActivityCard from './ActivityCard';
import { MonoText } from '../../components/StyledText';

export default class Activities extends Component {
	constructor(props) {
		super(props);
		this.state = {
			refreshing: false
		};
	}
	componentDidUpdate() {
		//LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
	}
	render() {
		return (
			<View
				ref={ref => {
					this.activitiesRef = ref;
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
					Activities
				</MonoText>
				<ActivityCard
					name="Maddie"
					taskText="Added a pin in Puerto Rico"
					taskDetail="School collapsed. Evacuation and transportation needed."
				/>
				<ActivityCard
					name="Ed"
					taskText="Added a pin in New York area"
					taskDetail="Trees on the road. Transportation stopped. Volunteers required."
				/>
				<ActivityCard
					name="Sam"
					taskText="Added a pin in Texas area"
					taskDetail="Trees on the road. Transportation stopped. Volunteers required."
				/>
				<ActivityCard
					name="Steven"
					taskText="Added a pin in New York area"
					taskDetail="Trees on the road. Transportation stopped. Volunteers required."
				/>
			</View>
		);
	}
}
