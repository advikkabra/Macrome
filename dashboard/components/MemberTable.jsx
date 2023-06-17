import {
  Avatar,
  Badge,
  Box,
  Checkbox,
  HStack,
  Icon,
  IconButton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import * as React from "react";

import { IoArrowDown } from "react-icons/io5";

export const MemberTable = (props) => (
  <Table {...props}>
    <Thead>
      <Tr>
        <Th>Date</Th>
        <Th>Description</Th>
        <Th>Calories</Th>
        <Th>Protein</Th>
        <Th>Carbohydrates</Th>
        <Th>Fat</Th>
        <Th>Sodium</Th>
      </Tr>
    </Thead>
    <Tbody>
      {props.data.map((member) => (
        <Tr key={crypto.randomUUID()}>
          <Td>
            <Badge size="sm" colorScheme={"blue"}>
              {member.date}/{member.month}/{member.year}
            </Badge>
          </Td>
          <Td>
            <Text color="muted">{member.name}</Text>
          </Td>
          <Td>
            <Badge size="sm" colorScheme={"green"}>
              {member.calories}
            </Badge>
          </Td>
          <Td>
            <Badge size="sm" colorScheme={"red"}>
              {member.protein} g
            </Badge>
          </Td>
          <Td>
            <Badge size="sm" colorScheme={"purple"}>
              {member.carbs} g
            </Badge>
          </Td>
          <Td>
            <Badge size="sm" colorScheme={"orange"}>
              {member.fat} g
            </Badge>
          </Td>
          <Td>
            <Badge size="sm" colorScheme={"cyan"}>
              {member.sodium} mg
            </Badge>
          </Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
);
