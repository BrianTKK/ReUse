import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as Typography from '../Typography/typography';
import { colors } from '../../../constants/theme';

interface ReUseItem {
  id: string;
  title: string;
  category: string;
  points: number;
  image: any;
}

export default function ItemCard({ item }: { item: ReUseItem }) {
  return (
    <TouchableOpacity style={styles.card}>
      <Image 
        source={item.image} 
        style={styles.image} 
        resizeMode="cover" 
      />

      <View style={styles.info}>
        <Typography.H5 style={styles.title} numberOfLines={1}>{item.title}</Typography.H5>
        <Typography.Caption style={styles.category}>{item.category}</Typography.Caption>
        <Typography.Body2 style={styles.points}>{item.points} EcoPoints</Typography.Body2>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    width: '48%',
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  image: {
    width: '100%',
    height: 120,
  },
  info: {
    padding: 12,
  },
  title: { fontSize: 14, fontWeight: '700', color: colors.textDark },
  category: { fontSize: 12, color: '#6B7280', marginVertical: 4 },
  points: { fontSize: 14, fontWeight: '600', color: colors.primary },
});