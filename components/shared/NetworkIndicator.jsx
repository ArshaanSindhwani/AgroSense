import {StyleSheet, Text, View} from "react-native"
import useNetworkStatus from "../../hooks/useNetworkStatus"

export function NetworkIndicator(){
    const online = useNetworkStatus()

    return (
    <View style={[styles.pill, { backgroundColor: online ? '#DCFCE7' : '#FEE2E2' }]}>
      <View style={[styles.dot, { backgroundColor: online ? '#15803D' : '#B91C1C' }]} />
      <Text style={[styles.label, { color: online ? '#15803D' : '#B91C1C' }]}>
        {online ? 'Online' : 'Offline'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
    pill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        paddingHorizontal: 10, 
        paddingVertical: 4,
        borderRadius: 999,
        marginRight: 25,
    },

    dot: {
        width: 8,
        height: 8,
        borderRadius: 999,
    },

    label: {
        fontSize: 15,
        fontWeight:"600"
    }
})