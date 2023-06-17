/*global chrome*/

import "./App.css";
import {
  Container,
  CircularProgress,
  CircularProgressLabel,
  HStack,
  Text,
  Heading,
  Center,
  Link,
  VStack,
  Image,
  Button,
  Input,
  Box,
  Spinner,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { GoogleIcon } from "./ProviderIcons";
import {
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  browserLocalPersistence,
} from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);
function App(props) {
  const auth = getAuth();
  const db = props.db;
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const [target, setTarget] = useState(2000);
  const [calories, setCalories] = useState(0);
  const [added, setAdded] = useState(0);

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        setLoggedIn(true);
        chrome.storage.local.set({ email: user.email }, () => {});

        fetch("http://localhost:5000/api/dashboard", {
          method: "POST",
          body: JSON.stringify({ email: user.email }),
          headers: { "Content-Type": "application/json" },
        })
          .then((res) => res.json())
          .then((res) =>
            setCalories((calories) => calories + res.consumption_today.calories)
          );
      }
      setLoading(false);
    });
  }, [auth, db]);

  useEffect(() => {
    let em;
    chrome.storage.local.get(["calories"], (val) => {
      if (val !== undefined) {
        em = val.calories;
        if (em !== undefined) {
          setAdded(em);
        }
      }
    });
    console.log(calories, added, target);
  });

  const onLogin = () => {
    setLoginLoading(true);

    setErrorMessage("");
    setPersistence(auth, browserLocalPersistence).then(() => {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          setLoggedIn(true);
          setLoginLoading(false);
          setEmail("");
          setPassword("");
          setErrorMessage("");
          const user = userCredential.user;

          // ...
        })
        .catch((error) => {
          setLoginLoading(false);
          const errorCode = error.code;
          setErrorMessage(error.message);
          // ..
        });
    });
  };

  const onLogout = () => {
    auth
      .signOut()
      .then(() => {
        setLoggedIn(false);
      })
      .catch((error) => {
        // An error happened
        console.log(error.message);
      });
  };

  const onSave = () => {
    let payload = {};
    chrome.storage.local.get(["recipe", "email"], (val) => {
      payload = val.recipe;
      payload["email"] = val.email;
      fetch("http://localhost:5000/api/direct", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      }).then(setConfirmed(true));
    });
  };

  return (
    <>
      {loading && (
        <Center pt={2} pb="4" mt="12">
          <Spinner
            thickness="3px"
            speed="0.65s"
            emptyColor="gray.200"
            color="teal.500"
          />
        </Center>
      )}
      {!loading && loggedIn && (
        <>
          <Center pt={2} pb="4" mt="12">
            <Image h="7" objectFit="cover" src="./logo.png" alt="Macrome" />
          </Center>
          <VStack pt={2} mb="4">
            <Text
              style={{ marginTop: "55px", position: "absolute" }}
              fontWeight="bold"
              fontSize={"4xl"}
            >
              {calories}
            </Text>

            <Box w="150px">
              <Doughnut
                options={{
                  responsive: true,
                  plugins: {
                    tooltip: { enabled: false },
                    legend: { display: false },
                  },
                  cutout: "80%",
                }}
                data={{
                  labels: ["", "", ""],
                  datasets: [
                    {
                      label: "# of Votes",
                      data:
                        calories + added >= target
                          ? [0, target, 0]
                          : [calories, added, target - calories - added],
                      backgroundColor: ["#38B2AC", "#F56565", "#EDF2F7"],
                      hoverBackgroundColor: ["#38B2AC", "#F56565", "#EDF2F7"],
                      borderWidth: 0,
                    },
                  ],
                }}
              />
            </Box>

            <Heading fontSize="xl">Calories Today</Heading>
            {calories + added >= target && (
              <Text color="red.500" fontWeight="medium" fontSize="lg">
                Limit exceeded
              </Text>
            )}
            {added > 0 && (
              <Text color="red.500" fontWeight="medium" fontSize="lg">
                +{added} calories from consumption
              </Text>
            )}
          </VStack>
          <Center pt={2}>
            <HStack mb="16">
              <Button size="sm">Visit dashboard</Button>
              <Button size="sm" onClick={onSave}>
                Save Recipe
              </Button>
              <Button
                size="sm"
                colorScheme="teal"
                variant="outline"
                onClick={onLogout}
              >
                Log out
              </Button>
            </HStack>
          </Center>
          {confirmed && <Text color="green.400">Saved!</Text>}
        </>
      )}
      {!loading && !loggedIn && (
        <>
          <Center pt={2} pb="4" mt="12">
            <Image h="7" objectFit="cover" src="./logo.png" alt="Shunya" />
          </Center>
          <VStack pt="4" mb="4">
            <Text fontWeight="bold" fontSize={"xl"}>
              Log in to your account
            </Text>
          </VStack>
          <Center pt={2}>
            <VStack mb="16">
              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="sm"
              />
              <Input
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                size="sm"
              />
              <Button
                size="sm"
                loadingText="Loading"
                isLoading={loginLoading}
                onClick={onLogin}
                w="full"
              >
                Log in
              </Button>
              <Box pt="2">
                <Text fontSize="sm">
                  Don't have an account?{" "}
                  <Link color="teal.500" href="#">
                    Sign up
                  </Link>{" "}
                </Text>
              </Box>
              <Box pt="2">
                <Text fontSize="sm" color="red.500">
                  {errorMessage}
                </Text>
              </Box>
            </VStack>
          </Center>
        </>
      )}
    </>
  );
}

export default App;
