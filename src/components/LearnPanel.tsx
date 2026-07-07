import React, { useState } from "react";
import { MyopiaQuizItem } from "../types";
import { AlertTriangle, CheckCircle, HelpCircle, Compass, Search, UserCheck, ShieldAlert } from "lucide-react";

const MYOPIA_QUIZ_ITEMS: MyopiaQuizItem[] = [
  {
    company: "Netflix (Inicios)",
    statement: "Nuestro mercado es el alquiler físico de películas en DVD por correo postal.",
    classification: "estrecha",
    badgeText: "Demasiado Estrecha",
    explanation: "Si Netflix se hubiera quedado en el DVD por correo, habría muerto con la llegada del internet rápido. Al redefinirse como 'entretenimiento en el hogar', pudieron liderar el streaming."
  },
  {
    company: "Uber",
    statement: "Nuestro mercado es el transporte global de cualquier molécula física o ser vivo.",
    classification: "miopia",
    badgeText: "Demasiado Amplia (Miopía)",
    explanation: "Intentar abarcarlo todo desde el inicio hace que pierdas el enfoque y la diferenciación. Es mejor acotar el mercado inicialmente a 'conectar pasajeros urbanos con conductores independientes'."
  },
  {
    company: "Caffé local de especialidad",
    statement: "Ofrecemos café artesanal premium para profesionales y amantes del buen café en el distrito financiero de la ciudad.",
    classification: "balanceada",
    badgeText: "Justa / Balanceada",
    explanation: "Es una definición excelente: tiene un foco claro de diferenciación (café premium), un segmento de clientes definido (profesionales) y una delimitación geográfica clara."
  },
  {
    company: "Tesla",
    statement: "Construimos únicamente baterías de iones de litio de 12V para coches deportivos de lujo.",
    classification: "estrecha",
    badgeText: "Demasiado Estrecha",
    explanation: "Tesla comenzó con el Roadster de lujo, pero su mercado real era 'la transición del mundo hacia la energía sostenible', lo cual les permitió expandirse a sedanes, SUVs y paneles solares."
  },
  {
    company: "Startup de Delivery",
    statement: "Hacemos entregas a domicilio para todo el mundo que quiera comprar cualquier cosa.",
    classification: "miopia",
    badgeText: "Demasiado Amplia (Miopía)",
    explanation: "Competir contra gigantes globales en todos los sectores es una receta para el fracaso. El punto de entrada ideal (SOM) debe ser ultra enfocado, por ejemplo, 'comida saludable a domicilio para corporaciones'."
  }
];

