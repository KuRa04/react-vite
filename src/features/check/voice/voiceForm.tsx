import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { wordVoices } from '../../../util/audio';

import {
  Box,
  ButtonGroup,
  Button,
  Heading,
  Text,
  Flex,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';

import { firebase } from '../../../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { NavBar } from '../../components/navbar';
import { useFetchUserInfo } from '../../../hooks/useFetchUserInfo';

const PLAY_STATUS = {
  UN_PLAYED: 1, // 未再生
  PLAYING: 2, // 再生中
  STOP: 3, // 停止(聞こえていない)
  HEARD: 4, // 聞こえた（音声は停止）
};

export const VoiceFormPage = () => {
  const navigate = useNavigate();
  const [gainState, setGainState] = useState(0);
  const [text, setText] = useState('');
  const [playStatus, setPlayStatus] = useState(1);

  const userInfo = useFetchUserInfo();

  const { fireStore } = firebase;

  const search = useLocation().search;
  const query = new URLSearchParams(search);
  const ear = query.get('ear') || '';

  let randomIndex = Math.floor(Math.random() * wordVoices.length); // 配列のランダムなインデックスを生成
  const initialAudio = new Audio(wordVoices[randomIndex]);
  // 元のアプリが0.01ずつ増加
  initialAudio.volume = 0.01;

  const [selectedItem, setSelectedItem] = useState<string>(
    wordVoices[randomIndex]
  ); // 選択されたアイテムをstateとして保持
  const [lastSelectedItem, setLastSelectedItem] = useState<string>(''); // 前回選択されたアイテムをstateとして保持
  const [audio, setAudio] = useState<HTMLAudioElement | null>(initialAudio);

  const goBack = () => {
    if (!audio) return;
    audio.pause();
    navigate(-1);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const openTextForm = () => {
    if (!audio) return;
    audio.pause();
    while (wordVoices[randomIndex] === lastSelectedItem) {
      // 前回選択されたアイテムと同じ場合は再度ランダムなインデックスを生成
      randomIndex = Math.floor(Math.random() * wordVoices.length);
    }
    setSelectedItem(wordVoices[randomIndex]); // stateにランダムに選択されたアイテムをセット
    setLastSelectedItem(wordVoices[randomIndex]); // 今回選択されたアイテムを前回選択されたアイテムとして保存
    const newAudio = new Audio(selectedItem);
    newAudio.volume = 0;
    setAudio(newAudio);
    setPlayStatus(PLAY_STATUS.HEARD);
  };

  const onPlay = () => {
    if (!audio) return;
    setPlayStatus(PLAY_STATUS.PLAYING);
    audio.play();
  };

  const onPause = () => {
    if (!audio) return;
    setPlayStatus(PLAY_STATUS.STOP);
    audio.pause();
    audio.currentTime = 0;
  };

  const checkVoiceEnded = () => {
    if (!audio) return;
    if (audio.ended && audio.volume <= 0.1) {
      audio.currentTime = 0;
      audio.volume += 0.001;
      setGainState(audio.volume);
      audio.play();
    }
    requestAnimationFrame(checkVoiceEnded);
  };

  checkVoiceEnded();

  const postVoiceData = () => {
    if (!audio) return;

    const collectionPath = collection(
      fireStore,
      'users',
      userInfo.userId,
      'voice'
    );
    addDoc(collectionPath, {
      id: userInfo.userId,
      site: ear,
      appVolume: gainState,
      selectedItem,
      text,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });
    window.alert('登録しました。');
  };

  // 音声チェックをやり直す
  const cancelCheckingVoice = () => {
    setPlayStatus(PLAY_STATUS.UN_PLAYED);
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
            as="h1"
            w="100%"
            textAlign={'left'}
            fontWeight="normal"
            mb="2%"
          >
            {`音声 ${ear}`}
          </Heading>
          <Text as="p">
            チェック開始ボタンをタップして声が聴こえるまで待ってください
          </Text>
          <Text as="p">
            声が聴こえたら聴こえたボタンをタップして，聴こえた言葉を入力してください
          </Text>
        </Box>
        <ButtonGroup mt="2%" w="100%">
          <Flex w="100%" justifyContent="space-between">
            <Flex>
              <Button
                onClick={() => onPlay()}
                isDisabled={[PLAY_STATUS.PLAYING, PLAY_STATUS.HEARD].includes(
                  playStatus
                )}
                colorScheme="teal"
                variant="solid"
                mr="4"
              >
                チェック開始
              </Button>
              <Button
                isDisabled={!(playStatus === PLAY_STATUS.PLAYING)}
                onClick={() => onPause()}
                mr="4"
                colorScheme="teal"
                variant="outline"
              >
                停止
              </Button>
              {!(playStatus === PLAY_STATUS.UN_PLAYED) && (
                <Button
                  onClick={() => openTextForm()}
                  isDisabled={
                    ![PLAY_STATUS.PLAYING, PLAY_STATUS.STOP].includes(
                      playStatus
                    )
                  }
                  colorScheme="teal"
                  variant="solid"
                >
                  聴こえた
                </Button>
              )}
            </Flex>
          </Flex>
        </ButtonGroup>
        {playStatus === PLAY_STATUS.HEARD && (
          <Box>
            <Text mt="4">聞こえた言葉を入力して登録してください。</Text>
            <FormControl mt="2">
              <FormLabel htmlFor="word" fontWeight={'bold'}>
                聴こえた言葉
              </FormLabel>
              <Input
                id="word"
                placeholder="あ"
                onChange={(e) => handleTextChange(e)}
              />
            </FormControl>
            <Button
              mt="4"
              onClick={() => postVoiceData()}
              colorScheme="teal"
              variant="solid"
            >
              登録
            </Button>
            <Button
              mt="4"
              ml="4"
              onClick={() => cancelCheckingVoice()}
              colorScheme="teal"
              variant="outline"
            >
              やり直す
            </Button>
          </Box>
        )}
        <Box mt="4%">
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
    </>
  );
};
