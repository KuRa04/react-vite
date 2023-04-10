import {
  Box,
  Heading,
  Text
} from '@chakra-ui/react';

import { Link } from "react-router-dom";

const Form1 = () => {
  const siteArray = ['左', '右', '両耳']
  return (
    <>
      <Box>
        <Heading as="h1" w="100%" textAlign={'left'} fontWeight="normal" mb="2%">
          聴こえチェック 音声
        </Heading>
        <Text as="p">
          語音をどの程度聴きとれるか調べる検査です。
        </Text>
        <Text as="p">
          一音の単音節音声が流れます。 例：は
        </Text>
        <Text as="p" mt="2%">
          イヤホン・ヘッドホンを着用してください。
        </Text>
        <Text as="p">
          検査したい耳を選んで検査を開始してください。
        </Text>
      </Box>
      <Box>
        {siteArray.map((site, index) => {
          return (
            <Box key={`${site}-${index}`} mt="2%">
              <Link to={`detail?site=${site}`}>
                <Text color={'blue.400'}>
                  {site}
                </Text>
              </Link>
            </Box>
          )
        })}
      </Box>
    </>
  );
};

export const VoicePage = () => {
  return (
    <Box
      borderWidth="1px"
      rounded="lg"
      shadow="1px 1px 3px rgba(0,0,0,0.3)"
      maxWidth={800}
      p={6}
      m="10px auto"
      as="form">
      <Form1 />
    </Box>
  );
}