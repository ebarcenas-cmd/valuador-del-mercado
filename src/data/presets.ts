import { IndustryPreset } from "../types";

export const INDUSTRY_PRESETS: IndustryPreset[] = [
  {
    id: "saas_gym",
    name: "SaaS de Gestión para Gimnasios",
    category: "Software as a Service",
    icon: "Activity",
    idea: "Un software todo en uno para automatizar reservas, suscripciones y retención de socios en centros deportivos de tamaño medio con gamificación integrada.",
    target: "Dueños de gimnasios independientes y centros de entrenamiento funcional.",
    region: "México",
    pricing: "Suscripción de $99 USD/mes por gimnasio ($1,188 USD al año)",
    data: {
      currency: "USD",
      tam: {
        name: "TAM (Total Addressable Market)",
        value: 125000000,
        definition: "Demanda total universal sin barreras geográficas o competitivas. El límite superior absoluto.",
        explanation: "105,000 centros deportivos y gimnasios en toda Latinoamérica, multiplicados por nuestra suscripción anual de $1,188 USD.",
        sources: ["Censos de Cámaras de Comercio de LATAM 2025", "Reporte Fitness de IHRSA Global"]
      },
      sam: {
        name: "SAM (Serviceable Addressable Market)",
        value: 14256000,
        definition: "Segmento que tu modelo de negocio, tecnología y ubicación geográfica pueden servir hoy.",
        explanation: "12,000 gimnasios medianos e independientes ubicados en México que cuentan con conexión a internet y operan bajo suscripción.",
        sources: ["INEGI Directorio de Unidades Económicas (DENUE) 2025", "Estudio de Madurez Digital de Pymes en México"]
      },
      som: {
        name: "SOM (Serviceable Obtainable Market)",
        value: 415800,
        definition: "Mercado realista a capturar a corto plazo; el grupo específico donde la startup se concentra inicialmente.",
        explanation: "350 gimnasios ubicados en Ciudad de México y Monterrey que nuestro equipo de ventas directo de 3 personas puede capturar en el primer año.",
        sources: ["Análisis de Capacidad de Ventas (Bottom-Up)", "Campaña piloto local en CDMX"]
      },
      trampa_1_percent: "Si pretendes 'capturar el 1% del TAM de gimnasios en LATAM' ($1.25M USD), fracasarás por falta de enfoque. Un gimnasio en Argentina requiere adaptaciones fiscales diferentes a uno en México, y no tienes la capacidad de marketing para llegar a 1,000 gimnasios dispersos geográficamente. Al enfocarte en el SOM (350 gimnasios locales), puedes darles soporte de alta calidad y validar el producto de manera rentable antes de escalar.",
      miopia_advice: "No definas tu mercado de forma estrecha como 'Software para registrar huellas dactilares en la entrada del gimnasio' (eso ignora la competencia de sistemas más amplios y limita tu crecimiento). Tampoco lo definas tan amplio como 'Soluciones de salud para humanos', donde pierdes tu diferenciación. El punto óptimo es 'Software de retención y administración para centros deportivos independientes'.",
      investigador_checklist: [
        "Realizar 20 entrevistas cualitativas con dueños de gimnasios locales sobre sus puntos de dolor en administración.",
        "Monitorear la tasa de abandono de socios en 5 centros deportivos durante un mes.",
        "Validar si la disposición a pagar $99 USD/mes es compatible con su presupuesto de operación actual."
      ],
      lider_checklist: [
        "Diseñar un plan de prospección directa (Outbound) dirigido a los 50 gimnasios más cercanos.",
        "Desarrollar una demo interactiva enfocada exclusivamente en resolver las reservas de clases grupales.",
        "Configurar el proceso de onboarding en menos de 2 horas para garantizar el éxito inicial del cliente."
      ],
      validation_strategy: "Validación de Magnitud: Cruza los datos del INEGI (DENUE) con visitas presenciales en 3 colonias de alta densidad comercial en CDMX para verificar qué porcentaje de gimnasios está activo y usa software en la actualidad."
    }
  },
  {
    id: "organic_delivery",
    name: "E-commerce de Alimentos Bio D2C",
    category: "E-commerce / Agritech",
    icon: "Leaf",
    idea: "Plataforma de suscripción semanal para cajas de frutas, verduras y lácteos orgánicos directos de agricultores locales a familias urbanas de ingresos medios-altos.",
    target: "Familias con niños preocupadas por la salud y la sostenibilidad.",
    region: "España (Madrid y Barcelona)",
    pricing: "Suscripción de $45 USD/semana ($2,340 USD al año por cliente)",
    data: {
      currency: "USD",
      tam: {
        name: "TAM (Total Addressable Market)",
        value: 842400000,
        definition: "Demanda total universal sin barreras geográficas o competitivas. El límite superior absoluto.",
        explanation: "Aproximadamente 360,000 familias con conciencia ecológica en España que consumen productos orgánicos, multiplicado por $2,340 USD anuales.",
        sources: ["Informe del Consumo Alimentario en España (Ministerio de Agricultura)", "Estudios de Hábitos de Vida Saludable de Kantar"]
      },
      sam: {
        name: "SAM (Serviceable Addressable Market)",
        value: 187200000,
        definition: "Segmento que tu modelo de negocio, tecnología y ubicación geográfica pueden servir hoy.",
        explanation: "80,000 familias en las áreas metropolitanas de Madrid y Barcelona con hábitos de compra online frecuentes y presupuesto para productos bio.",
        sources: ["Datos Demográficos Urbanos de Comunidades Autónomas 2025", "Índice de E-commerce de la CNMC"]
      },
      som: {
        name: "SOM (Serviceable Obtainable Market)",
        value: 3510000,
        definition: "Mercado realista a capturar a corto plazo; el grupo específico donde la startup se concentra inicialmente.",
        explanation: "1,500 suscriptores constantes en el distrito Centro y Salamanca de Madrid durante el primer año, limitado por la logística de reparto y acuerdos con 4 fincas ecológicas locales.",
        sources: ["Capacidad Operativa de Almacén Inicial", "Estudio de densidad de ruta de reparto de última milla"]
      },
      trampa_1_percent: "Intentar capturar el '1% del mercado bio nacional' de manera dispersa arruinaría tu logística de última milla. Los costos de enviar cajas refrigeradas desde Madrid hasta Galicia o Sevilla comerían todo tu margen. Al enfocarte en el SOM (1,500 clientes en códigos postales específicos de Madrid), optimizas las rutas de entrega para que el costo de envío por caja sea inferior a $3 USD, asegurando rentabilidad desde el día uno.",
      miopia_advice: "La miopía del mercado sería definir tu negocio como 'Reparto de zanahorias orgánicas' (demasiado estrecho, compites solo por precio y commoditizas el producto). Tampoco digas 'Alimentar a España' (demasiado amplio). Enfócate en 'Nutrición consciente y sostenible para familias urbanas ocupadas'.",
      investigador_checklist: [
        "Encuestar a 100 familias en colegios y centros de yoga de Madrid sobre su gasto mensual en orgánicos.",
        "Hacer una prueba piloto de reparto con 15 amigos para evaluar la frescura de los alimentos al llegar.",
        "Analizar los precios de competidores en supermercados premium vs. nuestra oferta directa del productor."
      ],
      lider_checklist: [
        "Asegurar contratos de suministro estables con al menos 4 agricultores en un radio de 100km de Madrid.",
        "Diseñar cajas de cartón compostables atractivas que sirvan como publicidad orgánica en el vecindario.",
        "Implementar un software básico de ruteo para optimizar el despacho matutino de entregas."
      ],
      validation_strategy: "Validación de Magnitud: Instalar un stand en un mercado orgánico local para pre-vender 50 suscripciones con descuento y validar la tasa de conversión real de los transeúntes interesados."
    }
  },
  {
    id: "ai_education",
    name: "Tutor IA para Matemáticas Escolares",
    category: "EdTech",
    icon: "GraduationCap",
    idea: "Un tutor virtual interactivo basado en IA que se adapta al ritmo de aprendizaje de los alumnos de secundaria, proporcionando reportes de progreso en tiempo real para colegios.",
    target: "Colegios privados bilingües y padres con hijos en educación secundaria.",
    region: "Colombia",
    pricing: "Licencia de $15 USD por alumno al año contratada por colegios",
    data: {
      currency: "USD",
      tam: {
        name: "TAM (Total Addressable Market)",
        value: 63000000,
        definition: "Demanda total universal sin barreras geográficas o competitivas. El límite superior absoluto.",
        explanation: "4.2 millones de estudiantes de secundaria matriculados en toda Colombia en colegios públicos y privados, multiplicados por $15 USD anuales.",
        sources: ["Matrícula Oficial del Ministerio de Educación Nacional de Colombia", "Reportes de Gasto en EdTech de HolonIQ"]
      },
      sam: {
        name: "SAM (Serviceable Addressable Market)",
        value: 10500000,
        definition: "Segmento que tu modelo de negocio, tecnología y ubicación geográfica pueden servir hoy.",
        explanation: "700,000 estudiantes matriculados en colegios privados bilingües de estratos 4, 5 y 6 que tienen tablets o computadores individuales por estudiante.",
        sources: ["Censo del Sector de Educación Privada de Colombia", "Estudios de Penetración Tecnológica en Aulas Escolares"]
      },
      som: {
        name: "SOM (Serviceable Obtainable Market)",
        value: 450000,
        definition: "Mercado realista a capturar a corto plazo; el grupo específico donde la startup se concentra inicialmente.",
        explanation: "30,000 estudiantes pertenecientes a 45 colegios privados en el norte de Bogotá con los que ya se tiene un canal de contacto directo o afinidad de red en el primer año.",
        sources: ["Base de contactos comerciales del equipo fundador", "Plan de demostración comercial en la red de Colegios UNCOLI"]
      },
      trampa_1_percent: "Argumentar que 'solo necesitamos el 1% de los estudiantes de Colombia' ignora que los colegios públicos tienen procesos de licitación gubernamentales que duran de 18 a 24 meses y requieren certificaciones técnicas imposibles para una startup inicial. Al enfocarse en el SOM (colegios privados seleccionados en Bogotá), se reduce el ciclo de decisión a 3 meses y se valida la metodología pedagógica directamente con familias que ya cuentan con los dispositivos.",
      miopia_advice: "La miopía sería definir tu producto como 'Un bot de WhatsApp para resolver problemas de álgebra'. Te conviertes en una herramienta de trampa fácil para tareas. Al definirlo como 'Plataforma de aceleración del razonamiento matemático escolar', escalas a nivel de dirección escolar y cobras licencias institucionales anuales.",
      investigador_checklist: [
        "Validar el desfase de aprendizaje real en matemáticas aplicando un examen piloto a 50 estudiantes voluntarios.",
        "Entrevistar a 10 profesores de matemáticas para entender cuántas horas dedican a calificar tareas semanales.",
        "Comprobar si las directivas escolares prefieren facturación mensual o un único pago anual por licencia."
      ],
      lider_checklist: [
        "Desarrollar un panel de control simple para que los rectores vean el progreso general del colegio en comparación con estándares nacionales.",
        "Estructurar un programa de piloto gratuito de 4 semanas para los primeros 3 colegios de referencia.",
        "Crear guías de uso rápido para profesores de matemáticas, disminuyendo su fricción para adoptar el software."
      ],
      validation_strategy: "Validación de Magnitud: Ejecutar un taller virtual gratuito de 'Preparación para Pruebas Saber con IA' invitando a rectores y profesores para recolectar leads altamente calificados."
    }
  }
];
