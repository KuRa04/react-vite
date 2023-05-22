import {
  Box,
  Button,
  Heading,
  Text
} from '@chakra-ui/react';

import { useState } from 'react';

import { firebase } from '../../firebase';

import { getDocs, collection } from "firebase/firestore";

interface Answers {
  docId: string;
  gainState: number
} 

export const HistoryPage = () => {
  const { fireStore } = firebase
  const [answers, setAnswers] = useState<Answers[]>([])

  const getHearingData = () => {
    const ansersCollectionRef = collection(fireStore, 'answers');
    getDocs(ansersCollectionRef).then((querySnapshot) => {
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