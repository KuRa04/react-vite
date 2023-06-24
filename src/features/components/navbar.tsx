import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  HStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '../../util/routes';

export const NavBar = () => {
  const navigate = useNavigate();

  return (
    <Box as="section" pb={{ base: '12' }}>
      <Box as="nav" bg="bg.surface" boxShadow="sm">
        <Container py={{ base: '4', lg: '5' }}>
          <HStack spacing="10" justify="space-between">
            <Flex justify="space-between" flex="1">
              <ButtonGroup variant="text" colorScheme="gray" spacing="4">
                <Button onClick={() => navigate(ROUTE_PATH.HOME)}>
                  ホーム
                </Button>
                <Button onClick={() => navigate(ROUTE_PATH.FACE)}>
                  フェイスシート
                </Button>
                <Button onClick={() => navigate(ROUTE_PATH.RESERVE)}>
                  準備
                </Button>
                <Button onClick={() => navigate(ROUTE_PATH.PURETONE)}>
                  純音
                </Button>
                <Button onClick={() => navigate(ROUTE_PATH.VOICE)}>音声</Button>
                <Button onClick={() => navigate(ROUTE_PATH.HISTORY)}>
                  履歴
                </Button>
              </ButtonGroup>
            </Flex>
          </HStack>
        </Container>
      </Box>
    </Box>
  );
};
