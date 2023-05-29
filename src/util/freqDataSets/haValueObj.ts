import { 
  freq250HzDataSet, 
  freq500HzDataSet,
  freq1000HzDataSet,
  freq2000HzDataSet,
  freq3000HzDataSet,
  freq4000HzDataSet,
  freq8000HzDataSet
} from './freqDataSet'

export const hzValueObj: {[key: string]: {[key: string]: number}} = {
  '250': freq250HzDataSet,
  '500': freq500HzDataSet,
  '1000': freq1000HzDataSet,
  '2000': freq2000HzDataSet,
  '3000': freq3000HzDataSet,
  '4000': freq4000HzDataSet,
  '8000': freq8000HzDataSet
}