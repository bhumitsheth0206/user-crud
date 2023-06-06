import { Provider } from "react-redux";

import { persistor, store } from "./Redux/store";
import { PersistGate } from "redux-persist/integration/react";
import User from "./Pages/User";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <User />
        </PersistGate>
      </Provider>
    </div>
  );
}

export default App;
