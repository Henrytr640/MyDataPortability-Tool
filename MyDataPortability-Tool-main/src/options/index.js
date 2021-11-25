import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom';
import Options from './Options';
import { extendTheme } from "@chakra-ui/react"

const colors = {
  brand: {
     900: "#1a365d",
     800: "#153e75",
     700: "#2a69ac",
   },
 }
 const theme = extendTheme({ colors })
ReactDOM.render(
  <React.StrictMode>
     <ChakraProvider theme={theme}>
      <Options />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('options')
);
