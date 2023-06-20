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
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";

import { pureToneDataObj, gainStates, translateEarToEnglish, switchPan } from '../../../util/commonItem';

// 換算表で利用
import { frequencyDataSet } from '../../../util/frequencyDataSets/frequencyDataSet';
import { getLocalStorage } from '../../../util/localStorage';

import { UserInfo, TestPuretoneData } from '../../../types/type';
import { ROUTE_PATH } from '../../../util/routes';

export const PureToneFormPage = () => {
  const { fireStore } = firebase
  const search = useLocation().search;
  const navigate = useNavigate();

  const query = new URLSearchParams(search);
  const ear = query.get('ear') || ''
  const frequency = query.get('frequency')
  
  const userInfoJson = getLocalStorage('userInfo')
  const userInfoParse = JSON.parse(userInfoJson as string) as UserInfo

  const [index, setIndex] = useState<number>(0)

  const countUp = () => {
    if (index >= gainStates.length) return
    onStop()
    setIndex((prevIndex) => prevIndex + 1)
  }

  const countDown = () => {
    if (index <= 0) return
    onStop()
    setIndex((prevIndex) => prevIndex - 1)
  }
  
  let oscillator: OscillatorNode | null = null;
  const context = new AudioContext();
  const stereoPannerNode = context.createStereoPanner();
  
  const onPlay = () => {
    oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = Number(frequency);
    
    const gainNode = context.createGain();
    
    gainNode.gain.value = 0;
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(gainStates[index], context.currentTime + 0.1);
    
    stereoPannerNode.pan.value = switchPan(ear); // -1（左）から 1（右）の範囲で設定できます
    oscillator.connect(stereoPannerNode);
    stereoPannerNode.connect(gainNode);
    gainNode.connect(context.destination);
  
    if (!oscillator) return
    oscillator.start(0);
  }

  const onStop = () => {
    oscillator?.stop();
    oscillator = null;
  }

  const goBack = () => {
    onStop()
    navigate(-1)
  }

  const postPureToneData = async () => {
    if (!frequency) return
    const puretoneDocRef = doc(fireStore, 'users', userInfoParse.userId, "puretone", translateEarToEnglish(ear));
    const selectGainState = gainStates[index].toString()
    const puretoneSnap = await getDoc(puretoneDocRef)
    if (!puretoneSnap.data()) {
      await setDoc(puretoneDocRef, {
        ear,
        puretoneData: pureToneDataObj,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      })  
    } 
    const castPuretoneSnap = puretoneSnap.data() as TestPuretoneData || pureToneDataObj
    const selectFreqHzObj = frequencyDataSet[frequency]

    await setDoc(puretoneDocRef, {
      ear,
      puretoneData: {...castPuretoneSnap.puretoneData, [frequency]: selectFreqHzObj[selectGainState]},
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    })
    onStop()
    window.alert("登録しました。")
    navigate(ROUTE_PATH.PURETONE)
  }

  useEffect(() => {
    if (oscillator) {
      onStop()
    }
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
          {`純音 ${frequency}Hz ${ear}`} 
        </Heading>
        <Text as="p">
          チェック開始ボタンをタップして音が鳴るまで待ってください。
        </Text>
        <Text as="p">
          音が聴こえたら聴こえたボタンをタップしてください。
        </Text>
      </Box>
      <Progress value={index} max={29}/>
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