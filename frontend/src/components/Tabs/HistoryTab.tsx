import { motion } from "framer-motion";

const dummyHistory = [
  { id: 1, name: "John Doe", time: "08:02", date: "2025-06-25" },
  { id: 2, name: "Jane Smith", time: "08:10", date: "2025-06-25" },
];

const HistoryTab = () => (
  <div className="p-4">
    <motion.h2
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-xl font-bold text-gray-800"
    >
      Historique des pointages
    </motion.h2>

    <table className="w-full mt-6 border text-left text-sm shadow rounded-lg overflow-hidden">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th className="py-2 px-4">Nom</th>
          <th className="py-2 px-4">Heure</th>
          <th className="py-2 px-4">Date</th>
        </tr>
      </thead>
      <tbody>
        {dummyHistory.map((entry) => (
          <tr key={entry.id} className="border-t">
            <td className="py-2 px-4">{entry.name}</td>
            <td className="py-2 px-4">{entry.time}</td>
            <td className="py-2 px-4">{entry.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default HistoryTab;
