import { Permissions, Location } from 'expo';
import { Alert } from 'react-native';
export async function alertIfNotificationisDisabled() {
  const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  if (status !== 'granted') {
    Alert.alert('Notification service is turned off! Change it in settings!');
  }
}

export const alertIfLocationisDisabled = async () => {
  const { status } = await Permissions.getAsync(Permissions.LOCATION);
  if (status !== 'granted') {
    Alert.alert('Location service is turned off! Change it in settings');
  }
};
export const getUserCurrentLocation = async () => {
  const { status } = await Permissions.askAsync(Permissions.LOCATION);
  return status === 'granted' ? getCurrentLocation() : {};
};
export const getCurrentLocation = async () => {
  return Location.getCurrentPositionAsync({
    enableHighAccuracy: true
  });
};

export const getCameraPermission = async () => {
  const { status } = Permissions.askAsync(Permissions.CAMERA);
  const cameraRollPermission = Permissions.askAsync(Permissions.CAMERA_ROLL);
  if (status !== 'granted' || cameraRollPermission.status !== 'granted') {
    return null;
  }
  return cameraRollPermission;
};
