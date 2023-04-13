import { useState } from 'react';
import { useLocation } from "react-router-dom"
import useSound from 'use-sound';
// import wordVoiceA from '../../../audio/67s101-a.wav'
// import wordVoiceKi from '../../../audio/67s102-ki.wav'
// import wordVoiceShi from '../../../audio/67s103-shi.wav'
// import wordVoiceTa from '../../../audio/67s104-ta.wav'
// import wordVoiceNi from '../../../audio/67s105-ni.wav'
// import wordVoiceYo from '../../../audio/67s106-yo.wav'
// import wordVoiceJi from '../../../audio/67s107-ji.wav'
// import wordVoiceU from '../../../audio/67s108-u.wav'
// import wordVoiceKu from '../../../audio/67s109-ku.wav'
// import wordVoiceSu from '../../../audio/67s110-su.wav'
// import wordVoiceNe from '../../../audio/67s111-ne.wav'
// import wordVoiceHa from '../../../audio/67s112-ha.wav'
// import wordVoiceRi from '../../../audio/67s113-ri.wav'
// import wordVoiceBa from '../../../audio/67s114-ba.wav'
// import wordVoiceO from '../../../audio/67s115-o.wav'
// import wordVoiceTe from '../../../audio/67s116-te.wav'
// import wordVoiceMo from '../../../audio/67s117-mo.wav'
// import wordVoiceWa from '../../../audio/67s118-wa.wav'
// import wordVoiceTo from '../../../audio/67s119-to.wav'
// import wordVoiceGa from '../../../audio/67s120-ga.wav'
import { wordVoices } from '../../../audio';

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

// import { useToast } from '@chakra-ui/react';

const Form1 = () => {
  // const [show, setShow] = useState(false);
  // const [value, setValue] = useState('1')
  // const handleClick = () => setShow(!show);
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
  // const toast = useToast();
  // const [step, setStep] = useState(1);
  // const [progress, setProgress] = useState(33.33);

  // const wordVoices = [
  //   wordVoiceA,
  //   wordVoiceKi,
  //   wordVoiceShi,
  //   wordVoiceTa,
  //   wordVoiceNi,
  //   wordVoiceYo,
  //   wordVoiceJi,
  //   wordVoiceU,
  //   wordVoiceKu,
  //   wordVoiceSu,
  //   wordVoiceNe,
  //   wordVoiceHa,
  //   wordVoiceRi,
  //   wordVoiceBa,
  //   wordVoiceO,
  //   wordVoiceTe,
  //   wordVoiceMo,
  //   wordVoiceWa,
  //   wordVoiceTo,
  //   wordVoiceGa,
  // ];

  const [selectedItem, setSelectedItem] = useState<string>(''); // 選択されたアイテムをstateとして保持
  const [lastSelectedItem, setLastSelectedItem] = useState<string>(''); // 前回選択されたアイテムをstateとして保持

  const handleSelect = () => {
    let randomIndex = Math.floor(Math.random() * wordVoices.length); // 配列のランダムなインデックスを生成
    while (wordVoices[randomIndex] === lastSelectedItem) { // 前回選択されたアイテムと同じ場合は再度ランダムなインデックスを生成
      randomIndex = Math.floor(Math.random() * wordVoices.length);
    }
    setSelectedItem(wordVoices[randomIndex]); // stateにランダムに選択されたアイテムをセット
    setLastSelectedItem(wordVoices[randomIndex]); // 今回選択されたアイテムを前回選択されたアイテムとして保存
  };

  const [play, { stop }] = useSound(selectedItem);
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
                  handleSelect()
                  play()
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
                  stop()
                }}
                mr="5%"
                colorScheme="teal"
                variant="outline">
                キャンセル
              </Button>
              <Button
                onClick={() => {
                  console.log("onClick")
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