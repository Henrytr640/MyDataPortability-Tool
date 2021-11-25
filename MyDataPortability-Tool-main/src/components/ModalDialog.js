import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  IconButton,
  Icon,
  Box,
} from "@chakra-ui/react";
import { GrDownload } from "react-icons/gr";
import ReactJson from "react-json-view";
import { downloadObjectAsJson } from "../common/utils";
import EnlargeIcon from "./EnlargeIcon";

const ModalDialog = (props) => {
  const { modalTitle, modalData } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getValidJsonObject = (str) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      return {};
    }
  };
  return (
    <>
      <IconButton
        size="sm"
        aria-label="Enlarge request response"
        icon={<EnlargeIcon />}
        onClick={onOpen}
      />
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        scrollBehavior="inside"
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              bg="white"
              padding="5"
              border={"1px solid"}
              borderColor={"gray.800"}
            >
              <ReactJson
                src={getValidJsonObject(modalData)}
                displayDataTypes={false}
                name={false}
              />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              rightIcon={<Icon as={GrDownload} />}
              onClick={() => downloadObjectAsJson(modalData, modalTitle)}
              variant="outline"
              size="sm"
            >
              Download file
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalDialog;
