import { useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { userInfoAtom } from '../../util/userInfoAtom';
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
import { useNavigate } from "react-router-dom";

import { firebase } from '../../firebase';
import { setDoc, doc } from "firebase/firestore";

export const FaceFormPage = () => {
  const setUserInfo = useSetRecoilState(userInfoAtom)
  const userInfo = useRecoilState(userInfoAtom)

  const [age, setAge] = useState('')
  const [sex, setSex] = useState('')

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ id: e.target.value })
  }

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAge(e.target.value)
  }

  const navigate = useNavigate();
  const { fireStore } = firebase

  const goBack = () => {
    navigate(-1)
  }

  const postUserStatusData = () => {
    setDoc(doc(fireStore, "users", userInfo[0].id), {
      id: userInfo[0].id,
      age,
      sex
    })
  }

  return (
    <Box
      borderWidth="1px"
      rounded="lg"
      shadow="1px 1px 3px rgba(0,0,0,0.3)"
      maxWidth={800}
      p={6}
      m="10px auto"
      as="form">
      <Heading w="100%" textAlign={'center'} fontWeight={'normal'} mb={'2%'}>
      フェイスシートの登録
      </Heading>
      <Box>
        <FormControl mt="2%">
          <FormLabel htmlFor="name" fontWeight={'bold'}>
            ID
          </FormLabel>
          <Input id="name" placeholder="0000" onChange={(e) => handleIdChange(e)} defaultValue={userInfo[0].id}/>
        </FormControl>
        <FormControl mt="2%">
          <FormLabel htmlFor="date-of-birth" fontWeight={'bold'}>
            年齢
          </FormLabel>
          <Input id="date-of-birth" placeholder="20" onChange={(e) => handleAgeChange(e)} defaultValue={age}/>
        </FormControl>
        <FormControl mt="2%">
          <FormLabel htmlFor="" fontWeight={'bold'}>
            性別
          </FormLabel>
          <RadioGroup onChange={setSex} value={sex} defaultValue={sex}>
          <Stack direction='row'>
            <Radio value='男性'>男性</Radio>
            <Radio value='女性'>女性</Radio>
            <Radio value='その他'>その他</Radio>
          </Stack>
        </RadioGroup>
        </FormControl>
      </Box>
      <FormControl mt="2%">
        <FormLabel htmlFor="" fontWeight={'bold'}>
          聴こえに関してあてはまるものにチェックしてください。
        </FormLabel>
        <Stack spacing={5} bg={"gray.100"} padding={'16px'}>
          <Checkbox colorScheme='green' defaultChecked>
            テレビの音が大きいと言われる。
          </Checkbox>
          <Checkbox colorScheme='green' defaultChecked>
            会議で相手の発言が聞き取りにくい。
          </Checkbox>
          <Checkbox colorScheme='green' defaultChecked>
            聞き間違えることが多い。
          </Checkbox>
          <Checkbox colorScheme='green' defaultChecked>
            会話が聞き取れず、聞き返してしまう。
          </Checkbox>
          <Checkbox colorScheme='green' defaultChecked>
            病院などで呼ばれても気づかないことがある。
          </Checkbox>
          <Checkbox colorScheme='green' defaultChecked>
            後ろから呼ばれても気づかない。
          </Checkbox>
        </Stack>
      </FormControl>
      <ButtonGroup mt="2%" w="100%">
        <Flex w="100%" justifyContent="space-between">
          <Flex>
            <Button
              onClick={() => {
                postUserStatusData()
              }}
              colorScheme="teal"
              variant="solid"
              w="7rem"
              mr="5%">
              登録
            </Button>
            <Button
              w="7rem"
              onClick={() => {
                goBack()
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