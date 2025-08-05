import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const RadarScoreChart = ({ data }) => {
  if (!data) return null;

  // Transforma os dados para o formato que o Recharts espera
  const chartData = Object.keys(data).map(key => {
    let subjectName = '';
    switch (key) {
      case 'basicStats':
        subjectName = 'Básicas';
        break;
      case 'advancedStats':
        subjectName = 'Avançadas';
        break;
      case 'physicalAttributes':
        subjectName = 'Físicos';
        break;
      case 'technicalSkills':
        subjectName = 'Técnicas';
        break;
      case 'development':
        subjectName = 'Desenvolvimento';
        break;
      default:
        subjectName = key;
    }
    return {
      subject: subjectName,
      score: Math.round(data[key] * 100), // Converte para uma escala de 0-100
      fullMark: 100,
    };
  });

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <defs>
            <radialGradient id="radarGradient">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
            </radialGradient>
          </defs>
          <PolarGrid stroke="#e0e0e0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#4A5568', fontSize: 14 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#718096', fontSize: 12 }} />
          <Radar 
            name="Score do Radar"
            dataKey="score" 
            stroke="#8884d8" 
            fill="url(#radarGradient)" 
            fillOpacity={0.8}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid #ccc',
              borderRadius: '8px'
            }}
            formatter={(value) => `${value}%`}
          />
          <Legend iconType="circle" />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarScoreChart;
