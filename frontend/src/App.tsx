import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TabNavigation from "./components/TabNavigation";
import ScanTab from "./components/Tabs/ScanTab";
import GenerateTab from "./components/Tabs/GenerateTab";
import HistoryTab from "./components/Tabs/HistoryTab";
import AdminTab from "./components/Tabs/AdminTab";
import './App.css'

export default function App() {
  const [activeTab, setActiveTab] = useState("generate");

  const renderTab = () => {
    switch (activeTab) {
      case "scan":
        return <ScanTab />;
      case "generate":
        return <GenerateTab />;
      case "history":
        return <HistoryTab />;
      case "admin":
        return <AdminTab />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Animation de transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {renderTab()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

