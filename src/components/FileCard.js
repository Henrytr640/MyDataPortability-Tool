import React from "react";
import {
  chakra,
  Box,
  Flex,
  useColorModeValue,
  Button,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { CodeBlock } from "@atlaskit/code";
import ModalDialog from "./ModalDialog";
import { downloadObjectAsJson } from "../common/utils";
import { GrDownload, GrTrash } from "react-icons/gr";
import { useDispatch } from "react-redux";
import { deleteWebRequestResponse } from "../common/actions";



const FileCard = (fileResponse) => {
  const { requestData, requestFile, id } = fileResponse.fileResponse;
  const dispatch = useDispatch();
  
  return (
    <Flex p={5} maxW="355px" alignItems="center" justifyContent="center">
      <Box
        maxW="355px"
        w="full"
        mx="auto"
        px={2}
        py={1}
        shadow="md"
        rounded="md"
      >
        <Flex justifyContent="space-between" alignItems="center">
          <chakra.span
            px={3}
            py={1}
            rounded="full"
            textTransform="uppercase"
            fontSize="xs"
          >
            {requestFile}
          </chakra.span>
          <chakra.span
            fontSize="sm"
            color={useColorModeValue("gray.800", "gray.400")}
            m="2"
          >
            <ModalDialog modalData={requestData} modalTitle={requestFile} />
          </chakra.span>
        </Flex>

        <Box>
          <chakra.h1
            fontSize="lg"
            fontWeight="bold"
            color={useColorModeValue("gray.800", "white")}
          ></chakra.h1>
          <CodeBlock
            language="json"
            showLineNumbers={false}
            text={requestData}
          />
        </Box>
        <Flex justifyContent="space-between" alignItems="center">
          <Box textAlign="left" m="2">
            <IconButton
              variant="outline"
              size="sm"
              aria-label="Delete web request response"
              icon={<GrTrash color="red.500" />}
              onClick={() => dispatch(deleteWebRequestResponse(id))}
            />
          </Box>
          <Box textAlign="right" m="2">
            <Button
              rightIcon={<Icon as={GrDownload} />}
              onClick={() => downloadObjectAsJson(requestData, requestFile)}
              variant="outline"
              size="sm"
            >
              Download file
            </Button>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};

export default FileCard;
