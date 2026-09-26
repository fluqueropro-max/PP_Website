export interface LocationMetric {
  label: string;
  currentValue: string;
  adaptedValue: string;
  unit: string;
  changeDescription: string;
  favorable: 'decrease' | 'increase';
}

export interface AdaptationPillar {
  id: string;
  title: string;
  tagline: string;
  category: 'water' | 'vegetation' | 'roofs' | 'human';
  description: string;
  architecturalIntervention: string;
  climateBenefit: string;
  metricHighlight?: string;
}

export interface LocationViewAngle {
  id: string;
  name: string;
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  description?: string;
}

export interface GenevaLocation {
  id: string;
  name: string;
  code?: string;
  frenchName: string;
  subtitle: string;
  status: 'active' | 'upcoming';
  coordinates: [number, number]; // [lng, lat]
  camera: {
    zoom: number;
    pitch: number;
    bearing: number;
  };
  overviewCamera: {
    zoom: number;
    pitch: number;
    bearing: number;
  };
  summary: string;
  currentProblemSummary: string;
  adaptationVisionSummary: string;
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  views?: LocationViewAngle[];
  metrics: LocationMetric[];
  pillars: AdaptationPillar[];
}
