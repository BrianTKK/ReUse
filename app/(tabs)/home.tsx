import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AntDesign, Ionicons } from '@expo/vector-icons';

import { getUserSession } from '../../src/services/authService';
import ItemCard from '../../src/components/Cards/ItemCard';
import * as Typography from '../../src/components/Typography/typography';
import SearchBar from '../../src/components/Inputs/SearchBar';
import Banner from '../../src/components/Cards/Banner';
import { CATEGORIES, filterItems } from '../../src/data/items';
import { colors } from '../../constants/theme';

import LogoReUseText from '../../src/assets/images/ReUse.svg';
import ReUseLogo from '../../src/assets/images/ReUse_SVG.svg';

export default function Home() {
  const [userName, setUserName] = useState('Usuário');
  const router = useRouter();
  const [category, setCategory] = useState<string | null>(null); // null = todos
  const [query, setQuery] = useState('');
  const [sortByPoints, setSortByPoints] = useState(false);
  const visibleItems = filterItems(category, query, sortByPoints);

  // Recupera o nome salvo no Login
  useEffect(() => {
    async function loadData() {
      const savedName = await getUserSession();
      if (savedName) setUserName(savedName);
    }
    loadData();
  }, []);

  return (
<SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>

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
        data={visibleItems}
        keyboardShouldPersistTaps="handled"
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ItemCard item={item} />}

        numColumns={2}
        columnWrapperStyle={styles.row}

        ListHeaderComponent={
          <View>
            <SearchBar
              value={query}
              onChangeText={setQuery}
              sortActive={sortByPoints}
              onToggleSort={() => setSortByPoints((active) => !active)}
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScroll}
            >
              <TouchableOpacity
                style={[styles.chip, category === null ? styles.chipActive : styles.chipInactive]}
                onPress={() => setCategory(null)}
              >
                <Typography.Body3 style={category === null ? styles.chipTextActive : styles.chipTextInactive}>Osasco, SP</Typography.Body3>
              </TouchableOpacity>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, category === cat ? styles.chipActive : styles.chipInactive]}
                  onPress={() => setCategory(cat)}
                >
                  <Typography.Body3 style={category === cat ? styles.chipTextActive : styles.chipTextInactive}>{cat}</Typography.Body3>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Typography.H5 style={styles.sectionTitle}>
              {sortByPoints ? 'Mais EcoPoints primeiro' : 'Recentes'}
            </Typography.H5>
          </View>
        }

        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={32} color="#9CA3AF" />
            <Typography.Body3 style={styles.emptyText}>
              {query.trim()
                ? `Nenhum item encontrado para "${query.trim()}".`
                : 'Nenhum item nesta categoria por enquanto.'}
            </Typography.Body3>
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
  chipTextActive: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  chipTextInactive: {
    color: '#6B7280', fontSize: 14 },
  empty: { alignItems: 'center', paddingHorizontal: 24, paddingVertical: 32, gap: 8 },
  emptyText: { color: '#6B7280', fontSize: 14, lineHeight: 20, textAlign: 'center' },
  sectionTitle: { paddingHorizontal: 24, marginBottom: 16, fontWeight: '700' },
  listContent: { paddingBottom: 100 },
  row: { justifyContent: 'space-between', paddingHorizontal: 24, marginBottom: 16 },
});