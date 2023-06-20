import {
  Box,
  Button,
  Heading,
  Text
} from '@chakra-ui/react';

import { Link, useNavigate } from "react-router-dom";
import { NavBar } from '../../components/navbar';
import { ears } from '../../../util/commonItem';

export const VoicePage = () => {
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
        maxWidth={800}
        p={6}
        m="10px auto"
        as="form">
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
          {ears.map((ear, index) => {
            return (
              <Box key={`${ear}-${index}`} mt="2%">
                <Link to={`detail?ear=${ear}`}>
                  <Text color={'blue.400'}>
                    {ear}
                  </Text>
                </Link>
              </Box>
            )
          })}
        </Box>
        <Box mt="2%">
            {/* <Text as="p" fontWeight={'bold'}>
              暗騒音レベル
            </Text> */}
            <Button
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