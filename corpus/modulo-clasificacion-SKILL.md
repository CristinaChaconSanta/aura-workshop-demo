# Módulo de clasificación estratégica (integrar al SKILL.md de analisis-prospectos-aura)

> Este módulo agrega tres clasificaciones a la ficha. Se integra DESPUÉS de las reglas
> existentes de scraping y safe-write, que no cambian. Las justificaciones teóricas
> viven en `referencias/fundamentos-clasificacion.md` — consultar solo si hay ambigüedad
> en un caso concreto.

## Regla madre

Toda clasificación de este módulo es una **observación con evidencia**, nunca una
recomendación. La ficha registra QUÉ se observó, DÓNDE se observó y QUÉ clasificación
resulta. Prohibido derivar de aquí ángulos de mensaje, gatillos, frameworks o copy —
eso pertenece a la skill de redacción.

Si no hay evidencia suficiente para clasificar, se registra "Sin evidencia" con el
valor por defecto indicado. Nunca inventar ni inferir más allá de lo observable.

## Clasificación 1: Temperatura de mercado

Campo de ficha: `temperatura_mercado` — valores: `in-market probable` / `out-of-market` / `sin evidencia`

**Por defecto: `out-of-market`.** El 95% de las empresas no está comprando activamente.
Solo clasificar `in-market probable` si se observa al menos UNA señal de disparo (trigger
event) verificable en fuentes públicas de los últimos 6 meses:

- Cambio de liderazgo en marketing o dirección general (LinkedIn, prensa)
- Vacantes abiertas en marketing, contenido, growth o "IA/automatización" (sitio web, portales de empleo visibles en el scraping)
- Anuncio de expansión: nuevo mercado, nueva línea, nueva sede, ronda de inversión
- Crisis o presión visible: reestructuración, caída pública, cambio regulatorio de su industria
- Menciones públicas de la empresa sobre adopción de IA, transformación digital o rediseño de procesos

Registrar en `evidencia_temperatura`: la señal exacta, la fuente (URL) y la fecha aproximada.
Sin señal de los últimos 6 meses → `out-of-market`, sin excepciones. La ausencia de señal
no es señal negativa: es el estado normal del mercado.

## Clasificación 2: Costo percibido de cambio

Campo de ficha: `costo_cambio_estimado` — valores: `alto` / `medio` / `bajo` / `sin evidencia`

Estima qué tan costoso le parecería a esta empresa adoptar servicios como los de Aura.
Se evalúa SOLO con evidencia pública:

- **Alto:** señales de agencia o proveedor de marketing incumbente (créditos en el sitio, casos publicados por terceros, menciones en prensa), equipo de marketing grande y estructurado, procesos visiblemente maduros
- **Medio:** equipo de marketing pequeño identificable, sin proveedor visible, presencia digital activa pero artesanal
- **Bajo:** sin equipo de marketing identificable, presencia digital mínima o desactualizada, señales de que todo lo hace el fundador

Registrar en `evidencia_costo_cambio` las señales concretas. Este campo NO implica
prioridad de contacto por sí solo: se cruza con fit/anti-fit (secciones 05-06 del
manifiesto), que sigue mandando.

## Clasificación 3: Estructura de decisión probable

Campo de ficha: `estructura_decision` — texto breve, máximo 3 líneas.

Para pymes LATAM el comité formal de 6-10 personas de la literatura enterprise NO aplica
directo. Registrar solamente:

- ¿El contacto de Apollo es probablemente el decisor final o reporta a alguien? (inferir por cargo + tamaño de empresa; en empresas <50 personas el fundador/gerente general casi siempre participa)
- ¿Quién más visible en LinkedIn/sitio web participaría en una decisión de contratar servicios de IA/marketing? Nombres y cargos si son públicos, nada más
- ¿Hay señales de que finanzas o el dueño controlan gasto? (empresa familiar, gerente general = fundador)

Prohibido especular sobre dinámicas internas, conflictos o motivaciones personales.
Solo estructura observable.

## Orden de prioridad resultante (para la columna de priorización existente)

1. Fit alto (manifiesto 05) + `in-market probable` → prioridad máxima
2. Fit alto + `out-of-market` → prioridad normal (la mayoría; el objetivo del contacto es distinto pero eso lo decide la capa de redacción, no esta)
3. Anti-fit (manifiesto 06) → descartar sin importar temperatura

La temperatura nunca convierte un anti-fit en prospecto.
