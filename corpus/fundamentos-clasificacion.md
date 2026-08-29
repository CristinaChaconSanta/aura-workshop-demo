# Fundamentos de clasificación de prospectos — Referencia

> Consultar este archivo solo cuando un caso concreto genere ambigüedad sobre cómo
> clasificar. Las reglas operativas viven en el SKILL.md; esto es el "por qué".

## 1. Regla 95-5 (Ehrenberg-Bass / B2B Institute)

En cualquier momento, ~95% del mercado B2B no está comprando activamente: contratos
vigentes, presupuestos cerrados, otras prioridades. Solo ~5% está en evaluación activa.

Implicaciones para la ficha:

- El valor por defecto de `temperatura_mercado` es `out-of-market` porque es la
  realidad estadística. Clasificar in-market requiere evidencia positiva, no ausencia
  de evidencia contraria.
- El 80% de los compradores ya tiene una lista mental de proveedores ("day-one
  consideration set") antes de empezar a buscar, y ~90% termina comprando a alguien
  de esa lista. Descubrir a un prospecto cuando ya está in-market llega tarde para
  entrar a esa lista — por eso el contacto con out-of-market no es tiempo perdido:
  construye la presencia mental que decide compras futuras. Qué hacer con eso es
  decisión de la capa de redacción/estrategia, no de esta skill.

## 2. Construal Level Theory (Trope & Liberman) aplicada a señales

La distancia temporal a una compra cambia cómo procesa el prospecto:

- **Lejos de comprar (out-of-market):** procesamiento abstracto. Consume visión,
  tendencias, "por qué". Señal pública típica: interacción con contenido de
  liderazgo intelectual, sin urgencia visible.
- **Cerca de comprar (in-market):** procesamiento concreto. Busca "cómo": precios,
  implementación, comparaciones, garantías. Señal pública típica: trigger events
  recientes que lo obligan a resolver algo ya.

Para esta skill solo importa el lado observable: los trigger events son la señal
pública más confiable de que una empresa cruzó (o va a cruzar) al modo concreto.
Los datos de consumo de contenido (qué descargan, qué páginas visitan) NO están
disponibles en nuestro stack — requieren herramientas de intent data tipo 6sense.
No simular esa información.

## 3. Trigger events válidos y su lógica

Un trigger event crea una brecha entre el estado actual de la empresa y lo que
necesita resolver, con presión de tiempo. Los verificables desde fuentes públicas:

| Evento | Por qué señala apertura | Dónde verificar |
|---|---|---|
| Nuevo líder de marketing/dirección | Los ejecutivos nuevos revisan proveedores y procesos en sus primeros meses | LinkedIn, prensa |
| Vacantes en marketing/growth/IA | Presupuesto asignado + dolor de capacidad reconocido | Sitio web, portales |
| Expansión (mercado, línea, sede, inversión) | Necesidad de escalar operación sin escalar equipo linealmente | Prensa, LinkedIn corporativo |
| Crisis/reestructuración/regulación | Presión por eficiencia inmediata | Prensa |
| Menciones públicas de IA/transformación | La conversación interna ya empezó | LinkedIn, blog corporativo, prensa |

Ventana de validez: 6 meses. Un trigger de hace un año ya fue resuelto o dejó de doler.

## 4. FOMU y costo de cambio (Dixon & McKenna, The JOLT Effect)

Análisis de 2.5 millones de llamadas de ventas: 40-60% de los deals calificados se
pierden por indecisión del comprador, no contra competidores. El miedo dominante es
FOMU (fear of messing up): el comprador teme el error activo más que la oportunidad
perdida. Presionar con FOMO a un indeciso aumenta la probabilidad de perder en 84%.

**Límite importante para esta skill:** casi todas las señales de FOMU del estudio
(pedir más referencias, reprogramar, escepticismo ante casos de éxito) son
conductuales y aparecen DURANTE la conversación de venta. No son observables
pre-contacto. Por eso la ficha no clasifica FOMU: clasifica su proxy pre-contacto,
el **costo percibido de cambio**:

- Empresa con proveedor incumbente visible o procesos maduros → cambiar implica
  romper algo que funciona → costo percibido alto → mayor propensión a indecisión
  si algún día evalúa.
- Empresa sin estructura de marketing → no hay statu quo que defender → costo
  percibido bajo → la barrera es otra (presupuesto, desconocimiento), no indecisión.

Este proxy es una hipótesis de trabajo, no un hallazgo del estudio original. Marcarlo
así si alguna vez se documenta hacia afuera.

## 5. Buying groups (Gartner) — versión pyme

La literatura enterprise: 6-10 stakeholders promedio, hasta 13 en deals complejos,
74% de los comités con conflictos internos, compradores dedicando solo ~17% del
tiempo de compra a hablar con proveedores (y ~5-6% con cada proveedor individual).

**Ajuste crítico:** esos números vienen de compras enterprise (ACV >$100K USD). En
pymes LATAM de 10-200 personas la estructura real suele ser: decisor de marketing +
fundador/gerente general + a veces finanzas. Dos o tres personas, no diez.

Lo que sí traslada a nuestro contexto:

- El contacto de Apollo casi nunca decide solo. La ficha debe registrar si es
  decisor probable o influenciador que necesitará convencer a alguien más.
- La mayor parte de la decisión ocurre sin el proveedor presente. Eso hace valiosos
  los materiales reenviables — pero producirlos es trabajo de capas posteriores;
  la ficha solo mapea a quién tendría que reenviárselos.

## 6. Advertencias de rigor

- **Origen de las muestras:** casi toda esta investigación se hizo en EE.UU. y
  Europa, en contextos enterprise. Los porcentajes exactos (95-5, 40-60%, 84%) son
  direccionales para pymes LATAM, no leyes. Tratarlos como hipótesis a validar con
  los sends reales.
- **Datos de vendors vs experimentos:** las cifras de Gong, Emblaze, 6sense y
  similares son observacionales (datos masivos, sin grupo de control). Las de
  Ehrenberg-Bass y los papers académicos (Trope & Liberman, Samuelson & Zeckhauser)
  tienen base experimental. Cuando entren en conflicto, pesa más la fuente
  experimental.
- **El sesgo de esta skill sería sobre-clasificar in-market.** Encontrar señales es
  emocionante y empuja a inflar la temperatura. La disciplina es al revés: en la
  duda, out-of-market. Un falso in-market contamina la capa de redacción con
  supuestos de urgencia que el prospecto no siente.
