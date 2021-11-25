import React from "react";
import { MANUAL_DATA_PORTABILITY } from "../common/constants";
import { Box, Kbd, Text } from "@chakra-ui/layout";
import ReactJson from "react-json-view";
import { Button } from "@chakra-ui/button";
import Icon from "@chakra-ui/icon";
import { GrDownload } from "react-icons/gr";
import { downloadObjectAsJson } from "../common/utils";

const JsonEditor = () => {
  const [code, setCode] = React.useState(
    JSON.parse(localStorage.getItem(MANUAL_DATA_PORTABILITY)) ?? {}
  );
  
  const setCodeFromStorage = () => {
    const manualPortability = JSON.parse(
      localStorage.getItem(MANUAL_DATA_PORTABILITY)
    );
    setCode(manualPortability);
  }
  React.useEffect(() => {
    window.addEventListener("storage", setCodeFromStorage);
    return () => {
      window.removeEventListener("storage", setCodeFromStorage);
    };
  }, []);

  const onChange = (newSrc) => {
    setCode(newSrc.updated_src);
    localStorage.setItem(
      MANUAL_DATA_PORTABILITY,
      JSON.stringify(newSrc.updated_src)
    );
  };
  return (
    <Box
      px={{ base: 2, md: 4 }}
      py={"5"}
      shadow={"xl"}
      border={"1px solid"}
      borderColor={"gray.800"}
      rounded={"lg"}
      w="full"
      bg="white"
    >
      <Box pb="5">
        <Text color="gray.500">
          Press the following buttons to enable scraper:
        </Text>{" "}
        <Kbd>CTRL</Kbd> + <Kbd>SHIFT</Kbd> + <Kbd>Y</Kbd>
      </Box>
      <Box bg="white" padding="5" border={"1px solid"} borderColor={"gray.800"}>
        <ReactJson
          src={code}
          displayDataTypes={false}
          name={false}
          onEdit={(edit) => onChange(edit)}
          onAdd={(add) => onChange(add)}
          onDelete={(d) => onChange(d)}
        />
      </Box>
      <Box textAlign="right" pt="5">
        <Button
          rightIcon={<Icon as={GrDownload} />}
          onClick={() => downloadObjectAsJson(JSON.stringify(code), "dpexport")}
          variant="outline"
        >
          Download file
        </Button>
      </Box>
    </Box>
  );
};

export default JsonEditor;
