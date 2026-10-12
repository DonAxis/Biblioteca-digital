# Plan: Página /orientacion

Página pública de orientación vocacional con gráfica radar por carrera.
Los datos se cargan de un JSON estático — sin Firebase, sin login requerido.

---

## Stack

- **Recharts** — `RadarChart` nativo en React, ligero (~50 kb gzip)
- `src/data/careers.json` — JSON estático, carga manual, no requiere backend
- Tailwind para estilos, igual que el resto del proyecto

Instalar:
```bash
npm install recharts
```

---

## Archivos a crear / modificar

| Archivo | Acción | Qué hace |
| --- | --- | --- |
| `src/data/careers.json` | Crear | Datos de las 6 carreras (copiar del doc) |
| `src/components/CareerRadar.jsx` | Crear | Componente radar reutilizable |
| `src/components/AreaFilter.jsx` | Crear | Barra de toggles para filtrar áreas |
| `src/pages/Orientacion.jsx` | Crear | Página principal |
| `src/App.jsx` | Modificar | Agregar ruta `/orientacion` (pública) |
| `src/components/Header.jsx` | Modificar | Agregar link "Orientación" en nav |

---

## Estructura de datos (`careers.json`)

```json
[
  {
    "id": "negocios-internacionales",
    "nombre": "Licenciatura en Negocios Internacionales",
    "institucion": "Instituto Leonardo Bravo",
    "periodos": 8,
    "tipoPeriodo": "semestre",
    "areas": {
      "matematicas": 7,
      "ciencias_exactas": 1,
      "tecnologia": 4,
      "negocios": 10,
      "derecho": 7,
      "humanidades": 6,
      "ciencias_sociales": 5,
      "investigacion": 5
    }
  }
  // ... resto de carreras
]
```

Las 8 áreas fijas (mismas etiquetas en todos los radares):

| Clave | Etiqueta visible |
| --- | --- |
| `matematicas` | Matemáticas |
| `ciencias_exactas` | Ciencias Exactas |
| `tecnologia` | Tecnología |
| `negocios` | Negocios |
| `derecho` | Derecho |
| `humanidades` | Humanidades |
| `ciencias_sociales` | Ciencias Sociales |
| `investigacion` | Investigación |

---

## Layout de la página

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER (existente)                                             │
├─────────────────────────────────────────────────────────────────┤
│  Hero: "¿Qué carrera es para ti?"                               │
│  Subtítulo: selecciona las áreas que quieres evitar             │
├─────────────────────────────────────────────────────────────────┤
│  FILTROS (AreaFilter)                                           │
│  [ Matemáticas ✓ ]  [ Derecho ]  [ Tecnología ✓ ]  ...         │
│  Área marcada = el estudiante quiere EVITARLA                   │
├─────────────────────────────────────────────────────────────────┤
│  GRID DE CARRERAS (3 col desktop / 1 col mobile)                │
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │ Negocios Int.    │  │ Contador Público │  │ Ing. Cómputo │  │
│  │  [radar mini]    │  │  [radar mini]    │  │  [radar mini]│  │
│  │  ● Compatible    │  │  ⚠ Matemáticas  │  │  ✗ No apto   │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│  FOOTER (existente)                                             │
└─────────────────────────────────────────────────────────────────┘
```

**Lógica de compatibilidad:**
- Ningún área evitada con score > 6 → ● Verde "Compatible"
- 1 área evitada con score 5–6 → ⚠ Amarillo "Revisa [área]"
- Algún área evitada con score ≥ 7 → ✗ Rojo "Alto nivel de [área]"

---

## Componente `CareerRadar`

Props:
```jsx
<CareerRadar
  areas={career.areas}          // objeto con los 8 scores
  avoidAreas={['matematicas']}  // áreas a resaltar en rojo
  size="sm" | "lg"              // sm = tarjeta, lg = detalle
/>
```

Internamente usa `recharts`:
```jsx
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'
```

Los ejes con `avoidAreas` se colorean en rojo para que el estudiante vea de un vistazo qué tan presente está esa área.

---

## Componente `AreaFilter`

- 8 botones toggle, uno por área
- Estado: `avoidAreas = []` (array de claves activas)
- Toggle: agrega o quita del array
- Estilo: inactivo = gris, activo (evitar) = rojo/naranja con tache

---

## Página `Orientacion.jsx`

```
estado:
  avoidAreas = []   ← áreas que el estudiante quiere evitar

render:
  <Hero />
  <AreaFilter avoidAreas={avoidAreas} onChange={setAvoidAreas} />
  <Grid>
    {careers.map(c => (
      <CareerCard
        career={c}
        avoidAreas={avoidAreas}
        compatibilidad={calcCompatibilidad(c, avoidAreas)}
      />
    ))}
  </Grid>
```

Las carreras se ordenan: verde primero → amarillo → rojo.

---

## Cambios en archivos existentes

### `src/App.jsx`
Agregar una ruta pública (sin `<ProtectedRoute>`):
```jsx
<Route path="/orientacion" element={<Orientacion />} />
```

### `src/components/Header.jsx`
Agregar link en la nav (junto a "Biblioteca"):
```jsx
<NavLink to="/orientacion">Orientación</NavLink>
```

---

## Orden de implementación

1. `npm install recharts`
2. Crear `src/data/careers.json` con las 6 carreras
3. Crear `CareerRadar.jsx` — solo el radar, sin lógica de filtro
4. Crear `AreaFilter.jsx` — toggles con estado
5. Crear `Orientacion.jsx` — armar la página con grid y ordenamiento
6. Modificar `App.jsx` — ruta
7. Modificar `Header.jsx` — link nav
8. Probar con `npm run dev`

---

## Notas

- La página es **pública** (no requiere login). Cualquier visitante puede usarla.
- Los datos se actualizan editando `careers.json` a mano — no hay panel admin para esto.
- Si en el futuro se agregan más carreras, solo se agrega un objeto al JSON.
- Los scores son estimaciones basadas en los planes de estudio — se pueden ajustar manualmente en el JSON.
