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
  Link,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
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
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user && !loading) {
        router.push("/dashboard");
      }
    });
  }, []);

  const onSignup = () => {
    setLoading(true);
    setSuccess(false);
    setErrorMessage("");
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        setLoading(false);
        setSuccess(true);
        const user = userCredential.user;
        const current = new Date();
        addDoc(collection(db, "users"), {
          email: email,
          joined: current.toISOString(),
          points: { alphabets: 0, numbers: 0 },
          lastQuiz: { alphabets: 0, numbers: 0 },
        })
          .then(() => {
            console.log("success");
          })
          .catch((error) => {
            console.log("error adding");
            console.log(error);
          });
        // ...
      })
      .catch((error) => {
        setLoading(false);
        const errorCode = error.code;
        setErrorMessage(error.message);
        // ..
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
              <Heading size={"lg"}>Sign up to get started</Heading>
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
              <FormControl>
                <FormLabel htmlFor="password">Confirm Password</FormLabel>
                <Input
                  id="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="********"
                  type="password"
                />
              </FormControl>
            </Stack>

            <Stack spacing="4">
              <Button
                colorScheme="teal"
                onClick={onSignup}
                disabled={
                  loading ||
                  email.length == 0 ||
                  password.length == 0 ||
                  confirm !== password
                }
              >
                {loading ? "Loading..." : "Sign up"}
              </Button>
              {password.length > 0 &&
                confirm.length > 0 &&
                password !== confirm && (
                  <Text fontSize="sm" color="red.500">
                    Passwords must match.
                  </Text>
                )}
              <Text fontSize="sm" color="red.500">
                {errorMessage}
              </Text>

              {success && (
                <Text fontSize="sm" color="green.500">
                  Your account was created successfully. Log in to get started.
                </Text>
              )}
            </Stack>
          </Stack>
          <HStack spacing="1" justify="center">
            <Text fontSize="sm" color="muted">
              Already have an account?
            </Text>
            <Button
              variant="link"
              as="a"
              href="/login"
              colorScheme="teal"
              size="sm"
            >
              Log in
            </Button>
          </HStack>
        </Stack>
      </Container>
    </>
  );
}

