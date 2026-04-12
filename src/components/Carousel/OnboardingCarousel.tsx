import { useRouter } from "expo-router";
import React, { useRef, useState } from 'react';
import { Animated, FlatList, Image, Text, useWindowDimensions, View } from "react-native";

import { colors } from "../../../constants/theme";
import PrimaryButton from "../Buttons/PrimaryButton";
import * as Typography from '../Typography/typography';

const onboardingData = [
  {
    id: '1',
    titleLine1: 'Tem algo parado\n',
    titleHighlight: 'em casa?',
    description: 'Troque com alguém que está\nprocurando exatamente isso.',
    imagePlaceholder: 'Ilustração 1 (Caixa Verde)',
    imageSource: require('../../assets/images/carousel1.png'),
  },
  {
    id: '2',
    titleLine1: 'Antes de comprar,\n',
    titleHighlight: 'que tal trocar?',
    description: 'Dê uma nova vida aos seus objetos. Economize dinheiro e ajude o planeta.',
    imagePlaceholder: 'Ilustração 2 (Duas Pessoas)',
    imageSource: require('../../assets/images/carousel2.png'),
  },
  {
    id: '3',
    titleLine1: 'Desapegar nunca foi\n',
    titleHighlight: 'tão simples',
    description: 'Publique, combine e troque.\nTudo em um só lugar no ReUse.',
    imagePlaceholder: 'Ilustração 3 (Mulher com Caixa)',
    imageSource: require('../../assets/images/carousel3.png'),
  }
];

export default function OnboardingCarousel() {
  const router = useRouter();
  const { width, height } = useWindowDimensions(); // Sempre atualizado com tela
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.push("/login");
    }
  };

  const renderItem = ({ item }: { item: typeof onboardingData[0] }) => {
    return (
      <View style={{ width, flex: 1, alignItems: 'center', paddingHorizontal: 24, paddingBottom: 32 }}>
        <View style={{
          flex: 1,
          width: '100%',
          maxHeight: height * 0.45, // Garante que a imagem nunca ocupe mais que ~45% da tela! (Responsivo para S25 normal)
          minHeight: 200, // Proteção contra o "bug" da web
          backgroundColor: item.imageSource ? 'transparent' : '#EAEAEA',
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {item.imageSource ? (
            <Image
              source={item.imageSource}
              style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
            />
          ) : (
            <Text style={{ color: '#aaa', fontWeight: 'bold' }}>{item.imagePlaceholder}</Text>
          )}
        </View>

        {/* Agrupamento do texto */}
        <View style={{ marginTop: 32 }}>
          <Typography.H1 style={{ textAlign: 'center', marginBottom: 16 }}>
            {item.titleLine1}
            <Text style={{ color: colors.greenLight }}>{item.titleHighlight}</Text>
          </Typography.H1>

          <Typography.Body style={{ textAlign: 'center', color: colors.greenMid }}>
            {item.description}
          </Typography.Body>
        </View>
      </View>
    );
  };

  return (
    <>
      {/* Container flex para empurrar o paginador pro fim sem cortar */}
      <View style={{ flex: 1, marginTop: 40 }}>
        <FlatList
          data={onboardingData}
          ref={flatListRef}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          scrollEventThrottle={32}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
        />
      </View>

      <View style={{ paddingHorizontal: 24, paddingBottom: 24, alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 32 }}>
          {onboardingData.map((_, index) => {
            const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 24, 8],
              extrapolate: 'clamp',
            });

            const bgColor = scrollX.interpolate({
              inputRange,
              outputRange: ['#19E65E50', colors.greenLight, '#19E65E50'],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={index}
                style={{
                  height: 8,
                  width: dotWidth,
                  borderRadius: 4,
                  backgroundColor: bgColor,
                }}
              />
            );
          })}
        </View>

        <PrimaryButton
          title="Próximo"
          onPress={scrollToNext}
        />
      </View>
    </>
  );
}
