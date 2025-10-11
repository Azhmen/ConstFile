import { useContext, useEffect, useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import AuthContext from "../context/AuthContext";
import MapPicker from "../ui/MapPicker";
import {
  Building2,
  MapPin,
  User,
  CalendarDays,
  DollarSign,
  TrendingUp,
  Clock,
  Search,
  Filter,
  PlusCircle,
  Edit3,
  Trash2,
  Loader2,
  Layers,
  CheckCircle2,
  PauseCircle,
  Hammer,
  AlertTriangle,
  ChevronDown,
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  CloudLightning,
  FileText,
  Calendar,
  Target,
  Briefcase,
  X,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "";

const generatePDF = (projects, setError) => {
  if (!Array.isArray(projects) || projects.length === 0) {
    setError("No projects available to generate PDF.");
    return;
  }

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  doc.setFillColor(13, 59, 102);
  doc.rect(0, 0, 210, 297, "F");
  doc.setFillColor(100, 149, 237);
  doc.triangle(0, 0, 210, 0, 210, 297, "F");
  doc.setFont("times", "bold");
  doc.setFontSize(30);
  doc.setTextColor(255, 255, 255);
  doc.text("Construction Projects Report", 105, 90, { align: "center" });
  doc.setFont("times", "normal");
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 110, {
    align: "center",
  });
  doc.setFontSize(10);
  doc.setTextColor(220, 220, 220);
  doc.text("Prepared by: [ConstrucEASE]", 105, 125, { align: "center" });
  doc.text("[SLIIT] | [ConstrucEASE@GMAIL.COM]", 105, 135, { align: "center" });

  doc.addPage();

  doc.setFillColor(13, 59, 102);
  doc.rect(0, 0, 210, 20, "F");
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text("[ConstrucEASE]", 10, 12);
  doc.setFont("times", "normal");
  doc.setFontSize(10);
  doc.text("Projects Report", 10, 18);
  doc.setTextColor(180, 180, 180);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 160, 12, {
    align: "right",
  });
  doc.text("[Logo Placeholder]", 190, 18, { align: "right" });
  doc.setDrawColor(100, 149, 237);
  doc.setLineWidth(0.3);
  doc.line(10, 22, 200, 22);

  doc.setFont("times", "bold");
  doc.setFontSize(12);
  doc.setTextColor(33, 33, 33);
  doc.text("Table of Contents", 10, 35);
  doc.setFont("times", "normal");
  doc.setFontSize(10);
  doc.text("1. Project List....................2", 10, 42);

  autoTable(doc, {
    startY: 50,
    head: [
      [
        "Project Name",
        "Client",
        "Location",
        "Status",
        "Priority",
        "Budget",
        "Deadline",
      ],
    ],
    body: projects.map((p) => [
      p.name || "N/A",
      p.client || "N/A",
      p.location || "N/A",
      p.status || "N/A",
      p.priority || "N/A",
      p.budget ? `${p.currency} ${Number(p.budget).toFixed(2)}` : "N/A",
      p.deadline ? new Date(p.deadline).toLocaleDateString() : "N/A",
    ]),
    margin: { left: 10, right: 10 },
    styles: {
      font: "times",
      fontSize: 9,
      cellPadding: 3,
      textColor: [33, 33, 33],
      lineColor: [180, 180, 180],
      lineWidth: 0.15,
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: [13, 59, 102],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
      fontSize: 9.5,
    },
    alternateRowStyles: {
      fillColor: [248, 248, 248],
    },
    columnStyles: {
      0: { cellWidth: 45, halign: "left" },
      1: { cellWidth: 30, halign: "left" },
      2: { cellWidth: 30, halign: "left" },
      3: { cellWidth: 20, halign: "center" },
      4: { cellWidth: 20, halign: "center" },
      5: { cellWidth: 25, halign: "right" },
      6: { cellWidth: 20, halign: "center" },
    },
    didDrawPage: (data) => {
      const pageHeight = doc.internal.pageSize.height;
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.2);
      doc.line(10, pageHeight - 15, 200, pageHeight - 15);
      doc.setFont("times", "italic");
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text("[Your Company Name] - Building the Future", 10, pageHeight - 8);
      doc.setFont("times", "normal");
      doc.text(
        "[Your Company Email] | [Your Company Phone]",
        105,
        pageHeight - 8,
        { align: "center" }
      );
      doc.text(`Page ${data.pageNumber - 1}`, 200, pageHeight - 8, {
        align: "right",
      });
    },
  });

  doc.save("projects-report.pdf");
};

