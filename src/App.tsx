import { useState, useEffect } from "react";
import { MarketData, IndustryPreset } from "./types";
import { INDUSTRY_PRESETS } from "./data/presets";
import { MarketTargetChart } from "./components/MarketTargetChart";
import { CalculatorPanel } from "./components/CalculatorPanel";
import { AIReportBuilder } from "./components/AIReportBuilder";
import { CompanyGameSimulator } from "./components/CompanyGameSimulator";
import { LearnPanel } from "./components/LearnPanel";
import {
  Activity,
  Leaf,
  GraduationCap,
  Info,
  TrendingUp,
  Compass,
  Sparkles,
  Calculator,
  Award,
  ShieldAlert,
  BookOpen,
  Play,
  HelpCircle,
  FileText,
  UserCheck
} from "lucide-react";

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<"dashboard" | "calculator" | "ai" | "simulator" | "learn">("dashboard");

  // Presets & Active State
  const [selectedPresetId, setSelectedPresetId] = useState<string>("saas_gym");
  const [marketData, setMarketData] = useState<MarketData>(INDUSTRY_PRESETS[0].data);
  const [activeSegment, setActiveSegment] = useState<"tam" | "sam" | "som">("som");

  // Form states for Custom AI Report (shared, so we don't lose typed data between tabs)
  const [customIdea, setCustomIdea] = useState("");
  const [customTarget, setCustomTarget] = useState("");
  const [customRegion, setCustomRegion] = useState("");
  const [customPricing, setCustomPricing] = useState("");

  // Select Preset handler
  const selectPreset = (preset: IndustryPreset) => {
    setSelectedPresetId(preset.id);
    setMarketData(preset.data);
    // Auto-populate AI generator fields so the user can easily tweak them or run an AI report for it!
    setCustomIdea(preset.idea);
    setCustomTarget(preset.target);
    setCustomRegion(preset.region);
    setCustomPricing(preset.pricing);
  };

  // Setup initial form states based on first preset
  useEffect(() => {
    const defaultPreset = INDUSTRY_PRESETS[0];
    setCustomIdea(defaultPreset.idea);
    setCustomTarget(defaultPreset.target);
    setCustomRegion(defaultPreset.region);
    setCustomPricing(defaultPreset.pricing);
  }, []);

  // Handler when custom calculated data or AI data is applied
  const handleApplyNewData = (newData: MarketData) => {
    setMarketData(newData);
    setSelectedPresetId("custom");
    setActiveTab("dashboard"); // Go back to dashboard to see results
  };

  const activePreset = INDUSTRY_PRESETS.find((p) => p.id === selectedPresetId);

  // Helper for rendering preset icons
  const renderPresetIcon = (iconName: string) => {
    switch (iconName) {
      case "Activity":
        return <Activity size={16} />;
      case "Leaf":
        return <Leaf size={16} />;
      case "GraduationCap":
        return <GraduationCap size={16} />;
      default:
        return <Activity size={16} />;
    }
  };

  // Active segment data details
  const getActiveSegmentDetails = () => {
    if (activeSegment === "tam") return marketData.tam;
    if (activeSegment === "sam") return marketData.sam;
    return marketData.som;
  };

  const segmentDetails = getActiveSegmentDetails();

  return (
    <div className="min-h-screen bg-[#0A0A0A] font-sans text-[#F0F0F0] antialiased selection:bg-white/10 selection:text-white pb-16">
      {/* HEADER SECTION */}
      <header id="app-header" className="bg-[#0A0A0A] border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between py-5 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white flex items-center justify-center rounded-sm shrink-0">
                  <div className="w-4 h-4 bg-[#0A0A0A]"></div>
                </div>
                <h1 className="text-lg font-light tracking-[0.2em] uppercase text-white">
                  MarketOpportunity <span className="text-white/40 font-mono text-[10px]">v4.2</span>
                </h1>
              </div>
              <p className="text-[10px] tracking-widest text-white/40 uppercase mt-1">
                De la Visión a la Realidad: Analizador, Simulador y Generador de Oportunidad con IA
              </p>
            </div>

            {/* Main Tabs Navigation */}
            <nav id="app-nav" className="flex flex-wrap gap-1 bg-white/5 p-1 rounded-xl border border-white/10 self-start md:self-auto">
              <button
                id="nav-dashboard"
                onClick={() => setActiveTab("dashboard")}
                className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-medium rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "dashboard"
                    ? "bg-white text-[#0A0A0A] font-bold shadow-xs"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <TrendingUp size={13} />
                Visualizador
              </button>
              <button
                id="nav-calculator"
                onClick={() => setActiveTab("calculator")}
                className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-medium rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "calculator"
                    ? "bg-white text-[#0A0A0A] font-bold shadow-xs"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Calculator size={13} />
                Calculadoras
              </button>
              <button
                id="nav-ai"
                onClick={() => setActiveTab("ai")}
                className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-medium rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "ai"
                    ? "bg-white text-indigo-900 border border-indigo-100/50 font-bold shadow-xs"
                    : "text-indigo-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Sparkles size={13} className="text-indigo-400" />
                Reporte IA
              </button>
              <button
                id="nav-simulator"
                onClick={() => setActiveTab("simulator")}
                className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-medium rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "simulator"
                    ? "bg-white text-[#0A0A0A] font-bold shadow-xs"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Play size={13} />
                Simulador Game
              </button>
              <button
                id="nav-learn"
                onClick={() => setActiveTab("learn")}
                className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-medium rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "learn"
                    ? "bg-white text-[#0A0A0A] font-bold shadow-xs"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <BookOpen size={13} />
                Aprender Hub
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* SUB-HEADER: PRESETS LOADER */}
      <section id="preset-selector-bar" className="bg-white/[0.02] border-b border-white/10 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[9px] uppercase tracking-[0.2em] text-white/40">
              Casos de Estudio:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {INDUSTRY_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  id={`preset-${preset.id}`}
                  onClick={() => selectPreset(preset)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedPresetId === preset.id
                      ? "bg-white/15 border-white/30 text-white shadow-xs"
                      : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {renderPresetIcon(preset.icon)}
                  {preset.name}
                </button>
              ))}
              <button
                disabled
                className={`px-2.5 py-1 rounded-md text-xs font-medium border cursor-not-allowed ${
                  selectedPresetId === "custom"
                    ? "bg-purple-900/40 border-purple-500/30 text-purple-200"
                    : "hidden"
                }`}
              >
                <Activity size={16} />
                Análisis Personalizado
              </button>
            </div>
          </div>

          <div className="text-[11px] text-white/50">
            {activePreset ? (
              <span>
                Foco actual: <strong className="text-white font-medium">{activePreset.region}</strong> • {activePreset.category}
              </span>
            ) : (
              <span>Parámetros calculados manualmente</span>
            )}
          </div>
        </div>
      </section>

      {/* MAIN BODY CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* TAB 1: VISUALIZER / DASHBOARD */}
        {activeTab === "dashboard" && (
          <div id="tab-content-dashboard" className="space-y-8 animate-fade-in">
            {/* Split layout: Visual concentric circle + Details Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column (Circles Visualizer) */}
              <div className="lg:col-span-5 flex flex-col">
                <MarketTargetChart
                  data={marketData}
                  activeSegment={activeSegment}
                  setActiveSegment={(seg) => setActiveSegment(seg)}
                />
              </div>

              {/* Right Column (Focus segment detail card) */}
              <div className="lg:col-span-7 flex flex-col justify-between bg-white/[0.02] border border-white/10 rounded-2xl p-6 shadow-sm">
                <div>
                  {/* Header info */}
                  <div className="flex justify-between items-start pb-4 border-b border-white/10">
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.2em] text-white/40">
                        Segmento de Mercado Seleccionado
                      </span>
                      <h2 className="text-2xl font-serif italic font-light text-white mt-1">
                        {segmentDetails.name}
                      </h2>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] uppercase tracking-[0.2em] text-white/40">
                        Valor Estimado (Anual)
                      </span>
                      <p className="text-3xl font-serif font-light text-white mt-1">
                        ${segmentDetails.value.toLocaleString()} <span className="text-xs font-normal text-white/40">USD</span>
                      </p>
                    </div>
                  </div>

                  {/* Body description */}
                  <div className="mt-5 space-y-4">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">
                        Definición del Concepto
                      </h4>
                      <p className="text-sm text-white/80 leading-relaxed font-sans font-light">
                        {segmentDetails.definition}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">
                        Explicación Cuantitativa y Cálculo
                      </h4>
                      <p className="text-sm text-white/70 leading-relaxed bg-white/[0.03] p-4 rounded-xl border border-white/5 font-light">
                        {segmentDetails.explanation || "No hay explicación cuantitativa disponible. Utiliza las calculadoras o la IA para formular un cálculo robusto."}
                      </p>
                    </div>

                    {segmentDetails.sources && segmentDetails.sources.length > 0 && (
                      <div>
                        <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1.5">
                          Metodologías de Validación de Magnitud (Fuentes de Datos)
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {segmentDetails.sources.map((source, idx) => (
                            <div key={idx} className="bg-white/[0.03] border border-white/5 rounded-lg p-2.5 flex items-start gap-2">
                              <span className="text-white/60 text-xs mt-0.5">✔</span>
                              <span className="text-[11px] text-white/80 font-medium leading-tight">
                                {source}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer advice / Warnings */}
                <div className="mt-8 pt-5 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <Info size={14} />
                    <span>Haz clic en cualquiera de los círculos del gráfico para explorar su desglose.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Opportunities Diagnosis & Checklists (from preset or generated) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Risks (1% trap & myopia) */}
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 shadow-sm space-y-5">
                <h3 className="text-sm font-medium uppercase tracking-wider text-white/80 flex items-center gap-1.5 pb-2 border-b border-white/10">
                  <ShieldAlert className="text-red-400" size={18} />
                  Diagnóstico de Riesgos de Mercado
                </h3>

                <div>
                  <h4 className="text-xs font-semibold text-red-300 flex items-center gap-1 mb-1">
                    La Trampa del 1%
                  </h4>
                  <p className="text-xs text-white/60 leading-relaxed font-light">
                    {marketData.trampa_1_percent || "La trampa de asumir pasivamente el 1% de un mercado gigante suele dejar un beneficio neto de cero. Lanza campañas ultra-focadas en tu SOM."}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-purple-300 flex items-center gap-1 mb-1">
                    Miopía del Mercado
                  </h4>
                  <p className="text-xs text-white/60 leading-relaxed font-light">
                    {marketData.miopia_advice || "No delimites tu producto tan estrechamente que ignore la competencia colateral, ni tan ampliamente que se pierda tu propuesta de valor."}
                  </p>
                </div>
              </div>

              {/* Actionable Checklists (Design thinking) */}
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 shadow-sm space-y-5">
                <h3 className="text-sm font-medium uppercase tracking-wider text-white/80 flex items-center gap-1.5 pb-2 border-b border-white/10">
                  <UserCheck className="text-teal-400" size={18} />
                  Roles de Diseño: Plan de Acción
                </h3>

                {marketData.investigador_checklist && marketData.investigador_checklist.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-semibold text-teal-300 mb-2 flex items-center gap-1 uppercase tracking-wider">
                        🔍 Investigador (Validar)
                      </h4>
                      <ul className="space-y-1.5">
                        {marketData.investigador_checklist.map((item, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-[11px] text-white/70 leading-relaxed font-light">
                            <span className="text-teal-400 font-bold">☐</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-violet-300 mb-2 flex items-center gap-1 uppercase tracking-wider">
                        🚀 Líder (Lanzar)
                      </h4>
                      <ul className="space-y-1.5">
                        {marketData.lider_checklist?.map((item, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-[11px] text-white/70 leading-relaxed font-light">
                            <span className="text-violet-400 font-bold">☐</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-xs text-white/40">
                      Usa el <strong>Generador de Reportes de IA</strong> para crear checklists accionables personalizados para tu startup.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CALCULATOR */}
        {activeTab === "calculator" && (
          <div id="tab-content-calculator" className="animate-fade-in">
            <CalculatorPanel onApplyCalculatedData={handleApplyNewData} />
          </div>
        )}

        {/* TAB 3: AI GENERATOR */}
        {activeTab === "ai" && (
          <div id="tab-content-ai" className="animate-fade-in">
            <AIReportBuilder
              onApplyAiData={handleApplyNewData}
              currentIdea={customIdea}
              setCurrentIdea={setCustomIdea}
              currentTarget={customTarget}
              setCurrentTarget={setCustomTarget}
              currentRegion={customRegion}
              setCurrentRegion={setCustomRegion}
              currentPricing={customPricing}
              setCurrentPricing={setCustomPricing}
            />
          </div>
        )}

        {/* TAB 4: SIMULATOR */}
        {activeTab === "simulator" && (
          <div id="tab-content-simulator" className="animate-fade-in">
            <CompanyGameSimulator data={marketData} />
          </div>
        )}

        {/* TAB 5: LEARN HUB */}
        {activeTab === "learn" && (
          <div id="tab-content-learn" className="animate-fade-in">
            <LearnPanel />
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer id="app-footer" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-white/10 text-center">
        <p className="text-[10px] text-white/30 tracking-widest uppercase">
          Valuador de Mercado TAM, SAM y SOM • Diseñado de forma interactiva con Inteligencia Artificial (Gemini 3.5) • Conforme con metodologías ágiles y Design Thinking para startups.
        </p>
      </footer>
    </div>
  );
}
