import React from 'react';
import { useState } from 'react';
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  Box,
  Link,
  Avatar,
  FormControl,
} from '@chakra-ui/react';
import { firebase } from '../../firebase';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

export const SignUpPage: React.FC = () => {
  const auth = getAuth(firebase.app);
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  const createUserData = async () => {
    const userCollection = collection(firebase.fireStore, "users");
    console.log(userCollection)
    const newUser = { email: email, password: password };

    try {
      const docRef = await addDoc(userCollection, newUser);
      console.log(docRef.id)
    } catch (e) {
      console.log(e)
    }
  }

  const handleSubmit = async () => {
    // e.preventDefault()
    console.log(`Logged in as ${email}`);
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user
        createUserData()
        console.log(`Logged in as ${user.email}`);
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      console.error(`Login failed with error ${errorCode}: ${errorMessage}`)
    })
  };

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      backgroundColor="gray.200"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar bg="teal.500" />
        <Heading color="teal.400">Welcome</Heading>
        <Box minW={{ base: '90%', md: '468px' }}>
          <Stack
            spacing={4}
            p="1rem"
            backgroundColor="whiteAlpha.900"
            boxShadow="md"
          >
            <FormControl>
              <InputGroup>
                <Input
                  type="email"
                  placeholder="email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <InputGroup>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </InputGroup>
            </FormControl>
            <Button
              borderRadius={0}
              type="submit"
              variant="solid"
              colorScheme="teal"
              width="full"
              onClick={handleSubmit}
            >
              SignUp
            </Button>
          </Stack>
        </Box>
      </Stack>
      <Box>
        New to us?{' '}
        <Link color="teal.500" href="#">
          Sign Up
        </Link>
      </Box>
    </Flex>
  );
};