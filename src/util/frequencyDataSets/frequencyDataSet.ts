import {
  frequency250HzVolume1DataSet,
  frequency500HzVolume1DataSet,
  frequency1000HzVolume1DataSet,
  frequency2000HzVolume1DataSet,
  frequency3000HzVolume1DataSet,
  frequency4000HzVolume1DataSet,
  frequency8000HzVolume1DataSet,
  frequency10000HzVolume1DataSet,
  freq12000HzDataSet,
} from './conversionGainToSoundPressure';

export const frequencyDataSet: { [key: string]: { [key: string]: number } } = {
  '250': frequency250HzVolume1DataSet,
  '500': frequency500HzVolume1DataSet,
  '1000': frequency1000HzVolume1DataSet,
  '2000': frequency2000HzVolume1DataSet,
  '3000': frequency3000HzVolume1DataSet,
  '4000': frequency4000HzVolume1DataSet,
  '8000': frequency8000HzVolume1DataSet,
  '10000': frequency10000HzVolume1DataSet,
  '12000': freq12000HzDataSet,
};
