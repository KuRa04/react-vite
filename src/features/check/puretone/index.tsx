import {
  Box,
  Button,
  HStack,
  Heading,
  Text
} from '@chakra-ui/react';

import { Link, useNavigate} from "react-router-dom";

import { frequencies } from '../../../util/commonItem';

export const PureTonePage = () => {
  const navigate = useNavigate();
  const siteArray = ['左', '右', '両耳'];

  const siteTranslate: {[key: string]: string} = {
    '左': 'left',
    '右': 'right',
    '両耳': 'both'
  };

  const goBack = () => {
    navigate(-1)
  }

  return (
    <>
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
      </Box>
    </>
  );
}