import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Line, Polygon, Text as SvgText, G } from 'react-native-svg';

const RadarChart = ({ data, labels, size }) => {
    const numberOfScales = 5;
    const radius = size / 4;
    const angleStep = (2 * Math.PI) / labels.length;

    const maxValue = Math.max(...data);

    // Normalize the data
    const normalizedData = data.map(value => (value / maxValue) * 100);

    const points = normalizedData.map((value, index) => {
        const angle = index * angleStep;
        const x = radius * (value / 100) * Math.cos(angle);
        const y = radius * (value / 100) * Math.sin(angle);
        return { x, y, originalValue: data[index] };
    });

    const pointsStr = points.map(p => `${p.x},${p.y}`).join(' ');

    return (
        <View>
            <Svg height={size} width={size}>
                <G transform={`translate(${size / 2}, ${size / 2})`}>
                    {/* Draw scales */}
                    {[...Array(numberOfScales)].map((_, i) => (
                        <Circle
                            key={i}
                            cx={0}
                            cy={0}
                            r={(radius / numberOfScales) * (i + 1)}
                            stroke="grey"
                            strokeWidth="0.5"
                            fill="none"
                        />
                    ))}

                    {/* Draw axis lines */}
                    {labels.map((_, index) => {
                        const angle = index * angleStep;
                        const x = radius * Math.cos(angle);
                        const y = radius * Math.sin(angle);
                        return (
                            <Line
                                key={index}
                                x1={0}
                                y1={0}
                                x2={x}
                                y2={y}
                                stroke="grey"
                                strokeWidth="0.5"
                            />
                        );
                    })}

                    {/* Draw labels and values */}
                    {labels.map((label, index) => {
                        const angle = index * angleStep;
                        const x = (radius + 32) * Math.cos(angle);
                        const y = (radius + 32) * Math.sin(angle);

                        return (
                            <G key={index}>
                                <SvgText
                                    x={x}
                                    y={y}
                                    fontSize="13"
                                    textAnchor="middle"
                                    alignmentBaseline="middle"
                                    fill="black"
                                >
                                    {label}
                                </SvgText>
                                <SvgText
                                    x={x}
                                    y={y + 15} // Adjust the value here to control the distance between the label and the value
                                    fontSize="10"
                                    textAnchor="middle"
                                    alignmentBaseline="middle"
                                    fill="red"
                                >
                                    {data[index]}
                                </SvgText>
                            </G>
                        );
                    })}

                    {/* Draw data polygon */}
                    <Polygon
                        points={pointsStr}
                        fill="rgba(0, 128, 255, 0.5)"
                        stroke="blue"
                        strokeWidth="2"
                    />
                </G>
            </Svg>
        </View>
    );
};

export default RadarChart;
