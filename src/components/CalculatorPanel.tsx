import React, { useState, useEffect } from "react";
import { MarketData } from "../types";
import { Info, HelpCircle, Check, AlertTriangle, ChevronRight, TrendingUp } from "lucide-react";

interface CalculatorPanelProps {
  onApplyCalculatedData: (newData: MarketData) => void;
}

export const CalculatorPanel: React.FC<CalculatorPanelProps> = ({ onApplyCalculatedData }) => {
  const [activeMethod, setActiveMethod] = useState<"topdown" | "bottomup">("bottomup");

  // --- Top-Down States ---
  const [macroPop, setMacroPop] = useState(1200000); // e.g. total SMEs in Mexico
  const [relevantFilter, setRelevantFilter] = useState(25); // e.g. 25% are fit for SaaS
  const [regionFilter, setRegionFilter] = useState(12); // e.g. 12% in central CDMX
  const [arpuTopDown, setArpuTopDown] = useState(1500); // e.g. $1,500/year subscription
  const [naiveCapture, setNaiveCapture] = useState(1.0); // e.g. "We will capture 1% of SAM"

  // Top-Down Calculations
  const calculatedTamTD = macroPop * arpuTopDown;
  const calculatedSamTD = calculatedTamTD * (relevantFilter / 100) * (regionFilter / 100);
  const calculatedSomTD = calculatedSamTD * (naiveCapture / 100);

  // --- Bottom-Up States (Recommended) ---
  const [localAcquirableClients, setLocalAcquirableClients] = useState(450); // e.g. CDMX gyms we can visit
  const [monthlyPrice, setMonthlyPrice] = useState(99); // Monthly price
  const [salesReps, setSalesReps] = useState(3); // Team of sales people
  const [annualCapacityPerRep, setAnnualCapacityPerRep] = useState(100); // Max gyms a rep can sell & support
  const [totalCountrySMEs, setTotalCountrySMEs] = useState(15000); // Total gyms in the whole country
  const [totalLatamSMEs, setTotalLatamSMEs] = useState(120000); // Total gyms in LATAM

  // Bottom-Up Calculations
  const arpuAnnualBU = monthlyPrice * 12;
  const maxCapacitySOM = salesReps * annualCapacityPerRep;
  const calculatedSomBU = Math.min(localAcquirableClients, maxCapacitySOM) * arpuAnnualBU;
  const calculatedSamBU = totalCountrySMEs * arpuAnnualBU;
  const calculatedTamBU = totalLatamSMEs * arpuAnnualBU;

  // Warning check for 1% Trap on Top-Down
  const showTDWarning = naiveCapture <= 1.5;

  const handleApplyTopDown = () => {
    const marketData: MarketData = {
      currency: "USD",
      tam: {
        name: "TAM (Total Addressable Market)",
        value: calculatedTamTD,
        definition: "Demanda total global calculada por método Top-Down basándose en indicadores macroeconómicos amplios.",
        explanation: `Basado en un universo macro de ${macroPop.toLocaleString()} unidades multiplicado por un ARPU anual de $${arpuTopDown.toLocaleString()} USD.`
      },
      sam: {
        name: "SAM (Serviceable Addressable Market)",
        value: calculatedSamTD,
        definition: "Segmento del mercado total que encaja con los criterios geográficos y de tecnología iniciales.",
        explanation: `Calculado aplicando un filtro de idoneidad del ${relevantFilter}% y un alcance geográfico del ${regionFilter}% sobre el TAM.`
      },
      som: {
        name: "SOM (Serviceable Obtainable Market)",
        value: calculatedSomTD,
        definition: "Mercado que pretendemos capturar inicialmente a corto plazo mediante esfuerzo de ventas.",
        explanation: `Estimado aplicando un porcentaje de captura teórica del ${naiveCapture}% sobre el SAM total.`
      },
      trampa_1_percent: showTDWarning 
        ? `¡Atención! Has definido un SOM basado en una penetración fija del ${naiveCapture}%. Esto es el núcleo de la 'Trampa del 1%'. Sin un plan de ventas directo (Bottom-Up) que justifique cómo tu equipo comercial adquirirá esos clientes específicos, esta cifra es solo una suposición de escritorio. ¡Te recomendamos usar el método Bottom-Up!`
        : `Has definido una captura del ${naiveCapture}% del SAM. Recuerda validar la capacidad operativa de tu equipo para adquirir y dar soporte a este volumen de clientes.`,
      miopia_advice: "Evita la miopía asumiendo que todos los miembros de la macro población son clientes idénticos. Ajusta los filtros cualitativos para reflejar a los compradores reales."
    };
    onApplyCalculatedData(marketData);
  };

  const handleApplyBottomUp = () => {
    const marketData: MarketData = {
      currency: "USD",
      tam: {
        name: "TAM (Total Addressable Market)",
        value: calculatedTamBU,
        definition: "Demanda total universal del sector proyectada basándose en el volumen total continental.",
        explanation: `Universo de ${totalLatamSMEs.toLocaleString()} clientes potenciales a nivel continental, con un ARPU anualizado de $${arpuAnnualBU.toLocaleString()} USD.`
      },
      sam: {
        name: "SAM (Serviceable Addressable Market)",
        value: calculatedSamBU,
        definition: "La parte del mercado que tu modelo de negocio y cobertura geográfica del país pueden servir de forma óptima.",
        explanation: `Foco a nivel país de ${totalCountrySMEs.toLocaleString()} clientes calificados que cuentan con la infraestructura para usar el producto.`
      },
      som: {
        name: "SOM (Serviceable Obtainable Market)",
        value: calculatedSomBU,
        definition: "El mercado realista que podemos capturar en el corto plazo basándonos en nuestra capacidad operativa y de ventas directa.",
        explanation: `Basado en adquirir un máximo de ${Math.min(localAcquirableClients, maxCapacitySOM)} clientes en la región piloto mediante ${salesReps} ejecutivos de ventas (capacidad total: ${maxCapacitySOM} clientes).`
      },
      trampa_1_percent: `Este SOM del Bottom-Up está basado en TU CAPACIDAD REAL de ventas (máximo ${maxCapacitySOM} clientes). Es inmune a la trampa del 1% porque no asume una porción pasiva de un gran pastel, sino que calcula activamente cuántas visitas y cierres puede realizar tu equipo en el terreno.`,
      miopia_advice: "Al trabajar Bottom-Up, asegúrate de que el nicho inicial (SOM) no sea tan pequeño que no te permita validar un modelo de negocio escalable. Usa el feedback para expandir el SAM del país.",
      investigador_checklist: [
        `Mapear y listar con nombre propio los primeros ${Math.min(100, localAcquirableClients)} leads calificados de la zona central.`,
        "Entrevistar a los primeros prospectos para confirmar si el precio mensual de $" + monthlyPrice + " USD es aceptable.",
        "Medir el ciclo de venta promedio: ¿cuántos días toma desde el primer contacto hasta la firma del contrato?"
      ],
      lider_checklist: [
        `Asignar cuotas claras de prospección semanal para los ${salesReps} ejecutivos de ventas.`,
        "Garantizar que el Onboarding inicial sea impecable para mantener la tasa de retención cerca del 100%.",
        "Estructurar un programa de referidos locales para acelerar el crecimiento del SOM orgánicamente."
      ]
    };
    onApplyCalculatedData(marketData);
  };

  return (
    <div id="calculator-panel" className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 shadow-sm">
      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-6">
        <button
          id="tab-bottomup"
          onClick={() => setActiveMethod("bottomup")}
          className={`flex-1 pb-3 text-sm font-semibold border-b-2 text-center transition-all cursor-pointer ${
            activeMethod === "bottomup"
              ? "border-emerald-500 text-emerald-400"
              : "border-transparent text-white/40 hover:text-white/70"
          }`}
        >
          Análisis Bottom-Up (Recomendado)
          <span className="block text-[10px] text-emerald-400/80 font-normal mt-0.5">
            Basado en capacidad real de ventas
          </span>
        </button>
        <button
          id="tab-topdown"
          onClick={() => setActiveMethod("topdown")}
          className={`flex-1 pb-3 text-sm font-semibold border-b-2 text-center transition-all cursor-pointer ${
            activeMethod === "topdown"
              ? "border-indigo-500 text-indigo-400"
              : "border-transparent text-white/40 hover:text-white/70"
          }`}
        >
          Análisis Top-Down (Teórico)
          <span className="block text-[10px] text-indigo-400/80 font-normal mt-0.5">
            Basado en estadísticas macro
          </span>
        </button>
      </div>

      {/* METHOD A: BOTTOM-UP (RECOMENDADO) */}
      {activeMethod === "bottomup" && (
        <div id="bottom-up-calculator" className="space-y-6">
          <div className="p-4 bg-emerald-950/20 rounded-xl border border-emerald-500/10 text-xs text-emerald-300 leading-relaxed flex items-start gap-2.5">
            <Info size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong>¿Por qué es el método más realista?</strong> El análisis <strong>Bottom-Up</strong> se construye de abajo hacia arriba. En lugar de soñar con capturar un pedazo de un mercado nacional gigantesco, calculas cuántos clientes puedes visitar, venderles y darles servicio directamente con tu estructura actual.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input fields column */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest font-mono">
                Parámetros de Capacidad Operativa
              </h3>

              <div>
                <label className="block text-xs font-medium text-white/75 mb-1.5">
                  Clientes locales calificados identificados (en tu zona piloto)
                </label>
                <input
                  type="number"
                  value={localAcquirableClients}
                  onChange={(e) => setLocalAcquirableClients(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-1.5 text-sm font-medium text-white focus:outline-none focus:ring-1 focus:ring-white/30"
                />
                <p className="text-[10px] text-white/40 mt-1">
                  El número total de prospectos en tu área de alcance inicial (ej: gimnasios en CDMX).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/75 mb-1.5">
                    Precio mensual / Ticket medio
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-xs">$</span>
                    <input
                      type="number"
                      value={monthlyPrice}
                      onChange={(e) => setMonthlyPrice(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-lg pl-6 pr-3 py-1.5 text-sm font-medium text-white focus:outline-none focus:ring-1 focus:ring-white/30"
                    />
                  </div>
                  <p className="text-[10px] text-white/40 mt-1">USD por cliente/mes</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/75 mb-1.5">
                    ARPU Anualizado
                  </label>
                  <div className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3 py-1.5 text-sm font-bold text-white/60">
                    ${arpuAnnualBU.toLocaleString()} USD
                  </div>
                  <p className="text-[10px] text-white/40 mt-1">Suscripción anual</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/75 mb-1.5">
                    Vendedores en el equipo
                  </label>
                  <input
                    type="number"
                    value={salesReps}
                    onChange={(e) => setSalesReps(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-1.5 text-sm font-medium text-white focus:outline-none focus:ring-1 focus:ring-white/30"
                  />
                  <p className="text-[10px] text-white/40 mt-1">Ejecutivos comerciales dedicados.</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/75 mb-1.5">
                    Capacidad anual de cuentas / vendedor
                  </label>
                  <input
                    type="number"
                    value={annualCapacityPerRep}
                    onChange={(e) => setAnnualCapacityPerRep(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-1.5 text-sm font-medium text-white focus:outline-none focus:ring-1 focus:ring-white/30"
                  />
                  <p className="text-[10px] text-white/40 mt-1">Clientes máximos que un vendedor puede adquirir/atender.</p>
                </div>
              </div>

              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest font-mono pt-2">
                Escala Macro de Mercado (SAM y TAM)
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/75 mb-1.5">
                    Total clientes calificados país (SAM)
                  </label>
                  <input
                    type="number"
                    value={totalCountrySMEs}
                    onChange={(e) => setTotalCountrySMEs(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-1.5 text-sm font-medium text-white focus:outline-none focus:ring-1 focus:ring-white/30"
                  />
                  <p className="text-[10px] text-white/40 mt-1">Ej: Gimnasios en México.</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/75 mb-1.5">
                    Total clientes calificados LATAM (TAM)
                  </label>
                  <input
                    type="number"
                    value={totalLatamSMEs}
                    onChange={(e) => setTotalLatamSMEs(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-1.5 text-sm font-medium text-white focus:outline-none focus:ring-1 focus:ring-white/30"
                  />
                  <p className="text-[10px] text-white/40 mt-1">Ej: Gimnasios en todo LATAM.</p>
                </div>
              </div>
            </div>

            {/* Calculations results column */}
            <div className="bg-white/[0.01] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                  <TrendingUp size={14} /> Resultados de Estimación Bottom-Up
                </h4>

                <div className="space-y-3">
                  <div className="p-3 bg-white/[0.03] border border-white/5 rounded-lg">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-xs font-bold text-white/40">TAM (Continental)</span>
                      <span className="text-xs bg-teal-950/40 text-teal-300 border border-teal-500/20 px-2 py-0.5 rounded font-mono">Total</span>
                    </div>
                    <p className="text-lg font-mono font-bold text-teal-300">
                      ${calculatedTamBU.toLocaleString()} USD <span className="text-xs font-normal text-white/40">/ año</span>
                    </p>
                    <p className="text-[10px] text-white/40 mt-1">
                      {totalLatamSMEs.toLocaleString()} clientes potenciales en LATAM x ${arpuAnnualBU.toLocaleString()} ARPU.
                    </p>
                  </div>

                  <div className="p-3 bg-white/[0.03] border border-white/5 rounded-lg">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-xs font-bold text-white/40">SAM (Servible País)</span>
                      <span className="text-xs bg-purple-950/40 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded font-mono">
                        {((totalCountrySMEs / totalLatamSMEs) * 100).toFixed(1)}% de TAM
                      </span>
                    </div>
                    <p className="text-lg font-mono font-bold text-purple-300">
                      ${calculatedSamBU.toLocaleString()} USD <span className="text-xs font-normal text-white/40">/ año</span>
                    </p>
                    <p className="text-[10px] text-white/40 mt-1">
                      {totalCountrySMEs.toLocaleString()} clientes en tu país x ${arpuAnnualBU.toLocaleString()} ARPU.
                    </p>
                  </div>

                  <div className="p-3 bg-white/[0.03] border border-white/5 rounded-lg border-l-4 border-l-orange-500">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-xs font-bold text-white/80">SOM (Obtenible Realista)</span>
                      <span className="text-xs bg-orange-950/40 text-orange-300 border border-orange-500/20 px-2 py-0.5 rounded font-mono">
                        {((calculatedSomBU / calculatedSamBU) * 100).toFixed(1)}% de SAM
                      </span>
                    </div>
                    <p className="text-lg font-mono font-bold text-orange-400">
                      ${calculatedSomBU.toLocaleString()} USD <span className="text-xs font-normal text-white/40">/ año</span>
                    </p>
                    <p className="text-[10px] text-white/40 mt-1">
                      Limitado por tu capacidad máxima de {maxCapacitySOM} clientes en total ({salesReps} x {annualCapacityPerRep}).
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <button
                  id="apply-bottom-up-btn"
                  onClick={handleApplyBottomUp}
                  className="w-full bg-white hover:bg-white/90 text-[#0A0A0A] font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  ¡Aplicar estos números al Visualizador de Círculos!
                  <ChevronRight size={14} />
                </button>
                <p className="text-[10px] text-white/30 text-center mt-2">
                  Esto actualizará el gráfico circular central para que coincida con tus estimaciones Bottom-Up.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* METHOD B: TOP-DOWN (TEÓRICO) */}
      {activeMethod === "topdown" && (
        <div id="top-down-calculator" className="space-y-6">
          <div className="p-4 bg-indigo-950/20 rounded-xl border border-indigo-500/10 text-xs text-indigo-300 leading-relaxed flex items-start gap-2.5">
            <Info size={16} className="text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong>¿Qué es el método Top-Down?</strong> Consiste en tomar un número macro muy grande (por ejemplo, "población total de un país") e ir aplicando filtros o porcentajes hacia abajo para deducir el SAM y SOM. Es útil como primer filtro global, pero suele pecar de optimista si los filtros no son severos.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input fields column */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest font-mono">
                Filtros del Embudo Teórico
              </h3>

              <div>
                <label className="block text-xs font-medium text-white/75 mb-1.5">
                  Población o mercado macro total (Unidades)
                </label>
                <input
                  type="number"
                  value={macroPop}
                  onChange={(e) => setMacroPop(Math.max(100, parseInt(e.target.value) || 0))}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-1.5 text-sm font-medium text-white focus:outline-none focus:ring-1 focus:ring-white/30"
                />
                <p className="text-[10px] text-white/40 mt-1">
                  El tamaño total del universo macroeconómico sin barreras.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/75 mb-1.5">
                    ARPU Anual estimado (USD)
                  </label>
                  <input
                    type="number"
                    value={arpuTopDown}
                    onChange={(e) => setArpuTopDown(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-1.5 text-sm font-medium text-white focus:outline-none focus:ring-1 focus:ring-white/30"
                  />
                  <p className="text-[10px] text-white/40 mt-1">
                    Gasto promedio por cliente al año.
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/75 mb-1.5">
                    TAM Potencial
                  </label>
                  <div className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3 py-1.5 text-sm font-bold text-white/60">
                    ${calculatedTamTD.toLocaleString()} USD
                  </div>
                  <p className="text-[10px] text-white/40 mt-1">Macro población x ARPU</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/75 mb-1.5">
                    Filtro Idoneidad (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={relevantFilter}
                    onChange={(e) => setRelevantFilter(Math.min(100, Math.max(1, parseFloat(e.target.value) || 0)))}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-1.5 text-sm font-medium text-white focus:outline-none focus:ring-1 focus:ring-white/30"
                  />
                  <p className="text-[10px] text-white/40 mt-1">% que realmente encaja con el producto.</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/75 mb-1.5">
                    Filtro Geográfico (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={regionFilter}
                    onChange={(e) => setRegionFilter(Math.min(100, Math.max(1, parseFloat(e.target.value) || 0)))}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-1.5 text-sm font-medium text-white focus:outline-none focus:ring-1 focus:ring-white/30"
                  />
                  <p className="text-[10px] text-white/40 mt-1">% ubicado en la región accesible inicial.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/75 mb-1.5">
                  % de captura estimado para el SOM (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="100"
                  value={naiveCapture}
                  onChange={(e) => setNaiveCapture(Math.min(100, Math.max(0.1, parseFloat(e.target.value) || 0)))}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-1.5 text-sm font-medium text-white focus:outline-none focus:ring-1 focus:ring-white/30"
                />
                <p className="text-[10px] text-white/40 mt-1">
                  El porcentaje teórico que esperas capturar del SAM.
                </p>
              </div>
            </div>

            {/* Calculations results column */}
            <div className="bg-white/[0.01] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-widest font-mono">
                  Resultados de Estimación Top-Down
                </h4>

                <div className="space-y-3">
                  <div className="p-3 bg-white/[0.03] border border-white/5 rounded-lg">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-xs font-bold text-white/40">TAM (Mercado Absoluto)</span>
                    </div>
                    <p className="text-lg font-mono font-bold text-teal-300">
                      ${calculatedTamTD.toLocaleString()} USD <span className="text-xs font-normal text-white/40">/ año</span>
                    </p>
                  </div>

                  <div className="p-3 bg-white/[0.03] border border-white/5 rounded-lg">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-xs font-bold text-white/40">SAM (Foco Filtrado)</span>
                      <span className="text-xs bg-indigo-950/40 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded font-mono">
                        {((relevantFilter * regionFilter) / 100).toFixed(2)}% de TAM
                      </span>
                    </div>
                    <p className="text-lg font-mono font-bold text-purple-300">
                      ${calculatedSamTD.toLocaleString()} USD <span className="text-xs font-normal text-white/40">/ año</span>
                    </p>
                  </div>

                  <div className="p-3 bg-white/[0.03] border border-white/5 rounded-lg relative overflow-hidden">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-xs font-bold text-white/40">SOM (Obtenible Teórico)</span>
                      <span className="text-xs bg-orange-950/40 text-orange-300 border border-orange-500/20 px-2 py-0.5 rounded font-mono">
                        {naiveCapture}% de SAM
                      </span>
                    </div>
                    <p className="text-lg font-mono font-bold text-orange-400">
                      ${calculatedSomTD.toLocaleString()} USD <span className="text-xs font-normal text-white/40">/ año</span>
                    </p>
                  </div>
                </div>

                {/* The 1% Trap Warning Trigger */}
                {showTDWarning && (
                  <div className="p-3 bg-amber-950/20 border border-amber-500/20 text-amber-300 rounded-lg text-xs flex items-start gap-2 animate-pulse">
                    <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>¡Trampa del 1% Detectada!</strong> Has estimado una captura estática de solo el {naiveCapture}%. En el pitch deck se ve fácil, pero en la realidad, competir sin foco encarece el marketing y reduce los beneficios a cero. Intenta el método Bottom-Up.
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <button
                  id="apply-top-down-btn"
                  onClick={handleApplyTopDown}
                  className="w-full bg-white hover:bg-white/90 text-[#0A0A0A] font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  ¡Aplicar estos números al Visualizador de Círculos!
                  <ChevronRight size={14} />
                </button>
                <p className="text-[10px] text-white/30 text-center mt-2">
                  Esto actualizará el gráfico circular central para que coincida con tus estimaciones Top-Down.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
