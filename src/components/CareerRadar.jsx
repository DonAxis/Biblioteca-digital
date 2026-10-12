import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'

export const AREA_LABELS = {
  matematicas:      'Matemáticas',
  ciencias_exactas: 'Ciencias',
  tecnologia:       'Tecnología',
  negocios:         'Negocios',
  derecho:          'Derecho',
  humanidades:      'Humanidades',
  ciencias_sociales:'Social',
  investigacion:    'Investigación',
}

export const CareerRadar = ({ areas, avoidAreas = [], preferAreas = [], size = 'sm' }) => {
  const height = size === 'lg' ? 360 : 210
  const fontSize = size === 'lg' ? 12 : 9

  const data = Object.entries(areas).map(([key, value]) => ({
    area:         AREA_LABELS[key],
    key,
    value,
    avoidValue:   avoidAreas.includes(key) && value >= 5 ? value : 0,
    preferValue:  preferAreas.includes(key) ? value : 0,
    fullMark:     10,
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} margin={{ top: 4, right: 16, bottom: 4, left: 16 }}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis
          dataKey="area"
          tick={{ fontSize, fill: '#4b5563' }}
        />
        <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />

        {/* área de la carrera */}
        <Radar
          dataKey="value"
          stroke="#1a2744"
          fill="#1a2744"
          fillOpacity={0.45}
          dot={false}
        />

        {/* overlay verde para áreas preferidas */}
        {preferAreas.length > 0 && (
          <Radar
            dataKey="preferValue"
            stroke="#16a34a"
            fill="#16a34a"
            fillOpacity={0.25}
            dot={false}
          />
        )}

        {/* overlay rojo para áreas evitadas con score alto */}
        {avoidAreas.length > 0 && (
          <Radar
            dataKey="avoidValue"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.35}
            dot={false}
          />
        )}
      </RadarChart>
    </ResponsiveContainer>
  )
}
