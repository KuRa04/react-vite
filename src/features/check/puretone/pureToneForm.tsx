import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  Box,
  ButtonGroup,
  Button,
  Heading,
  Text,
  Flex,
  Progress,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { firebase } from '../../../firebase';
import {
  addDoc,
  serverTimestamp,
  getDoc,
  collection,
} from 'firebase/firestore';
import { frequencies } from '../../../util/commonItem';
import {
  gainStates,
  translateEarToEnglish,
  switchPan,
} from '../../../util/commonItem';

// 換算表で利用
import { frequencyDataSet } from '../../../util/frequencyDataSets/frequencyDataSet';

import { ROUTE_PATH } from '../../../util/routes';
import { NavBar } from '../../components/navbar';
import { useFetchUserInfo } from '../../../hooks/useFetchUserInfo';

type frequencyDataType = {
  frequency: number;
  isHeard: boolean;
  volume: number;
};

export const PureToneFormPage = () => {
  const { fireStore } = firebase;
  const search = useLocation().search;
  const navigate = useNavigate();

  const query = new URLSearchParams(search);
  const ear = query.get('ear') || '';

  const userInfo = useFetchUserInfo();
  const [checkingDialogData, setCheckingDialogData] = useState<{
    isOpen: boolean;
    frequency: number;
    isHeard: boolean;
    volume: number;
  }>({
    isOpen: false,
    frequency: -1,
    isHeard: false,
    volume: 0,
  });

  const [frequenciesData, setFrequenciesData] = useState<frequencyDataType[]>(
    []
  );
  useEffect(() => {
    const frequenciesInfo = Object.values(frequencies).map((frequency) => ({
      frequency,
      isHeard: false,
      volume: 0,
    }));
    setFrequenciesData(frequenciesInfo);
  }, [ear]);

  const countUp = () => {
    if (checkingDialogData.volume >= gainStates.length - 1) return;
    onStop();
    setCheckingDialogData((prev) => ({ ...prev, volume: prev.volume + 1 }));
  };

  const countDown = () => {
    if (checkingDialogData.volume <= 0) return;
    onStop();
    setCheckingDialogData((prev) => ({ ...prev, volume: prev.volume - 1 }));
  };

  let oscillator: OscillatorNode | null = null;

  const onPlay = (frequencyData: frequencyDataType) => {
    const context = new AudioContext();
    const stereoPannerNode = context.createStereoPanner();
    oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = Number(frequencyData.frequency); // ここを変えればいけそう

    const gainNode = context.createGain();

    gainNode.gain.value = 0;
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      gainStates[frequencyData.volume],
      context.currentTime + 0.1
    );

    stereoPannerNode.pan.value = switchPan(ear);
    oscillator.connect(stereoPannerNode);
    stereoPannerNode.connect(gainNode);
    gainNode.connect(context.destination);

    if (!oscillator) return;
    oscillator.start(0);
  };

  const onStop = () => {
    oscillator?.stop();
    oscillator = null;
  };

  const goBack = () => {
    onStop();
    navigate(-1);
  };

  const postPuretoneData = async () => {
    const puretoneDocRef = collection(
      fireStore,
      'users',
      userInfo.userId,
      'puretone'
    );
    const puretoneData = frequenciesData.reduce((prev, data) => {
      const selectGainState = gainStates[data.volume].toString();
      const currentData = {
        [data.frequency]: data.isHeard
          ? frequencyDataSet[data.frequency][selectGainState]
          : 0,
      };
      return { ...prev, ...currentData };
    }, {});

    await addDoc(puretoneDocRef, {
      ear: translateEarToEnglish(ear),
      puretoneData,
      created_at: serverTimestamp(),
    });

    window.alert('登録しました。');
    navigate(ROUTE_PATH.PURETONE);
  };

  const openCheckingModal = (frequencyData: frequencyDataType) => {
    onPlay(frequencyData);
    setCheckingDialogData({
      frequency: frequencyData.frequency,
      isOpen: true,
      isHeard: frequencyData.isHeard,
      volume: frequencyData.volume,
    });
  };

  const closeCheckingDialog = () => {
    setCheckingDialogData({
      frequency: -1,
      isOpen: false,
      isHeard: false,
      volume: 0,
    });
  };

  useEffect(() => {
    if (oscillator) {
      onStop();
    }
    onPlay(checkingDialogData);
  }, [checkingDialogData.volume]);

  /**
   * 聞こえチェックの値の更新
   * @param {React.ChangeEvent<HTMLInputElement>} e
   * @param {*} data
   */
  const updateChecked = (
    e: React.ChangeEvent<HTMLInputElement>,
    data: frequencyDataType | undefined
  ) => {
    if (!data) return;
    setFrequenciesData((prevData) =>
      prevData.map((prev) =>
        prev.frequency === data.frequency
          ? {
              frequency: data.frequency,
              isHeard: !data.isHeard,
              volume: data.volume,
            }
          : prev
      )
    );

    // ダイアログのデータも同時に変更する
    setCheckingDialogData((prev) => ({ ...prev, isHeard: !prev.isHeard }));
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
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th width="30%">周波数</Th>
                <Th></Th>
                <Th>聞こえチェック</Th>
              </Tr>
            </Thead>
            <Tbody>
              {frequenciesData.map((data, index) => {
                return (
                  <Tr key={index}>
                    <Td>
                      <Text color={'blue.400'}>{data.frequency}Hz</Text>
                    </Td>
                    <Td onClick={() => openCheckingModal(data)}>
                      <Button>検査開始</Button>
                    </Td>
                    <Td>
                      <Checkbox
                        isChecked={data.isHeard}
                        onChange={(e) => updateChecked(e, data)}
                      ></Checkbox>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
        <Box mt="2%">
          <Button zIndex={99999} onClick={() => postPuretoneData()}>
            以上の内容で登録
          </Button>
        </Box>
        <Box mt="2%">
          <Button
            mt="2%"
            onClick={() => goBack()}
            colorScheme="teal"
            variant="outline"
          >
            戻る
          </Button>
        </Box>
      </Box>
      <Modal
        closeOnOverlayClick={false}
        size="3xl"
        isOpen={Boolean(checkingDialogData.isOpen)}
        onClose={() =>
          setCheckingDialogData({
            frequency: -1,
            isOpen: false,
            isHeard: false,
            volume: 0,
          })
        }
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {`純音 ${checkingDialogData.frequency}Hz ${ear}の検査`}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{checkingDialogData.frequency}</Text>
            <Box>
              <Heading
                as="h1"
                w="100%"
                textAlign={'left'}
                fontWeight="normal"
                mb="2%"
              ></Heading>
              <Text as="p">
                チェック開始ボタンをタップして音が鳴るまで待ってください。
              </Text>
              <Text as="p">
                音が聴こえたら聴こえたボタンをタップしてください。
              </Text>
            </Box>
            <Progress
              value={checkingDialogData.volume}
              max={gainStates.length - 1}
            />
            <ButtonGroup mt="2%" w="100%">
              <Flex w="100%">
                <Button
                  onClick={() => countDown()}
                  colorScheme="blue"
                  variant="solid"
                  mr="4"
                  disabled={checkingDialogData.volume === 0}
                >
                  音量を下げる
                </Button>
                <Button
                  onClick={() => countUp()}
                  mr="4"
                  colorScheme="red"
                  variant="solid"
                >
                  音量を上げる
                </Button>
                <Box>
                  <Text>聞こえチェック</Text>
                  <Checkbox
                    isChecked={checkingDialogData.isHeard}
                    onChange={(e) => {
                      updateChecked(e, checkingDialogData);
                      onStop();
                    }}
                  ></Checkbox>
                </Box>
              </Flex>
            </ButtonGroup>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                closeCheckingDialog();
                onStop();
              }}
            >
              閉じる
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
