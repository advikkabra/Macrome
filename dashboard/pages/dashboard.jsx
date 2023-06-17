import {
  Flex,
  Stack,
  Text,
  Center,
  Image,
  Container,
  Heading,
  HStack,
  VStack,
  Button,
  SimpleGrid,
  CircularProgress,
  CircularProgressLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import Raect, { useState, useEffect, useDisclosure } from "react";
import { FaFire, FaCamera, FaPowerOff } from "react-icons/fa";
import { useRouter } from "next/router";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Card } from "../components/Card";
import { NavButton } from "../components/NavButton";
import { Progress } from "../components/Progress";
import { Graph } from "../components/Graph";
import { MemberTable } from "../components/MemberTable";
import Head from "next/head";
export default function Dashboard() {
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();
  const [email, setEmail] = useState("");

  const [today, setToday] = useState({});
  const [week, setWeek] = useState([]);
  const [consumptions, setConsumptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [loadingDonation, setLoadingDonation] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (!user) {
        router.push("/login");
      } else {
        fetch("http://localhost:5000/api/dashboard", {
          method: "POST",
          body: JSON.stringify({ email: user.email }),
          headers: { "Content-Type": "application/json" },
        })
          .then((response) => response.json())
          .then((res) => {
            setToday(res.consumption_today);
            setConsumptions(res.consumptions);
            setWeek(res.consumption_week);
          });
        setEmail(user.email);
      }
    });
  }, [auth, router]);

  const onLogout = () => {
    auth
      .signOut()
      .then(() => {
        router.push("/login");
      })
      .catch((error) => {
        // An error happened
        console.log(error.message);
      });
  };

  return (
    <>
      <Head>
        <title>Macrome - Macro Tracking</title>
      </Head>
      <Flex as="section" minH="100vh" bg="gray.50">
        <Flex
          flex="1"
          w="full"
          bg="teal.500"
          maxW={{
            base: "full",
            sm: "xs",
          }}
          py={{
            base: "6",
            sm: "8",
          }}
          px={{
            base: "4",
            sm: "6",
          }}
        >
          <Stack justify="space-between" spacing="1" width="full">
            <Stack spacing="8" shouldWrapChildren>
              <Image src="/logo2.png" alt="Macrome" w="90%" />

              <Stack spacing="1">
                <NavButton
                  onClick={onLogout}
                  label="Log out"
                  icon={FaPowerOff}
                  aria-current="page"
                />
              </Stack>
            </Stack>
          </Stack>
        </Flex>

        <Stack w="full" py="8" px="8" spacing={{ base: "8", lg: "6" }}>
          <Stack
            spacing="4"
            direction={{ base: "column", lg: "row" }}
            justify="space-between"
            align={{ base: "start", lg: "center" }}
          >
            <Stack spacing="1">
              <Heading size="lg" fontWeight="bold">
                Macro Tracking Dashboard
              </Heading>
              <Text color="muted">
                View the nutrients you are consuming, for a healthier future
              </Text>
            </Stack>
          </Stack>
          <Stack spacing={{ base: "5", lg: "6" }}>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap="6">
              <Card minH="xs" p="8">
                <SimpleGrid columns="2" gap="6">
                  <SimpleGrid columns="2" gap="6">
                    <Progress
                      percent={Math.round(today.carbs_percent)}
                      value={Math.round(today.carbs)}
                      target={100}
                      macro={"Carbohydrates"}
                      unit={"g"}
                      color={"#ac9bcc"}
                    />
                    <Progress
                      percent={Math.round(today.protein_percent)}
                      value={Math.round(today.protein)}
                      target={100}
                      macro={"Protein"}
                      unit={"g"}
                      color={"#ecbdbd"}
                    />
                    <Progress
                      percent={Math.round(today.fat_percent)}
                      value={Math.round(today.fat)}
                      target={100}
                      macro={"Fat"}
                      unit={"g"}
                      color={"#e3c6a5"}
                    />
                    <Progress
                      percent={Math.round(today.sodium_percent)}
                      value={Math.round(today.sodium)}
                      target={100}
                      macro={"Sodium"}
                      unit={"mg"}
                      color={"#51a1b0"}
                    />
                  </SimpleGrid>
                  <Progress
                    percent={Math.round(today.calories_percent)}
                    value={Math.round(today.calories)}
                    target={100}
                    macro={"Calories"}
                    unit={""}
                    color={"#8ebfa1"}
                    isBig
                  />
                </SimpleGrid>
              </Card>
              <Card minH="xs" p="6">
                <Heading size="sm" mb="4">
                  Macro percentages over the last week
                </Heading>
                <Graph week={week} />
              </Card>
            </SimpleGrid>
          </Stack>
          <Card minH="sm" p="6">
            <Heading size="md" mb="6">
              Transaction history
            </Heading>
            <MemberTable data={consumptions} />
          </Card>
        </Stack>
      </Flex>
    </>
  );
}
