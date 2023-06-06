import {
  Box,
  Button,
  Heading,
  Text
} from '@chakra-ui/react';

import { useState, useEffect } from 'react';

import { useRecoilState } from 'recoil';
import { userInfoAtom } from '../../util/userInfoAtom';

import { firebase } from '../../firebase';

import { getDoc, getDocs, doc, collection } from "firebase/firestore";

import { setLocalStorage, getLocalStorage } from '../../util/localStorage';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

const labels = ['250', '500', '1000', '2000', '3000', '4000', '8000', '10000', '12000', '14000', '16000'];
const array = Array(11).fill(20.2);
export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: labels.map(() => faker.datatype.number({ min: 0, max: 80 })),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: '暗騒音',
      data: array,
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

interface PuretoneData {
  250: string,
  500: string,
  1000: string,
  2000: string,
  3000: string,
  4000: string,
  8000: string
}

interface UserInfo {
  userId: string
  age: string
  sex: string
  bgn: string
}

interface TestPuretoneData {
  site: string
  puretoneData: PuretoneData
}

interface CsvData extends UserInfo {
  site: string,
  250: string,
  500: string,
  1000: string,
  2000: string,
  3000: string,
  4000: string,
  8000: string
}

export const HistoryPage = () => {
  // faceseatで入力したIDを取得
  const userInfoJson = getLocalStorage('userInfo')
  const userInfoParse = JSON.parse(userInfoJson as string) as UserInfo
  
  const { fireStore } = firebase

  const [userInfo, setUserInfo] = useState<UserInfo>(userInfoParse)
  const [pureToneData, setPuretoneData] = useState<PuretoneData>()
  const [csvTestData, setCsvTextData] = useState<CsvData>({
    userId: userInfo.userId,
    age: userInfo.age,
    sex: userInfo.sex,
    bgn: userInfo.bgn,
    site: '',
    250: '',
    500: '',
    1000: '',
    2000: '',
    3000: '',
    4000: '',
    8000: ''
  })

  const pureToneDataObj = {
    '250': '',
    '500': '',
    '1000': '',
    '2000': '',
    '3000': '',
    '4000': '',
    '8000': ''
  }

  const getHearingData = async () => {
    const docRef = doc(fireStore, "users", userInfo.userId)
    const puretoneRef = doc(fireStore, "users", userInfo.userId, "puretone", "left")
    const docSnap = await getDoc(docRef)
    const puretoneSnap = await getDoc(puretoneRef)
    if (!puretoneSnap.data() || !docSnap.data()) {
      setPuretoneData(pureToneDataObj)
    } else {
      const castPuretoneSnap = puretoneSnap.data() as TestPuretoneData
      const castUserInfoSnap = docSnap.data() as UserInfo
      if (!castPuretoneSnap.puretoneData) return
      setUserInfo(castUserInfoSnap)
      setPuretoneData(castPuretoneSnap.puretoneData)
      setCsvTextData({
        userId: userInfo.userId,
        age: userInfo.age,
        sex: userInfo.sex,
        bgn: userInfo.bgn,
        site: castPuretoneSnap.site,
        250: castPuretoneSnap.puretoneData[250],
        500: castPuretoneSnap.puretoneData[500],
        1000: castPuretoneSnap.puretoneData[1000],
        2000: castPuretoneSnap.puretoneData[2000],
        3000: castPuretoneSnap.puretoneData[3000],
        4000: castPuretoneSnap.puretoneData[4000],
        8000: castPuretoneSnap.puretoneData[8000]
      })
    }
  }

  function convertToCSV(obj: CsvData): string {
    const header = Object.keys(obj).join(",") + "\n";
    const values = Object.values(obj).join(",");
    return header + values;
  }
  
  function downloadCSV(data: string, filename: string) {
    const csvData = new Blob([data], { type: "text/csv" });
    const csvUrl = URL.createObjectURL(csvData);
    const link = document.createElement("a");
    link.href = csvUrl;
    link.download = filename;
    link.click();
  }
   
  if (!csvTestData) return <></>
  const csvData = convertToCSV(csvTestData)

  useEffect(() => {
    getHearingData()
  }, [])

  return (
    <>
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        maxWidth={800}
        p={6}
        m="10px auto"
        as="form">
         <Box>
          <Heading as="h1" w="100%" textAlign={'left'} fontWeight="normal" mb="2%">
            聴こえチェック履歴
          </Heading>
          <Line options={options} data={data} />
          <Button
            onClick={() => {
              getHearingData()
            }}
            // isDisabled={step === 1}
            colorScheme="teal"
            variant="solid"
            mr="5%">
            履歴取得
          </Button>
          <Button
            onClick={() => {
              downloadCSV(csvData, "data.csv");
            }}
            // isDisabled={step === 1}
            colorScheme="teal"
            variant="solid"
            mr="5%">
            csvダウンロード
          </Button>
        </Box>
        <Box>
          {/* {
            answers.map((answer) => {
              return (
              <Box key={`${answer.docId}`}>
              <Text>
                id: {answer.docId}
              </Text>
              <Text>
                アプリの音量: {answer.gainState}
              </Text>
              </Box>
              )
            })
          } */}
        </Box>
      </Box>
    </>
  );
}