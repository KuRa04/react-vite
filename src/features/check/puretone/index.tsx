import {
  Box,
  HStack,
  Heading,
  Text
} from '@chakra-ui/react';

import { Link } from "react-router-dom";

const Form1 = () => {
  // const handleClick = () => setShow(!show);


  return (
    <>

    </>
  );
};

export const PureTonePage = () => {
  const siteArray = ['左', '右', '両耳']
  const hzValueArray = [250, 500, 1000, 2000, 3000, 4000, 6000, 8000, 9000, 10000, 12000, 14000, 16000]

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
                  {hzValueArray.map((hzValue, index) => {
                    return (
                      <Link key={`${hzValue}-${index}`} to={`detail?site=${site}&hzValue=${hzValue}`}>
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
      </Box>
    </>
  );
}