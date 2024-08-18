
import { StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MultiSelect } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import { presentableWord } from '../utils/consts';

const MultiSelectAdd = ({ data, selected, setSelected, placeholder }) => {

  const configData = data.map((d, index) => ({ label: d, value: index, presentableLabel: presentableWord(d) }));
  const [itemsList, setItemsList] = useState([]);

  useEffect(() => {

    const selectedArray = Array.isArray(selected) ? selected : [selected];
    const initialSelections = selectedArray.map(item => {
      const index = configData.findIndex(d => d.label === item);
      return index !== -1 ? index : null;
    }).filter(index => index !== null);
    setItemsList(initialSelections);


  }, [selected]);


  return (
    <MultiSelect
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      search
      data={configData}
      labelField="presentableLabel"
      valueField="value"
      placeholder={"Select " + placeholder}
      searchPlaceholder={"Search " + placeholder + "..."}
      value={itemsList}
      onChange={item => {
        console.log('item: ' + item); 
        setItemsList(item);
        const names = [];
        item.map((i) => {
          names.push(configData[i].label);
        });
        setSelected(names);
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
  );
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

export default MultiSelectAdd;
