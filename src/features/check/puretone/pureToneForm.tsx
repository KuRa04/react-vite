import { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom"

import {
  Box,
  ButtonGroup,
  Button,
  Heading,
  Text,
  Flex
} from '@chakra-ui/react';
import { firebase } from '../../../firebase';
import { addDoc, collection } from "firebase/firestore";

export const PureToneFormPage = () => {
  const navigate = useNavigate();

  const [gainState, setGainState] = useState(0.01)
  const [isPlaying, setPlaying] = useState(false)

  const { fireStore } = firebase

  const search = useLocation().search;
  const query = new URLSearchParams(search);
  const site = query.get('site')
  const hzValue = query.get('hzValue')

  const context = new AudioContext();
  let oscillator: OscillatorNode | null = null;
  const frequency = Number(hzValue);
  const duration = 2; // 2秒間再生
  let intervalId;
  

  const onPlay = (gainValue: number) => {
    oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    
    const gainNode = context.createGain();
    
    gainNode.gain.value = 0;
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(gainValue, context.currentTime + 0.1);
    gainNode.connect(context.destination);
    
    oscillator.connect(gainNode);
    if (!oscillator) return
    oscillator.start(0);

    intervalId = setInterval(() => {
      oscillator?.stop(0);
      oscillator = null;
      const newGainValue = gainValue + 0.01
      if (newGainValue > 0.1) {
        return
      }
      onPlay(newGainValue);
    }, (duration + 0.5) * 2000);
  }

  const onStop = () => {
    console.log('sss')
    setPlaying(false)
    oscillator?.stop(0);
    oscillator = null;
    clearInterval(intervalId);
  }

  const goBack = () => {
    onStop()
    navigate(-1)
  }

  const postPureToneData = () => {
    const ansersCollectionRef = collection(fireStore, 'answers');
    addDoc(ansersCollectionRef, {
      gainState: gainState,
      hzValue: hzValue
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
          {`純音 ${hzValue}Hz ${site}`} 
        </Heading>
        <Text as="p">
          チェック開始ボタンをタップして音が鳴るまで待ってください。
        </Text>
        <Text as="p">
          音が聴こえたら聴こえたボタンをタップしてください。
        </Text>
      </Box>
        <ButtonGroup mt="2%" w="100%">
          <Flex w="100%" justifyContent="space-between">
            <Flex>
              <Button
                onClick={() => {
                  onPlay(gainState)
                }}
                isDisabled={isPlaying}
                colorScheme="teal"
                variant="solid"
                mr="5%">
                チェック開始
              </Button>
              <Button
                // isDisabled={step === 3}
                onClick={() => {
                  onStop()
                }}
                mr="5%"
                colorScheme="teal"
                variant="outline">
                キャンセル
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
          <Text as="p" fontWeight={'bold'}>
            暗騒音レベル
          </Text>
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