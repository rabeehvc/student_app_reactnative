import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/app-redux";
import NavigationContainerView from "./NavigationContainerView";

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainerView />
      </PersistGate>
    </Provider>
  );
};

export default App;

