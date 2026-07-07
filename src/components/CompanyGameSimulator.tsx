import React, { useState, useEffect } from "react";
import { MarketData, SimYearData } from "../types";
import { Play, TrendingUp, DollarSign, Users, Award, ShieldCheck } from "lucide-react";

interface CompanyGameSimulatorProps {
  data: MarketData;
}

export const CompanyGameSimulator: React.FC<CompanyGameSimulatorProps> = ({ data }) => {
  const somVal = data.som.value || 100000;
  const samVal = data.sam.value || 1000000;
  const tamVal = data.tam.value || 10000000;

  const [somBase, setSomBase] = useState(somVal);
  const [annualGrowthRate, setAnnualGrowthRate] = useState(35); // 35% compound annual growth
  const [profitMargin, setProfitMargin] = useState(25); // 25% profit margin
  const [simulationResults, setSimulationResults] = useState<SimYearData[]>([]);

  // Update base when parent state updates
  useEffect(() => {
    setSomBase(somVal);
  }, [somVal]);

  const runSimulation = () => {
    const results: SimYearData[] = [];
    let currentRevenue = somBase;
    let accumulatedProfit = 0;

    // Estimate average customer price based on typical values
    const averageCustomerValueAnual = Math.round(somBase / 100) || 1200;

    for (let year = 1; year <= 5; year++) {
      if (year > 1) {
        // Grow revenue
        currentRevenue = currentRevenue * (1 + annualGrowthRate / 100);
      }

      // Ensure we don't exceed the SAM!
      if (currentRevenue > samVal) {
        currentRevenue = samVal;
      }

      const yearlyProfit = currentRevenue * (profitMargin / 100);
      accumulatedProfit += yearlyProfit;

      const penetration = (currentRevenue / samVal) * 100;
      const estimatedCustomers = Math.round(currentRevenue / averageCustomerValueAnual);

      results.push({
        year,
        somRevenue: Math.round(currentRevenue),
        penetration: parseFloat(penetration.toFixed(1)),
        accumulatedProfit: Math.round(accumulatedProfit),
        customers: estimatedCustomers
      });
    }

    setSimulationResults(results);
  };

  // Run automatically on load or change
  useEffect(() => {
    runSimulation();
  }, [somBase, annualGrowthRate, profitMargin, samVal]);

  return (
    <div id="company-game-simulator" className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 shadow-sm">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 rounded-xl">
          <Play size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#F0F0F0]">
            Simulador de Negocio: "Company Game"
          </h2>
          <p className="text-sm text-white/55 mt-1">
            Proyecta la demanda, el crecimiento de ingresos y la tasa de penetración de mercado de tu startup a 5 años partiendo de tu SOM (Serviceable Obtainable Market) inicial.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-white/[0.01] border border-white/5 p-4 rounded-xl">
        <div>
          <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest font-mono mb-2">
            Base SOM Año 1 (USD / Anual)
          </label>
          <input
            type="number"
            value={somBase}
            onChange={(e) => setSomBase(Math.max(1000, parseInt(e.target.value) || 0))}
            className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-sm font-medium text-white focus:outline-none focus:ring-1 focus:ring-white/30"
          />
          <p className="text-[10px] text-white/40 mt-1">
            Tu SOM inicial seleccionado o calculado.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest font-mono mb-2">
            Tasa de Crecimiento Anual (%)
          </label>
          <input
            type="range"
            min="10"
            max="120"
            step="5"
            value={annualGrowthRate}
            onChange={(e) => setAnnualGrowthRate(parseInt(e.target.value))}
            className="w-full accent-white cursor-pointer"
          />
          <div className="flex justify-between text-xs font-mono text-white/40 mt-1">
            <span>Conservador (10%)</span>
            <span className="font-bold text-emerald-400">{annualGrowthRate}%</span>
            <span>Agresivo (120%)</span>
          </div>
          <p className="text-[10px] text-white/40 mt-1">
            Tasa de crecimiento compuesto de ingresos anuales.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest font-mono mb-2">
            Margen de Utilidad Neto (%)
          </label>
          <input
            type="range"
            min="5"
            max="70"
            step="5"
            value={profitMargin}
            onChange={(e) => setProfitMargin(parseInt(e.target.value))}
            className="w-full accent-white cursor-pointer"
          />
          <div className="flex justify-between text-xs font-mono text-white/40 mt-1">
            <span>Bajo (5%)</span>
            <span className="font-bold text-emerald-400">{profitMargin}%</span>
            <span>Alto (70%)</span>
          </div>
          <p className="text-[10px] text-white/40 mt-1">
            Porcentaje de ingresos que se convierte en ganancia real.
          </p>
        </div>
      </div>

      {/* Simulation results container */}
      <div className="space-y-6">
        <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
          <TrendingUp size={14} /> Proyecciones de Crecimiento y Penetración de SAM
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {simulationResults.map((yearData) => {
            // Calculate a nice height/width percentage
            const penetrationPercentage = Math.min(100, yearData.penetration);

            return (
              <div
                key={yearData.year}
                className="bg-white/[0.03] border border-white/5 rounded-xl p-4 shadow-sm relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold font-mono text-white/40">AÑO {yearData.year}</span>
                    <span className="text-[9px] bg-emerald-950/40 text-emerald-300 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono font-bold">
                      {yearData.penetration}% de SAM
                    </span>
                  </div>

                  <p className="text-base font-bold font-mono text-[#F0F0F0]">
                    ${yearData.somRevenue.toLocaleString()} <span className="text-[10px] text-white/40 font-normal">USD</span>
                  </p>
                  <p className="text-[10px] text-white/40">Ingresos Proyectados</p>

                  <div className="mt-3 space-y-1.5">
                    <div className="flex justify-between text-[10px] text-white/50">
                      <span className="flex items-center gap-1">
                        <Users size={10} className="text-white/40" /> Clientes:
                      </span>
                      <span className="font-semibold text-white/80">{yearData.customers}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-white/50">
                      <span className="flex items-center gap-1">
                        <DollarSign size={10} className="text-white/40" /> Beneficio Acum:
                      </span>
                      <span className="font-semibold text-emerald-400">${yearData.accumulatedProfit.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Progress bar of market penetration */}
                <div className="mt-4">
                  <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${penetrationPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Conclusion card */}
        {simulationResults.length > 0 && (
          <div className="bg-emerald-950/10 border border-emerald-500/10 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="p-3 bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 rounded-lg shrink-0">
              <Award size={20} />
            </div>
            <div className="text-xs text-emerald-300 leading-relaxed">
              <strong>Análisis de Escala:</strong> Al término del <strong>Año 5</strong>, tu negocio habrá expandido su SOM inicial hasta alcanzar un volumen anualizado de <strong>${simulationResults[4].somRevenue.toLocaleString()} USD</strong>, lo que equivale a capturar el <strong>{simulationResults[4].penetration}%</strong> de tu mercado servible del país (SAM). Esto demuestra que partiendo de un foco pequeño y sustentable, se puede construir una gran empresa rentable y atractiva para inversionistas.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
