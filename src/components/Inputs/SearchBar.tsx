import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

import SearchIcon from '../../assets/images/icons/search.svg'; 
import FilterIcon from '../../assets/images/icons/bar.svg';

import { colors } from '../../../constants/theme';

export default function SearchBar() {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <SearchIcon width={20} height={20} />
      </View>

      <TextInput 
        placeholder="Encontre itens próximos" 
        placeholderTextColor="#9CA3AF"
        style={styles.input}
      />

      {/* ÍCONE DE FILTRO (BAR) */}
      <TouchableOpacity style={styles.filterContainer}>
        <View style={styles.greenCircle}>
            <FilterIcon width={20} height={20} />
        </View>
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
});