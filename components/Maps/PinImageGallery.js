import React, { Component } from 'react';
import { Image, StyleSheet, View, LayoutAnimation } from 'react-native';
import Lightbox from 'react-native-lightbox';
import Layout from '../../constants/Layout';

const IMAGE_WIDTH = Layout.width / 3 - 20;
const IMAGE_HEIGHT = 100;

class Gallery extends React.PureComponent {
  renderCarousel = () => (
    <View style={styles.contentContainer}>
      <Image
        style={styles.conImage}
        resizeMode="contain"
        source={{
          uri: this.props.uri
        }}
      />
    </View>
  );
  render() {
    const { uri } = this.props;
    return (
      <Lightbox underlayColor="white" renderContent={this.renderCarousel}>
        <View style={styles.lightbox}>
          <Image
            style={styles.image}
            resizeMode="cover"
            source={{
              uri: `${uri}`
            }}
          />
        </View>
      </Lightbox>
    );
  }
}

export default ({ photos }) => {
  return (
    <View style={styles.sceneContainer}>
      {photos &&
        photos.map((photo, index) => {
          return <Gallery key={index} uri={photo} />;
        })}
    </View>
  );
};
const styles = StyleSheet.create({
  sceneContainer: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly'
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    borderColor: '#EDEDED',
    borderRadius: 10,
    marginBottom: 8
  },
  lightbox: {
    flex: 1,
    height: IMAGE_HEIGHT,
    width: IMAGE_WIDTH,
    backgroundColor: '#000',
    borderColor: '#EDEDED',
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
    padding: 0
  },
  image: {
    width: 120,
    height: 120
  },
  conImage: {
    flex: 1,
    width: Layout.width,
    height: Layout.width
  }
});
