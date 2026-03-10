import { useRouter } from "expo-router";
import { View } from "react-native";
import LogoReUse from "../assets/images/ReUse_SVG.svg";
import PrimaryButton from "../components/Buttons/PrimaryButton";
import * as Typography from '../components/Typography/typography';

export default function Index() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 2. Use o Logo como se fosse um botão ou texto, definindo largura e altura */}
      <LogoReUse width={150} height={50} />

      <Typography.H1> Tem algo parado em casa?</Typography.H1>

      <PrimaryButton
        title="Ir para o Login"
        onPress={() => router.push("/login")}
      />
    </View>
  );
}
