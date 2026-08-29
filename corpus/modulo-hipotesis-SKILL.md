# Sistema de hipótesis y estrategia outbound (para el sistema 3 en Cowork)

> Este sistema consume fichas terminadas + resultados del tracking. Produce hipótesis,
> lecturas de patrones y ajustes de estrategia. NO analiza prospectos (skill 1) ni
> redacta mensajes (skill 2). Justificaciones en `referencias/fundamentos-estrategia.md`.

## Insumos que lee (nunca escribe)

- Fichas: `temperatura_mercado`, `costo_cambio_estimado`, `estructura_decision`, evidencias
- Tracking (outreach_tracking.xlsx): columna `Etapa` (sistema) y columna `Estado`
  (manual de Cris). **Prohibido escribir en `Estado`.** Este sistema solo lee resultados.
- Etiquetas de borrador que la skill de redacción registra al generar cada mensaje
  (ver "Etiquetado" abajo).

## Matriz CLT operativa: temperatura → registro del argumento

La temperatura de la ficha es pre-contacto; la respuesta real del prospecto la actualiza:

| Estado operativo | Definición | Foco del argumento | Evitar |
|---|---|---|---|
| **Frío** | `out-of-market` o `sin evidencia`, sin respuesta previa | Deseabilidad: el "por qué". Observación de industria, riesgo global, visión | Especificaciones, precios, detalle de implementación |
| **Tibio** | Respondió o interactuó (cualquier `Estado` ≠ vacío/Enviado) sin pedir detalles | Transición "por qué → qué": caso sectorial breve, opciones viables sin granularidad | Tanto el pitch inspiracional puro como el desglose técnico completo |
| **Caliente** | `in-market probable` con trigger vigente, O pidió detalles/reunión | Factibilidad: el "cómo". Plazos, alcance, precio, garantías concretas | Mensajes inspiracionales y promesas abstractas de transformación — a esta altura generan sospecha |

Regla de concreción (resolución Nyilasy 2024): mientras Aura sea marca desconocida
para el prospecto, la concreción SUMA confianza en todos los estados. El registro
abstracto del estado Frío se refiere al TEMA (visión vs. implementación), no al
lenguaje: las palabras siempre concretas, per la skill de redacción.

## Etiquetado por mensaje (lo registra la skill de redacción; este sistema lo analiza)

Tres etiquetas por borrador, una palabra cada una, en columnas propias del tracking:

- `ancla`: qué abre la atención — `riesgo` / `oportunidad` / `esfuerzo` (personalización extrema como gancho) / `dato`
- `registro`: `deseabilidad` / `transicion` / `factibilidad`
- `byaf`: `si` / `no` (por ahora siempre `si`; la etiqueta existe para poder testear después)

## Formulación de hipótesis

Toda hipótesis se escribe ANTES de mirar los resultados del período, con esta plantilla:

> "Los mensajes con [variable=valor] tendrán mayor [tasa de respuesta / calidad de
> respuesta] que [variable=valor] en prospectos [segmento], porque [mecanismo psicológico]."

Ejemplos válidos:
- "Los mensajes con registro=deseabilidad tendrán mayor tasa de respuesta que
  registro=factibilidad en prospectos out-of-market, porque la distancia temporal
  alta hace ilegible el detalle concreto (CLT)."
- "Los mensajes con ancla=riesgo externalizado tendrán respuestas más sustantivas que
  ancla=oportunidad en directores de marketing, porque la brecha de información sin
  amenaza al ego genera curiosidad en lugar de defensa."

Máximo 2 hipótesis activas a la vez. Con 3-5 envíos/día, más hipótesis simultáneas
fragmentan la muestra hasta volverla ilegible.

## Disciplina de lectura de resultados

- **Bajo n=30 por celda de comparación: solo lectura cualitativa.** Qué dijeron los
  que respondieron, en qué tono, qué objetaron. Prohibido concluir "X convierte mejor
  que Y" con 8 envíos.
- Cada lectura del período cierra con: hipótesis sostenida / debilitada / sin datos
  suficientes — y UNA sola modificación propuesta para el período siguiente. Cambiar
  varias variables a la vez destruye la atribución.
- Las respuestas negativas con contenido ("no es momento porque...") valen más que
  los silencios: registrar la razón textual, es dato de mercado gratis.

## Secuencias multi-touch: parqueadas, con criterio de activación

Los benchmarks de la industria (8 toques, hasta 27, ejecutivo C-level en el toque ~3)
son datos observacionales de vendors — benchmarks de partida, no leyes (ver referencia
§4). Este sistema NO diseña secuencias hasta que se cumpla el criterio ya definido:
al menos una respuesta positiva real a un primer contacto. Cuando se active:
un segundo toque varía canal o ángulo, nunca repite el mismo mensaje con "¿viste mi
correo anterior?".

## Salidas de este sistema

1. Hipótesis del período (máx. 2, con plantilla)
2. Lectura del período anterior (cualitativa hasta tener volumen)
3. Una modificación propuesta — que Cris aprueba antes de que toque cualquier skill
4. Registro de razones textuales de los "no"

Nada de lo anterior modifica skills ni tracking automáticamente. Este sistema propone;
Cris dispone.