const daysLeft = (deadline) => {
  if (!deadline) return null;
  const d = new Date(deadline);
  const now = new Date();
  return Math.ceil((d - now) / (1000 * 60 * 60 * 24));
};

const statusMeta = {
  Planning: {
    color: "bg-slate-50 text-slate-700 border-slate-300",
    Icon: Layers,
    accentColor: "bg-slate-600",
  },
  "In Progress": {
    color: "bg-blue-50 text-blue-700 border-blue-300",
    Icon: Hammer,
    accentColor: "bg-blue-600",
  },
  "On Hold": {
    color: "bg-amber-50 text-amber-700 border-amber-300",
    Icon: PauseCircle,
    accentColor: "bg-amber-600",
  },
  Completed: {
    color: "bg-emerald-50 text-emerald-700 border-emerald-300",
    Icon: CheckCircle2,
    accentColor: "bg-emerald-600",
  },
};

const priorityPill = {
  High: "bg-rose-50 text-rose-700 border-rose-300",
  Medium: "bg-amber-50 text-amber-700 border-amber-300",
  Low: "bg-slate-50 text-slate-600 border-slate-300",
};

const priorityDot = {
  High: "bg-rose-500",
  Medium: "bg-amber-500",
  Low: "bg-slate-400",
};

const weatherIcon = (code) => {
  if (code == null) return Cloud;
  if ([0, 1].includes(code)) return Sun;
  if ([2, 3, 45, 48].includes(code)) return Cloud;
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code))
    return CloudRain;
  if ([71, 73, 75, 77, 85, 86].includes(code)) return CloudSnow;
  if ([95, 96, 99].includes(code)) return CloudLightning;
  return Cloud;
};

/* ---------- Small UI atoms ---------- */
function Label({ children }) {
  return (
    <label className="block text-sm text-slate-700 mb-2">{children}</label>
  );
}

function Select({ className = "", children, ...props }) {
  return (
    <div className="relative group">
      <select
        {...props}
        className={`appearance-none w-full border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm text-slate-900 
          focus:border-slate-900 focus:outline-none transition-colors
          hover:border-slate-300 cursor-pointer ${className}`}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
    </div>
  );
}

