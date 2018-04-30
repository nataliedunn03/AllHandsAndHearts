import { Constants, Permissions, Notifications } from 'expo';
import * as AuthService from './auth';
import ApiWrapper from '../services/api';
const Api = new ApiWrapper();

export default (async function registerForPushNotificationsAsync() {
  // Remote notifications do not work in simulators, only on device
  if (!Constants.isDevice) {
    return;
  }

  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== 'granted') {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== 'granted') {
    alert(
      'Hey! You might want to enable notifications to receive broadcast updates.'
    );
    return;
  }

  // Get the token that uniquely identifies this device
  const token = await Notifications.getExpoPushTokenAsync();
  if (!token) return null;
  const Id = await AuthService.getValueFromStorage('Id');
  const payload = {
    deviceId: Constants.deviceId,
    deviceName: Constants.deviceName,
    userId: Id,
    notificationToken: token
  };
  return await Api.registerPushNotificationToken(payload);
});
