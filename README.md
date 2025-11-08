# Plinko ML Predictor

A modern browser-based Plinko simulation and machine learning prediction model built with React 19, TypeScript, and Matter.js physics engine. Uses K-Nearest Neighbors (KNN) algorithm to predict ball landing positions based on drop parameters.

![Machine Learning Prediction Model](https://img.shields.io/badge/ML-Prediction%20Model-FF9A8B)
![React](https://img.shields.io/badge/React-19-56CCF2)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-2F80ED)

## Overview

This project simulates a Plinko board where balls drop through pegs and land in buckets. It collects data about ball trajectories based on different parameters and uses K-Nearest Neighbors machine learning algorithm to analyze prediction accuracy. The app features a beautiful, modern UI inspired by Apple's design language with sky blue and peach color themes.

## Features

- **🎨 Modern UI/UX**: Beautiful glassmorphism design with smooth animations and transitions
- **🧠 ML Prediction Analysis**: K-Nearest Neighbors algorithm for bucket prediction
- **⚡ Real-time Physics**: Matter.js powered physics simulation
- **🎯 10 Bucket System**: Balls land in one of 10 buckets with live count tracking
- **🎪 Customizable Ball Properties**:
    - Adjustable bounciness coefficient (0.0 - 1.0)
    - Variable ball size (1.0 - 30.0)
    - Randomization ranges for both parameters
- **🎮 Multiple Drop Modes**:
    - Click to drop individual balls
    - Batch drop at various positions with custom spacing
    - Batch drop at a single position for consistency testing
- **📊 Visual Analytics**: 
    - Real-time data collection progress bar
    - Prediction accuracy visualization
    - Animated result charts
- **🔄 Reset Functionality**: Clear all data and restart simulation
- **💫 Animated Icons**: Lucide React icons with custom animations
- **📱 Responsive Design**: Works on various screen sizes

## Project Structure

```
plinko-ml-react/
├── index.html                 # HTML entry point
├── package.json              # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
└── src/
    ├── main.tsx             # React entry point
    ├── App.tsx              # Main application component
    ├── App.css              # Main application styles
    ├── index.css            # Global styles
    ├── types/
    │   └── index.ts         # TypeScript type definitions
    ├── hooks/
    │   └── usePlinko.ts     # Physics engine hook
    ├── utils/
    │   └── analysis.ts      # ML analysis utilities (KNN algorithm)
    └── components/
        ├── Card.tsx         # Reusable card component
        ├── Card.css
        ├── Button.tsx       # Reusable button component
        ├── Button.css
        ├── Input.tsx        # Reusable input component
        └── Input.css
```

## Dependencies

### Core
- [React](https://react.dev/) (v19.0.0) - UI library
- [TypeScript](https://www.typescriptlang.org/) (v5.3.3) - Type-safe JavaScript
- [Vite](https://vitejs.dev/) (v5.0.0) - Build tool and dev server

### Libraries
- [Matter.js](https://brm.io/matter-js/) (v0.19.0) - 2D physics engine
- [Lodash](https://lodash.com/) (v4.17.21) - Utility library for ML operations
- [Lucide React](https://lucide.dev/) (v0.294.0) - Beautiful animated icons

## Getting Started

### Installation

1. Clone or download the project
```bash
git clone https://github.com/liamkande/plinko-MachineLearning.git
cd plinko-MachineLearning
```

2. Install dependencies
```bash
yarn install
```

3. Start development server
```bash
yarn run dev
```

4. Open your browser to the URL shown (typically `http://localhost:5173`)

### Building for Production

```bash
yarn run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
yarn run preview
```

## Usage

### Data Collection Phase

1. **Configure Ball Properties**:
   - Set bounciness range (min/max) in the sidebar
   - Set ball size range (min/max)
   - Adjust balls per click if desired

2. **Drop Balls**:
   - **Manual Drop**: Click anywhere on the Plinko board
   - **Batch Drop - Scan**: Drop multiple balls at evenly spaced positions
   - **Batch Drop - Spot**: Drop many balls from a single position

3. **Monitor Progress**:
   - Watch the progress bar fill as you collect data
   - You need at least **110 samples** to run the prediction analysis

### Prediction Analysis Phase

4. **Run Analysis**:
   - Once you have 110+ samples, click the **"Analyze & Predict"** button
   - The KNN algorithm will process your data
   - View prediction accuracy for each feature:
     - Drop Position
     - Bounciness
     - Ball Size

5. **Interpret Results**:
   - Higher accuracy percentages indicate better prediction capability
   - Visual bars show relative accuracy
   - Results indicate how well each parameter predicts bucket landing

### Reset and Start Over

6. **Reset**: Click "Reset All Data" to clear everything and start fresh

## Machine Learning Details

### K-Nearest Neighbors (KNN) Algorithm

The app uses the KNN algorithm to predict which bucket a ball will land in based on:
- **Drop Position**: Where the ball enters the board (x-coordinate)
- **Bounciness**: The restitution coefficient of the ball
- **Ball Size**: The radius of the ball

### How It Works

1. **Data Collection**: Each ball drop records:
   - Drop position (x)
   - Bounciness coefficient
   - Ball size
   - Bucket landed in (0-9)

2. **Data Processing**:
   - Dataset is shuffled randomly
   - Split into training set (70%) and test set (30%)
   - Features are normalized using min-max scaling

3. **Prediction**:
   - For each test point, find k=10 nearest neighbors
   - Use Euclidean distance to measure similarity
   - Predict bucket based on majority vote of neighbors

4. **Accuracy Calculation**:
   - Compare predictions vs actual results
   - Display accuracy percentage for each feature

## Color Theme

- **Primary Blue**: `#56CCF2` (Sky Blue)
- **Secondary Blue**: `#2F80ED` (Deep Blue)
- **Primary Peach**: `#FF9A8B` (Soft Peach)
- **Accent Coral**: `#FF6A88` (Coral Pink)
- **Background**: Gradient blend of blues and peach tones

## Use Cases

- 🎓 **Educational**: Teaching machine learning concepts
- 🔬 **Research**: Physics simulation experiments
- 📊 **Data Science**: Probability and statistics demonstrations
- 🎮 **Game Development**: Prototyping physics-based games
- 🧪 **ML Experimentation**: Testing prediction algorithms

## Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Modern browsers with ES2020 support

## License

MIT License - feel free to use this project for learning and experimentation!

## Author

**Liam Kande** - [@liamkande](https://github.com/liamkande)

## Acknowledgments

- Matter.js for the excellent physics engine
- React team for React 19
- Lucide for beautiful icons
- The ML community for KNN algorithm insights

---

Built with ❤️ using React 19, TypeScript, and Matter.js