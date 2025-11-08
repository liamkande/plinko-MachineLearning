# Plinko Machine Learning

A browser-based Plinko simulation game built with Matter.js physics engine for machine learning experimentation and data collection.

## Overview

This project simulates a Plinko board where balls drop through pegs and land in buckets. It's designed to collect data about ball trajectories based on different parameters, making it useful for machine learning experiments and analysis.

## Features

- **Interactive Physics Simulation**: Real-time Plinko game using Matter.js physics engine
- **10 Bucket System**: Balls land in one of 10 buckets at the bottom
- **Customizable Ball Properties**:
    - Adjustable bounciness coefficient (0.0 - 1.0)
    - Variable ball size (1.0 - 30.0)
- **Multiple Drop Modes**:
    - Click to drop individual balls
    - Drop multiple balls at various positions with custom spacing
    - Drop multiple balls at a single position
- **Data Collection**: Track which bucket each ball lands in for analysis
- **Reset Functionality**: Clear all data and start fresh

## Project Structure
```
plinko-MachineLearning-main/
├── index.html          # Main HTML structure
├── score.js            # Scoring and data tracking logic
└── lib/
├── index.js        # Core game logic and physics
└── style.css       # Styling
```


## Dependencies

- [Matter.js](https://brm.io/matter-js/) (v0.12.0) - Physics engine
- [Lodash](https://lodash.com/) (v4.17.11) - Utility library
- [Semantic UI](https://semantic-ui.com/) (v2.3.3) - CSS framework

## Getting Started

1. Clone or download the project
2. Open `index.html` in a web browser
3. Configure ball properties using the input forms
4. Click on the game area to drop balls or use the batch drop buttons
5. Click "Analyze!" to process collected data
6. Click "Reset!" to clear all scores and start over

## Usage

### Single Ball Drop
- Set desired ball properties in the range fields
- Click anywhere on the Plinko board to drop balls

### Batch Drops
- **Various Spots**: Drop multiple balls at evenly spaced positions
- **Single Spot**: Drop multiple balls from the same position for consistency testing

### Analysis
- Use the "Analyze!" button to process the collected data and generate insights

## Use Cases

- Machine learning training data generation
- Physics simulation experiments
- Probability and statistics demonstrations
- Game development prototyping
