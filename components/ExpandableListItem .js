import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native';

const ExpandableListItem = ({ item }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    return (
        <View style={styles.itemContainer}>
            <TouchableOpacity
                onPress={toggleExpand}
                style={styles.itemTouchable}
            >
                <View style={{ flexDirection: 'row' }}>
                    {item.icon}
                    <Text style={styles.itemTitle}>
                        {item.title}
                    </Text>

                </View>

            </TouchableOpacity>
            {expanded && (
                <View style={styles.itemContent}>
                    {item.content}
                </View>
            )}
        </View>
    );
};

export default ExpandableListItem

const styles = StyleSheet.create({
    itemContainer: {
        marginBottom: 18,
        padding: 10,
        backgroundColor: "white",
        borderRadius: 10,
        elevation: 3,
    },
    itemTouchable: {
        borderRadius: 10,
        overflow: "hidden",
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginLeft:7
    },
    itemContent: {
        marginTop: 20,
        fontSize: 14,
        color: "#666",
    },
})