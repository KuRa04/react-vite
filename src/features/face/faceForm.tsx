import { useState } from 'react';
import {
  Box,
  Stack,
  ButtonGroup,
  Button,
  Heading,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Checkbox,
} from '@chakra-ui/react';

// import { useToast } from '@chakra-ui/react';

const Form1 = () => {
  // const [show, setShow] = useState(false);
  const [value, setValue] = useState('1')
  // const handleClick = () => setShow(!show);
  return (
    <>
      <Heading w="100%" textAlign={'center'} fontWeight={'normal'} mb={'2%'}>
      フェイスシートの登録
      </Heading>
      <Box>
        <FormControl mt="2%">
          <FormLabel htmlFor="name" fontWeight={'bold'}>
            氏名
          </FormLabel>
          <Input id="name" placeholder="山田太郎" />
        </FormControl>
        <FormControl mt="2%">
          <FormLabel htmlFor="date-of-birth" fontWeight={'bold'}>
            生年月
          </FormLabel>
          <Input id="date-of-birth" placeholder="yyyy-mm" />
        </FormControl>
        <FormControl mt="2%">
          <FormLabel htmlFor="" fontWeight={'bold'}>
            性別
          </FormLabel>
          <RadioGroup onChange={setValue} value={value}>
          <Stack direction='row'>
            <Radio value='1'>男性</Radio>
            <Radio value='2'>女性</Radio>
            <Radio value='3'>その他</Radio>
          </Stack>
        </RadioGroup>
        </FormControl>
      </Box>
      <FormControl mt="2%">
        <FormLabel htmlFor="" fontWeight={'bold'}>
          聴こえに関してあてはまるものにチェックしてください
        </FormLabel>
        <Stack spacing={5} bg={"gray.100"} padding={'16px'}>
          <Checkbox colorScheme='green' defaultChecked>
            テレビの音が大きいと言われる
          </Checkbox>
          <Checkbox colorScheme='green' defaultChecked>
            会議で相手の発言が聞き取りにくい
          </Checkbox>
          <Checkbox colorScheme='green' defaultChecked>
            聞き間違えることが多い
          </Checkbox>
          <Checkbox colorScheme='green' defaultChecked>
            会話が聞き取れず、聞き返してしまう
          </Checkbox>
          <Checkbox colorScheme='green' defaultChecked>
            病院などで呼ばれても気づかないことがある
          </Checkbox>
          <Checkbox colorScheme='green' defaultChecked>
            後ろから呼ばれても気づかない
          </Checkbox>
        </Stack>
      </FormControl>
    </>
  );
};

export const FaceFormPage = () => {
  // const toast = useToast();
  // const [step, setStep] = useState(1);
  // const [progress, setProgress] = useState(33.33);
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
      <ButtonGroup mt="2%" w="100%">
        <Flex w="100%" justifyContent="space-between">
          <Flex>
            <Button
              onClick={() => {
                // setStep(step - 1);
                // setProgress(progress - 33.33);
                console.log("onClick")
              }}
              // isDisabled={step === 1}
              colorScheme="teal"
              variant="solid"
              w="7rem"
              mr="5%">
              登録
            </Button>
            <Button
              w="7rem"
              // isDisabled={step === 3}
              onClick={() => {
                // setStep(step + 1);
                // if (step === 3) {
                //   setProgress(100);
                // } else {
                //   setProgress(progress + 33.33);
                // }
                console.log("onClick")
              }}
              colorScheme="teal"
              variant="outline">
              戻る
            </Button>
          </Flex>
        </Flex>
      </ButtonGroup>
    </Box>
  );
}