import React from "react";
import { MarketData } from "../types";

interface MarketTargetChartProps {
  data: MarketData;
  activeSegment: "tam" | "sam" | "som" | null;
  setActiveSegment: (segment: "tam" | "sam" | "som") => void;
}

export const MarketTargetChart: React.FC<MarketTargetChartProps> = ({
  data,
  activeSegment,
  setActiveSegment,
}) => {
  const tamVal = data.tam.value || 1;
  const samVal = data.sam.value || 1;
  const somVal = data.som.value || 1;

  // We want the area of the circles to be proportional to their values.
  // Area = pi * r^2  => r is proportional to sqrt(value).
  // Let's normalize the radii so the largest (TAM) is r = 160px, and smallest (SOM) is at least r = 40px to remain readable.
  const maxR = 160;
  const minR = 40;

  const rawTamR = Math.sqrt(tamVal);
  const rawSamR = Math.sqrt(samVal);
  const rawSomR = Math.sqrt(somVal);

  // Map to a reasonable visual range [minR, maxR]
  const scale = (rawVal: number) => {
    if (rawTamR === rawSomR) return maxR;
    return minR + ((rawVal - rawSomR) / (rawTamR - rawSomR)) * (maxR - minR);
  };

  const tamR = maxR; // TAM is always the outer boundary
  const samR = Math.max(minR + 25, Math.min(maxR - 20, scale(rawSamR)));
  const somR = Math.max(minR, Math.min(samR - 20, scale(rawSomR)));

  // Format monetary values elegantly
  const formatCurrency = (val: number) => {
    if (val >= 1e9) {
      return `$${(val / 1e9).toFixed(1)}B`;
    }
    if (val >= 1e6) {
      return `$${(val / 1e6).toFixed(1)}M`;
    }
    if (val >= 1e3) {
      return `$${(val / 1e3).toFixed(0)}K`;
    }
    return `$${val}`;
  };

  const samPercentageOfTam = ((samVal / tamVal) * 100).toFixed(1);
  const somPercentageOfSam = ((somVal / samVal) * 100).toFixed(1);
  const somPercentageOfTam = ((somVal / tamVal) * 100).toFixed(2);

  return (
    <div id="market-target-chart-container" className="flex flex-col items-center justify-center p-6 bg-white/[0.02] border border-white/10 rounded-2xl shadow-sm">
      <div className="text-center mb-4">
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest font-mono">
          El Embudo de Oportunidad
        </h3>
        <p className="text-[10px] text-white/30 mt-1">
          Representación de la magnitud del mercado (Áreas proporcionales)
        </p>
      </div>

      <div className="relative w-[360px] h-[360px] flex items-center justify-center">
        {/* SVG concentric target chart */}
        <svg
          viewBox="0 0 360 360"
          className="w-full h-full drop-shadow-md select-none"
        >
          {/* Definitions for beautiful radial gradients */}
          <defs>
            <radialGradient id="tam-grad" cx="50%" cy="50%" r="50%">
              <stop offset="70%" stopColor="#2dd4bf" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.1" />
            </radialGradient>
            <radialGradient id="sam-grad" cx="50%" cy="50%" r="50%">
              <stop offset="70%" stopColor="#a78bfa" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.14" />
            </radialGradient>
            <radialGradient id="som-grad" cx="50%" cy="50%" r="50%">
              <stop offset="70%" stopColor="#fb923c" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#fb923c" stopOpacity="0.2" />
            </radialGradient>
          </defs>

          {/* Grid lines or target guides */}
          <line x1="180" y1="20" x2="180" y2="340" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="20" y1="180" x2="340" y2="180" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />

          {/* TAM Outer Circle */}
          <circle
            cx="180"
            cy="180"
            r={tamR}
            fill="url(#tam-grad)"
            stroke="#14b8a6"
            strokeWidth={activeSegment === "tam" ? "3" : "1"}
            className="transition-all duration-300 cursor-pointer hover:fill-teal-500/[0.04]"
            onClick={() => setActiveSegment("tam")}
          />
          {/* TAM Outer Guide dashed ring */}
          <circle
            cx="180"
            cy="180"
            r={tamR + 4}
            fill="none"
            stroke="#14b8a6"
            strokeWidth="0.5"
            strokeDasharray="2 2"
            opacity="0.4"
          />

          {/* SAM Middle Circle */}
          <circle
            cx="180"
            cy="180"
            r={samR}
            fill="url(#sam-grad)"
            stroke="#8b5cf6"
            strokeWidth={activeSegment === "sam" ? "3" : "1"}
            className="transition-all duration-300 cursor-pointer hover:fill-violet-500/[0.06]"
            onClick={() => setActiveSegment("sam")}
          />

          {/* SOM Inner Circle */}
          <circle
            cx="180"
            cy="180"
            r={somR}
            fill="url(#som-grad)"
            stroke="#f97316"
            strokeWidth={activeSegment === "som" ? "3" : "1"}
            className="transition-all duration-300 cursor-pointer hover:fill-orange-500/[0.08]"
            onClick={() => setActiveSegment("som")}
          />

          {/* Little concentric target dot in center */}
          <circle cx="180" cy="180" r="4" fill="#f97316" />

          {/* Label text inside circles (positioned carefully so they don't overlap) */}
          {/* TAM label (placed at top boundary) */}
          <g className="pointer-events-none">
            <text
              x="180"
              y={180 - tamR + 25}
              textAnchor="middle"
              className="font-mono text-[10px] font-bold fill-teal-300 tracking-wider"
            >
              TAM: {formatCurrency(tamVal)}
            </text>
          </g>

          {/* SAM label (placed at middle boundary) */}
          <g className="pointer-events-none">
            <text
              x="180"
              y={180 - samR + 20}
              textAnchor="middle"
              className="font-mono text-[10px] font-bold fill-violet-300 tracking-wider"
            >
              SAM: {formatCurrency(samVal)}
            </text>
          </g>

          {/* SOM label (placed in center center) */}
          <g className="pointer-events-none">
            <text
              x="180"
              y="200"
              textAnchor="middle"
              className="font-mono text-[10px] font-black fill-orange-300 tracking-wider"
            >
              SOM: {formatCurrency(somVal)}
            </text>
          </g>
        </svg>

        {/* Floating helper badges */}
        <div className="absolute top-2 left-2 bg-teal-950/40 border border-teal-500/20 px-2 py-0.5 rounded-full text-[9px] font-medium text-teal-300">
          TAM (100%)
        </div>
        <div className="absolute top-2 right-2 bg-purple-950/40 border border-purple-500/20 px-2 py-0.5 rounded-full text-[9px] font-medium text-purple-300">
          SAM ({samPercentageOfTam}% de TAM)
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-orange-950/40 border border-orange-500/20 px-2 py-0.5 rounded-full text-[9px] font-medium text-orange-300">
          SOM ({somPercentageOfSam}% de SAM • {somPercentageOfTam}% de TAM)
        </div>
      </div>

      {/* Circle selector guide */}
      <div className="flex gap-2 mt-2 w-full justify-center">
        <button
          id="select-tam-btn"
          onClick={() => setActiveSegment("tam")}
          className={`px-3 py-1 text-xs rounded-lg border font-medium transition-all cursor-pointer ${
            activeSegment === "tam"
              ? "bg-teal-950/40 text-teal-300 border-teal-500/30 shadow-xs"
              : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white"
          }`}
        >
          <span className="inline-block w-2 h-2 rounded-full bg-teal-400 mr-1.5"></span>
          TAM
        </button>
        <button
          id="select-sam-btn"
          onClick={() => setActiveSegment("sam")}
          className={`px-3 py-1 text-xs rounded-lg border font-medium transition-all cursor-pointer ${
            activeSegment === "sam"
              ? "bg-purple-950/40 text-purple-300 border-purple-500/30 shadow-xs"
              : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white"
          }`}
        >
          <span className="inline-block w-2 h-2 rounded-full bg-purple-400 mr-1.5"></span>
          SAM
        </button>
        <button
          id="select-som-btn"
          onClick={() => setActiveSegment("som")}
          className={`px-3 py-1 text-xs rounded-lg border font-medium transition-all cursor-pointer ${
            activeSegment === "som"
              ? "bg-orange-950/40 text-orange-300 border-orange-500/30 shadow-xs"
              : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white"
          }`}
        >
          <span className="inline-block w-2 h-2 rounded-full bg-orange-400 mr-1.5"></span>
          SOM
        </button>
      </div>
    </div>
  );
};
