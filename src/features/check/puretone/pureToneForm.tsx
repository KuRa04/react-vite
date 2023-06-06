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
import { doc, addDoc, collection, serverTimestamp } from "firebase/firestore";

import { useRecoilState } from 'recoil';
import { userInfoAtom } from '../../../util/userInfoAtom';

import { hzValueObj } from '../../../util/freqDataSets/haValueObj';

interface BgnType {
  bgn: string
}

export const PureToneFormPage = () => {
  const userInfo = useRecoilState(userInfoAtom)

  const [bgn, setBgn] = useState()

  const navigate = useNavigate();
  const initialState = [0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
  console.log(initialState.length)

  // const [gainState, setGainState] = useState<number[]>(initialState)
  const [index, setIndex] = useState<number>(0)
  const [isPlaying, setPlaying] = useState(false)

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
  const site = query.get('site')
  const hzValue = query.get('hzValue')

  const context = new AudioContext();
  let oscillator: OscillatorNode | null = null;
  const frequency = Number(hzValue);
  const duration = 10 // 2秒間再生
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
    setPlaying(false)
    oscillator?.stop();
    oscillator = null;
    // clearInterval(intervalId);
  }

  const goBack = () => {
    onStop()
    navigate(-1)
  }

  const postPureToneData = () => {
    if (!hzValue) return
    const ansersCollectionRef = collection(fireStore, 'answers');
    const selectIndex = initialState[index].toString()
    const selectFreqHzObj = hzValueObj[hzValue]
    addDoc(ansersCollectionRef, {
      dB: selectFreqHzObj[selectIndex],
      hzValue: hzValue,
      site,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    })
    onStop()
  }

  useEffect(() => {
    if (oscillator) {
      onStop()
    }
    onPlay()
  })

  // const getHearingData = async () => {
  //   const docRef = doc(fireStore, "users", userInfo[0].id)
  //   const docSnap = await getDoc(docRef)
  //   console.log(userInfo[0].id)
  //   if (!docSnap.data()) return
  // }

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
          {`純音 ${hzValue}Hz ${site}`} 
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