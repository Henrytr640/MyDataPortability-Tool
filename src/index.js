/*global browser*/
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { Store, applyMiddleware } from "webext-redux";
import thunkMiddleware from "redux-thunk";

const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
};
const theme = extendTheme({ colors });
const store = new Store();

// Apply middleware to proxy store
const middleware = [thunkMiddleware];
const storeWithMiddleware = applyMiddleware(store, ...middleware);
storeWithMiddleware.ready().then(() => {
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={storeWithMiddleware}>
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </Provider>
    </React.StrictMode>,
    document.getElementById("root")
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
