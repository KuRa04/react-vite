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
  const hzValueArray = [500, 1000, 2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000]
  return (
    <>
      <Box>
        <Heading as="h1" w="100%" textAlign={'left'} fontWeight="normal" mb="2%">
        聴こえチェック純音
        </Heading>
        <Text as="p">
        純音をどの程度聴きとれるか調べる検査です
        </Text>
        <Text as="p">
        イヤホン・ヘッドホンを着用してください
        </Text>
        <Text as="p">
        検査したい耳，周波数を選んで検査を開始してください
        </Text>
      </Box>
      <Box>
        <>
          {siteArray.map((site, index) => {
            return (
              <Box key={`${site}-${index}`} mt="2%">
                <Text as="p">
                  {site}
                </Text>
                <HStack>
                  {hzValueArray.map((hzValue, index) => {
                    return (
                      <Link key={`${hzValue}-${index}`} to={`detail?site=${site}&hzValue=${hzValue}`}>
                        <Text color={'blue.400'}>
                          {hzValue}hz
                        </Text>
                      </Link>
                    )  
                    })}    
                </HStack>
              </Box>
            )
          })}
        </>
      </Box>
    </>
  );
};

export const PureTonePage = () => {
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