import React, {useRef} from 'react';
import {View, Text, StyleSheet, Image, Dimensions} from 'react-native';
//@ts-ignore
import VideoPlayer from 'react-native-video-player';

const Videox = ({route}) => {
  const {videoPath} = route.params;

  return (
    <View style={styles.container}>
      {videoPath != '' ? (
        <VideoPlayer
          video={{
            uri: videoPath,
          }}
          videoWidth={Dimensions.get('window').width}
        />
      ) : (
        <Text style={styles.noVideoText}>You haven't recorded video yet!</Text>
      )}
    </View>
  );
};

export default Videox;

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noVideoText: {
    marginTop: 100,
    textAlign: 'center',
    fontSize: 40,
    color: 'black',
  },
});
