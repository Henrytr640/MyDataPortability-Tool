/*global browser*/

import rootReducer from "../common/reducer";
import { wrapStore } from "webext-redux";
import { applyMiddleware, createStore, combineReducers } from "redux";
import thunkMiddleware from "redux-thunk";
import {
  addWebRequestResponse,
  getCurrentTab,
  GET_CURRENT_TAB,
  setCurrentTab,
} from "../common/actions";
import { v4 as uuidv4 } from 'uuid';
var psl = require('psl');

const listener = (details) => {

  var currentTabUrl = psl.parse(new URL(store.getState().rootReducer.currentTab.url).hostname);
  if(details.url.indexOf(currentTabUrl.sld) === -1) return {}


  let filter = browser.webRequest.filterResponseData(details.requestId);
  let decoder = new TextDecoder("utf-8");
  let encoder = new TextEncoder();
  filter.ondata = (event) => {
    let urlResource = details.url.substring(details.url.lastIndexOf("/") + 1);
    if (urlResource.includes("?")) urlResource = urlResource.split("?")[0];
    let str = decoder.decode(event.data, { stream: true });
    const srcUrl = new URL(store.getState().rootReducer.currentTab.url).hostname;

    var fileObj = {
      id:uuidv4(),
      requestUrl: details.url,
      requestFile: urlResource,
      requestData: str,
      requestTabId: store.getState().rootReducer.currentTab.id,
      requestSourceUrl: srcUrl,
    };


    store.dispatch(addWebRequestResponse(fileObj));

    filter.write(encoder.encode(str));
    filter.disconnect();
  };

  return {};
};

const lastAction = (state = null, action) => {
  return action;
};

const setWebRequestListener = (enabled) => {
  if (enabled) {
    browser.webRequest.onBeforeRequest.addListener(
      listener,
      {
        urls: ["<all_urls>"],
        types: ["xmlhttprequest"],
      },
      ["blocking"]
    );
  } else {
    browser.webRequest.onBeforeRequest.removeListener(listener);
  }
};

const setBrowserTab = () => {
  browser.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    store.dispatch(setCurrentTab(tabs[0]));
  });
};

const middleware = [thunkMiddleware];
const reducer = combineReducers({
  rootReducer,
  lastAction,
});
const store = createStore(reducer, applyMiddleware(...middleware));

wrapStore(store);

store.subscribe(() => {
  let state = store.getState();
  if (store.getState().lastAction.type === GET_CURRENT_TAB) {
    setBrowserTab();
  }

  if (state.rootReducer.webRequestListener) {
    setWebRequestListener(true);
  } else {
    setWebRequestListener(false);
  }
});

browser.tabs.onActivated.addListener(function (activeInfo) {
  store.dispatch(getCurrentTab());
});

browser.commands.onCommand.addListener(function (command) {
  if (command === "enable-theroom") {
    browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      browser.tabs.sendMessage(tabs[0].id, { text: "theroom" });
    });
  }
});

const setContentScriptIfNotInjected = (domain, tabId) => {
  browser.storage.local.get([domain], function (data) {
    if (data !== null) {
      if (Object.values(data)[0] === true) {
        browser.tabs.executeScript(tabId, {
          file: "contentScript.bundle.js",
        });
      }
    }
  });
};
browser.tabs.onActivated.addListener(function (activeInfo) {
  const tabId = activeInfo.tabId;

  browser.tabs.sendMessage(
    tabId,
    { text: "isContentScriptActive?" },
    function (msg) {
      msg = msg || {};
      if (msg.status !== "yes") {
        browser.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            var tab = tabs[0];
            var url = new URL(tab.url);
            var domain = url.hostname;

            setContentScriptIfNotInjected(domain, tabId);
          }
        );
      }
    }
  );
});

browser.tabs.onUpdated.addListener((tabId, changed) => {
  if (changed?.status === "complete") {
    browser.tabs.get(tabId).then((activeTab) => {
      var url = new URL(activeTab.url);
      var domain = url.hostname;

      try {
        browser.tabs.sendMessage(
          tabId,
          { text: "isContentScriptActive?" },
          function (msg) {
            msg = msg || {};
            if (msg.status !== "yes") {
              setContentScriptIfNotInjected(domain, tabId);
            }
          }
        );
      } catch {
        setContentScriptIfNotInjected();
      }
    });
  }
});
