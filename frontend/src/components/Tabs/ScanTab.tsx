import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { motion } from "framer-motion";

export default function ScanTab() {
  const scanner = useRef<Html5Qrcode | null>(null);
  const [cameras, setCameras] = useState<{ id: string; label?: string }[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
  const [history, setHistory] = useState<{ code: string; time: string; date: string }[]>([]);

  useEffect(() => {
    scanner.current = new Html5Qrcode("qr-reader");

    Html5Qrcode.getCameras()
      .then((devices) => {
        setCameras(devices);
        if (devices.length > 0) {
          setSelectedCameraId(devices[0].id);
          startScanner(devices[0].id);
        }
      })
      .catch((err) => console.error("Erreur récupération caméras", err));

    return () => {
      scanner.current?.stop().then(() => scanner.current?.clear());
    };
  }, []);

  const startScanner = (cameraId: string) => {
    scanner.current?.start(
      cameraId,
      { fps: 10, qrbox: 250 },
      (decodedText) => {
const now = new Date();
const date = now.toLocaleDateString();
const time = now.toLocaleTimeString();

// Enregistrement côté frontend (local)
setHistory((prev) => [...prev, { code: decodedText, date, time }]);

// Envoi vers le backend
fetch("http://localhost:3333/api/attendances", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ employee_id: decodedText }),
})
  .then((res) => {
    if (!res.ok) throw new Error("Erreur lors de l’enregistrement");
    return res.json();
  })
  .then((data) => {
    console.log("✅ Pointage enregistré sur le backend :", data);
  })
  .catch((err) => {
    console.error("❌ Erreur de communication avec le backend :", err);
    alert("Erreur de communication avec le serveur !");
  });

      },
      () => {} // onScanFailure ignoré pour l’instant
    );
  };

  // Fonction pour exporter en CSV
  const exportToCsv = () => {
    if (history.length === 0) {
      alert("Aucun historique à exporter.");
      return;
    }
    const headers = ["Code QR", "Date", "Heure"];
    const csvRows = [
      headers.join(","), // ligne d'entête
      ...history.map(({ code, date, time }) =>
        [code, date, time].map((field) => `"${field.replace(/"/g, '""')}"`).join(",")
      ),
    ];
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `historique_qr_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Fonction pour exporter en JSON
  const exportToJson = () => {
    if (history.length === 0) {
      alert("Aucun historique à exporter.");
      return;
    }
    const jsonContent = JSON.stringify(history, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `historique_qr_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="p-6 max-w-lg mx-auto text-center"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Scanner un QR Code</h2>

      <div id="qr-reader" className="w-full h-64 border-2 border-dashed border-gray-400 rounded-lg mb-4" />

      {cameras.length > 0 && (
        <select
          className="w-full mb-4 px-3 py-2 border rounded"
          value={selectedCameraId || ""}
          onChange={(e) => {
            const newCam = e.target.value;
            setSelectedCameraId(newCam);
            scanner.current?.stop().then(() => startScanner(newCam));
          }}
        >
          {cameras.map((cam) => (
            <option key={cam.id} value={cam.id}>
              {cam.label || cam.id}
            </option>
          ))}
        </select>
      )}

      <p className="text-sm text-gray-500 mb-4">
        Dirigez la caméra vers un QR Code pour enregistrer automatiquement l'entrée.
      </p>

      {/* Historique local du scan */}
      {history.length > 0 && (
        <div className="mt-6 text-left text-sm">
          <h3 className="text-md font-semibold mb-2">🕓 Historique local :</h3>
          <ul className="space-y-1 max-h-40 overflow-y-auto border rounded p-2 bg-gray-50">
            {history.map((entry, idx) => (
              <li key={idx} className="text-gray-700">
                ✅ {entry.code} – {entry.time} le {entry.date}
              </li>
            ))}
          </ul>

          {/* Boutons d'export */}
          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={exportToCsv}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Exporter CSV
            </button>
            <button
              onClick={exportToJson}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Exporter JSON
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

