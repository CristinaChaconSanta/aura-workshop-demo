# Guía del workshop — Construir tu agente de inteligencia comercial

Para asistentes. Van a armar **su** sistema, no el de Aura Studio.

En todo documento o prompt, el placeholder es **`mi empresa`**.  
Buscalo y reemplazalo por el nombre de tu emprendimiento. Lo mismo con **`mi nombre`** (quién firma los mails).

Cristina te da: esta guía, el manifiesto plantilla, y los prompts de psicología social.  
Vos construís el resto en Cursor, con Groq (gratis).

---

## Cómo llegar a los archivos

```
git clone https://github.com/CristinaChaconSanta/aura-workshop.git
```

**Si no usás GitHub:** descargá el ZIP de Drive y en Cursor: **File → Open Folder**.

Drive: https://drive.google.com/drive/folders/16SA6w1fA0s4_JySo1jhgU-0UkRwYa7Sx?usp=sharing

Ejemplo visual de Aura: `workshop/ejemplo-aura.md`.

---

## Qué estamos haciendo (en una página)

No estás haciendo un CRM ni un robot que dispara emails. Estás haciendo un **asistente de outbound** con tres capas:

1. **Cerebro** — reglas de cómo trata a una persona (eso te lo da el workshop).
2. **Datos** — de dónde salen las empresas (Maps, un Excel, o URLs).
3. **Cara** — una barra donde pedís un lote, ves fichas y armás borradores.

El envío, si algún día existe, es **con tu confirmación**. El agente redacta. Vos mandás.

Tres formas de entrar, todas válidas:

| Entrada | Cuándo usarla | Qué API hace falta |
|---|---|---|
| Pegar sitios web | La más simple. Tenés 3–10 URLs. | Solo Groq |
| Subir una base (CSV/Excel) | Export de Maps, Apollo, un Excel propio. | Solo Groq |
| Buscar un lugar (Maps) | “clínicas en Chapinero”. | Groq + **Places API** (Google), opcional |
| Conectar Gmail | Enviar / leer respuestas desde tu correo. | **Gmail API + OAuth**. Si no tenés correo de empresa, **saltealo**. Subí base o pegá URLs. |

---

## Qué te dan y qué armás vos

**Te dan:**
- `workshop/manifiesto.md` — qué hace mi empresa, sus productos y cómo habla. Se puede editar ahora o después.
- `workshop/ejemplo-aura.md` — una copia corta de Aura (marca y visuales), solo de referencia.
- El corpus de psicología social.
- Esta guía.

**Armás vos (con Cursor):**
- Reglas del proyecto, scrape, score, fichas, skill de redacción, pantalla.

**No copies** el código ni la UI de Aura. El *criterio* sí se comparte; la *implementación* es tuya.

---

## Modos de Cursor (usá el que toca)

| Modo | Para qué en este workshop |
|---|---|
| **Plan** | Diseñar la fase. No escribe código. |
| **Ask** | Dudas sobre los fundamentos. “¿Esto viola Fiske?” |
| **Agent** | Construir ESA fase. Un objetivo por chat. |
| **Debug** | Algo falló y tenés evidencia (URL, log, captura). |

Un chat = una fase. Si el Agent mezcla ficha con email, cortá y abrí otro.

---

## Groq

