export const puretoneDataObj = {
  '250': 0,
  '500': 0,
  '1000': 0,
  '2000': 0,
  '3000': 0,
  '4000': 0,
  '8000': 0,
  '9000': 0,
  '10000': 0,
  '12000': 0,
  '14000': 0,
  '16000': 0,
};

export const frequencies = [
  250, 500, 1000, 2000, 3000, 4000, 6000, 8000, 10000, 12000,
];

export const gainStates = [
  0, 0.000001, 0.000002, 0.000003, 0.000004, 0.000005, 0.000006, 0.000007,
  0.000008, 0.000009, 0.00001, 0.00002, 0.00003, 0.00004, 0.00005, 0.00006,
  0.00007, 0.00008, 0.00009, 0.0001, 0.0002, 0.0003, 0.0004, 0.0005, 0.0006,
  0.0007, 0.0008, 0.0009, 0.001, 0.002, 0.003, 0.004, 0.005, 0.006, 0.007,
  0.008, 0.009, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1,
];

export const ears = ['左耳', '右耳', '両耳'];

export const siteTranslate: { [key: string]: string } = {
  左: 'leftEar',
  右: 'rightEar',
  両耳: 'bothEars',
};

export const translateEarToEnglish = (ear: string) => {
  if (ear === '左耳') {
    return 'left';
  } else if (ear === '右耳') {
    return 'right';
  } else {
    return 'both';
  }
};

export const switchPan = (ear: string) => {
  if (ear === '左耳') {
    return -1;
  } else if (ear === '右耳') {
    return 1;
  } else {
    return 0;
  }
};
