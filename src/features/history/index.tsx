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

interface UserInfo {
  userId: string
  age: string
  sex: string
  bgnValue: string
}

interface PuretoneData extends UserInfo {
  db: number
  hzValue: string
  site: string
}

export const HistoryPage = () => {
  // faceseatで入力したIDを取得
  const userInfoJson = getLocalStorage('userInfo')
  const userInfoParse = JSON.parse(userInfoJson as string) as UserInfo
  
  const { fireStore } = firebase
  const [userInfo, setUserInfo] = useState<UserInfo>(userInfoParse)

  const getHearingData = async () => {
    const docRef = doc(fireStore, "users", userInfo.userId)
    const puretoneRef = collection(fireStore, "users", userInfo.userId, "puretone")
    const docSnap = await getDoc(docRef)
    const puretoneSnap = await getDocs(puretoneRef)
    puretoneSnap.forEach((doc) => {
      console.log(doc.id, "=>", doc.data())
    })
    // console.log(docSnap.data())
    if (!docSnap.data()) return
    setUserInfo(docSnap.data() as UserInfo)
  }

  function convertToCSV(obj: UserInfo): string {
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
   
  if (!userInfo) return <></>
  const csvData = convertToCSV(userInfo)

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