Key: [console.groq.com](https://console.groq.com) → **API Keys**.

En la raíz, archivo `.env`:

```
GROQ_API_KEY=gsk_...
GROQ_BASE_URL=https://api.groq.com/openai/v1
GROQ_MODEL=llama-3.3-70b-versatile
```

---

# La ruta, punto por punto

## 0. Abrir casa

**Qué estamos haciendo.** Abrir el kit y dejar las reglas del agente. El manifiesto ya está: dice qué hace mi empresa, sus productos y cómo habla. Se puede editar ahora o después.

**Modo.** Plan, después Agent.

**Hacé esto.**
1. Cloná el repo **o** bajá el ZIP de Drive (arriba) y abrilo en Cursor.
2. En `.env`, pegá la key de Groq.
3. Si querés, en `workshop/manifiesto.md` reemplazá `mi empresa` y `mi nombre`. Si no, seguí y lo editás cuando quieras.

**Prompt (Plan):**

> Voy a construir un agente de inteligencia comercial para mi empresa.  
> No es CRM ni sender.  
> Leé corpus/manifiesto.md y los fundamentos de psicología social en corpus/.  
> Entregá: mapa de 5 módulos (búsqueda, análisis, ficha, redacción, seguimiento), qué archivo vive en cada uno, qué está prohibido inventar, y fases testeables.  
> No escribas código. No diseñes la landing.

**Prompt (Agent, después):**

> Convertí ese plan en CLAUDE.md y .cursor/rules.  
> El nombre de la marca es el de workshop/manifiesto.md.  
> El LLM es Groq: GROQ_API_KEY, base https://api.groq.com/openai/v1, modelo llama-3.3-70b-versatile.  
> El copy de outreach solo se genera en un módulo. El scorer no llama al LLM.  
> No inventar datos. Borrador ≠ envío.

**Listo cuando.** Existen `CLAUDE.md` y `.cursor/rules`. El proyecto está abierto en Cursor.

---

## 1. Tres puertas de entrada (sin Google todavía)

**Qué estamos haciendo.** Decidir cómo entra un lead: URL, archivo, o (después) Maps. Hoy implementamos las dos que no piden correo de empresa.

**En una frase.** Que alguien pueda pegar `midominio.com` o subir un Excel y el sistema sepa qué hacer.

**Modo.** Plan, luego Agent.

**Prompt (Plan):**

> El usuario entra de tres formas:  
> 1) pega una o varias URLs,  
> 2) sube CSV/Excel,  
> 3) busca un lugar en Maps (después, opcional).  
> Si no hay Gmail de empresa, 1 y 2 tienen que bastar.  
> Diseñá el parseo de intención y el contrato de datos de un “lote”. No codees Maps ni Gmail.

**Prompt (Agent):**

> Implementá la barra de entrada: texto + clip para archivo.  
> Si detecta URLs, arma un lote de esos sitios.  
> Si hay archivo, leé las columnas que existan (nombre, url, email, ciudad) y no inventes las que falten.  
> Todavía no scrapees. Marcá “pendiente de análisis”.

**Listo cuando.** Pegás dos URLs o subís un CSV de 5 filas y ves un lote con esas empresas, sin datos inventados.

---

## 2. Leer el sitio y puntuar (sin IA de venta)

**Qué estamos haciendo.** Visitar el HTML, sacar título, headings, texto corto, redes, y un score 0–100 en Python (o JS) **sin** pedirle al LLM que “opte” el lead.

**En una frase.** Primero evidencia; después, si califica, gastamos tokens.

**Modo.** Agent. Un chat solo para esto.

**Prompt (Agent):**

> Implementá scrape: requests + BeautifulSoup, timeout 15s, fallback r.jina.ai si el sitio bloquea.  
> Extraé: título, meta, H1–H3, hasta 1500 caracteres, links de redes.  
> Caché local 7 días. Si falla dos veces: scraping=error, el lote sigue.  
> Scorer 0–100 sin HTTP ni LLM. Dimensiones: fit con el ICP de mi empresa (corpus/manifiesto.md), señales del sitio, seniority si hay contacto, calidad de email si hay, momentum si hay.  
> Score < 25: no llamar a Groq.  
> Groq solo recibe el JSON extraído, nunca el HTML.

**Listo cuando.** Corrés 3 URLs reales. Ves score + texto extraído. Una que falle no tumba las otras.

---

## 3. La ficha (inteligencia, no pitch)

**Qué estamos haciendo.** Convertir lo extraído + (si hay) la fila del Excel en una ficha: qué hacen, brechas, ángulos. Cada afirmación cita fuente. Acá entra la **clasificación** de los fundamentos (temperatura, costo de cambio).

**En una frase.** El agente observa. No vende.

**Modo.** Ask (si dudás de un fundamento), después Agent.

**Prompt (Ask), si hace falta:**

> Según los fundamentos de clasificación que te pasé: si no hay trigger de 6 meses, ¿puedo marcar in-market? Respondé solo con la regla.

