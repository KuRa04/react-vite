import {
  Box,
  Button,
  HStack,
  Heading,
  Text
} from '@chakra-ui/react';

import { Link, useNavigate} from "react-router-dom";

import { frequencies, ears } from '../../../util/commonItem';
import { NavBar } from '../../components/navbar';

export const PureTonePage = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1)
  }

  return (
    <>
      <NavBar />
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        p={6}
        m="10px auto"
      >
      <Box>
        <Heading as="h1" w="100%" textAlign={'left'} fontWeight="normal" mb="2%">
        聴こえチェック純音
        </Heading>
        <Text as="p">
        純音をどの程度聴きとれるか調べる検査です。
        </Text>
        <Text as="p">
        イヤホン・ヘッドホンを着用してください。
        </Text>
        <Text as="p">
        検査したい耳，周波数を選んで検査を開始してください。
        </Text>
      </Box>
        <Box>
          {ears.map((ear, index) => {
            return (
              <Box key={`${ear}-${index}`} mt="2%">
                <Text as="p" fontWeight={'bold'}>
                  {ear}
                </Text>
                <HStack>
                  {frequencies.map((frequency, index) => {
                    return (
                      <Link key={`${frequency}-${index}`} to={`detail?ear=${ear}&frequency=${frequency}`}>
                        <Text color={'blue.400'}>
                          {frequency}Hz
                        </Text>
                      </Link>
                    )  
                    })}    
                </HStack>
              </Box>
            )
          })}
        </Box>
        <Box mt="2%">
          {/* <Text as="p" fontWeight={'bold'}>
            暗騒音レベル
          </Text> */}
          <Button
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