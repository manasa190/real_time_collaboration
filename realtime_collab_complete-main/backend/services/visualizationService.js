class VisualizationService {
    generateChartData(data, type) {
        switch (type) {
            case 'bar':
                return this.processBarChartData(data);
            case 'line':
                return this.processLineChartData(data);
            case 'pie':
                return this.processPieChartData(data);
            default:
                throw new Error('Unsupported chart type');
        }
    }

    processBarChartData(data) {
        // Process data for bar charts
        return {
            labels: data.map(item => item.label),
            datasets: [{
                data: data.map(item => item.value),
                backgroundColor: this.generateColors(data.length)
            }]
        };
    }

    processLineChartData(data) {
        // Process data for line charts
        return {
            labels: data.map(item => item.label),
            datasets: [{
                data: data.map(item => item.value),
                borderColor: '#2196f3',
                fill: false
            }]
        };
    }

    processPieChartData(data) {
        // Process data for pie charts
        return {
            labels: data.map(item => item.label),
            datasets: [{
                data: data.map(item => item.value),
                backgroundColor: this.generateColors(data.length)
            }]
        };
    }

    generateColors(count) {
        // Generate unique colors for charts
        return Array.from({ length: count }, (_, i) => 
            `hsl(${(i * 360) / count}, 70%, 50%)`
        );
    }
}

module.exports = new VisualizationService(); 