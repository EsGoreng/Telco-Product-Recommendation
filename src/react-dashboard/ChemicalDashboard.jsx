import React, { useState, useEffect } from "react";

/*
  ChemicalDiscoveryDashboard - Single-file React + Tailwind dashboard
  - Berisi komponen reusable: StatCard, ActivityItem, MoleculePreview, QuickActionButton
  - Dummy data disediakan untuk demo
  - Siap ditempel ke proyek React yang sudah mengaktifkan TailwindCSS
*/

// --- Sparkline kecil untuk stat card ---
const Sparkline = ({ values = [], className = "" }) => {
  const w = 80,
    h = 24;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const points = values
    .map((v, i) => {
      const x = (i / Math.max(values.length - 1, 1)) * w;
      const y = h - ((v - min) / Math.max(max - min, 1e-6)) * h;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} className={className} viewBox={`0 0 ${w} ${h}`}>
      <polyline
        fill="none"
        stroke="#60A5FA"
        strokeWidth="2"
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// --- StatCard ---
export const StatCard = ({ title, value, trend = [], subtitle }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-4 flex items-center justify-between">
      <div>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          {title}
        </div>
        <div className="text-2xl font-semibold text-slate-900 dark:text-white">
          {value}
        </div>
        {subtitle && (
          <div className="text-xs text-slate-400 mt-1">{subtitle}</div>
        )}
      </div>
      <div className="ml-4">
        <Sparkline values={trend} />
      </div>
    </div>
  );
};

// --- ActivityItem ---
export const ActivityItem = ({ item }) => {
  return (
    <div className="flex items-start gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded">
      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
        A
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="font-medium text-sm text-slate-900 dark:text-white">
            {item.name}
          </div>
          <div className="text-xs text-slate-400">{item.time}</div>
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-300">
          {item.message}
        </div>
      </div>
    </div>
  );
};

// --- MoleculePreview ---
export const MoleculePreview = ({ molecule }) => {
  if (!molecule)
    return (
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-4">
        <div className="text-slate-500">No molecule selected</div>
      </div>
    );
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-4">
      <div className="flex gap-4">
        <div className="w-48 h-48 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center">
          {/* Placeholder 3D viewer */}
          <div className="text-slate-400">3D Viewer</div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {molecule.name}
          </h3>
          <div className="text-sm text-slate-500 mt-1">
            Formula:{" "}
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {molecule.formula}
            </span>
          </div>
          <div className="text-sm text-slate-500">
            Mol. Weight:{" "}
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {molecule.mw}
            </span>
          </div>
          <div className="text-sm text-slate-500">
            Toxicity score:{" "}
            <span className="font-medium text-red-500">
              {molecule.toxicity}
            </span>
          </div>
          <div className="mt-3">
            <pre className="text-xs bg-slate-50 dark:bg-slate-800 p-2 rounded">
              SMILES: {molecule.smiles}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- QuickActionButton ---
export const QuickActionButton = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white dark:bg-slate-900 border rounded-lg p-3 flex flex-col items-center gap-2 shadow hover:shadow-md"
  >
    <div className="text-xl text-primary">{icon}</div>
    <div className="text-sm text-slate-700 dark:text-slate-200">{label}</div>
  </button>
);

// --- Main Dashboard ---
export default function ChemicalDiscoveryDashboard() {
  // dummy stats
  const [stats] = useState([
    {
      title: "Molecules Analyzed",
      value: "1,248",
      trend: [5, 6, 7, 8, 7, 9, 10],
      subtitle: "Last 7 days",
    },
    {
      title: "Predictions Generated",
      value: "3,412",
      trend: [2, 4, 6, 8, 7, 6, 8],
      subtitle: "AI runs",
    },
    {
      title: "Experiments in Progress",
      value: "12",
      trend: [1, 2, 3, 2, 3, 4, 3],
      subtitle: "Active",
    },
    {
      title: "Dataset Size",
      value: "24,560",
      trend: [20, 22, 21, 23, 24, 25, 26],
      subtitle: "Entries",
    },
  ]);

  // dummy activity feed
  const [activities] = useState([
    {
      name: "Molecule-X27",
      message: "Analisis selesai — prediksi: low toxicity",
      time: "2m",
    },
    {
      name: "Molecule-A11",
      message: "Prediksi generated — score 0.82",
      time: "12m",
    },
    { name: "Molecule-B03", message: "Start analysis", time: "30m" },
  ]);

  const [selected, setSelected] = useState({
    name: "Molecule-X27",
    formula: "C6H6O2",
    mw: "110.11",
    toxicity: "0.12",
    smiles: "C1=CC=CC=C1O2",
  });

  const [projects] = useState([
    {
      id: 1,
      name: "Project Phenol-Analogs",
      status: "Running",
      updated: "1h ago",
    },
    {
      id: 2,
      name: "Catalyst Screening",
      status: "Paused",
      updated: "Yesterday",
    },
    { id: 3, name: "Solubility Sweep", status: "Running", updated: "2d ago" },
  ]);

  function handleQuick(action) {
    // demo placeholder
    alert(action + " clicked (demo)");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Chemical Discovery Dashboard</h1>
            <div className="text-sm text-slate-500">
              Research & AI-assisted molecular discovery
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                placeholder="Search molecule or formula"
                className="pl-3 pr-10 py-2 rounded-lg border bg-white dark:bg-slate-800"
              />
              <button className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 text-sm bg-primary text-white rounded">
                Search
              </button>
            </div>
            <button className="p-2 rounded bg-white dark:bg-slate-800 shadow">
              🔔
            </button>
            <div className="relative">
              <button className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded shadow">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700" />
                <div className="text-sm">Dr. Researcher</div>
              </button>
            </div>
          </div>
        </header>

        {/* Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((s) => (
                <StatCard key={s.title} {...s} />
              ))}
            </div>

            {/* Main content: Activity + Molecule preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <MoleculePreview molecule={selected} />
                <div className="mt-4 bg-white dark:bg-slate-900 rounded-lg p-4 shadow">
                  <h4 className="font-semibold">Ringkasan properti</h4>
                  <div className="grid grid-cols-2 gap-3 mt-3 text-sm text-slate-600 dark:text-slate-300">
                    <div>
                      Formula:{" "}
                      <span className="font-medium text-slate-800 dark:text-slate-100">
                        {selected.formula}
                      </span>
                    </div>
                    <div>
                      Mol. Weight:{" "}
                      <span className="font-medium">{selected.mw}</span>
                    </div>
                    <div>
                      Toxicity score:{" "}
                      <span className="font-medium text-red-500">
                        {selected.toxicity}
                      </span>
                    </div>
                    <div>
                      Preview:{" "}
                      <span className="font-medium">{selected.smiles}</span>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="space-y-4">
                <div className="bg-white dark:bg-slate-900 rounded-lg p-3 shadow">
                  <h4 className="font-semibold mb-2">AI Activity Feed</h4>
                  <div className="max-h-64 overflow-auto">
                    {activities.map((a, i) => (
                      <ActivityItem key={i} item={a} />
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-lg p-3 shadow">
                  <h4 className="font-semibold mb-2">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <QuickActionButton
                      icon={"⬆️"}
                      label={"Upload Molecule"}
                      onClick={() => handleQuick("Upload Molecule")}
                    />
                    <QuickActionButton
                      icon={"🤖"}
                      label={"Generate Prediction"}
                      onClick={() => handleQuick("Generate Prediction")}
                    />
                    <QuickActionButton
                      icon={"🔬"}
                      label={"Compare Structures"}
                      onClick={() => handleQuick("Compare Structures")}
                    />
                    <QuickActionButton
                      icon={"📁"}
                      label={"Access Dataset"}
                      onClick={() => handleQuick("Access Dataset")}
                    />
                  </div>
                </div>
              </aside>
            </div>

            {/* Recent Projects */}
            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 shadow">
              <h4 className="font-semibold mb-3">Recent Projects</h4>
              <div className="grid gap-3">
                {projects.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-slate-500">
                        Last update: {p.updated}
                      </div>
                    </div>
                    <div
                      className={`text-sm px-2 py-1 rounded ${
                        p.status === "Running"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {p.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 shadow">
              <h4 className="font-semibold mb-3">Molecular Preview Panel</h4>
              <MoleculePreview molecule={selected} />
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 shadow">
              <h4 className="font-semibold mb-3">AI Activity (compact)</h4>
              <div className="space-y-2">
                {activities.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm"
                  >
                    <div>{a.name}</div>
                    <div className="text-slate-400">{a.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
