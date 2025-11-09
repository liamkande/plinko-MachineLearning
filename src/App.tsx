import React, { useRef, useState, useCallback } from 'react'
import { usePlinko } from './hooks/usePlinko'
import { runAnalysis } from './utils/analysis'
import { Card } from './components/Card'
import { Button } from './components/Button'
import { Input } from './components/Input'
import { BallData, AnalysisResult, PlinkoConfig } from './types'
import {
  Brain,
  Sparkles,
  BarChart3,
  Play,
  RotateCcw,
  Zap,
  Target,
  CircleDot,
  Layers,
} from 'lucide-react'
import './App.css'

const App: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [outputs, setOutputs] = useState<BallData[]>([])
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([])
  const [bucketCounts, setBucketCounts] = useState<number[]>(Array(10).fill(0))
  const [showResults, setShowResults] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const [config, setConfig] = useState<PlinkoConfig>({
    coefStart: 0.5,
    coefEnd: 0.55,
    sizeStart: 16,
    sizeEnd: 16,
    dropQuantity: 1,
  })

  const [scanQuantity, setScanQuantity] = useState(180)
  const [scanSpacing, setScanSpacing] = useState(10)
  const [spotQuantity, setSpotQuantity] = useState(180)
  const [spotLocation, setSpotLocation] = useState(400)

  const handleBallLanded = useCallback((data: BallData) => {
    setOutputs((prev) => [...prev, data])
    setBucketCounts((prev) => {
      const newCounts = [...prev]
      newCounts[data.bucketLabel]++
      return newCounts
    })
  }, [])

  const { dropBall, reset: resetPhysics } = usePlinko(canvasRef, config, handleBallLanded)

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left

    for (let i = 0; i < config.dropQuantity; i++) {
      setTimeout(() => dropBall(x), i * 100)
    }
  }

  const handleScanDrop = () => {
    const spacing = 800 / scanQuantity
    for (let i = 0; i < scanQuantity; i++) {
      setTimeout(() => {
        dropBall(spacing * i + spacing / 2)
      }, i * scanSpacing)
    }
  }

  const handleSpotDrop = () => {
    for (let i = 0; i < spotQuantity; i++) {
      setTimeout(() => dropBall(spotLocation), i * 100)
    }
  }

  const handleAnalyze = () => {
    if (outputs.length < 110) {
      alert('Please collect at least 110 data points before analyzing!')
      return
    }
    setIsAnalyzing(true)
    setTimeout(() => {
      const results = runAnalysis(outputs)
      setAnalysisResults(results)
      setShowResults(true)
      setIsAnalyzing(false)
    }, 1500)
  }

  const handleReset = () => {
    setOutputs([])
    setAnalysisResults([])
    setBucketCounts(Array(10).fill(0))
    setShowResults(false)
    resetPhysics()
  }

  const canAnalyze = outputs.length >= 110
  const progress = Math.min((outputs.length / 110) * 100, 100)

  return (
    <div className="app">
      <header className="header">
        <div className="header-badge">
          <Brain className="header-badge-icon" />
          <span>Machine Learning Prediction Model</span>
        </div>
      </header>

      <div className="container">
        <div className="main-content">
          {showResults && analysisResults.length > 0 && (
            <Card className="results-card">
              <div className="results-header">
                <div className="results-title-container">
                  <BarChart3 className="results-icon rotating" />
                  <h2 className="results-title">Prediction Analysis Results</h2>
                </div>
                <div className="results-badge">
                  <Sparkles size={16} />
                  KNN Model
                </div>
              </div>
              <div className="results-description">
                <p>
                  Advanced K-Nearest Neighbors Analysis Engine, predicting bucket landing positions
                  based on drop position, ball bounciness, and ball size parameters.
                </p>
              </div>
              <div className="results-grid">
                {analysisResults.map((result, index) => (
                  <div
                    key={result.feature}
                    className="result-item"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="result-header">
                      <div className="result-feature">
                        <Target className="result-feature-icon" size={18} />
                        {result.featureName}
                      </div>
                      <div className="result-accuracy-badge">{result.accuracy}%</div>
                    </div>
                    <div className="result-accuracy-container">
                      <div className="result-accuracy-bar">
                        <div
                          className="result-accuracy-fill"
                          style={{ width: `${result.accuracy}%` }}
                        >
                          <div className="result-accuracy-shimmer" />
                        </div>
                      </div>
                    </div>
                    <div className="result-label">Prediction Accuracy</div>
                  </div>
                ))}
              </div>
            </Card>
          )}
          <Card className="canvas-card">
            <div className="canvas-header">
              <div className="canvas-title">
                <h1 className="title">
                  <img src="/logo.svg" alt="Logo" className="title-logo" />
                  Plinko ML
                  <Sparkles className="title-icon" />
                </h1>
              </div>
              <div className="analyze-section">
                <div className="progress-container">
                  <div className="progress-header">
                    <div className="progress-label">
                      <Layers className="progress-icon" />
                      <span>Training Data Collection</span>
                    </div>
                    <div className="progress-count">{outputs.length} / 110 samples</div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }}>
                      <div className="progress-shimmer" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div ref={canvasRef} className="canvas-wrapper" onClick={handleCanvasClick} />
            <div className="buckets">
              {bucketCounts.map((count, i) => (
                <div key={i} className="bucket">
                  <div className="bucket-count">{count}</div>
                  <div className="bucket-label">B{i + 1}</div>
                  <div className="bucket-bar">
                    <div
                      className="bucket-bar-fill"
                      style={{
                        height: `${Math.min((count / Math.max(...bucketCounts, 1)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <aside className="sidebar">
          <Button
            variant="analyze"
            onClick={handleAnalyze}
            disabled={!canAnalyze || isAnalyzing}
            icon={isAnalyzing ? <Zap className="spinning" /> : <Brain />}
          >
            {isAnalyzing ? 'Analyzing Predictions...' : 'Analyze & Predict'}
          </Button>
          <Card>
            <h3 className="section-title">
              <Layers className="section-icon" />
              Batch Drop - Scan
            </h3>
            <div className="input-grid">
              <Input
                label="Quantity"
                value={scanQuantity}
                onChange={setScanQuantity}
                min={1}
                max={50}
              />
              <Input
                label="Spacing (ms)"
                value={scanSpacing}
                onChange={setScanSpacing}
                min={50}
                max={1000}
              />
            </div>
            <Button variant="primary" onClick={handleScanDrop} icon={<Play size={18} />}>
              Drop Scan
            </Button>
          </Card>

          <Card>
            <h3 className="section-title">
              <Target className="section-icon" />
              Batch Drop - Spot
            </h3>
            <div className="input-grid">
              <Input
                label="Quantity"
                value={spotQuantity}
                onChange={setSpotQuantity}
                min={1}
                max={500}
              />
              <Input
                label="X Position"
                value={spotLocation}
                onChange={setSpotLocation}
                min={50}
                max={750}
              />
            </div>
            <Button variant="primary" onClick={handleSpotDrop} icon={<Play size={18} />}>
              Drop Spot
            </Button>
          </Card>

          <Card>
            <h3 className="section-title">
              <CircleDot className="section-icon" />
              Drop Controls
            </h3>
            <Input
              label="Balls per Click"
              value={config.dropQuantity}
              onChange={(v) => setConfig({ ...config, dropQuantity: v })}
              min={1}
              max={10}
            />
          </Card>

          <Card>
            <h3 className="section-title">
              <Sparkles className="section-icon" />
              Ball Properties
            </h3>
            <div className="input-grid">
              <Input
                label="Bounciness Min"
                value={config.coefStart}
                onChange={(v) => setConfig({ ...config, coefStart: v })}
                min={0}
                max={1}
                step={0.01}
              />
              <Input
                label="Bounciness Max"
                value={config.coefEnd}
                onChange={(v) => setConfig({ ...config, coefEnd: v })}
                min={0}
                max={1}
                step={0.01}
              />
              <Input
                label="Size Min"
                value={config.sizeStart}
                onChange={(v) => setConfig({ ...config, sizeStart: v })}
                min={1}
                max={30}
              />
              <Input
                label="Size Max"
                value={config.sizeEnd}
                onChange={(v) => setConfig({ ...config, sizeEnd: v })}
                min={1}
                max={30}
              />
            </div>
          </Card>
          <Button
            variant="secondary"
            onClick={handleReset}
            disabled={isAnalyzing}
            icon={<RotateCcw />}
          >
            Reset All Data
          </Button>
        </aside>
      </div>
      <footer className="footer">
        <div className="footer-content">
          <span className="footer-copyright">
            © {new Date().getFullYear()} Plinko ML. All rights reserved.
            <span className="footer-built-by">
              {' '}
              Built by{' '}
              <a
                href="https://github.com/liamkande/plinko-MachineLearning"
                target="_blank"
                rel="noreferrer"
              >
                @LiamKande
              </a>
            </span>
          </span>
        </div>
      </footer>
    </div>
  )
}

export default App
