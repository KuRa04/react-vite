import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"

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
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { useRecoilState } from 'recoil';
import { userInfoAtom } from '../../util/userInfoAtom';

import { hzValueObj } from "../../util/freqDataSets/haValueObj";
import Timer from "../../util/Timer";

export const ExperimentPureToneFormPage = () => {
  const navigate = useNavigate();
  const userInfo = useRecoilState(userInfoAtom)
  const { fireStore } = firebase

  const [gainState, setGainState] = useState<number>(0.01)
  const [isPlaying, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [gainInitialValue ,setGainInitialValue] = useState<number>(0.01)

  const search = useLocation().search;
  const queryParams = new URLSearchParams(search);
  const hzValue = queryParams.get('hzValue')

  const gainArray = Array.from({ length: 10 }, (_, i) => Math.floor(gainInitialValue * (i + 1) * 10000) / 10000);

  const goBack = () => {
    navigate(-1)
  }

  const context = new AudioContext();
  let oscillator: OscillatorNode | null = null;
  // let intervalId: NodeJS.Timeout | null;
  const frequency = Number(hzValue);
  const duration = 10; // 10秒間再生

  const onClickStart = (gainValue: number) => {
    setTime(duration)
    setPlaying(true)
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
      setPlaying(false)
    }, duration * 1000);
  }

  const onClickStop = () => {
      oscillator?.stop();
      oscillator?.disconnect();
      oscillator = null;
      setTime(0)
      setPlaying(false)
  }

  const handleGainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGainInitialValue(Number(e.target.value))
  }
  
  const postPureToneData = async () => {
    if (!hzValue) return
    const selectIndex = gainState.toString()
    const selectFreqHzObj = hzValueObj[hzValue]

    const collectionPath = doc(fireStore, 'users', userInfo[0].id, 'answer', 'puretone')
    setDoc(collectionPath, {
      id: userInfo[0].id,
      HzValue: hzValue,
      dB: selectFreqHzObj[selectIndex],
      appVolume: gainState,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    })
  }

  return (
    <>
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
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
            <FormLabel htmlFor="background-noise" fontWeight={'bold'}>
              アプリ側の初期値（gain：0以上1以下 ）
            </FormLabel>
            <Input width={300} id="background-noise" placeholder="0.01" defaultValue={gainInitialValue} onChange={(e) => handleGainChange(e)}/>
            {/* <Button
                onClick={() => {
                  postBgnData()
                }}
                // isDisabled={step === 1}
                mt="2%"
                colorScheme="teal"
                variant="solid"
                w="7rem"
                mr="5%">
                登録
              </Button> */}
          </FormControl>
      </Box>
      {isPlaying && <Timer time={time} isPlaying={isPlaying}/>}
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
        <Box>
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