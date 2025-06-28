type Props = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export default function TabNavigation({ activeTab, setActiveTab }: Props) {
  const tabs = [
    { id: "scan", label: "Scanner" },
    { id: "generate", label: "Générer" },
    { id: "history", label: "Historique" },
    { id: "admin", label: "Admin" },
  ];

  return (
    <div className="flex border-b mb-4">
      {tabs.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-all duration-200 ${
            activeTab === id
              ? "text-blue-600 border-blue-600"
              : "text-gray-500 border-transparent hover:text-blue-600"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