export const LearnPanel: React.FC = () => {
  // Simulator State for the 1% Trap
  const [advertisingBudget, setAdvertisingBudget] = useState(15000);
  const [naiveCac, setNaiveCac] = useState(350); // CAC in wide market is high
  const [focusedCac, setFocusedCac] = useState(80); // CAC in local focused market is low

  // Calculate naive results
  const naiveCustomers = Math.floor(advertisingBudget / naiveCac);
  const naiveRevenue = naiveCustomers * 1200; // assume $1200 ARPU
  const naiveNet = naiveRevenue - advertisingBudget;

  // Calculate focused results
  const focusedCustomers = Math.floor(advertisingBudget / focusedCac);
  const focusedRevenue = focusedCustomers * 1200;
  const focusedNet = focusedRevenue - advertisingBudget;

  // Quiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<"miopia" | "estrecha" | "balanceada" | null>(null);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });
  const [showExplanation, setShowExplanation] = useState(false);

  const handleQuizAnswer = (answer: "miopia" | "estrecha" | "balanceada") => {
    if (selectedAnswer !== null) return; // prevent multiple clicks
    setSelectedAnswer(answer);
    setShowExplanation(true);
    const item = MYOPIA_QUIZ_ITEMS[currentQuizIndex];
    if (answer === item.classification) {
      setQuizScore((prev) => ({ correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      setQuizScore((prev) => ({ ...prev, total: prev.total + 1 }));
    }
  };

  const nextQuizItem = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCurrentQuizIndex((prev) => (prev + 1) % MYOPIA_QUIZ_ITEMS.length);
  };

  const currentQuiz = MYOPIA_QUIZ_ITEMS[currentQuizIndex];

  return (
    <div id="learn-panel" className="space-y-12">
      {/* SECTION 1: The 1% Trap Simulator */}
      <div id="trampa-1-percent-simulator" className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-red-950/40 text-red-400 border border-red-500/20 rounded-xl">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#F0F0F0]">
              La Trampa del 1%: Simulación de Enfoque vs. Dispersión
            </h2>
            <p className="text-sm text-white/55 mt-1">
              Muchos emprendedores creen que basta con capturar el "1% de un mercado gigante" para tener éxito. Esta simulación demuestra por qué esta premisa es matemáticamente arriesgada y cómo el enfoque local resulta más rentable.
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-white/[0.01] border border-white/5 p-4 rounded-xl">
          <div>
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest font-mono mb-2">
              Presupuesto de Marketing (USD)
            </label>
            <input
              type="number"
              value={advertisingBudget}
              onChange={(e) => setAdvertisingBudget(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-sm font-medium text-white focus:outline-none focus:ring-1 focus:ring-white/30"
            />
            <p className="text-[10px] text-white/40 mt-1">Suma total dedicada a adquirir clientes.</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest font-mono mb-2">
              CAC: Estrategia Dispersa (1% Trap)
            </label>
            <input
              type="range"
              min="150"
              max="600"
              step="10"
              value={naiveCac}
              onChange={(e) => setNaiveCac(parseInt(e.target.value))}
              className="w-full accent-white cursor-pointer"
            />
            <div className="flex justify-between text-xs font-mono text-white/40 mt-1">
              <span>Alta competencia</span>
              <span className="font-bold text-red-400">${naiveCac} USD</span>
            </div>
            <p className="text-[10px] text-white/40 mt-1">Coste por Adquisición por falta de enfoque geográfico.</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest font-mono mb-2">
              CAC: Estrategia Enfocada (SOM)
            </label>
            <input
              type="range"
              min="30"
              max="140"
              step="5"
              value={focusedCac}
              onChange={(e) => setFocusedCac(parseInt(e.target.value))}
              className="w-full accent-white cursor-pointer"
            />
            <div className="flex justify-between text-xs font-mono text-white/40 mt-1">
              <span>Nicho / Recomendado</span>
              <span className="font-bold text-emerald-400">${focusedCac} USD</span>
            </div>
            <p className="text-[10px] text-white/40 mt-1">Coste por Adquisición mediante prospección directa local.</p>
          </div>
        </div>

        {/* Results layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Strategy A: Naive */}
          <div className="border border-red-500/10 rounded-xl p-5 bg-red-950/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-red-950/40 text-red-300 border border-red-500/20 rounded-bl-xl uppercase tracking-widest font-mono text-[9px] px-3 py-1">
              La Trampa del 1% (Dispersa)
            </div>
            <h4 className="font-bold text-red-400 flex items-center gap-2 text-base font-mono">
              <AlertTriangle size={18} className="text-red-400" />
              Estrategia "Capturar el 1%"
            </h4>
            <p className="text-xs text-white/70 mt-1.5 leading-relaxed">
              Lanzas anuncios a todo el continente esperando atraer a cualquiera. Compites con multinacionales y tu mensaje es genérico.
            </p>

            <div className="mt-4 space-y-3 font-sans">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-xs text-white/40">Clientes Adquiridos:</span>
                <span className="text-sm font-semibold font-mono text-white">{naiveCustomers}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-xs text-white/40">Retorno por Cliente (Anual):</span>
                <span className="text-sm font-semibold font-mono text-white">$1,200 USD</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-xs text-white/40">Ingresos Totales (LTV):</span>
                <span className="text-sm font-semibold font-mono text-white">${naiveRevenue.toLocaleString()} USD</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-xs font-bold font-mono text-red-300">Ganancia Neta Inicial:</span>
                <span className={`text-sm font-bold font-mono ${naiveNet >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  ${naiveNet.toLocaleString()} USD
                </span>
              </div>
            </div>
            {naiveNet < 0 && (
              <div className="mt-4 p-2.5 bg-red-950/20 rounded-lg text-xs text-red-300 border border-red-500/20">
                <strong>¿Por qué pierdes dinero?</strong> El costo de adquisición (CAC) es superior a tu margen. La falta de foco geográfico y temático disipa tus esfuerzos.
              </div>
            )}
          </div>

          {/* Strategy B: Focused */}
          <div className="border border-emerald-500/10 rounded-xl p-5 bg-emerald-950/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-950/40 text-emerald-300 border border-emerald-500/20 rounded-bl-xl uppercase tracking-widest font-mono text-[9px] px-3 py-1">
              Enfoque en SOM (Enfocada)
            </div>
            <h4 className="font-bold text-emerald-400 flex items-center gap-2 text-base font-mono">
              <CheckCircle size={18} className="text-emerald-400" />
              Estrategia de Nicho (SOM)
            </h4>
            <p className="text-xs text-white/70 mt-1.5 leading-relaxed">
              Te concentras exclusivamente en los clientes calificados de tu vecindario o nicho cerrado. El marketing es directo y de alta conversión.
            </p>

            <div className="mt-4 space-y-3 font-sans">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-xs text-white/40">Clientes Adquiridos:</span>
                <span className="text-sm font-semibold font-mono text-white">{focusedCustomers}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-xs text-white/40">Retorno por Cliente (Anual):</span>
                <span className="text-sm font-semibold font-mono text-white">$1,200 USD</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-xs text-white/40">Ingresos Totales (LTV):</span>
                <span className="text-sm font-semibold font-mono text-white">${focusedRevenue.toLocaleString()} USD</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-xs font-bold font-mono text-emerald-300">Ganancia Neta Inicial:</span>
                <span className="text-sm font-bold font-mono text-emerald-400">
                  +${focusedNet.toLocaleString()} USD
                </span>
              </div>
            </div>

            <div className="mt-4 p-2.5 bg-emerald-950/20 rounded-lg text-xs text-emerald-300 border border-emerald-500/20">
              <strong>Resultado de Enfoque:</strong> Obtienes <strong>{focusedCustomers - naiveCustomers}</strong> clientes más con el mismo presupuesto y validas tu MVP de forma sustentable.
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Evitar la Miopía de Mercado (Interactive Quiz) */}
      <div id="miopia-mercado-quiz" className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-purple-950/40 text-purple-400 border border-purple-500/20 rounded-xl">
            <Compass size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#F0F0F0]">
              Desafío: Evitar la Miopía del Mercado
            </h2>
            <p className="text-sm text-white/55 mt-1">
              La "Miopía del Mercado" ocurre cuando una empresa define su alcance de forma tan estrecha que ignora el valor real del usuario, o de forma tan amplia que su mensaje se diluye. ¿Puedes clasificar las siguientes definiciones de mercado?
            </p>
          </div>
        </div>

        <div className="bg-white/[0.01] border border-white/5 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4 text-xs font-mono text-white/40">
            <span>Pregunta {currentQuizIndex + 1} de {MYOPIA_QUIZ_ITEMS.length}</span>
            <span className="bg-purple-950/40 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded font-mono">
              Puntuación: {quizScore.correct} / {quizScore.total}
            </span>
          </div>

          <div className="mb-6">
            <span className="text-[10px] uppercase font-semibold text-white/40 tracking-widest font-mono">Startup / Caso</span>
            <h3 className="text-base font-bold text-[#F0F0F0] mt-0.5">{currentQuiz.company}</h3>
            <div className="mt-3 bg-white/[0.03] border border-white/5 rounded-lg p-4 font-sans italic text-sm text-white/80 leading-relaxed shadow-xs">
              "{currentQuiz.statement}"
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => handleQuizAnswer("estrecha")}
              disabled={selectedAnswer !== null}
              className={`p-3 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                selectedAnswer !== null && currentQuiz.classification === "estrecha"
                  ? "bg-amber-950/35 text-amber-300 border-amber-500/30"
                  : selectedAnswer === "estrecha"
                  ? "bg-red-950/35 text-red-300 border-red-500/30"
                  : "bg-white/[0.04] text-white/80 border-white/10 hover:bg-white/[0.08]"
              }`}
            >
              Demasiado Estrecha
            </button>
            <button
              onClick={() => handleQuizAnswer("miopia")}
              disabled={selectedAnswer !== null}
              className={`p-3 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                selectedAnswer !== null && currentQuiz.classification === "miopia"
                  ? "bg-amber-950/35 text-amber-300 border-amber-500/30"
                  : selectedAnswer === "miopia"
                  ? "bg-red-950/35 text-red-300 border-red-500/30"
                  : "bg-white/[0.04] text-white/80 border-white/10 hover:bg-white/[0.08]"
              }`}
            >
              Demasiado Amplia (Miopía)
            </button>
            <button
              onClick={() => handleQuizAnswer("balanceada")}
              disabled={selectedAnswer !== null}
              className={`p-3 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                selectedAnswer !== null && currentQuiz.classification === "balanceada"
                  ? "bg-emerald-950/35 text-emerald-300 border-emerald-500/30"
                  : selectedAnswer === "balanceada"
                  ? "bg-red-950/35 text-red-300 border-red-500/30"
                  : "bg-white/[0.04] text-white/80 border-white/10 hover:bg-white/[0.08]"
              }`}
            >
              Justa / Balanceada
            </button>
          </div>

          {showExplanation && (
            <div className="mt-6 p-4 bg-purple-950/10 border border-purple-500/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {selectedAnswer === currentQuiz.classification ? (
                  <span className="text-emerald-400 font-bold text-xs flex items-center gap-1 font-mono">
                    <CheckCircle size={14} /> ¡Correcto!
                  </span>
                ) : (
                  <span className="text-red-400 font-bold text-xs flex items-center gap-1 font-mono">
                    <HelpCircle size={14} /> Incorrecto
                  </span>
                )}
                <span className="text-xs text-white/30 font-mono">• El mercado es:</span>
                <span className="text-xs font-bold text-purple-300 uppercase tracking-widest text-[10px] font-mono">
                  {currentQuiz.classification === "estrecha" && "Demasiado Estrecho"}
                  {currentQuiz.classification === "miopia" && "Demasiado Amplio / Miopía"}
                  {currentQuiz.classification === "balanceada" && "Equilibrado / Perfecto"}
                </span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed font-sans">{currentQuiz.explanation}</p>
              <button
                onClick={nextQuizItem}
                className="mt-3 px-3 py-1.5 bg-white hover:bg-white/90 text-[#0A0A0A] text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Siguiente Caso
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: Design Thinking Roles (Investigador vs Líder) */}
      <div id="design-thinking-roles" className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-teal-950/40 text-teal-400 border border-teal-500/20 rounded-xl">
            <UserCheck size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#F0F0F0]">
              Roles de Diseño en el Dimensionamiento del Mercado
            </h2>
            <p className="text-sm text-white/55 mt-1">
              El análisis TAM, SAM y SOM no es solo contabilidad teórica; requiere una visión de diseño centrada en el usuario para recolectar métricas del mundo real.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* El Investigador */}
          <div className="border border-teal-500/10 rounded-xl p-5 bg-teal-950/5">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="p-1.5 bg-teal-950/40 text-teal-400 border border-teal-500/20 rounded-lg">
                <Search size={16} />
              </span>
              <h4 className="font-bold text-teal-300 text-base font-mono">Rol: El Investigador de Mercado</h4>
            </div>
            <p className="text-xs text-teal-200/70 leading-relaxed font-sans">
              Su meta es la <strong>detección de necesidades y validación de magnitud</strong> en el campo. Busca estadísticas reales, realiza entrevistas en frío y refuta supuestos teóricos optimistas.
            </p>
            <ul className="mt-4 space-y-2.5 font-sans">
              <li className="flex items-start gap-2 text-xs text-white/70">
                <span className="text-teal-400 mt-0.5 font-bold">✔</span>
                <span><strong>Análisis Bottom-Up:</strong> Construye el mercado de abajo hacia arriba contando clientes calificados en un cuadrante físico.</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-white/70">
                <span className="text-teal-400 mt-0.5 font-bold">✔</span>
                <span><strong>Entrevistas Cualitativas:</strong> Investiga si el dolor del usuario es lo suficientemente urgente como para justificar el pago de una solución.</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-white/70">
                <span className="text-teal-400 mt-0.5 font-bold">✔</span>
                <span><strong>Búsqueda de Datos Duros:</strong> Consulta bases censales nacionales, listados de competidores locales y directorios comerciales.</span>
              </li>
            </ul>
          </div>

          {/* El Líder de Estrategia */}
          <div className="border border-purple-500/10 rounded-xl p-5 bg-purple-950/5">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="p-1.5 bg-purple-950/40 text-purple-400 border border-purple-500/20 rounded-lg">
                <Compass size={16} />
              </span>
              <h4 className="font-bold text-purple-300 text-base font-mono">Rol: El Líder de Estrategia</h4>
            </div>
            <p className="text-xs text-purple-200/70 leading-relaxed font-sans">
              Su meta es <strong>formular la solución, explicar el plan de lanzamiento</strong> y garantizar el enfoque en el SOM inicial para que la startup no muera por dispersión.
            </p>
            <ul className="mt-4 space-y-2.5 font-sans">
              <li className="flex items-start gap-2 text-xs text-white/70">
                <span className="text-purple-400 mt-0.5 font-bold">✔</span>
                <span><strong>Definición del Nicho:</strong> Identifica a los adoptantes tempranos (Early Adopters) más desesperados por la solución.</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-white/70">
                <span className="text-purple-400 mt-0.5 font-bold">✔</span>
                <span><strong>Estructuración Comercial:</strong> Mapea la capacidad de ventas diaria (ej: cuántas llamadas o visitas puede realizar el equipo actual).</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-white/70">
                <span className="text-purple-400 mt-0.5 font-bold">✔</span>
                <span><strong>Planificación de Ruta:</strong> Proyecta la expansión orgánica desde el SOM validado hacia el SAM y eventualmente el TAM.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
