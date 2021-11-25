import {
  Container,
  SimpleGrid,
  Flex,
  Heading,
  Text,
  Stack,
  StackDivider,
  useColorModeValue,
} from "@chakra-ui/react";
import { Illustration } from "./CallToActionWithIllustration";

const Feature = ({ text, stepNumber }) => {
  return (
    <Stack direction={"row"} align={"center"}>
      <Text fontWeight={600} color={"orange.400"}>
        {`STEP ${stepNumber}:`}
      </Text> 
      <Text fontWeight={600}>{text}</Text>
    </Stack>
  );
};

export default function SplitWithImage() {
  return (
    <Container maxW={"5xl"} >
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        <Stack spacing={4}>
          <Text
            textTransform={"uppercase"}
            color={"blue.400"}
            fontWeight={600}
            fontSize={"sm"}
            bg={useColorModeValue("blue.50", "blue.900")}
            p={2}
            alignSelf={"flex-start"}
            rounded={"md"}
          >
            Instructions
          </Text>
          <Heading>Usage instructions</Heading>
          <Text color={"gray.500"} fontSize={"lg"}>
            The main goal of this tool is to provide user-driven data
            portability, in JSON format.
          </Text>
          <Stack
            spacing={4}
            divider={
              <StackDivider
                borderColor={useColorModeValue("gray.100", "gray.700")}
              />
            }
          >
            <Feature stepNumber="1" text={"Navigate to desired service"} />
            <Feature stepNumber="2" text={"Activate either auto capture or manual capture"} />

          </Stack>
        </Stack>
        <Flex>
          <Illustration
            height={{ sm: "24rem", lg: "28rem" }}
            mt={{ base: 12, sm: 16 }}
          />
        </Flex>
      </SimpleGrid>
    </Container>
  );
}
