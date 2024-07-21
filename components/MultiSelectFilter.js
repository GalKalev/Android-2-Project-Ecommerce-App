import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MultiSelect } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';

const MultiSelectFilter = ({ data, setSelected, reset, setReset, placeholder, styleTitle }) => {
  // console.log(data[0]);

  const configData = data.map((name, index) => ({ label: name, value: index }));
  // console.log(configData[0]);

  const [itemsList, setItemsList] = useState([]);
  // console.log(reset);
  useEffect(() => {
    if (reset) {
      // console.log('reset is true');
      setItemsList([]);
      setReset(false);
    }
  }, [reset]);
  return (
    <View>
      <Text style={styleTitle}>{placeholder}</Text>
      <MultiSelect
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        search
        data={configData}
        labelField="label"
        valueField="value"
        placeholder={`Select ${placeholder}`}
        searchPlaceholder={`Search ${placeholder}...`}
        value={itemsList}

        onChange={item => {
          setItemsList(item);
          // console.log(item);
          const names = [];
          item.map((i) => {
            // console.log(configData[i].label);
            names.push(configData[i].label);
            // console.log(names);
          });
          // console.log('names: ' + names);
          setSelected(names);

          // console.log('item: ' + item + ' items list: ' + itemsList + ' selcted: ' + selected);
        }}

        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color="black"
            name="Safety"
            size={20}
          />
        )}
        selectedStyle={styles.selectedStyle}
      />

    </View>

  )
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  dropdown: {
    height: 50,
    backgroundColor: 'transparent',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  selectedStyle: {
    borderRadius: 12,
  },
});

export default MultiSelectFilter