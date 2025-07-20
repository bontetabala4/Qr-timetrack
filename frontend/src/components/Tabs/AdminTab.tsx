import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Attendance {
  id: number;
  employee_id: string;
  scanned_at: string;
}

const AdminTab = () => {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3333/api/attendances")
      .then((res) => res.json())
      .then((data) => {
        setRecords(data);
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
              {records.map((rec) => {
                const date = new Date(rec.scanned_at);
                const day = date.toLocaleDateString();
                const time = date.toLocaleTimeString();
                return (
                  <tr key={rec.id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{rec.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{rec.employee_id}</td>
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

export default AdminTab;
