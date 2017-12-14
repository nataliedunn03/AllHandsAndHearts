import { Permissions, Location } from "expo";

export async function alertIfNotificationisDisabled() {
  const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  if (status !== "granted") {
    alert("Notification is turned off! Chage it in settings");
  }
}
export const alertIfLocationisDisabled = async () => {
  const { status } = await Permissions.getAsync(Permissions.LOCATION);
  if (status !== "granted") {
    alert("Location is turned off! Chage it in settings");
  }
};

export const enableLocation = async () => {
  const { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status === "granted") {
    getCurrentLocation();
  } else {
    throw new Error("Location service denied");
  }
};
export const getCurrentLocation = async () => {
  return Location.getCurrentPositionAsync({
    enableHighAccuracy: true
  });
};
