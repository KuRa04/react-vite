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
import { useNavigate } from "react-router-dom";

import { firebase } from '../../firebase';
import { addDoc, collection } from "firebase/firestore";

interface UserStatus  {
  id: string;
  age: string;
  sex: string;
}

export const FaceFormPage = () => {
  const [id, setId] = useState('')
  const [age, setAge] = useState('')
  const [sex, setSex] = useState('')
  const [checkbox, setCheckBox] = useState([''])

  const [userStatus, setUserStatus] = useState<UserStatus>({
    id: '',
    age: '',
    sex: ''
  })

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value)
  }

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAge(e.target.value)
  }

  const handleSexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSex(e.target.value)
  }


  const navigate = useNavigate();
  const { fireStore } = firebase

  const goBack = () => {
    navigate(-1)
  }

  const postUserStatusData = () => {
    // if (!bgnValue) return
    const usersCollectionRef = collection(fireStore, 'users');
    addDoc(usersCollectionRef, {
      id,
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
          <Input id="name" placeholder="0000" onChange={(e) => handleIdChange(e)}/>
        </FormControl>
        <FormControl mt="2%">
          <FormLabel htmlFor="date-of-birth" fontWeight={'bold'}>
            年齢
          </FormLabel>
          <Input id="date-of-birth" placeholder="20" onChange={(e) => handleAgeChange(e)}/>
        </FormControl>
        <FormControl mt="2%">
          <FormLabel htmlFor="" fontWeight={'bold'}>
            性別
          </FormLabel>
          <RadioGroup onChange={setSex} value={sex}>
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