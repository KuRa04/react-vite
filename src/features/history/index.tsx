import {
  Box,
  Button,
  Heading,
  Text
} from '@chakra-ui/react';

import { useState } from 'react';

import { useRecoilState } from 'recoil';
import { userInfoAtom } from '../../util/userInfoAtom';

import { firebase } from '../../firebase';

import { getDoc, doc } from "firebase/firestore";

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

interface Answer {
  id: string;
  age: string;
  sex: string;
} 

export const HistoryPage = () => {
  // faceseatで入力したIDを取得
  const userInfo = useRecoilState(userInfoAtom)
  
  const { fireStore } = firebase
  const [answer, setAnswer] = useState<Answer>({
    id: '',
    age: '',
    sex: ''
  })

  const getHearingData = async () => {
    const docRef = doc(fireStore, "users", userInfo[0].id)
    const docSnap = await getDoc(docRef)
    console.log(userInfo[0].id)
    if (!docSnap.data()) return
    setAnswer(docSnap.data() as Answer)
    console.log(answer)
  }

  function convertToCSV(obj: Answer): string {
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
   
  if (!answer) return
  const csvData = convertToCSV(answer)

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