**Prompt (Agent):**

> Generá la ficha con Groq. Campos: resumen, sector, modelo, propuesta, madurez, brechas, ángulos con evidencia, temperatura_mercado, costo_cambio, estructura_decision.  
> Default out-of-market. in-market solo con trigger verificable < 6 meses.  
> Si el sitio no cargó, “sin evidencia”. Nunca inventes “no tienen chat”.  
> No escribas asunto ni email.

**Listo cuando.** 5 fichas de sitios reales. Si un campo no está, dice “sin evidencia”. Alguien del grupo puede auditar una y no encontrar un dato inventado.

---

## 4. El primer mensaje (el cerebro social)

**Qué estamos haciendo.** Una skill de redacción que usa los fundamentos del corpus y la ficha. Estructura térmica: calidez → competencia → calidez. Un CTA. BYAF. Firma de **mi nombre** | **mi empresa**.

**En una frase.** Convertimos observación en un borrador corto que se puede mandar a mano.

**Modo.** Ask + Agent.

**Prompt (Ask):**

> Con los fundamentos de redacción: listá las reglas duras de un primer contacto de máximo 120 palabras. Si dos reglas chocan, gana la de base experimental.

**Prompt (Agent):**

> Creá la skill de primer contacto. Justificaciones en referencias/, reglas en el SKILL.  
> Calidez (1 línea) → competencia (2–4, un dato de LA ficha) → calidez + un CTA + BYAF.  
> Una línea de esfuerzo que solo se escribe habiendo leído esa empresa.  
> Groq. Español, tuteo, sin palabras prohibidas del manifiesto de mi empresa.  
> Solo borrador. Validá largo, firma y que mencione la empresa, pero no bloquees si falla: mostrá avisos.

**Listo cuando.** De una ficha sale un JSON `{estrategia, asunto, email}`. Lo leés en voz alta y no suena a plantilla ni dice Aura Studio.

---

## 5. La cara: lote, ficha, bandeja

**Qué estamos haciendo.** Una pantalla para humanos: ver el lote (tarjetas o lista), abrir la ficha, pedir “construí los emails”, editar, **no** enviar solo.

**En una frase.** Que se pueda mostrar en 3 minutos sin abrir la terminal.

**Modo.** Plan, luego Agent (un chat por superficie).

**Prompt (Plan):**

> Una barra. Resultados en tarjetas o lista. Click = ficha. Desde la ficha o el chat: borradores.  
> Sin esfera 3D. Sin dos botones de entrada. El envío, si existe, pide confirmación.

**Prompt (Agent):**

> Implementá landing + lote + ficha + bandeja de borradores.  
> Textos de UI con el nombre de mi empresa (el del manifiesto).  
> Chat del lote: filtrar, cambiar tamaño de bloque, construir emails.

**Listo cuando.** Un compañero pega 3 URLs (o sube un CSV), ve fichas, genera un borrador, lo copia. Sin Gmail.

---

## 6. Maps (opcional)

**Qué estamos haciendo.** Si tenés key de Google, la barra puede buscar “gimnasios en Medellín” vía **Places API (New)**. Si no, esta fase se salta: seguís con URLs o Excel.

**En una frase.** Maps encuentra lugares; Groq no “inventa” un directorio.

**Modo.** Plan corto, Agent.

**Prompt (Agent):**

> Si existe GOOGLE_MAPS_API_KEY, la intención tipo “clínicas en Chapinero, 20” llama a Places (Text Search).  
> Tope 20–50 por rubro. No dupliques si el dominio ya está en el lote.  
> Si no hay key, decí que Maps no está conectado y pedí URLs o un archivo.  
> Restringí la key por referrer / IP en Google Cloud.

**Listo cuando.** Con key: una búsqueda devuelve lugares con nombre + sitio. Sin key: el mensaje de fallback es claro.

---

## 7. Gmail (opcional, solo si tenés correo de empresa)

**Qué estamos haciendo.** Conectar **Gmail API** con OAuth (no una API key). Enviar el borrador desde *tu* cuenta, o solo leer si ya enviaste a mano.

