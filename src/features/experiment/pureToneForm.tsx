import { useState } from "react";
import { useLocation } from "react-router-dom"

import {
  Box,
  ButtonGroup,
  Button,
  Heading,
  Text,
  Flex,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';

import { firebase } from '../../firebase';
import { addDoc, collection } from "firebase/firestore";

import { hzValueObj } from "../../util/freqDataSets/haValueObj";
// import Timer from "../../util/Timer";

export const ExperimentPureToneFormPage = () => {
  const { fireStore } = firebase

  const [gainState, setGainState] = useState<number>(0.01)
  const [name, setName] = useState('')
  // const [isPlaying, setPlaying] = useState(false)
  // const [time, setTime] = useState(0)

  const search = useLocation().search;
  const query = new URLSearchParams(search);
  const hzValue = query.get('hzValue')

  const gainArray = Array.from({ length: 9 }, (_, i) => (i + 1) / 100);
  const gainRowArray = Array.from({ length: 10 }, (_, i) => (i + 1) / 10);

  // useStateで配列の初期値を変更できるようにする

  const context = new AudioContext();
  let oscillator: OscillatorNode | null = null;
  let intervalId: NodeJS.Timeout | null;
  const frequency = Number(hzValue);
  const duration = 10; // 10秒間再生

  const onClickStart = (gainValue: number) => {
    // setTime(duration)
    // setPlaying(true)
    setGainState(gainValue)

    oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
  
    const gainNode = context.createGain();
    gainNode.gain.value = 0;
  
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(gainValue, context.currentTime + 0.1);
    // gainNode.gain.linearRampToValueAtTime(0, context.currentTime + duration - 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    if (!oscillator) return
    oscillator.start(0);
  
    setTimeout(() => {
      onClickStop();
      // setPlaying(false)
    }, duration * 1000);
  }

  const onClickStop = () => {
      oscillator?.stop();
      oscillator?.disconnect();
      oscillator = null;
    // if (intervalId) { 
    //   clearTimeout(intervalId);
    //   intervalId = null;
    // }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }


  const postPureToneData = () => {
    if (!hzValue) return
    const ansersCollectionRef = collection(fireStore, 'answers');
    const selectIndex = gainState.toString()
    const selectFreqHzObj = hzValueObj[hzValue]
    addDoc(ansersCollectionRef, {
      name,
      HzValue: hzValue,
      dB: selectFreqHzObj[selectIndex],
      appVolume: gainState
    })
  }

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
          純音 {frequency}Hz
        </Heading>
        <Text as="p">
          チェック開始ボタンをタップして音が鳴るまで待ってください。
        </Text>
        <Text as="p">
          音が聴こえたら聴こえたボタンをタップしてください。
        </Text>

        <FormControl mt="2%">
          <FormLabel htmlFor="name" fontWeight={'bold'}>
            名前
          </FormLabel>
          <Input id="name" placeholder="山田太郎" onChange={(e) => handleNameChange(e)}/>
        </FormControl>
      </Box>
      {/* <Timer time={duration}/> */}
        <ButtonGroup mt="2%" w="100%">
          <Flex w="100%" justifyContent="space-between">
            <Flex>
              {
                gainArray.map((item, index) => {
                  return (
                    <Button
                      key={`button-${index}`}
                      onClick={() => {
                        onClickStart(item)
                      }}
                      // isDisabled={step === 1}
                      colorScheme="teal"
                      variant="solid"
                      mr="2%">
                      {item}
                    </Button>    
                  )
                })
              }
            </Flex>
          </Flex>
        </ButtonGroup> 
        <Box mt="2%" >
          <Flex>
            {
              gainRowArray.map((item, index) => {
                return (
                  <Button
                    key={`button-${index}`}
                    onClick={() => {
                      onClickStart(item)
                    }}
                    // isDisabled={step === 1}
                    colorScheme="teal"
                    variant="solid"
                    mr="2%">
                    {item}
                  </Button>    
                )
              })
              }
            </Flex>
          </Box>
        <Box mt="2%">

          <Button
            onClick={() => {
              onClickStop()
            }}
            colorScheme="blue"
            variant="solid"
          >
            キャンセル
          </Button>
          <Button
            ml="2%"
            colorScheme="red"
            onClick={() => {
              console.log("onClick")
              postPureToneData()
            }}
            // isDisabled={step === 1}
            variant="solid"
            >
            聴こえた
          </Button>
        </Box>
      </Box>
    </>
  );
}