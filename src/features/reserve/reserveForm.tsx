import { useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';

import { useNavigate } from 'react-router-dom';

import { firebase } from '../../firebase';
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore';

import { setLocalStorage } from '../../util/localStorage';
import { NavBar } from '../components/navbar';
import { useFetchUserInfo } from '../../hooks/useFetchUserInfo';
import { ROUTE_PATH } from '../../util/routes';

export const ReserveFormPage = () => {
  const userInfo = useFetchUserInfo();

  const [bgn, setBgn] = useState(userInfo.bgn);
  const navigate = useNavigate();
  const { fireStore } = firebase;

  const goBack = () => {
    navigate(ROUTE_PATH.HOME);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBgn(e.target.value);
  };

  const postBgnData = () => {
    if (!bgn) return;
    const docRef = doc(fireStore, 'users', userInfo.userId);
    updateDoc(docRef, {
      bgn: bgn,
      updated_at: serverTimestamp(),
    });
    setLocalStorage('userInfo', JSON.stringify({ ...userInfo, bgn }));
    window.alert('登録しました。');
  };

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
        as="form"
      >
        <Box>
          <Heading
            as="h3"
            fontSize={'24px'}
            w="100%"
            textAlign={'left'}
            fontWeight="bold"
            mb="2%"
          >
            1. 暗騒音レベルの計測
          </Heading>
          <FormControl mt="2%">
            <FormLabel htmlFor="background-noise" fontWeight={'bold'}>
              暗騒音レベル
            </FormLabel>
            <Input
              id="background-noise"
              placeholder="db値 例：32.1"
              defaultValue={bgn}
              onChange={(e) => handleChange(e)}
            />
            <Button
              onClick={() => postBgnData()}
              mt="2%"
              colorScheme="teal"
              variant="solid"
              w="7rem"
              mr="5%"
            >
              登録
            </Button>
          </FormControl>
        </Box>
        <Box mt="2%">
          <Text as="p" fontWeight="bold">
            暗騒音レベルの計測が終わったら，チェックを開始してください。
          </Text>
          <Button
            mt="2%"
            onClick={() => goBack()}
            colorScheme="teal"
            variant="outline"
          >
            聴こえチェックへ
          </Button>
        </Box>
      </Box>
    </>
  );
};
