import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  Alert,
  Linking,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {Camera, useCameraDevice} from 'react-native-vision-camera';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';

//@ts-ignore
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
//@ts-ignore
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const App = () => {
  const navigation = useNavigation();

  const camera = useRef<Camera>(null);

  const [cameraPermission, setCameraPermission] = useState('');
  const [isRecordingOn, setIsRecordingOn] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [videoPath, setVideoPath] = useState('');

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const cameraPermissionStatus = await Camera.requestCameraPermission();
    const newMicrophonePermission = await Camera.requestMicrophonePermission();
    // const cameraPermissionStatus = Camera.getCameraPermissionStatus();
    // const microphonePermission = Camera.getMicrophonePermissionStatus();
    setCameraPermission(cameraPermissionStatus);
    if (
      cameraPermission === 'denied' ||
      cameraPermission === 'not-determined'
    ) {
      showPermissionDeniedAlert();
    } else {
      console.log('Permissinos already granted');
    }
  };

  const showPermissionDeniedAlert = () => {
    Alert.alert(
      'Requesting Permissions',
      'To use this app, you need to give camera permission in your device settings.',
      [
        {
          text: 'Go to Settings',
          onPress: () => Linking.openSettings(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );
  };

  const device = useCameraDevice('back');

  if (device == null) return <ActivityIndicator />;

  const recordVideo = async () => {
    try {
      if (camera != null) {
        setIsRecordingOn(true);
        const video = camera.current?.startRecording({
          onRecordingFinished: async video => {
            await CameraRoll.save(`file://${video.path}`, {
              type: 'video',
            });
            console.log('video in record', video);
            setVideoPath(video.path);
          },
          onRecordingError: error => console.error(error),
        });
      }
    } catch (error) {
      console.log('Error while recording video: ', error);
      setIsRecordingOn(false);
    }
  };

  const stopRecordingVideo = async () => {
    try {
      const video = await camera.current?.stopRecording();
      console.log('video in stop', video);
      setIsRecordingOn(false);
    } catch (error) {
      console.log('Error while stopping recording: ', error);
    }
  };

  const pauseRecording = async () => {
    setIsPaused(true);
    await camera.current?.pauseRecording();
  };

  const resumeRecording = async () => {
    await camera.current?.resumeRecording();
    setIsPaused(false);
  };

  const navigateToVideoScreen = () => {
    navigation.navigate('VideoScreen', {videoPath: videoPath});
  };

  return (
    <>
      {cameraPermission === 'granted' ? (
        <View style={styles.container}>
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            photo
            video
            audio
          />
          <View style={styles.buttonView}>
            {isRecordingOn ? (
              <TouchableOpacity
                style={styles.pauseButton}
                onPress={isPaused ? resumeRecording : pauseRecording}>
                {isPaused ? (
                  <FontAwesomeIcon name="circle" size={20} color="white" />
                ) : (
                  <FontAwesome5Icon name="pause" size={20} color="white" />
                )}
              </TouchableOpacity>
            ) : (
              <View style={styles.emptyView}></View>
            )}

            <TouchableOpacity
              style={styles.cameraButton}
              onPress={isRecordingOn ? stopRecordingVideo : recordVideo}>
              {isRecordingOn ? (
                <FontAwesomeIcon name="square" size={30} color="white" />
              ) : (
                <FontAwesomeIcon name="circle" size={30} color="white" />
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={navigateToVideoScreen}>
              <Image
                source={{
                  uri: 'https://store-images.s-microsoft.com/image/apps.60214.13510798887465976.5fa8b618-968b-4dac-98c8-ac21d818665e.bdd0c646-3ef7-4b7e-ac6e-6d249ab4544c?h=307',
                }}
                style={styles.galleryImage}
              />
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonView: {
    width: '100%',
    position: 'absolute',
    bottom: 50,
    // backgroundColor: 'purple',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },

  cameraButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyView: {
    width: 45,
    height: 45,
  },
  pauseButton: {
    width: 45,
    height: 45,
    borderRadius: 30,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryImage: {
    width: 50,
    height: 50,
  },
});
