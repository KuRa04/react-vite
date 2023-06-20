export interface UserInfo {
  userId: string;
  age: string;
  sex: string;
  bgn: string;
}

export interface PuretoneData {
  '250': number;
  '500': number;
  '1000': number;
  '2000': number;
  '3000': number;
  '4000': number;
  '8000': number;
  '9000': number;
  '10000': number;
  '12000': number;
  '14000': number;
  '16000': number;
  '18000': number;
  '20000': number;
}

export interface TestPuretoneData {
  site: string;
  puretoneData: PuretoneData;
}
