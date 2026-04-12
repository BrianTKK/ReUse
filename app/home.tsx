import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

import { getUserSession } from '../src/services/authService';
import ItemCard from '../src/components/Cards/ItemCard';
import * as Typography from '../src/components/Typography/typography';
import { colors } from '../constants/theme';

const REUSE_ITEMS = [
  { id: '1', title: 'Cadeira de Escritório', category: 'Móveis', points: 50 },
  { id: '2', title: 'Monitor 24"', category: 'Eletrônicos', points: 120 },
  { id: '3', title: 'Kit de Vasos', category: 'Decoração', points: 30 },
];

export default function Home() {
  const [userName, setUserName] = useState('Usuário');
  const router = useRouter();

  // Recupera o nome salvo no Login
  useEffect(() => {
    async function loadData() {
      const savedName = await getUserSession();
      if (savedName) setUserName(savedName);
    }
    loadData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER PERSONALIZADO */}
      <View style={styles.header}>
        <View>
          <Typography.H4 style={{ color: colors.textDark }}>Olá, {userName}!</Typography.H4>
          <Typography.Body3 style={{ color: '#6B7280' }}>Pronto para reutilizar?</Typography.Body3>
        </View>
        <TouchableOpacity style={styles.profileCircle}>
            <AntDesign name="user" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* LISTA DE ITENS (VITRINE) */}
      <FlatList
        data={REUSE_ITEMS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ItemCard item={item} />}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Typography.H5 style={styles.sectionTitle}>Sugestões para você</Typography.H5>
        }
        showsVerticalScrollIndicator={false}
      />

      {/* BOTÃO FLUTUANTE (FAB) PARA A CÂMERA */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/camera')}
      >
        <AntDesign name="plus" size={28} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#19E65E20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '700',
    color: colors.textDark,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});