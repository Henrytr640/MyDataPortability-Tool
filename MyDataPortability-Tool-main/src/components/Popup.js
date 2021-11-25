import { useColorModeValue } from "@chakra-ui/color-mode";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Container,
  Divider,
  Flex,
  Heading,
  Link,
  List,
  ListItem,
  Text,
} from "@chakra-ui/layout";
import { Switch } from "@chakra-ui/switch";
import React from "react";
/*global browser*/
function Popup() {
  const [enableOnThisPage, setEnableOnThisPage] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState("");

  React.useEffect(() => {
    browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var tab = tabs[0];
      var url = new URL(tab.url);
      var domain = url.hostname;
      setCurrentPage(domain);
      browser.storage.local.get([domain], function (data) {
        if (data !== null && Object.keys(data).length !== 0) {
          enableExtension(Object.values(data)[0], true);
        }
      });
      });
  }, []);

  const onExecuteScriptError = () => {   
    setEnableOnThisPage(false)
    browser.notifications.create("MyDataPortability-ErrorNotification", {
      "type": "basic",
      "iconUrl": browser.runtime.getURL("img/icon-48.png"),
      "title": "MyDataPortability - Error",
      "message": "Due to a lack of permission from this website, the tool is not able to extract any data from this site."
    });
  }


  const enableExtension = async (enableOnThisPage, fromReactEffect) => {
    browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var tab = tabs[0];
      var url = new URL(tab.url);
      var domain = url.hostname;
      browser.storage.local.set({ [domain]: enableOnThisPage });
    });

    setEnableOnThisPage(enableOnThisPage);

    if (enableOnThisPage) {
      var tabs = await browser.tabs.query({currentWindow: true, active: true});
      var activeTab = tabs[0];
      browser.tabs.sendMessage(
        activeTab.id,
        { text: "isContentScriptActive?" },
        function (msg) {
          msg = msg || {};
          if (msg.status !== "yes" && !fromReactEffect) {
            browser.tabs.executeScript({ file: "contentScript.bundle.js" }).then(null, onExecuteScriptError);
            setTimeout(function(){ window.close() }, 500);
          } else if(msg.status !== "yes" && fromReactEffect){
            browser.tabs.executeScript({ file: "contentScript.bundle.js" }).then(null, onExecuteScriptError);
          }
        }
      );
    } else {
      browser.tabs.executeScript({
        code: `localStorage.setItem("AUTOMATIC_DATA_PORTABILITY", JSON.stringify(false));`
      });
      browser.tabs.reload();
    }
  };

  return (
    <>
      <Container
        p="10"
        backgroundColor={useColorModeValue("#F9FAFB", "gray.600")}
      >
        <Box w="350px">
          <Flex alignItems="space-between" justifyContent="space-between">
            <Heading textAlign="left" as="h1" size="lg" display="block">
              MyDataPortability tool
            </Heading>
            <Text textAlign="right" fontStyle="italic" display="block" color={"gray.500"}>
              {browser.runtime.getManifest().version}
            </Text>
          </Flex>
          <Flex alignItems="space-between" justifyContent="space-between" paddingTop="5">
            <Text textAlign="left">
              Enable data portability tool on{" "}
              <Text as={"span"} color={"orange.400"}>
                {currentPage}
              </Text>{" "}
            </Text>
            <Switch
              id="capture-data"
              isChecked={enableOnThisPage}
              colorScheme="teal"
              onChange={() => enableExtension(!enableOnThisPage, false)}
            />
          </Flex>
          <Divider paddingY="5"/>
          <Box >
            <List>
              <ListItem
                textAlign="center"
                borderTop="1px"
                borderBottom="1px"
                borderLeft="1px"
                borderRight="1px"
                borderColor={"gray.500"}
                cursor="pointer"
                
              >
                <Link href="https://newaccount1627932913099.freshdesk.com/support/home" isExternal>
                  Getting started <ExternalLinkIcon mx="2px" />
                </Link>
              </ListItem>
              <ListItem
                textAlign="center"
                borderLeft="1px"
                borderRight="1px"
                borderBottom="1px"
                borderColor={"gray.500"}
                cursor="pointer"
              >
                <Link href="https://newaccount1627932913099.freshdesk.com/support/tickets/new" isExternal>
                  Report bug <ExternalLinkIcon mx="2px" />
                </Link>
              </ListItem>
            </List>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default Popup;
