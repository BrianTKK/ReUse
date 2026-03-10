import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Index() {
  const router = useRouter(); // Inicializa o roteador

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Tela princiapl (index.tsx)</Text>

      {/* Botão provisório para testar a navegação */}
      <Button
        title="Ir para o Login"
        onPress={() => router.push("/login")}
      />
    </View>
  );
}
