import React from 'react'
import './Input.css'

interface InputProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
}

export const Input: React.FC<InputProps> = ({ label, value, onChange, min, max, step = 0.01 }) => {
  return (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <input
        type="number"
        className="input-field"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        min={min}
        max={max}
        step={step}
      />
    </div>
  )
}
