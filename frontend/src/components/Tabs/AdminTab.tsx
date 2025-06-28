import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Employee {
  id: string;
  name: string;
  department: string;
  status: "Actif" | "En congé" | "Inactif";
}

const mockEmployees: Employee[] = [
  { id: "EMP001", name: "Jean Dupont", department: "IT", status: "Actif" },
  { id: "EMP002", name: "Marie Martin", department: "RH", status: "Actif" },
  { id: "EMP003", name: "Pierre Lambert", department: "Marketing", status: "En congé" },
];

const AdminTab = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    // Simuler chargement des données
    setTimeout(() => {
      setEmployees(mockEmployees);
    }, 1000);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Gestion des employés</h2>

      {employees.length === 0 ? (
        <p className="text-gray-500 animate-pulse">Chargement des données...</p>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Département</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">{emp.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{emp.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{emp.department}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        emp.status === "Actif"
                          ? "bg-green-100 text-green-800"
                          : emp.status === "En congé"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">Modifier</button>
                    <button className="text-red-600 hover:text-red-800">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
};

export default AdminTab;
