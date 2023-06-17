import {
  CircularProgress,
  CircularProgressLabel,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import * as React from "react";

export const Progress = (props) => (
  <VStack>
    <Heading mb="1" size={props.isBig ? "md" : "xs"}>
      {props.macro}
    </Heading>
    <CircularProgress
      color={props.color}
      value={props.percent}
      max={props.target}
      size="full"
    >
      <CircularProgressLabel>
        <Heading size={props.isBig ? "3xl" : "lg"}>
          {Math.round(props.value)}
          <span style={{ fontSize: props.isBig ? "24pt" : "14pt" }}>
            {" "}
            {props.unit}
          </span>
        </Heading>
      </CircularProgressLabel>
    </CircularProgress>
  </VStack>
);

