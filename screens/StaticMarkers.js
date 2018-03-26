export const randomId = () => {
  return (
    "_" +
    Math.random()
      .toString(36)
      .substr(2, 9)
  );
};
export const randomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};
const getMarkers = () => {
  return [
    {
      key: randomId(),
      color: randomColor(),
      coordinate: {
        latitude: 40.75539830640072,
        longitude: -73.993821144104
      },
      name: "Union Station - West 38st"
    },
    {
      key: randomId(),
      color: randomColor(),
      coordinate: {
        latitude: 39.08454657050675,
        longitude: -76.5449656918645
      },
      name: "Mularad Ct - Baltimore"
    },
    {
      key: randomId(),
      color: randomColor(),
      coordinate: {
        latitude: 37.78825,
        longitude: -122.4324
      },
      name: "San Francisco Area"
    },
    {
      key: randomId(),
      color: randomColor(),
      coordinate: {
        latitude: 49.26310195900646,
        longitude: 10.410288870334625
      },
      name: "Germany"
    },
    {
      key: randomId(),
      color: randomColor(),
      coordinate: {
        latitude: 17.728179838904037,
        longitude: -90.01192241907121
      },
      name: "Campeche Area"
    },
    {
      key: randomId(),
      color: randomColor(),
      coordinate: {
        latitude: 40.75733151949385,
        longitude: -73.97329218685627
      },
      name: "Eventage Event - Park Ave"
    }
  ];
};

export default getMarkers;