function Button({ variant = "solid", className = "", children, ...props }) {
  const variants = {
    solid: "bg-slate-900 text-white hover:bg-slate-800 border border-slate-900",
    outline:
      "bg-white text-slate-700 border border-slate-200 hover:border-slate-900 hover:text-slate-900",
    subtle:
      "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100",
    danger: "bg-rose-600 text-white hover:bg-rose-700 border border-rose-600",
  };
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm 
        transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

function StatusBadge({ value }) {
  const meta = statusMeta[value] || statusMeta["Planning"];
  const Icon = meta.Icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2.5 py-1 transition-colors ${meta.color}`}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="text-xs">{value}</span>
    </span>
  );
}

function PriorityBadge({ value }) {
  const pill = priorityPill[value] || priorityPill.Medium;
  const dot = priorityDot[value] || priorityDot.Medium;
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2.5 py-1 transition-colors ${pill}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      <span className="text-xs">{value}</span>
    </span>
  );
}

function ProgressBar({ value }) {
  const v = Math.min(100, Math.max(0, Number(value) || 0));
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-600">Progress</span>
        <span className="text-xs text-slate-900">{v}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 overflow-hidden">
        <div
          className="h-full bg-slate-900 transition-all duration-500"
          style={{ width: `${v}%` }}
        />
      </div>
    </div>
  );
}

/* ====================== Main Component ====================== */
export default function Projects() {
  const { token } = useContext(AuthContext) || {};
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState(null);

  const emptyForm = {
    id: null,
    name: "",
    client: "",
    location: "",
    status: "Planning",
    priority: "Medium",
    owner: "",
    description: "",
    currency: "LKR",
    budget: 0,
    startDate: "",
    deadline: "",
    progress: 0,
    lat: null,
    lon: null,
  };

  const [form, setForm] = useState(emptyForm);
  const isEditing = useMemo(() => !!form.id, [form.id]);

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (status) params.set("status", status);
      if (priority) params.set("priority", priority);
      const res = await fetch(`${API_BASE}/projects?${params.toString()}`, {
        headers,
      });
      if (!res.ok) throw new Error(`Failed to load (${res.status})`);
      const data = await res.json();
      setProjects(data);
    } catch (e) {
      setError(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, status, priority]);

  const resetForm = () => setForm(emptyForm);

  const today = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const validateForm = () => {
    setFormError(null);
    const requiredFields = [
      "name",
      "client",
      "location",
      "budget",
      "startDate",
      "deadline",
    ];
    for (const field of requiredFields) {
      if (!form[field]) {
        setFormError(`Field ${field} is required!`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError("");
    try {
      const url = isEditing
        ? `${API_BASE}/projects/${form.id}`
        : `${API_BASE}/projects`;
      const method = isEditing ? "PUT" : "POST";
      const { id, ...payload } = form;
      payload.budget = Number(payload.budget);
      payload.progress = Number(payload.progress);
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Save failed (${res.status})`);
      const saved = await res.json();
      if (isEditing) {
        setProjects((xs) => xs.map((p) => (p._id === saved._id ? saved : p)));
      } else {
        setProjects((xs) => [saved, ...xs]);
      }
      resetForm();
    } catch (e) {
      setError(e.message || "Save failed");
    }
  };

  const startEdit = (p) => {
    setForm({
      id: p._id,
      name: p.name || "",
      client: p.client || "",
      location: p.location || "",
      status: p.status || "Planning",
      priority: p.priority || "Medium",
      owner: p.owner || "",
      description: p.description || "",
      currency: p.currency || "LKR",
      budget: p.budget ?? 0,
      startDate: p.startDate
        ? new Date(p.startDate).toISOString().slice(0, 10)
        : "",
      deadline: p.deadline
        ? new Date(p.deadline).toISOString().slice(0, 10)
        : "",
      progress: p.progress ?? 0,
      lat: Number.isFinite(p.lat) ? p.lat : null,
      lon: Number.isFinite(p.lon) ? p.lon : null,
    });
    document
      .getElementById("project-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);
      setProjects((xs) => xs.filter((p) => p._id !== id));
    } catch (e) {
      alert(e.message || "Delete failed");
    }
  };

  const refreshWeather = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/projects/${id}/refresh-weather`, {
        method: "POST",
        headers,
      });
      if (!res.ok) throw new Error(`Weather refresh failed (${res.status})`);
      const updated = await res.json();
      setProjects((xs) => xs.map((p) => (p._id === updated._id ? updated : p)));
    } catch (e) {
      alert(e.message || "Unable to refresh weather");
    }
  };

  const mapValue = useMemo(() => {
    return Number.isFinite(form.lat) && Number.isFinite(form.lon)
      ? { lat: form.lat, lon: form.lon }
      : null;
  }, [form.lat, form.lon]);

  /* ====================== UI ====================== */
  return (
    <section className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Header */}
        <div className="space-y-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="h-6 w-6 text-slate-900" />
                <h1 className="text-2xl text-slate-900">Projects</h1>
              </div>
              <p className="text-sm text-slate-600">
                Manage and track construction projects
              </p>
            </div>
            <Button onClick={() => generatePDF(projects, setError)}>
              <FileText className="h-4 w-4" />
              Export PDF
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search projects..."
                  className="w-full border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 
                    focus:border-slate-900 focus:outline-none placeholder-slate-400 hover:border-slate-300 transition-colors"
                />
              </div>
            </div>
            <div className="md:col-span-7 flex items-center gap-3">
              <div className="flex items-center gap-2 flex-1">
                <Filter className="h-4 w-4 text-slate-400" />
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="flex-1"
                >
                  <option value="">All Status</option>
                  <option>Planning</option>
                  <option>In Progress</option>
                  <option>On Hold</option>
                  <option>Completed</option>
                </Select>
              </div>
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="flex-1"
              >
                <option value="">All Priority</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </Select>
              <Button
                onClick={() =>
                  document
                    .getElementById("project-form")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <PlusCircle className="h-4 w-4" />
                New
              </Button>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          id="project-form"
          onSubmit={handleSubmit}
          className="border border-slate-200 bg-white"
        >
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
            <h2 className="text-sm text-slate-900 flex items-center gap-2">
              <Target className="h-4 w-4" />
              {isEditing ? "Edit Project" : "New Project"}
            </h2>
          </div>

          <div className="p-6 space-y-8">
            {formError && (
              <div className="flex items-start gap-3 border border-rose-300 bg-rose-50 p-4">
                <AlertTriangle className="h-4 w-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-rose-900">{formError}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormError(null)}
                  className="text-rose-600 hover:text-rose-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Project Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Briefcase className="h-4 w-4 text-slate-600" />
                <h3 className="text-sm text-slate-900">Project Details</h3>
              </div>

              <div className="grid gap-6 md:grid-cols-12">
                <div className="md:col-span-6">
                  <Label>Project Name *</Label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="Enter project name"
                    className="w-full border border-slate-200 bg-white px-4 py-2.5 text-sm 
                      focus:border-slate-900 focus:outline-none transition-colors hover:border-slate-300"
                  />
                </div>
                <div className="md:col-span-3">
                  <Label>Status</Label>
                  <Select
                    value={form.status}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, status: e.target.value }))
                    }
                  >
                    <option>Planning</option>
                    <option>In Progress</option>
                    <option>On Hold</option>
                    <option>Completed</option>
                  </Select>
                </div>
                <div className="md:col-span-3">
                  <Label>Priority</Label>
                  <Select
                    value={form.priority}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, priority: e.target.value }))
                    }
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </Select>
                </div>

                <div className="md:col-span-6">
                  <Label>Client *</Label>
                  <input
                    value={form.client}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, client: e.target.value }))
                    }
                    placeholder="Enter client name"
                    className="w-full border border-slate-200 bg-white px-4 py-2.5 text-sm 
                      focus:border-slate-900 focus:outline-none transition-colors hover:border-slate-300"
                  />
                </div>
                <div className="md:col-span-6">
                  <Label>Owner</Label>
                  <input
                    value={form.owner}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, owner: e.target.value }))
                    }
                    placeholder="Enter owner name"
                    className="w-full border border-slate-200 bg-white px-4 py-2.5 text-sm 
                      focus:border-slate-900 focus:outline-none transition-colors hover:border-slate-300"
                  />
                </div>
              </div>
            </div>

            {/* Budget & Timeline */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <DollarSign className="h-4 w-4 text-slate-600" />
                <h3 className="text-sm text-slate-900">Budget & Timeline</h3>
              </div>

              <div className="grid gap-6 md:grid-cols-12">
                <div className="md:col-span-6">
                  <Label>Budget *</Label>
                  <input
                    type="number"
                    min={0}
                    value={form.budget}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, budget: e.target.value }))
                    }
                    placeholder="0.00"
                    className="w-full border border-slate-200 bg-white px-4 py-2.5 text-sm 
                      focus:border-slate-900 focus:outline-none transition-colors hover:border-slate-300"
                  />
                </div>
                <div className="md:col-span-6">
                  <Label>Currency</Label>
                  <Select
                    value={form.currency}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, currency: e.target.value }))
                    }
                  >
                    <option>LKR</option>
                    <option>USD</option>
                    <option>EUR</option>
                    <option>GBP</option>
                    <option>INR</option>
                  </Select>
                </div>

                <div className="md:col-span-6">
                  <Label>Start Date *</Label>
                  <input
                    type="date"
                    min={today}
                    value={form.startDate}
                    onChange={(e) => {
                      const selected = e.target.value;
                      if (selected && selected < today) return;
                      if (
                        form.deadline &&
                        selected &&
                        form.deadline < selected
                      ) {
                        setForm((f) => ({
                          ...f,
                          startDate: selected,
                          deadline: "",
                        }));
                      } else {
                        setForm((f) => ({ ...f, startDate: selected }));
                      }
                    }}
                    className="w-full border border-slate-200 bg-white px-4 py-2.5 text-sm 
                      focus:border-slate-900 focus:outline-none transition-colors hover:border-slate-300"
                  />
                </div>

                <div className="md:col-span-6">
                  <Label>Deadline *</Label>
                  <input
                    type="date"
                    min={form.startDate || today}
                    value={form.deadline}
                    onChange={(e) => {
                      const selected = e.target.value;
                      if (selected && selected < today) return;
                      if (
                        form.startDate &&
                        selected &&
                        selected < form.startDate
                      )
                        return;
                      setForm((f) => ({ ...f, deadline: selected }));
                    }}
                    className="w-full border border-slate-200 bg-white px-4 py-2.5 text-sm 
                      focus:border-slate-900 focus:outline-none transition-colors hover:border-slate-300"
                  />
                </div>

                <div className="md:col-span-12">
                  <Label>Progress: {form.progress}%</Label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={form.progress}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, progress: e.target.value }))
                    }
                    className="w-full h-1.5 bg-slate-100 cursor-pointer accent-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <MapPin className="h-4 w-4 text-slate-600" />
                <h3 className="text-sm text-slate-900">Location</h3>
              </div>

              <div className="grid gap-6 md:grid-cols-12">
                <div className="md:col-span-12">
                  <Label>Address *</Label>
                  <input
                    value={form.location}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, location: e.target.value }))
                    }
                    placeholder="e.g., Colombo 03"
                    className="w-full border border-slate-200 bg-white px-4 py-2.5 text-sm 
                      focus:border-slate-900 focus:outline-none transition-colors hover:border-slate-300"
                  />
                </div>

                <div className="md:col-span-8">
                  <Label>Map</Label>
                  <div className="border border-slate-200 overflow-hidden">
                    <MapPicker
                      value={mapValue}
                      onChange={(pos) =>
                        setForm((f) => {
                          const newLat = pos?.lat ?? null;
                          const newLon = pos?.lon ?? null;
                          if (f.lat === newLat && f.lon === newLon) return f;
                          return { ...f, lat: newLat, lon: newLon };
                        })
                      }
                      height={240}
                      defaultCenter={{ lat: 6.9271, lon: 79.8612 }}
                    />
                  </div>
                </div>

                <div className="md:col-span-4 space-y-4">
                  <div>
                    <Label>Latitude</Label>
                    <input
                      type="number"
                      step="any"
                      value={form.lat ?? ""}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          lat:
                            e.target.value === ""
                              ? null
                              : Number(e.target.value),
                        }))
                      }
                      placeholder="6.9271"
                      className="w-full border border-slate-200 bg-white px-4 py-2.5 text-sm 
                        focus:border-slate-900 focus:outline-none transition-colors hover:border-slate-300"
                    />
                  </div>
                  <div>
                    <Label>Longitude</Label>
                    <input
                      type="number"
                      step="any"
                      value={form.lon ?? ""}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          lon:
                            e.target.value === ""
                              ? null
                              : Number(e.target.value),
                        }))
                      }
                      placeholder="79.8612"
                      className="w-full border border-slate-200 bg-white px-4 py-2.5 text-sm 
                        focus:border-slate-900 focus:outline-none transition-colors hover:border-slate-300"
                    />
                  </div>
                </div>

                <div className="md:col-span-12">
                  <Label>Description</Label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    placeholder="Project details..."
                    className="w-full border border-slate-200 bg-white px-4 py-3 text-sm 
                      focus:border-slate-900 focus:outline-none transition-colors hover:border-slate-300 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 flex items-center justify-end gap-3">
            {isEditing && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
            <Button type="submit">{isEditing ? "Update" : "Create"}</Button>
          </div>
        </form>

        {error && (
          <div className="flex items-start gap-3 border border-rose-300 bg-rose-50 p-4">
            <AlertTriangle className="h-4 w-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-rose-900 flex-1">{error}</p>
            <button
              onClick={() => setError("")}
              className="text-rose-600 hover:text-rose-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Projects Grid */}
        <div>
          <div className="mb-6">
            <p className="text-sm text-slate-600">
              {projects.length} {projects.length === 1 ? "project" : "projects"}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div className="sm:col-span-2 lg:col-span-3 flex flex-col items-center justify-center border border-dashed border-slate-200 bg-slate-50 p-16">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400 mb-2" />
                <p className="text-sm text-slate-600">Loading...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="sm:col-span-2 lg:col-span-3 flex flex-col items-center justify-center border border-dashed border-slate-200 bg-slate-50 p-16">
                <Building2 className="h-8 w-8 text-slate-300 mb-2" />
                <p className="text-sm text-slate-600">No projects found</p>
              </div>
            ) : (
              projects.map((p) => {
                const dleft = daysLeft(p.deadline);
                const urgency =
                  dleft == null
                    ? ""
                    : dleft < 0
                    ? "text-rose-700 bg-rose-50 border-rose-300"
                    : dleft <= 7
                    ? "text-amber-700 bg-amber-50 border-amber-300"
                    : "text-slate-700 bg-slate-50 border-slate-300";
                const WeatherIcon = weatherIcon(p.weather?.code);
                const meta = statusMeta[p.status] || statusMeta["Planning"];

                return (
                  <article
                    key={p._id}
                    className="border border-slate-200 bg-white hover:border-slate-900 transition-colors"
                  >
                    <div className={`h-1 ${meta.accentColor}`} />

                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-sm text-slate-900 mb-3 line-clamp-2">
                          {p.name}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <StatusBadge value={p.status} />
                          <PriorityBadge value={p.priority} />
                        </div>
                      </div>

                      <div className="space-y-2 text-xs text-slate-600">
                        {p.client && (
                          <div className="flex items-center gap-2">
                            <User className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="truncate">{p.client}</span>
                          </div>
                        )}
                        {p.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="truncate">{p.location}</span>
                          </div>
                        )}
                        {p.owner && (
                          <div className="flex items-center gap-2">
                            <Hammer className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="truncate">{p.owner}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs">
                        <div className="inline-flex items-center gap-1.5 border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-700">
                          <DollarSign className="h-3.5 w-3.5" />
                          {p.budget
                            ? `${p.currency} ${Number(p.budget).toFixed(2)}`
                            : "N/A"}
                        </div>
                        {p.deadline && (
                          <div
                            className={`inline-flex items-center gap-1.5 border px-2.5 py-1 ${urgency}`}
                          >
                            <Clock className="h-3.5 w-3.5" />
                            {dleft < 0
                              ? `Overdue ${Math.abs(dleft)}d`
                              : `${dleft}d`}
                          </div>
                        )}
                      </div>

                      {p.weather && (
                        <div className="border border-slate-200 bg-slate-50 p-3">
                          <div className="flex items-center justify-between gap-3 text-xs text-slate-700">
                            <div className="flex items-center gap-2">
                              <WeatherIcon className="h-4 w-4" />
                              <span>{p.weather.description || "Weather"}</span>
                              <span>{Math.round(p.weather.tempC)}°C</span>
                            </div>
                            <button
                              onClick={() => refreshWeather(p._id)}
                              className="text-slate-600 hover:text-slate-900 transition-colors"
                            >
                              Refresh
                            </button>
                          </div>
                        </div>
                      )}

                      <ProgressBar value={p.progress ?? 0} />

                      {p.description && (
                        <p className="text-xs text-slate-600 line-clamp-2">
                          {p.description}
                        </p>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="subtle"
                          onClick={() => startEdit(p)}
                          className="flex-1 text-xs py-2"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => remove(p._id)}
                          className="flex-1 text-xs py-2 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
