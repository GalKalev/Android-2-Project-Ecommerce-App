import React from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Line, Circle, Text } from 'react-native-svg';

const D3Chart = ({ data , yAxisName}) => {
    const width = 320;
    const height = 200;
    const padding = 63; // Increased padding to accommodate labels

    // Get the min and max values for x and y
    const xMin = Math.min(...data.map(d => d.date.getTime()));
    const xMax = Math.max(...data.map(d => d.date.getTime()));
    const yMin = Math.min(...data.map(d => d.value));
    const yMax = Math.max(...data.map(d => d.value));

    // Scale functions
    const scaleX = date => padding + ((date - xMin) / (xMax - xMin)) * (width - 2 * padding);
    const scaleY = value => height - padding - ((value - yMin) / (yMax - yMin)) * (height - 2 * padding);

    // Generate the line segments
    const lines = data.slice(1).map((d, i) => {
        const x1 = scaleX(data[i].date.getTime());
        const y1 = scaleY(data[i].value);
        const x2 = scaleX(d.date.getTime());
        const y2 = scaleY(d.value);
        return <Line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="blue" strokeWidth="2" />;
    });

    // Generate the circles
    const circles = data.map((d, i) => {
        const cx = scaleX(d.date.getTime());
        const cy = scaleY(d.value);
        return <Circle key={i} cx={cx} cy={cy} r="4" fill="blue" stroke="black" />;
    });

    // Generate the x-axis labels
    const xAxisLabels = data.map((d, i) => {
        const x = scaleX(d.date.getTime());
        return <Text key={i} x={x} y={height - padding / 2} fontSize="10" textAnchor="middle">{d.date.toDateString()}</Text>;
    });

    // Generate the y-axis labels
    const yAxisLabels = [yMin, (yMin + yMax) / 2, yMax].map((value, i) => {
        const y = scaleY(value);
        return <Text key={i} x={padding / 1.5} y={y} fontSize="10" textAnchor="end" alignmentBaseline="middle">{value}</Text>;
    });

    return (
        <View>
            <Svg width={width} height={height}>
                {/* Y-Axis Title */}
                <Text x={padding / 2} y={padding / 2} fontSize="13" textAnchor="middle" alignmentBaseline="middle" >
                    {yAxisName}
                </Text>

                {/* X-Axis Title */}
                <Text x={width / 2} y={height - padding / 10} fontSize="13" textAnchor="middle">
                    Date
                </Text>

                {/* X-Axis Border */}
                <Line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="black" strokeWidth="1" />

                {/* Y-Axis Border */}
                <Line x1={padding} y1={height - padding} x2={padding} y2={padding} stroke="black" strokeWidth="1" />

                {lines}
                {circles}
                {xAxisLabels}
                {yAxisLabels}
            </Svg>
        </View>
    );
};

export default D3Chart;
