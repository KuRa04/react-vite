import { useState } from 'react';
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
  Input
} from '@chakra-ui/react';

import { useToast } from '@chakra-ui/react';

const Form1 = () => {
  const [show, setShow] = useState(false);
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
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(33.33);
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
                  console.log("onClick")
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
                  console.log("onClick")
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
            isDisabled={step === 3}
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