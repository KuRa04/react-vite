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

import { getDocs, collection, query, where } from "firebase/firestore";

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

interface Answers {
  docId: string;
  gainState: number
} 

export const HistoryPage = () => {
  // faceseatで入力したIDを取得
  const userInfo = useRecoilState(userInfoAtom)
  
  const { fireStore } = firebase
  const [answers, setAnswers] = useState<Answers[]>([])

  const getHearingData = async () => {
    const answersCollectionRef = collection(fireStore, 'users');

    // faceIdで登録したidで検索
    // idは一意にする
    // TODO faceシートで登録するときにuserをgetして同じIDだったら登録できないようにする    q
    const q = query(answersCollectionRef, where("id", "==", userInfo[0].id))
    const querySnapShot = await getDocs(q)
    querySnapShot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data().age)
    })
    getDocs(answersCollectionRef).then((querySnapshot) => {
      const AnswersList = querySnapshot.docs.map((doc, index) => {
        return  {
          docId: doc.id,
          gainState: doc.data().gainState,
        };
      })
      setAnswers(AnswersList)
    })
  }

  function convertToCSV(objArray: Answers[]): string {
    if (objArray.length === 0) {
      return ''
    }
    const header = Object.keys(objArray[0]).join(",") + "\n";
    const rows = objArray.map(obj => Object.values(obj).join(",")).join("\n");
    return header + rows;
  }
  
  function downloadCSV(data: string, filename: string) {
    const csvData = new Blob([data], { type: "text/csv" });
    const csvUrl = URL.createObjectURL(csvData);
    const link = document.createElement("a");
    link.href = csvUrl;
    link.download = filename;
    link.click();
  }

  const csvData = convertToCSV(answers)

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
          {
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
          }
        </Box>
      </Box>
    </>
  );
}