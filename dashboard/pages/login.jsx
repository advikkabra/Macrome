import {
  Button,
  Checkbox,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  Image,
  useBreakpointValue,
  Center,
  Box,
  Divider,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

import {
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  browserLocalPersistence,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/router";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import Head from "next/head";

export default function App() {
  const db = getFirestore();
  const router = useRouter();
  const auth = getAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user && !loading) {
        router.push("/dashboard");
      }
    });
  }, []);

  const onLogin = () => {
    setLoading(true);
    setErrorMessage("");
    setPersistence(auth, browserLocalPersistence).then(() => {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          setLoading(false);

          const user = userCredential.user;

          // ...
        })
        .catch((error) => {
          setLoading(false);
          const errorCode = error.code;
          setErrorMessage(error.message);
          // ..
        });
    });
  };

  return (
    <>
      <Head>
        <title>Macrome - Macro Tracking</title>
      </Head>
      <Container
        maxW="md"
        py={{
          base: "12",
          md: "24",
        }}
      >
        <Stack spacing="8">
          <Stack spacing="6">
            <Center mb={3}>
              <Image src="/logo.png" w="40%" h="40%" />
            </Center>
            <Stack
              spacing={{
                base: "2",
                md: "3",
              }}
              textAlign="center"
            >
              <Heading size={"lg"}>Log in to your account</Heading>
              <Text color="gray.600">
                Start making climate conscious purchases today
              </Text>
            </Stack>
          </Stack>
          <Stack spacing="6">
            <Stack spacing="5">
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  type="email"
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  type="password"
                />
              </FormControl>
            </Stack>

            <Stack spacing="4">
              <Button
                onClick={onLogin}
                disabled={loading || email.length == 0 || password.length == 0}
                colorScheme="teal"
              >
                {loading ? "Loading..." : "Sign in"}
              </Button>
              <Text fontSize="sm" color="red.500">
                {errorMessage}
              </Text>
            </Stack>
          </Stack>
          <HStack justify="space-between">
            <HStack spacing="1" justify="center">
              <Text fontSize="sm" color="muted">
                Don&apos;t have an account?
              </Text>
              <Button
                variant="link"
                as="a"
                href="/signup"
                colorScheme="teal"
                size="sm"
              >
                Sign up
              </Button>
            </HStack>
            <Button
              variant="link"
              colorScheme="teal"
              size="sm"
              as="a"
              href="/forgotpassword"
            >
              Forgot password
            </Button>
          </HStack>
        </Stack>
      </Container>
    </>
  );
}
