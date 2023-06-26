import { Box, Button, Heading } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { firebase } from '../../firebase';
import { getDocs, getDoc, collection, doc } from 'firebase/firestore';
import { getLocalStorage } from '../../util/localStorage';
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

import { puretoneDataObj } from '../../util/commonItem';
import { NavBar } from '../components/navbar';
import { useFetchUserInfo } from '../../hooks/useFetchUserInfo';
import { UserInfo } from '../../types/type';

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

const labels = [
  '250',
  '500',
  '1000',
  '2000',
  '3000',
  '4000',
  '8000',
  '10000',
  '12000',
];

interface PuretoneData {
  250: number;
  500: number;
  1000: number;
  2000: number;
  3000: number;
  4000: number;
  8000: number;
  10000: number;
  12000: number;
  14000: number;
  16000: number;
}
interface TestPuretoneData {
  site: string;
  puretoneData: PuretoneData;
}

interface CsvData extends UserInfo {
  site: string;
  250: number;
  500: number;
  1000: number;
  2000: number;
  3000: number;
  4000: number;
  8000: number;
  10000: number;
  12000: number;
  14000: number;
  16000: number;
}

export const HistoryPage = () => {
  const { fireStore } = firebase;

  const userInfoData = useFetchUserInfo();
  const [hearingData, setHearingData] = useState({
    left: puretoneDataObj,
    right: puretoneDataObj,
    both: puretoneDataObj
  })

  const [userInfo, setUserInfo] = useState<UserInfo>(userInfoData);
  const [pureToneData, setPuretoneData] =
    useState<PuretoneData>(puretoneDataObj);
  const [csvTestData, setCsvTextData] = useState<CsvData>({
    ...{
      userId: userInfoData.userId,
      age: userInfoData.age,
      sex: userInfoData.sex,
      bgn: userInfoData.bgn,
      site: '',
    },
    ...puretoneDataObj,
  });

  const updatePureToneData = { ...puretoneDataObj, ...pureToneData };
  const pureToneDataArray = Object.values(updatePureToneData);

  const array = Array(11).fill(userInfoData.bgn);

  const data = {
    labels,
    datasets: [
      {
        label: '左耳',
        data: Object.values(hearingData.left),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: '右耳',
        data: Object.values(hearingData.right),
        borderColor: 'rgb(30, 144, 255)',
        backgroundColor: 'rgba(0, 144, 255, 0.5)',
      },
      {
        label: '両耳',
        data: Object.values(hearingData.both),
        borderColor: 'rgb(60,179,113)',
        backgroundColor: 'rgba(60,179,113, 0.5)',
      },
      {
        label: '暗騒音',
        data: array,
        borderColor: 'rgb(248,180,0)',
        backgroundColor: 'rgba(248,180,0, 0.5)',
      },
    ],
  };

  const getHearingData = async () => {
    console.log(fireStore)
    const puretoneCollectionRef = collection(
      fireStore,
      'users',
      userInfoData.userId,
      'puretone'
    );
    // console.log(fireStore)
    const querySnapshot = await getDocs(puretoneCollectionRef)
    querySnapshot.forEach((doc) => {
      if (doc.data().ear === 'left') {
        setHearingData((prev) => ({
          ...prev, left: doc.data().puretoneData
        }))
      }
      if (doc.data().ear === 'right') {
        setHearingData((prev) => ({
          ...prev, right: doc.data().puretoneData
        }))
      }
      if (doc.data().ear === 'both') {
        setHearingData((prev) => ({
          ...prev, both: doc.data().puretoneData
        }))
      }
      console.log(doc.id, "=>", doc.data().created_at.seconds)
    })

    console.log(hearingData)
       // const docRef = doc(fireStore, 'users', userInfo.userId);
    // const puretoneRef = doc(
    //   fireStore,
    //   'users',
    //   userInfo.userId,
    //   'puretone',
    //   site
    // );
    // const docSnap = await getDoc(docRef);
    // const puretoneSnap = await getDoc(puretoneRef);
    // if (!puretoneSnap.data() || !docSnap.data()) {
    //   setPuretoneData(puretoneDataObj);
    // } else {
    //   const castPuretoneSnap = puretoneSnap.data() as TestPuretoneData;
    //   const castUserInfoSnap = docSnap.data() as UserInfo;
    //   if (!castPuretoneSnap.puretoneData) return;
    //   setUserInfo(castUserInfoSnap);
    //   setPuretoneData(castPuretoneSnap.puretoneData);
    //   setCsvTextData({
    //     userId: userInfo.userId,
    //     age: userInfo.age,
    //     sex: userInfo.sex,
    //     bgn: userInfo.bgn,
    //     site: castPuretoneSnap.site,
    //     250: castPuretoneSnap.puretoneData[250],
    //     500: castPuretoneSnap.puretoneData[500],
    //     1000: castPuretoneSnap.puretoneData[1000],
    //     2000: castPuretoneSnap.puretoneData[2000],
    //     3000: castPuretoneSnap.puretoneData[3000],
    //     4000: castPuretoneSnap.puretoneData[4000],
    //     8000: castPuretoneSnap.puretoneData[8000],
    //     10000: castPuretoneSnap.puretoneData[10000],
    //     12000: castPuretoneSnap.puretoneData[12000],
    //     14000: castPuretoneSnap.puretoneData[14000],
    //     16000: castPuretoneSnap.puretoneData[16000],
    //   });
    // }
  };

  function convertToCSV(obj: CsvData): string {
    const header = Object.keys(obj).join(',') + '\n';
    const values = Object.values(obj).join(',');
    return header + values;
  }

  function downloadCSV(data: string, filename: string) {
    const csvData = new Blob([data], { type: 'text/csv' });
    const csvUrl = URL.createObjectURL(csvData);
    const link = document.createElement('a');
    link.href = csvUrl;
    link.download = filename;
    link.click();
  }

  if (!csvTestData) return <></>;
  const csvData = convertToCSV(csvTestData);

  return (
    <>
      <NavBar />
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        maxWidth={800}
        p={6}
        m="10px auto"
        as="form"
      >
        <Box>
          <Heading
            as="h1"
            w="100%"
            textAlign={'left'}
            fontWeight="normal"
            mb="2%"
          >
            聴こえチェック履歴
          </Heading>
          <Line options={options} data={data} />
          <Button
            onClick={() => {
              getHearingData();
            }}
            // isDisabled={step === 1}
            colorScheme="teal"
            variant="solid"
            mr="5%"
          >
            履歴取得（左耳）
          </Button>
          <Button
            onClick={() => {
              getHearingData();
            }}
            // isDisabled={step === 1}
            colorScheme="teal"
            variant="solid"
            mr="5%"
          >
            履歴取得（右耳）
          </Button>
          <Button
            onClick={() => {
              getHearingData();
            }}
            // isDisabled={step === 1}
            colorScheme="teal"
            variant="solid"
            mr="5%"
          >
            履歴取得（両耳）
          </Button>
          <Button
            onClick={() => {
              downloadCSV(csvData, 'data.csv');
            }}
            // isDisabled={step === 1}
            colorScheme="teal"
            variant="solid"
          >
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
};
