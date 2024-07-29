import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const RangeSlider = ({ minValue, maxValue, setSelectedMinValue, setSelectedMaxValue, reset, setReset }) => {
  const [sliderValues, setSliderValues] = useState([minValue, maxValue]);

  const handleValuesChange = (newValues) => {
    setSliderValues(newValues);
    setSelectedMaxValue(newValues[1]);
    setSelectedMinValue(newValues[0]);
  };

  useEffect(() => {

    if (reset) {
      // console.log('reset is true');
      setSliderValues([minValue, maxValue]);
      setSelectedMinValue(minValue);
      setSelectedMaxValue(maxValue);
      setReset(false);
    }
  }, [reset]);

  return (
    <View style={styles.container}>
      <MultiSlider
        values={sliderValues}
        sliderLength={280}
        onValuesChange={handleValuesChange}
        min={minValue}
        max={maxValue}
        step={1}
        allowOverlap={false}
        snapped
        selectedStyle={{
          backgroundColor: 'black',
        }}
        unselectedStyle={{
          backgroundColor: 'silver',
        }}
        markerStyle={{
          backgroundColor: 'red',
        }}
        customMarkerLeft={(e) => <CustomMarker currentValue={e.currentValue} />}
        customMarkerRight={(e) => <CustomMarker currentValue={e.currentValue} />}
        isMarkersSeparated={true}
      />
    </View>
  );
};

const CustomMarker = ({ currentValue }) => {
  return (
    <View style={{ transform: [{ rotate: "270deg" }] }}>
      <View
        collapsable={false}
        style={{
          marginLeft: 54,
          marginBottom: -32,
          width: 15,
          height: 15,
          borderRadius: 10,
          backgroundColor: "blue",
        }}
      ></View>
      <View
        style={{
          width: 45,
          height: 50,
          backgroundColor: "black",
          padding: 5,
          position: "relative",
          marginRight: 80,
          transform: [{ rotate: "180deg" }],
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            width: "100%",
            textAlign: "center",
            transform: [{ rotate: "270deg" }],
            fontSize:12,
            color: "#fff",
          }}
        >
          {currentValue}
        </Text>
        <View
          style={{
            position: "absolute",
            left: -10,
            top: 25,
            width: 0,
            height: 0,
            backgroundColor: "transparent",
            borderStyle: "solid",
            borderRightWidth: 10,
            borderTopWidth: 10,
            borderRightColor: "transparent",
            borderTopColor: "black",
            transform: [{ rotate: "90deg" }],
          }}
        />
        <View
          style={{
            position: "absolute",
            left: -10,
            top: 15,
            width: 0,
            height: 0,
            backgroundColor: "transparent",
            borderStyle: "solid",
            borderRightWidth: 10,
            borderTopWidth: 10,
            borderRightColor: "transparent",
            borderTopColor: "black",
            transform: [{ rotate: "180deg" }],
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default RangeSlider;
