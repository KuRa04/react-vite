import { useState } from 'react';
import {
  Progress,
  Box,
  Stack,
  HStack,
  ButtonGroup,
  Button,
  Heading,
  Text,
  List,
  ListItem,
  ListIcon,
  OrderedList,
  Flex,
  FormControl,
  GridItem,
  FormLabel,
  Input
} from '@chakra-ui/react';

import { useToast } from '@chakra-ui/react';
import { Link } from "react-router-dom";

const Form1 = () => {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState('1')
  const handleClick = () => setShow(!show);
  const siteArray = ['左', '右', '両耳']
  return (
    <>
      <Box>
        <Heading as="h1" w="100%" textAlign={'left'} fontWeight="normal" mb="2%">
          4. 聴こえチェック 音声
        </Heading>
        <Text as="p">
          語音をどの程度聴きとれるか調べる検査です
        </Text>
        <Text as="p">
          一音の単音節音声が流れます 例：は
        </Text>
        <Text as="p" mt="5%">
          イヤホン・ヘッドホンを着用してください
        </Text>
        <Text as="p">
          検査したい耳を選んで検査を開始してください
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
      </Box>
    </>
  );
}