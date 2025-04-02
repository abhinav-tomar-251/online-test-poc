# Test Analytics Dashboard

This dashboard provides analytics and insights for the online test platform. It visualizes test performance, completion rates, score distributions, and more to help understand how tests are being used and performed.

## Features

- **Summary Metrics**: Overview of key metrics including total tests, completions, average scores, and completion rates
- **Test Completions Chart**: Bar chart showing completion counts per test
- **Score Distribution Chart**: Pie chart showing the distribution of scores across different ranges
- **Question Type Analysis**: Horizontal bar chart showing the frequency of different question types across all tests
- **Test Performance Table**: Detailed table with performance metrics for each test

## Components

- `SummaryMetrics`: Card-based display of key metrics
- `TestCompletionsChart`: Bar chart visualization for test completions
- `ScoreDistributionChart`: Pie chart visualization for score distribution
- `QuestionTypeAnalysis`: Horizontal bar chart for question type usage
- `TestPerformanceTable`: Table component for detailed test performance data

## Dependencies

- `chart.js`: For chart visualizations
- `react-chartjs-2`: React wrapper for Chart.js

## Implementation Details

The dashboard pulls data from the Zustand store (`useTestStore`) and calculates analytics metrics in real-time. Charts are rendered using Chart.js and utilize responsive design for optimal viewing on different screen sizes.

## Future Enhancements

Potential enhancements for the dashboard include:

1. Time-based analytics (performance over time)
2. User-specific analytics
3. Drill-down capabilities for more detailed insights
4. Export functionality for analytics data
5. More advanced visualizations (heatmaps, radar charts, etc.) 