**En una frase.** Google no reemplaza Groq. Solo es el cartero, y solo si vos querés.

**Si no tenés Google Workspace / correo @empresa.** No hagas esta fase. El taller está completo en el paso 5. Copiá el borrador a Gmail personal a mano.

**Si sí lo vas a hacer.**
1. Google Cloud: proyecto propio (no uses una credencial de n8n de otro proyecto).
2. Habilitar Gmail API.
3. Pantalla de consentimiento OAuth + usuario de prueba (tu correo).
4. Credencial **nueva**: ID de cliente OAuth, aplicación web.
5. Scope: `gmail.send` y, si leés respuestas, `gmail.readonly`.

**Prompt (Agent), solo cuando 1–5 existan:**

> Cableá “Conectar Gmail” con OAuth. Enviar un borrador pide confirmación explícita.  
> Nunca envíes el lote entero sin un “sí” por batch.  
> Si no hay OAuth configurado, la bandeja solo exporta o copia.

**Listo cuando.** Un email de prueba llega a tu propia bandeja, o decidís no conectar y el resto igual funciona.

---

## 8. Cierre del workshop (20 minutos)

**Qué estamos haciendo.** Demostrar el agente de mi empresa, no el de Aura.

Checklist en voz alta:
- [ ] Hay un manifiesto (se puede haber editado ahora o dejarse para después)
- [ ] Groq responde (ficha o borrador)
- [ ] Entrada por URL **o** por archivo (las dos, mejor)
- [ ] Una ficha sin datos inventados
- [ ] Un borrador con calidez → competencia → BYAF
- [ ] Maps / Gmail: conectados **o** conscientemente salteados

---

## Prompts de psicología social (los entrega Cristina)

Van a `corpus/`. El Agent de las fases 0, 3 y 4 debe **leerlo**, no reescribirlo.

Incluyen, entre otros:
- 95-5 (casi nadie está comprando ahora)
- CLT (lejos = por qué, cerca = cómo)
- Fiske (calidez antes que competencia)
- Loewenstein (abrir brecha, no cerrar el pitch)
- Un solo CTA
- BYAF / reactancia
- Fluidez, esfuerzo costoso, FOMU

Si Cursor “mejora” esas reglas, frená: **Ask** → “¿el borrador viola alguna regla del corpus? Citá el archivo.”

---

## Orden de chats sugerido

1. `plan-sistema` (Plan)  
2. `reglas-y-manifiesto` (Agent)  
3. `entrada-url-csv` (Agent)  
4. `scrape-y-score` (Agent)  
5. `fichas-groq` (Agent)  
6. `skill-redaccion` (Ask + Agent)  
7. `ui-lote` (Plan + Agent)  
8. `maps` (Agent, opcional)  
9. `gmail` (Agent, opcional)

---

## Si se traban

| Pasa esto | Hacer |
|---|---|
| Groq 429 (límite) | Modelo `llama-3.1-8b-instant` o esperar un minuto. No pidas 50 fichas de un saque. |
| El sitio bloquea scrape | Fallback Jina. Si falla: “sin evidencia”, seguir. |
| El Agent reescribe los fundamentos | Volvé a Plan / Ask. Pegá de nuevo el archivo de `corpus/`. |
| Quieren Maps y no hay key | Seguí con URLs/CSV. Maps no es el producto. |
| No hay correo de empresa | No Gmail. El valor está en ficha + borrador. |
| El copy suena a Aura o dice “mi empresa” | Falta reemplazar el placeholder en el manifiesto. Completalo y regenerá el borrador. |

---

## Lo que el workshop no es

No es instalar el repo de Aura y cambiar el logo.  
No es un curso de Google Cloud.  
No es “conectar todas las APIs”.  

Es: **un cerebro prestado (psicología social) + Groq + tus datos + la cara que armes hoy.**

---

## Si no terminaste

Quienes no llegaron al final tienen un repo con algunas características listas (no es el sistema completo):

```
git clone https://github.com/CristinaChaconSanta/aura-workshop-demo.git
```

https://github.com/CristinaChaconSanta/aura-workshop-demo
