import React from "react";
import "./App.css";

import "monday-ui-react-core/dist/main.css";
import { OrderForm } from "./components/OrderForm";

const App = () => {
  return (
    <div className="App">
      <OrderForm />
    </div>
  );
};

export default App;
