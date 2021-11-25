/*global browser*/
import React from "react";
import ReactDOM from "react-dom";
import Frame from "./Frame";
import SidebarApp from "./SidebarApp";
import { Provider } from "react-redux";
import { Store } from "webext-redux";
import theRoom from "../common/theroom";

browser.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.text === 'isContentScriptActive?') {
    sendResponse({status: "yes"});
  }
}); 

if (Frame.isReady()) {
  Frame.toggle();
} else {
  boot();
}

function boot() {

  const root = document.createElement("div");
  document.body.appendChild(root);
  
  const store = new Store();
  const App = (
    <Provider store={store}>
      <Frame
        containerChildren={
          <div>
            <SidebarApp />
          </div>
        }
      />
    </Provider>
  );

  ReactDOM.render(App, root);
}
