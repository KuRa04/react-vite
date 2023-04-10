import { useState } from 'react';
import {
  Box,
  ButtonGroup,
  Button,
  Heading,
  Text,
  ListItem,
  OrderedList,
  Flex,
  FormControl,
  FormLabel,
  Input
} from '@chakra-ui/react';

import { useToast } from '@chakra-ui/react';

const Form1 = () => {
  // const [show, setShow] = useState(false);
  // const handleClick = () => setShow(!show);
  return (
    <>
      <Box>
        <Heading as="h3" w="100%" textAlign={'left'} fontWeight="normal" mb="2%">
        1. 暗騒音レベルの計測
        </Heading>
        <FormControl mt="2%">
          <FormLabel htmlFor="background-noise" fontWeight={'normal'}>
            暗騒音レベル：
          </FormLabel>
          <Input id="background-noise" placeholder="db値 例：32.1" />
        </FormControl>
      </Box>
      <Box mt="2%">
        <Heading as="h3" w="100%" textAlign={'left'} fontWeight="normal" mb="2%">
        2. キャリブレーション
        </Heading>
        <Text as="p">
          以下の手順に従ってキャリブレーションを行ってください
        </Text>
        <OrderedList>
          <ListItem>使っているタブレット端末をヘッドフォンに接続してください</ListItem>
          <ListItem>開始ボタンをタップすると音（1 kHz の純音）が流れます</ListItem>
          <ListItem>サウンドレベル測定アプリSLA Liteを使って44 dBになるように<br />スピーカーのボリュームを調整してください</ListItem>
          <ListItem>停止ボタンをタップすると音が止まります</ListItem>
        </OrderedList>
      </Box>
    </>
  );
};

export const ReserveFormPage = () => {
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
        <ButtonGroup mt="5%" w="100%">
          <Flex w="100%" justifyContent="space-between">
            <Flex>
              <Button
                onClick={() => {
                  setStep(step - 1);
                  setProgress(progress - 33.33);
                }}
                isDisabled={step === 1}
                colorScheme="teal"
                variant="solid"
                w="7rem"
                mr="5%">
                開始
              </Button>
              <Button
                w="7rem"
                isDisabled={step === 3}
                onClick={() => {
                  setStep(step + 1);
                  if (step === 3) {
                    setProgress(100);
                  } else {
                    setProgress(progress + 33.33);
                  }
                }}
                colorScheme="teal"
                variant="outline">
                停止
              </Button>
            </Flex>
            {step === 3 ? (
              <Button
                w="7rem"
                colorScheme="red"
                variant="solid"
                onClick={() => {
                  toast({
                    title: 'Account created.',
                    description: "We've created your account for you.",
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  });
                }}>
                Submit
              </Button>
            ) : null}
          </Flex>
          
        </ButtonGroup>
        <Box mt="2%">
          <Text as="p">
            暗騒音レベルの計測とキャリブレーションが終わったら，チェックを開始してください
          </Text>
          <Button
            mt="2%"
            isDisabled={step === 3}
            onClick={() => {
              console.log("back")
            }}
            colorScheme="teal"
            variant="outline">
            聴こえチェックへ
          </Button>
        </Box>
      </Box>
    </>
  );
}