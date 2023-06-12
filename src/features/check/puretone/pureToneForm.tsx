import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom"

import {
  Box,
  ButtonGroup,
  Button,
  Heading,
  Text,
  Flex,
  Progress
} from '@chakra-ui/react';
import { firebase } from '../../../firebase';
import { doc, setDoc, addDoc, collection, serverTimestamp, getDoc } from "firebase/firestore";

import { useRecoilState } from 'recoil';
import { userInfoAtom } from '../../../util/userInfoAtom';

import { hzValueObj } from '../../../util/freqDataSets/haValueObj';
import { getLocalStorage } from '../../../util/localStorage';

interface UserInfo {
  userId: string
  age: string
  sex: string
  bgn: string
}

interface PuretoneData {
  250: number,
  500: number,
  1000: number,
  2000: number,
  3000: number,
  4000: number,
  8000: number
}

interface TestPuretoneData {
  site: string
  puretoneData: PuretoneData
}

export const PureToneFormPage = () => {
  const navigate = useNavigate();
  const initialState = [0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
  const userInfoJson = getLocalStorage('userInfo')
  const userInfoParse = JSON.parse(userInfoJson as string) as UserInfo

  // const [gainState, setGainState] = useState<number[]>(initialState)
  const [index, setIndex] = useState<number>(0)
  const [isPlaying, setPlaying] = useState(false)
  const [pureToneData, setPuretoneData] = useState<PuretoneData>()

  const { fireStore } = firebase

  const countUp = () => {
    if (index >= 19) return
    onStop()
    setIndex((prevIndex) => prevIndex + 1)
  }

  const countDown = () => {
    if (index <= 0) return
    onStop()
    setIndex((prevIndex) => prevIndex - 1)
  }

  const search = useLocation().search;
  const query = new URLSearchParams(search);
  const site = query.get('site') || ''
  const hzValue = query.get('hzValue')

  const siteTranslate: {[key: string]: string} = {
    'left': '左',
    'right': '右',
    'both': '両耳'
  };

  const pureToneDataObj = {
    250: 0,
    500: 0,
    1000: 0,
    2000: 0,
    3000: 0,
    4000: 0,
    8000: 0
  }

  const context = new AudioContext();
  let oscillator: OscillatorNode | null = null;
  const frequency = Number(hzValue);
  // const duration = 10 // 2秒間再生
  // let intervalId;
  

  const onPlay = () => {
    oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    
    const gainNode = context.createGain();
    
    gainNode.gain.value = 0;
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(initialState[index], context.currentTime + 0.1);
    gainNode.connect(context.destination);
    
    oscillator.connect(gainNode);
    if (!oscillator) return
    oscillator.start(0);

    // setInterval(() => {
    //   oscillator?.stop(0);
    //   oscillator = null;
    //   setIndex((prevIndex) => prevIndex + 1)
    //   onPlay();
    // }, (duration + 0.5) * 2000);
  }

  const onStop = () => {
    console.log(oscillator)
    setPlaying(false)
    oscillator?.stop();
    oscillator = null;
    // clearInterval(intervalId);
  }

  const goBack = () => {
    onStop()
    navigate(-1)
  }

  //puretoneの初期値を代入するuseEffect
  //firebaseを検索して初期値がなかったらlocalにあるobjectを代入

  // const getPureToneData = async () => {
  //   const puretoneDocRef = doc(fireStore, 'users', userInfoParse.userId, "puretone", site);
  //   try {
  //     const puretoneSnap = await getDoc(puretoneDocRef)
  //     if (!puretoneSnap) {
  //       setPuretoneData(pureToneDataObj)
  //       console.log('hoge')
  //     } else {
  //       const castPuretoneSnap = puretoneSnap.data() as TestPuretoneData
  //       console.log('huga');
  //       if (!castPuretoneSnap.puretoneData) return
  //       setPuretoneData(castPuretoneSnap.puretoneData)
  //       console.log('hoge-huga');
  //     }
  //   } catch(error) {
  //     console.log(error)  
  //   }
  // }

  const postPureToneData = async () => {
    const castHzValue = Number(hzValue)
    if (!hzValue) return
    const puretoneDocRef = doc(fireStore, 'users', userInfoParse.userId, "puretone", site);
    const selectIndex = initialState[index].toString()
    const puretoneSnap = await getDoc(puretoneDocRef)
    if (!puretoneSnap.data()) {
      await setDoc(puretoneDocRef, {
        site,
        puretoneData: pureToneDataObj,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      })  
    } 
    const castPuretoneSnap = puretoneSnap.data() as TestPuretoneData || pureToneDataObj
    const selectFreqHzObj = hzValueObj[hzValue]

    await setDoc(puretoneDocRef, {
      site,
      puretoneData: {...castPuretoneSnap.puretoneData, [castHzValue]: selectFreqHzObj[selectIndex]},
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    })
    onStop()
  }

  useEffect(() => {
    if (oscillator) {
      onStop()
    }
    // getPureToneData()
    onPlay()
  }, [index])

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
          {`純音 ${hzValue}Hz ${siteTranslate[site]}`} 
        </Heading>
        <Text as="p">
          チェック開始ボタンをタップして音が鳴るまで待ってください。
        </Text>
        <Text as="p">
          音が聴こえたら聴こえたボタンをタップしてください。
        </Text>
      </Box>
      <Progress value={index} max={19}/>
        <ButtonGroup mt="2%" w="100%">
          <Flex w="100%" justifyContent="space-between">
            <Flex>
              <Button
                onClick={() => {
                  countDown()
                }}
                colorScheme="blue"
                variant="solid"
                mr="5%"
                disabled={index === 0}
                >
                音量を下げる
              </Button>
              <Button
                // isDisabled={step === 3}
                onClick={() => {
                  countUp()
                }}
                mr="5%"
                colorScheme="red"
                variant="solid"
                >
                音量を上げる
              </Button>
              <Button
                onClick={() => {
                  console.log("onClick")
                  postPureToneData()
                }}
                // isDisabled={step === 1}
                colorScheme="teal"
                variant="solid"
                >
                聴こえた
              </Button>
            </Flex>
          </Flex>
        </ButtonGroup>
        <Box mt="2%">
          {/* <Text as="p" fontWeight={'bold'}>
            暗騒音レベル
          </Text> */}
          <Button
            mt="2%"
            // isDisabled={step === 3}
            onClick={() => {
              goBack()
            }}
            colorScheme="teal"
            variant="outline">
            戻る
          </Button>
        </Box>
      </Box>
    </>
  );
}