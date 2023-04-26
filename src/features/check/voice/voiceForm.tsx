import { useState } from 'react';
import { useLocation } from "react-router-dom"
import { wordVoices } from '../../../util/audio';

import {
  Box,
  ButtonGroup,
  Button,
  Heading,
  Text,
  Flex,
  FormControl,
  FormLabel,
  Input
} from '@chakra-ui/react';

const Form1 = () => {
  const search = useLocation().search;
  const query = new URLSearchParams(search);
  const site = query.get('site')
  return (
    <Box>
      <Heading as="h1" w="100%" textAlign={'left'} fontWeight="normal" mb="2%">
        {`音声 ${site}`} 
      </Heading>
      <Text as="p">
        チェック開始ボタンをタップして声が聴こえるまで待ってください
      </Text>
      <Text as="p">
        声が聴こえたら聴こえたボタンをタップして，聴こえた言葉を入力してください
      </Text>
    </Box>
  );
};

export const VoiceFormPage = () => {
  let randomIndex = Math.floor(Math.random() * wordVoices.length); // 配列のランダムなインデックスを生成
  const initialAudio = new Audio(wordVoices[randomIndex])
  // 元のアプリが0.01ずつ増加
  initialAudio.volume = 0.01

  const [selectedItem, setSelectedItem] = useState<string>(wordVoices[randomIndex]); // 選択されたアイテムをstateとして保持
  const [lastSelectedItem, setLastSelectedItem] = useState<string>(''); // 前回選択されたアイテムをstateとして保持
  const [audio, setAudio] = useState<HTMLAudioElement | null>(initialAudio);

  const handleSelect = () => {
    if (!audio) return
    audio.pause()
    while (wordVoices[randomIndex] === lastSelectedItem) { // 前回選択されたアイテムと同じ場合は再度ランダムなインデックスを生成
      randomIndex = Math.floor(Math.random() * wordVoices.length);
    }
    setSelectedItem(wordVoices[randomIndex]); // stateにランダムに選択されたアイテムをセット
    setLastSelectedItem(wordVoices[randomIndex]); // 今回選択されたアイテムを前回選択されたアイテムとして保存
    const newAudio = new Audio(selectedItem)
    newAudio.volume = 0.; 
    setAudio(newAudio);
  };

  const onVoiceStart = (audio: HTMLAudioElement) => {
    audio.play()
  }
 
  const onVoicePause = (audio: HTMLAudioElement) => {
    audio.pause()
    audio.currentTime = 0
  }
  
  const checkVoiceEnded = () => {
    if (!audio) return
    if (audio.ended && audio.volume <= 0.1) {
      audio.currentTime = 0;
      audio.volume += 0.01
      audio.play();
    }
    requestAnimationFrame(checkVoiceEnded);
  }

  checkVoiceEnded()

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
        <Form1 />
        <ButtonGroup mt="2%" w="100%">
          <Flex w="100%" justifyContent="space-between">
            <Flex>
              <Button
                onClick={() => {
                  if (!audio) return
                  onVoiceStart(audio)
                }}
                // isDisabled={step === 1}
                colorScheme="teal"
                variant="solid"
                mr="5%">
                チェック開始
              </Button>
              <Button
                // isDisabled={step === 3}
                onClick={() => {
                  if (!audio) return
                  onVoicePause(audio)
                }}
                mr="5%"
                colorScheme="teal"
                variant="outline">
                キャンセル
              </Button>
              <Button
                onClick={() => {
                  handleSelect()
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
        <Box>
          <FormControl mt="4%">
            <FormLabel htmlFor="word" fontWeight={'bold'}>
              聴こえた言葉
            </FormLabel>
            <Input id="word" placeholder="あ" />
          </FormControl>
          <Button
            mt="2%"
            // isDisabled={step === 3}
            onClick={() => {
              console.log("back")
            }}
            colorScheme="teal"
            variant="solid"
          >
            登録
          </Button>
        </Box>
        <Box mt="4%">
          <Text as="p" fontWeight={'bold'}>
            暗騒音レベル
          </Text>
          <Button
            mt="2%"
            // isDisabled={step === 3}
            onClick={() => {
              console.log("back")
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