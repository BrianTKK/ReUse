import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import SearchIcon from '../../assets/images/icons/search.svg';
import FilterIcon from '../../assets/images/icons/bar.svg';

import { colors } from '../../../constants/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  sortActive: boolean;        // ordenação por EcoPoints ligada
  onToggleSort: () => void;
}

export default function SearchBar({ value, onChangeText, sortActive, onToggleSort }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <SearchIcon width={20} height={20} />
      </View>

      <TextInput
        placeholder="Encontre itens próximos"
        placeholderTextColor="#9CA3AF"
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        autoCorrect={false}
      />

      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeText('')}
          accessibilityRole="button"
          accessibilityLabel="Limpar busca"
          hitSlop={8}
        >
          <Ionicons name="close-circle" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      )}

      {/* ÍCONE DE FILTRO (BAR) */}
      <TouchableOpacity
        style={styles.filterContainer}
        onPress={onToggleSort}
        accessibilityRole="button"
        accessibilityLabel={sortActive ? 'Tirar a ordenação por EcoPoints' : 'Ordenar por mais EcoPoints'}
      >
        <View style={[styles.greenCircle, sortActive && styles.greenCircleActive]}>
            <FilterIcon width={20} height={20} />
        </View>
        {sortActive && <View style={styles.activeDot} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  iconContainer: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    paddingVertical: 0,
  },
  filterContainer: {
    marginLeft: 10,
  },
  greenCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1A4632',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greenCircleActive: {
    backgroundColor: colors.primary,
  },
  activeDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.greenLight,
    borderWidth: 2,
    borderColor: '#FFF',
  },
});