import { useRouter } from "expo-router";
import { View, Text } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import LogoReUseSVG from "../src/assets/images/ReUse_SVG.svg";
import LogoReUseText from "../src/assets/images/ReUse.svg";

import OnboardingCarousel from "../src/components/Carousel/OnboardingCarousel";
import { colors } from "../constants/theme";

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background, 
      }}
    >
      {/* HEADER EXATO DO PROTÓTIPO */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20, 
        paddingHorizontal: 24,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}> 
            <LogoReUseSVG width={25} height={24} />
            <LogoReUseText width={66.2} height={22.5} />
        </View>
        
        <Text 
            style={{ 
                fontFamily: 'PlusJakartaSans_600SemiBold',
                fontSize: 14,
                lineHeight: 20,
                color: colors.textDark
             }}
            onPress={() => router.push("/login")}
        >
            Pular
        </Text>
      </View>

      {/* COMPONENTE DO CARROSEL QUE ENCAPSULA AS FOLHAS E OS BOTÕES */}
      <OnboardingCarousel />

    </SafeAreaView>
  );
}
