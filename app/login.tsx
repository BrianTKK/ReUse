import { StyleSheet, Text, View } from "react-native";

export default function LoginScreen() {
    return (
        <View style={styles.container}>
            <Text>Tela de Login / Cadastro</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff', // Fundo branco como no design
    },
});
