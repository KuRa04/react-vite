import { Box, ListItem, OrderedList } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <>
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        maxWidth={800}
        p={6}
        m="10px auto"
        as="form"
      >
      <h1>Vite + React ({import.meta.env.MODE})</h1>  
        <Box>
          <OrderedList color={'blue.400'}>
            <ListItem>
              <Link to="/face">フェイスシートの登録・確認</Link>
            </ListItem>
            <ListItem>
              <Link to="/reserve">準備</Link>
            </ListItem>
            <ListItem>
              <Link to="/check/pure_tone">聞こえチェック 純音</Link>
            </ListItem>
            <ListItem>
              <Link to="/check/voice">聞こえチェック 音声</Link>
            </ListItem>
            <ListItem>
              <Link to="/history">聞こえチェック 履歴</Link>
            </ListItem>
            <ListItem>
              <Link to="/experiment/pure_tone">
                （実験用）音圧の増加量チェック 純音
              </Link>
            </ListItem>
          </OrderedList>
        </Box>
      </Box>
    </>
  );
};
