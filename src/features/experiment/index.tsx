import {
  Box,
  Button,
  HStack,
  Heading,
  Text
} from '@chakra-ui/react';

import { Link, useNavigate } from "react-router-dom";
import { frequencies, siteArray, siteTranslate } from '../../util/commonItem';

export const ExperimentPureTonePage = () => {
  const navigate = useNavigate();
  
  const goBack = () => {
    navigate(-1)
  }
  return (
    <>
      <Box>
        <Heading as="h1" w="100%" textAlign={'left'} fontWeight="normal" mb="2%">
        聴こえチェック純音（実験用）
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
          {siteArray.map((site, index) => {
            return (
              <Box key={`${site}-${index}`} mt="2%">
                <Text as="p" fontWeight={'bold'}>
                  {site}
                </Text>
                <HStack>
                  {frequencies.map((hzValue, index) => {
                    return (
                      <Link key={`${hzValue}-${index}`} to={`detail?site=${siteTranslate[site]}&hzValue=${hzValue}`}>
                        <Text color={'blue.400'}>
                          {hzValue}Hz
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
    </>
  );
}