// import { useState } from 'react';
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

import { useNavigate } from "react-router-dom";

export const ReserveFormPage = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate("/")
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
          <Heading as="h3" fontSize={'24px'} w="100%" textAlign={'left'} fontWeight="bold" mb="2%">
          1. 暗騒音レベルの計測
          </Heading>
          <FormControl mt="2%">
            <FormLabel htmlFor="background-noise" fontWeight={'bold'}>
              暗騒音レベル
            </FormLabel>
            <Input id="background-noise" placeholder="db値 例：32.1" />
          </FormControl>
        </Box>
        <Box mt="2%">
          <Heading as="h3" fontSize={'24px'} w="100%" textAlign={'left'} fontWeight="bold" mb="2%">
          2. キャリブレーション
          </Heading>
          <Text as="p" fontWeight={'bold'}>
            以下の手順に従ってキャリブレーションを行ってください。
          </Text>
          <Box bg={"gray.100"} mt={'2%'} padding={'16px'}>
            <OrderedList>
              <ListItem>使っているタブレット端末をヘッドフォンに接続してください。</ListItem>
              <ListItem>開始ボタンをタップすると音（1 kHz の純音）が流れます。</ListItem>
              <ListItem>SLA Liteを使って44 dBになるようにスピーカーのボリュームを調整してください。</ListItem>
              <ListItem>停止ボタンをタップすると音が止まります。</ListItem>
            </OrderedList>
          </Box>
        </Box>
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
                w="7rem"
                mr="5%">
                開始
              </Button>
              <Button
                w="7rem"
                // isDisabled={step === 3}
                onClick={() => {
                  console.log("onClick")
                }}
                colorScheme="teal"
                variant="outline">
                停止
              </Button>
            </Flex>
          </Flex>
        </ButtonGroup>
        <Box mt="2%">
          <Text as="p" fontWeight="bold">
            暗騒音レベルの計測とキャリブレーションが終わったら，チェックを開始してください。
          </Text>
          <Button
            mt="2%"
            // isDisabled={step === 3}
            onClick={() => {
              goBack()
            }}
            colorScheme="teal"
            variant="outline"
          >
            聴こえチェックへ
          </Button>
        </Box>
      </Box>
    </>
  );
}