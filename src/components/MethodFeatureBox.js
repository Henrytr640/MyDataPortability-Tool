import { useColorModeValue } from "@chakra-ui/color-mode";
import { Box, Text } from "@chakra-ui/layout";
import { Tag } from "@chakra-ui/tag";


export const MethodFeatureBox = ({ tagText, btnDescription, kbd }) => {
    return (
        <Box
        px={{ base: 2, md: 4 }}
        py={"5"}
        shadow={"xl"}
        border={"1px solid"}
        borderColor={useColorModeValue("gray.800", "gray.500")}
        rounded={"lg"}
        w="full"
        >
        <Tag size="lg"> {tagText}</Tag>
        <Text color={"gray.500"} maxW={"2xl"}>
        {btnDescription}{<br />}
        <span>
         {kbd}
        </span>
        </Text>
        </Box>
        
    );
  };