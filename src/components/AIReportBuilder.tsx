import React, { useState } from "react";
import { MarketData } from "../types";
import { Sparkles, FileText, Clipboard, Check, RotateCcw, AlertCircle, RefreshCw } from "lucide-react";

interface AIReportBuilderProps {
  onApplyAiData: (newData: MarketData) => void;
  currentIdea: string;
  setCurrentIdea: (val: string) => void;
  currentTarget: string;
  setCurrentTarget: (val: string) => void;
  currentRegion: string;
  setCurrentRegion: (val: string) => void;
  currentPricing: string;
  setCurrentPricing: (val: string) => void;
}

export const AIReportBuilder: React.FC<AIReportBuilderProps> = ({
  onApplyAiData,
  currentIdea,
  setCurrentIdea,
  currentTarget,
  setCurrentTarget,
  currentRegion,
  setCurrentRegion,
  currentPricing,
  setCurrentPricing,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiReport, setAiReport] = useState<MarketData | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateReport = async () => {
    if (!currentIdea || !currentTarget || !currentRegion) {
      setError("Por favor completa los tres campos básicos para poder formular el análisis de mercado.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-market-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea: currentIdea,
          target: currentTarget,
          region: currentRegion,
          pricing: currentPricing,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ocurrió un error en el servidor de IA.");
      }

      const data = await response.json();
      setAiReport(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!aiReport) return;

    const text = `
# Reporte de Oportunidad de Mercado: ${currentIdea}

## Resumen Ejecutivo
- **Región:** ${currentRegion}
- **Público Objetivo:** ${currentTarget}
- **Estructura de Precios:** ${currentPricing || "Típica del sector"}

## Segmentación del Mercado (TAM, SAM, SOM)

### 1. TAM (Total Addressable Market)
- **Tamaño Estimado:** $${aiReport.tam.value.toLocaleString()} USD anuales
- **Definición:** ${aiReport.tam.definition}
- **Cálculo / Explicación:** ${aiReport.tam.explanation || aiReport.tam.size_explanation}
- **Fuentes de Validación Sugeridas:**
${aiReport.tam.sources?.map((s) => `  - ${s}`).join("\n") || "  - No provistas"}

### 2. SAM (Serviceable Addressable Market)
- **Tamaño Estimado:** $${aiReport.sam.value.toLocaleString()} USD anuales
- **Definición:** ${aiReport.sam.definition}
- **Cálculo / Explicación:** ${aiReport.sam.explanation || aiReport.sam.size_explanation}
- **Fuentes de Validación Sugeridas:**
${aiReport.sam.sources?.map((s) => `  - ${s}`).join("\n") || "  - No provistas"}

### 3. SOM (Serviceable Obtainable Market)
- **Tamaño Estimado:** $${aiReport.som.value.toLocaleString()} USD anuales
- **Definición:** ${aiReport.som.definition}
- **Cálculo / Explicación:** ${aiReport.som.explanation || aiReport.som.size_explanation}
- **Fuentes de Validación Sugeridas:**
${aiReport.som.sources?.map((s) => `  - ${s}`).join("\n") || "  - No provistas"}

## Diagnóstico y Mitigación de Riesgos

### La Trampa del 1% (1% Trap Warning)
${aiReport.trampa_1_percent}

### Evitar la Miopía de Mercado (Market Myopia)
${aiReport.miopia_advice}

## Roles de Diseño (Design Thinking) - Plan de Acción

### Checklist para el Investigador (Validación Cualitativa)
${aiReport.investigador_checklist?.map((item) => `- [ ] ${item}`).join("\n") || "- No provisto"}

### Checklist para el Líder de Estrategia (Ejecución y Ruta)
${aiReport.lider_checklist?.map((item) => `- [ ] ${item}`).join("\n") || "- No provisto"}

---
*Reporte generado de forma cuantitativa mediante Inteligencia Artificial (Gemini 3.5).*
`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyNumbers = () => {
    if (aiReport) {
      onApplyAiData(aiReport);
    }
  };

  return (
    <div id="ai-report-builder" className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 shadow-sm">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 bg-indigo-950/40 text-indigo-400 border border-indigo-500/20 rounded-xl">
          <Sparkles size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#F0F0F0]">
            Generador de Reportes de Oportunidad con IA
          </h2>
          <p className="text-sm text-white/55 mt-1">
            Ingresa tu idea de negocio y el modelo de inteligencia artificial analizará el mercado idóneo, estimará tamaños realistas y redactará advertencias de riesgo personalizadas.
          </p>
        </div>
      </div>

      {/* Inputs Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-medium text-white/75 mb-1.5">
            1. ¿Cuál es tu idea de negocio o solución?
          </label>
          <textarea
            value={currentIdea}
            onChange={(e) => setCurrentIdea(e.target.value)}
            rows={2}
            placeholder="Ej: Un SaaS de telemedicina con videollamadas y recetas electrónicas para clínicas rurales pequeñas..."
            className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-xs font-medium text-white focus:outline-none focus:ring-1 focus:ring-white/30 placeholder-white/30"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/75 mb-1.5">
            2. ¿Quién es tu cliente ideal / nicho inicial?
          </label>
          <textarea
            value={currentTarget}
            onChange={(e) => setCurrentTarget(e.target.value)}
            rows={2}
            placeholder="Ej: Médicos de consultorios particulares y clínicas pequeñas de hasta 5 doctores..."
            className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-xs font-medium text-white focus:outline-none focus:ring-1 focus:ring-white/30 placeholder-white/30"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/75 mb-1.5">
            3. Región Geográfica de Lanzamiento
          </label>
          <input
            type="text"
            value={currentRegion}
            onChange={(e) => setCurrentRegion(e.target.value)}
            placeholder="Ej: Colombia (especialmente Cundinamarca y Boyacá)"
            className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-xs font-medium text-white focus:outline-none focus:ring-1 focus:ring-white/30 placeholder-white/30"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/75 mb-1.5">
            4. Modelo de Precios / Monetización (Opcional)
          </label>
          <input
            type="text"
            value={currentPricing}
            onChange={(e) => setCurrentPricing(e.target.value)}
            placeholder="Ej: $49 USD mensuales por consultorio contratado"
            className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-xs font-medium text-white focus:outline-none focus:ring-1 focus:ring-white/30 placeholder-white/30"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pb-6 border-b border-white/10">
        <button
          id="btn-generate-ai-report"
          onClick={handleGenerateReport}
          disabled={loading}
          className="bg-white hover:bg-white/90 disabled:bg-white/30 disabled:text-white/40 text-[#0A0A0A] font-bold py-2 px-6 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {loading ? (
            <>
              <RefreshCw size={14} className="animate-spin" />
              Escribiendo análisis cuantitativo...
            </>
          ) : (
            <>
              <Sparkles size={14} />
              Generar Reporte Completo con IA
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-950/20 border border-red-500/20 text-red-300 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Generated Report View */}
      {aiReport && !loading && (
        <div id="ai-report-results" className="mt-6 space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-white/[0.03] p-4 rounded-xl border border-white/10">
            <div>
              <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider font-mono">
                Documentación Cuantitativa
              </span>
              <h3 className="text-sm font-bold text-[#F0F0F0] flex items-center gap-1.5">
                <FileText size={16} className="text-indigo-400" />
                Reporte de Oportunidad Listo
              </h3>
            </div>
            <div className="flex gap-2">
              <button
                id="btn-apply-ai-numbers"
                onClick={applyNumbers}
                className="bg-white hover:bg-white/90 text-[#0A0A0A] text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Aplicar Cifras al Gráfico
              </button>
              <button
                id="btn-copy-ai-report"
                onClick={copyToClipboard}
                className="bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
              >
                {copied ? (
                  <>
                    <Check size={12} className="text-emerald-400" /> Copiado
                  </>
                ) : (
                  <>
                    <Clipboard size={12} /> Copiar Markdown
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sizing grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* TAM */}
            <div className="bg-teal-950/5 border border-teal-500/10 rounded-xl p-4">
              <span className="text-[10px] font-bold text-teal-300 bg-teal-950/40 border border-teal-500/20 px-2 py-0.5 rounded-full uppercase tracking-widest font-mono">
                TAM Estimado
              </span>
              <p className="text-xl font-mono font-bold text-teal-300 mt-2">
                ${aiReport.tam.value.toLocaleString()} USD
              </p>
              <p className="text-[11px] text-white/60 font-medium mt-1 leading-relaxed">
                {aiReport.tam.definition}
              </p>
              <div className="mt-3 text-[10px] text-white/50 bg-white/[0.02] p-2 rounded border border-white/5 leading-relaxed">
                <strong>Metodología:</strong> {aiReport.tam.explanation || aiReport.tam.size_explanation}
              </div>
              {aiReport.tam.sources && aiReport.tam.sources.length > 0 && (
                <div className="mt-2">
                  <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider">Fuentes sugeridas:</span>
                  <ul className="list-disc pl-3 text-[9px] text-white/50 space-y-0.5 mt-1">
                    {aiReport.tam.sources.slice(0, 2).map((src, i) => (
                      <li key={i}>{src}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* SAM */}
            <div className="bg-purple-950/5 border border-purple-500/10 rounded-xl p-4">
              <span className="text-[10px] font-bold text-purple-300 bg-purple-950/40 border border-purple-500/20 px-2 py-0.5 rounded-full uppercase tracking-widest font-mono">
                SAM Estimado
              </span>
              <p className="text-xl font-mono font-bold text-purple-300 mt-2">
                ${aiReport.sam.value.toLocaleString()} USD
              </p>
              <p className="text-[11px] text-white/60 font-medium mt-1 leading-relaxed">
                {aiReport.sam.definition}
              </p>
              <div className="mt-3 text-[10px] text-white/50 bg-white/[0.02] p-2 rounded border border-white/5 leading-relaxed">
                <strong>Metodología:</strong> {aiReport.sam.explanation || aiReport.sam.size_explanation}
              </div>
              {aiReport.sam.sources && aiReport.sam.sources.length > 0 && (
                <div className="mt-2">
                  <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider">Fuentes sugeridas:</span>
                  <ul className="list-disc pl-3 text-[9px] text-white/50 space-y-0.5 mt-1">
                    {aiReport.sam.sources.slice(0, 2).map((src, i) => (
                      <li key={i}>{src}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* SOM */}
            <div className="bg-orange-950/5 border border-orange-500/10 rounded-xl p-4">
              <span className="text-[10px] font-bold text-orange-300 bg-orange-950/40 border border-orange-500/20 px-2 py-0.5 rounded-full uppercase tracking-widest font-mono">
                SOM Estimado
              </span>
              <p className="text-xl font-mono font-bold text-orange-400 mt-2">
                ${aiReport.som.value.toLocaleString()} USD
              </p>
              <p className="text-[11px] text-white/60 font-medium mt-1 leading-relaxed">
                {aiReport.som.definition}
              </p>
              <div className="mt-3 text-[10px] text-white/50 bg-white/[0.02] p-2 rounded border border-white/5 leading-relaxed">
                <strong>Metodología:</strong> {aiReport.som.explanation || aiReport.som.size_explanation}
              </div>
              {aiReport.som.sources && aiReport.som.sources.length > 0 && (
                <div className="mt-2">
                  <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider">Fuentes sugeridas:</span>
                  <ul className="list-disc pl-3 text-[9px] text-white/50 space-y-0.5 mt-1">
                    {aiReport.som.sources.slice(0, 2).map((src, i) => (
                      <li key={i}>{src}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Risks Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="border border-red-500/10 rounded-xl p-5 bg-red-950/5">
              <h4 className="font-bold text-red-400 text-xs uppercase tracking-widest font-mono mb-2">
                ⚠️ Mitigación de la Trampa del 1%
              </h4>
              <p className="text-xs text-white/70 leading-relaxed">
                {aiReport.trampa_1_percent}
              </p>
            </div>

            <div className="border border-purple-500/10 rounded-xl p-5 bg-purple-950/5">
              <h4 className="font-bold text-purple-400 text-xs uppercase tracking-widest font-mono mb-2">
                🧭 Evitando la Miopía del Mercado
              </h4>
              <p className="text-xs text-white/70 leading-relaxed">
                {aiReport.miopia_advice}
              </p>
            </div>
          </div>

          {/* Checklist Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="border border-white/5 rounded-xl p-5 bg-white/[0.01]">
              <h4 className="font-bold text-teal-400 text-xs uppercase tracking-widest font-mono mb-3">
                🔍 Tareas para el Investigador (Validación)
              </h4>
              <ul className="space-y-2">
                {aiReport.investigador_checklist?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-white/70">
                    <span className="text-teal-400 font-bold shrink-0">☐</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-white/5 rounded-xl p-5 bg-white/[0.01]">
              <h4 className="font-bold text-purple-400 text-xs uppercase tracking-widest font-mono mb-3">
                🚀 Tareas para el Líder de Estrategia
              </h4>
              <ul className="space-y-2">
                {aiReport.lider_checklist?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-white/70">
                    <span className="text-purple-400 font-bold shrink-0">☐</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Validation Magnitude strategy */}
          <div className="bg-indigo-950/5 border border-indigo-500/10 rounded-xl p-4 text-xs text-white/70">
            <h4 className="font-bold text-indigo-300 uppercase tracking-widest font-mono text-[11px] mb-1.5">
              Estrategia de Validación de Magnitud recomendada por la IA:
            </h4>
            <p className="leading-relaxed text-white/70">{aiReport.validation_strategy}</p>
          </div>
        </div>
      )}
    </div>
  );
};
