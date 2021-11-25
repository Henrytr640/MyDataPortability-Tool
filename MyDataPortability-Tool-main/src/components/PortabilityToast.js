import { Kbd, useToast } from "@chakra-ui/react";
import React from "react";
import JsonEditor from "./JsonEditor";

const PortabilityToast = () => {
  const toast = useToast();
  const id = "test-toast";

  const renderToast = () => {
    if (!toast.isActive(id)) {
      toast({
        id,
        isClosable: true,
        duration: null,
        position: "bottom-left",
        render: () => (
          <>
            <JsonEditor />
          </>
        ),
      });
    } else {
      toast.closeAll();
    }
  };
  return (
    <Kbd
      cursor="pointer"
      onClick={() => {
        renderToast();
      }}
    >
      Click here to activate
    </Kbd>
  );
};

export default PortabilityToast;
