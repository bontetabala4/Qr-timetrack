import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface HistoryEntry {
  id: number;
  employee_id: string;
  scanned_at: string;
  employee?: {
    full_name: string;
  };
}

const HistoryTab = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3333/api/attendances")
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement des pointages", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">🕓 Historique des pointages</h2>

      {loading ? (
        <p className="text-gray-500 animate-pulse">Chargement en cours...</p>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="overflow-x-auto"
        >
          <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employé</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Heure</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {history.map((entry) => {
                const date = new Date(entry.scanned_at);
                const day = date.toLocaleDateString();
                const time = date.toLocaleTimeString();

                return (
                  <tr key={entry.id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{entry.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {entry.employee?.full_name || entry.employee_id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{day}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{time}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
};

export default HistoryTab;
