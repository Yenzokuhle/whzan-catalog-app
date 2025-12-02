import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import Home from "./pages/Home";
import Details from "./pages/Details";
import Inventory from "./pages/Inventory";
import InventoryItemDetails from "./pages/InventoryItemDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:prodID" element={<Details />} />
        <Route path="/admin/inventory" element={<Inventory />} />
        <Route
          path="/admin/inventory/product/:prodID"
          element={<InventoryItemDetails />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
