import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import PrimaryButton from '../../src/components/Buttons/PrimaryButton';
import SecondaryButton from '../../src/components/Buttons/SecondaryButton';
import * as Typography from '../../src/components/Typography/typography';
import { getItemById } from '../../src/data/items';
import { colors } from '../../constants/theme';

export default function ItemDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = getItemById(id);
  const [interestSent, setInterestSent] = useState(false);

  // Quem abre o link direto (web) não tem para onde voltar: cai na Home.
  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/home');
    }
  };

  if (!item) {
    return (
      <SafeAreaView style={[styles.container, styles.notFound]}>
        <Typography.H4 style={{ textAlign: 'center' }}>Item não encontrado</Typography.H4>
        <Typography.Body3 style={styles.notFoundText}>
          Este anúncio pode ter sido pausado ou trocado.
        </Typography.Body3>
        <PrimaryButton title="Voltar para o início" onPress={goBack} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View>
          <Image source={item.image} style={styles.photo} contentFit="cover" transition={200} />

          <TouchableOpacity
            style={styles.backButton}
            onPress={goBack}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Ionicons name="arrow-back" size={22} color={colors.textDark} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.categoryChip}>
            <Typography.Caption style={styles.categoryText}>{item.category}</Typography.Caption>
          </View>

          <Typography.H3 style={styles.title}>{item.title}</Typography.H3>
          <Typography.H4 style={styles.points}>{item.points} EcoPoints</Typography.H4>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="shield-checkmark-outline" size={18} color={colors.greenMid} />
                <Typography.Body3 style={styles.infoLabelText}>Estado de conservação</Typography.Body3>
              </View>
              <Typography.Body3 style={styles.infoValue}>{item.condition}</Typography.Body3>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="location-outline" size={18} color={colors.greenMid} />
                <Typography.Body3 style={styles.infoLabelText}>Local</Typography.Body3>
              </View>
              <Typography.Body3 style={styles.infoValue}>{item.location}</Typography.Body3>
            </View>
          </View>

          <Typography.H5 style={styles.sectionTitle}>Descrição</Typography.H5>
          <Typography.Body3 style={styles.description}>{item.description}</Typography.Body3>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {interestSent ? (
          <>
            <View style={styles.confirmation}>
              <Ionicons name="checkmark-circle" size={22} color={colors.greenMid} />
              <Typography.Body3 style={styles.confirmationText}>
                Interesse enviado! Combine a troca com o anunciante pelo chat.
              </Typography.Body3>
            </View>
            <SecondaryButton title="Ir para o Chat" onPress={() => router.navigate('/chat')} />
          </>
        ) : (
          <PrimaryButton title="Tenho interesse" onPress={() => setInterestSent(true)} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  notFound: { justifyContent: 'center', paddingHorizontal: 24 },
  notFoundText: { textAlign: 'center', color: '#6B7280', marginTop: 8, marginBottom: 16, fontSize: 14, lineHeight: 20 },
  scrollContent: { paddingBottom: 24 },
  photo: { width: '100%', height: 320, backgroundColor: '#E5E7EB' },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  content: { paddingHorizontal: 24, paddingTop: 20 },
  categoryChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#19E65E20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  categoryText: { color: colors.greenDark, fontWeight: '600' },
  title: { marginTop: 12, fontWeight: '700' },
  points: { marginTop: 4, color: colors.primary, fontWeight: '700' },
  infoCard: {
    marginTop: 20,
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    paddingHorizontal: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  infoLabel: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoLabelText: { color: '#6B7280', fontSize: 14, lineHeight: 20 },
  infoValue: { color: colors.textDark, fontWeight: '700', fontSize: 14, lineHeight: 20 },
  divider: { height: 1, backgroundColor: '#F3F4F6' },
  sectionTitle: { marginTop: 24, marginBottom: 8, fontWeight: '700' },
  description: { color: '#4B5563', fontSize: 14, lineHeight: 22 },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  confirmation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#19E65E20',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  confirmationText: { flex: 1, color: colors.greenDark, fontSize: 14, lineHeight: 20 },
});
