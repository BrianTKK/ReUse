import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign, Ionicons } from '@expo/vector-icons';

import { getUserSession } from '../../src/services/authService';
import ItemCard from '../../src/components/Cards/ItemCard';
import * as Typography from '../../src/components/Typography/typography';
import SearchBar from '../../src/components/Inputs/SearchBar';
import Banner from '../../src/components/Cards/Banner';
import { colors } from '../../constants/theme';

import LogoReUseText from '../../src/assets/images/ReUse.svg';
import ReUseLogo from '../../src/assets/images/ReUse_SVG.svg';

const REUSE_ITEMS = [
  { id: '1', title: 'Cadeira de Escritório', category: 'Móveis', points: 50, image: require('../../src/assets/images/chair.jpg') },
  { id: '2', title: 'Monitor 24"', category: 'Eletrônicos', points: 120, image: require('../../src/assets/images/monitor.jpg') },
  { id: '3', title: 'Kit de Vasos', category: 'Decoração', points: 30, image: require('../../src/assets/images/pots.jpg') },
  { id: '4', title: 'Bicicleta', category: 'Esporte', points: 200, image: require('../../src/assets/images/bicycle.jpg') },
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
      
      <View style={styles.headerContainer}>
        <View style={styles.topRow}>
          <View style={styles.logoArea}>
            <View style={styles.logoCircle}>
               <ReUseLogo width={30} height={30} />
            </View>
            <View>
              <LogoReUseText width={80} height={20} />
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={12} color="#6B7280" />
                <Typography.Caption style={{ color: '#6B7280' }}>Osasco, SP</Typography.Caption>
              </View>
            </View>
          </View>
          
          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="notifications-outline" size={24} color={colors.textDark} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={REUSE_ITEMS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ItemCard item={item} />}
        
        numColumns={2}
        columnWrapperStyle={styles.row} 
        
        ListHeaderComponent={
          <View>
            <SearchBar /> 

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.filterScroll}
            >
              <TouchableOpacity style={[styles.chip, styles.chipActive]}>
                <Typography.Body3 style={{ color: '#FFF', fontWeight: '700' }}>Osasco, SP</Typography.Body3>
              </TouchableOpacity>
              {['Móveis', 'Som', 'Decoração', 'Eletro', 'Outros'].map((cat, i) => (
                <TouchableOpacity key={i} style={[styles.chip, styles.chipInactive]}>
                  <Typography.Body3 style={styles.chipTextInactive}>{cat}</Typography.Body3>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Typography.H5 style={styles.sectionTitle}>Recentes</Typography.H5>
          </View>
        }

        ListFooterComponent={<Banner />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerContainer: { paddingTop: 10, marginBottom: 10 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 15,
  },
  logoArea: { flexDirection: 'row', alignItems: 'center' },
  logoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#19E65E20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  notificationBtn: { position: 'relative' },
  notificationDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  filterScroll: { paddingHorizontal: 24, gap: 10, marginBottom: 15 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100, justifyContent: 'center',alignItems: 'center'},
  chipActive: { backgroundColor: colors.primary },
  chipInactive: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 100 },
  chipTextInactive: {
    color: '#6B7280', fontSize: 14 },
  sectionTitle: { paddingHorizontal: 24, marginBottom: 16, fontWeight: '700' },
  listContent: { paddingBottom: 100 },
  row: { justifyContent: 'space-between', paddingHorizontal: 24, marginBottom: 16 },
});