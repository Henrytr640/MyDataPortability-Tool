import {
  Box,
  Container,
  Divider,
  Heading,
  Kbd,
  Stack,
  Text,
} from "@chakra-ui/layout";
import { ChakraProvider, Icon } from "@chakra-ui/react";
import React from "react";
import PageCard from "../components/PageCard";
import ErrorBoundary from "../common/ErrorBoundary";
import PortabilityToast from "../components/PortabilityToast";
import {
  AUTOMATIC_DATA_PORTABILITY,
  MANUAL_DATA_PORTABILITY,
} from "../common/constants";
import { MethodFeatureBox } from "../components/MethodFeatureBox";
import { IoReturnUpBack } from "react-icons/io5";
import { setWebRequestListener } from "../common/actions";
import { useDispatch } from "react-redux";

/*global browser*/

const SidebarApp = () => {
  const [autoCapture, setAutoCapture] = React.useState(false);
  const dispatch = useDispatch();

  const generateUniqueKey = (manualPortability, strippedString) => {
    if(manualPortability.hasOwnProperty(strippedString)){
      strippedString +=new Date().getUTCMilliseconds().toString();
    }
    return strippedString
  }

  const createJsonPortabilityObject = (innerHTML) => {
    let strippedString = innerHTML.replace(/(<([^>]+)>)/gi, "");
    let manualPortability = localStorage.getItem(MANUAL_DATA_PORTABILITY);
    if (manualPortability) {
      manualPortability = JSON.parse(manualPortability);

      const keys = Object.keys(manualPortability);
      const lastValue = manualPortability[keys[keys.length - 1]];
      if (!lastValue || lastValue.length === 0) {
        manualPortability[keys[keys.length - 1]] = strippedString;
      } else {
        strippedString = generateUniqueKey(manualPortability, strippedString);
        manualPortability[strippedString] = "";
      }
      localStorage.setItem(
        MANUAL_DATA_PORTABILITY,
        JSON.stringify(manualPortability)
      );
    } else {
      if (strippedString.length > 0) {
        const newObj = {
          [strippedString]: "",
        };
        localStorage.setItem(MANUAL_DATA_PORTABILITY, JSON.stringify(newObj));
      }
    }
    window.dispatchEvent(new Event("storage"));
  };

  React.useEffect(() => {
    // configure theRoom
    window.theRoom.configure({
      blockRedirection: true,
      createInspector: true,
      excludes: [],
      click: function (element, event) {
        event.preventDefault();
        console.log("ELEMENTNODENAME", element.nodeName);
        console.log(element);
        if (element.nodeName === "INPUT" && element.value.length < 5000) {
          createJsonPortabilityObject(element.name);
          createJsonPortabilityObject(element.value);
        } else if (
          element.nodeName === "SELECT" &&
          element.value.length < 5000
        ) {
          createJsonPortabilityObject(element.id);
          createJsonPortabilityObject(element.value);
        } else if (element.innerHTML && element.innerHTML.length < 10000) {
          createJsonPortabilityObject(element.innerHTML);
        }
      },
    });
    const autoCapture = localStorage.getItem(AUTOMATIC_DATA_PORTABILITY);

    if (autoCapture != null) {
      const ac = JSON.parse(autoCapture);
      setAutoCapture(ac);
      dispatch(setWebRequestListener(ac));
    }

    // inspector element styles
    var linkElement = document.createElement("link");
    linkElement.setAttribute("rel", "stylesheet");
    linkElement.setAttribute("type", "text/css");
    linkElement.setAttribute(
      "href",
      "data:text/css;charset=UTF-8," +
        encodeURIComponent(
          ".inspector-element { z-index: 9999999999; position: absolute; pointer-events: none; border: 2px solid tomato; transition: all 200ms; background-color: rgba(180, 187, 105, 0.2); }"
        )
    );
    document.head.appendChild(linkElement);

    browser.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
      if (msg.text === "theroom") {
        if (window.theRoom.status() === "running") {
          window.theRoom.stop();
        } else {
          window.theRoom.start();
        }
      }
    });
  }, []);

  return (
    <React.Fragment>
      <ChakraProvider>
        <Box>
          <ErrorBoundary>
            <Container>
              {!autoCapture && (
                <Stack
                  textAlign={"center"}
                  align={"center"}
                  spacing={{ base: 8, md: 10 }}
                  py={{ base: 20 }}
                >
                  <Heading
                    fontWeight={600}
                    fontSize={{ base: "3xl" }}
                    lineHeight={"110%"}
                  >
                    My{""}
                    <Text as={"span"} color={"orange.400"}>
                      Dataportability
                    </Text>
                  </Heading>

                  <Text color={"gray.500"} maxW={"2xl"}>
                    User-driven dataportability tool, get in control of your
                    data.
                  </Text>
                  <Box w="full">
                    <MethodFeatureBox
                      tagText="Method 1"
                      btnDescription="Activate manual data extraction"
                      kbd={
                        <>
                          <PortabilityToast />
                        </>
                      }
                    />
                  </Box>

                  <Divider />

                  <Box
                    onClick={() => setAutoCapture(true)}
                    cursor="pointer"
                    w="full"
                  >
                    <MethodFeatureBox
                      tagText="Method 2"
                      btnDescription="Automatic data extraction (may not always work)"
                      kbd={<Kbd>Click here to activate</Kbd>}
                    />
                  </Box>
                </Stack>
              )}
              {autoCapture && (
                <>
                  <Box cursor="pointer" onClick={() => setAutoCapture(false)}>
                    <Icon as={IoReturnUpBack} w={8} h={8} />
                    <Text color={"gray.500"} maxW={"2xl"}>
                      Go back
                    </Text>
                  </Box>
                  <PageCard id="sidebarPageCard" />
                </>
              )}
            </Container>
          </ErrorBoundary>
        </Box>
      </ChakraProvider>
    </React.Fragment>
  );
};

export default SidebarApp;
