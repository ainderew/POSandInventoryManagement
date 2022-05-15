import { useState } from "react";
import "../src/index.css";

import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Cashier from "./pages/cashier.page";
import InventoryPage from "./pages/inventory.page";
import SideBar from "./components/side-bar.component";
import AnalyticsPage from "./pages/analytics.page";
import FinancePage from "./pages/finance.page";

const MainContainer: React.FC = () => {
  return (
    <div className="h-full w-full grid grid-cols-[4rem_1fr]">
      <Router>
        <SideBar />
        <Routes>
          <Route path="/" element={<Cashier />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/financial" element={<FinancePage />} />
        </Routes>
      </Router>
    </div>
  );
};

export default MainContainer;
