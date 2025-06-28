import { useState } from "react";
import { motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";


const GenerateTab = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [showQR, setShowQR] = useState(false);

  const handleGenerate = () => {
    if (employeeId.trim() === "") {
      setShowQR(false);
      return;
    }
    setShowQR(true);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Génération de QR Code</h2>

      <input
        type="text"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
        placeholder="Entrez l'ID de l'employé (ex: EMP001)"
        className="w-full px-4 py-2 border rounded-lg shadow-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleGenerate}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        Générer le QR Code
      </motion.button>

      {showQR && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6 flex justify-center"
        >
          <QRCodeCanvas value={employeeId} size={180} />
        </motion.div>
      )}
    </div>
  );
};

export default GenerateTab;
