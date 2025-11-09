export interface BallData {
  dropPosition: number
  bounciness: number
  size: number
  bucketLabel: number
}

export interface AnalysisResult {
  feature: number
  featureName: string
  accuracy: number
}

export interface PlinkoConfig {
  coefStart: number
  coefEnd: number
  sizeStart: number
  sizeEnd: number
  dropQuantity: number
}
