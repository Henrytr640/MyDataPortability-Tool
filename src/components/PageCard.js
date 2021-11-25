import React, { useState, useEffect } from "react";
import {
  chakra,
  Box,
  Flex,
  useColorModeValue,
  VStack,
  FormControl,
  FormLabel,
  Switch,
  useToast,
} from "@chakra-ui/react";
import { setWebRequestListener } from "../common/actions";
import { useSelector, useDispatch } from "react-redux";
import FileCard from "./FileCard";
import { AUTOMATIC_DATA_PORTABILITY } from "../common/constants";

const PageCard = () => {
  const dispatch = useDispatch();
  const webRequestListener = useSelector(
    (state) => state.rootReducer?.webRequestListener
  );
  const webRequestFiles = useSelector(
    (state) => state.rootReducer?.webRequestFiles
  );
  const currentTab = useSelector((state) => state.rootReducer?.currentTab);
  const [CurrentHost, setCurrentHost] = useState("Loading...");
  const [CurrentTab, setCurrentTab] = useState(currentTab);
  const [CurrentRequestFilesCount, setCurrentRequestFilesCount] = useState(0);
  const [WebRequestListener, setwebRequestListener] =
    useState(webRequestListener);

  const toast = useToast();
  const id = "notification-toast";

  useEffect(() => {
    if (
      !toast.isActive(id) &&
      webRequestFiles?.filter(
        (f) =>
          f.requestTabId === currentTab.id &&
          f.requestSourceUrl === new URL(currentTab.url).hostname
      ).length > CurrentRequestFilesCount
    ) {
      toast({
        id,
        title: "Captured data",
        description: "Open sidebar on the right side to download.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setCurrentRequestFilesCount(
        webRequestFiles?.filter(
          (f) =>
            f.requestTabId === currentTab.id &&
            f.requestSourceUrl === new URL(currentTab.url).hostname
        ).length
      );
    }
  }, [webRequestFiles]);

  useEffect(() => {
    setwebRequestListener(webRequestListener);
    if (currentTab) {
      setCurrentTab(currentTab);
      setCurrentHost(new URL(currentTab.url).host);
    }
  }, [webRequestListener, currentTab]);
  const listItems = webRequestFiles
    ?.filter(
      (f) =>
        f.requestTabId === currentTab.id &&
        f.requestSourceUrl === new URL(currentTab.url).hostname
    ).reverse().map((f, i) => <FileCard fileResponse={f} key={i} />);

  const SetWebRequestLitener = (enabled) => {
    dispatch(setWebRequestListener(enabled));
    setwebRequestListener(enabled);
    localStorage.setItem(AUTOMATIC_DATA_PORTABILITY, JSON.stringify(enabled));
    window.location.reload();
  };

  return (
    <Flex p={50} w="full" alignItems="center" justifyContent="center" h="full">
      <VStack>
        <Flex maxW="md" mx="auto" shadow="lg" rounded="lg" minW="400">
          <Box
            w={1 / 3}
            bgSize="cover"
            style={{
              backgroundImage: `url(${CurrentTab?.favIconUrl})`,
            }}
          ></Box>

          <Box w={2 / 3} p={{ base: 4, md: 4 }} minW="250">
            <chakra.h1
              fontSize="2xl"
              fontWeight="bold"
              color={useColorModeValue("gray.800", "white")}
              textAlign="left"
            >
              {CurrentHost}
            </chakra.h1>

            <chakra.p
              mt={2}
              fontSize="sm"
              color={useColorModeValue("gray.600", "gray.400")}
              textAlign="left"
            >
              Upon activation, navigate throughout the website to automatically
              capture data.
            </chakra.p>
            <Flex mt={3} alignItems="center" justifyContent="space-between">
              <FormControl
                display="flex"
                alignItems="center"
                w="full"
                justifyContent="space-between"
              >
                <FormLabel
                  htmlFor="capture-data"
                  mb="0"
                  bg="white"
                  fontSize="xs"
                  color="gray.900"
                  fontWeight="bold"
                  rounded="lg"
                  textTransform="uppercase"
                >
                  ENABLE DATA CAPTURE
                </FormLabel>
                <Switch
                  id="capture-data"
                  isChecked={WebRequestListener}
                  onChange={() => SetWebRequestLitener(!WebRequestListener)}
                  colorScheme="teal"
                />
              </FormControl>
            </Flex>
          </Box>
        </Flex>
        {listItems && (
          <Box overflowY="auto" overflowX="hidden" maxH="1000px">
            {listItems}
          </Box>
        )}
      </VStack>
    </Flex>
  );
};

export default PageCard;
