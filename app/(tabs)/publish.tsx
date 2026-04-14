import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Typography from '../../src/components/Typography/typography';
import { colors } from '../../constants/theme';

export default function NewListing() {
  const router = useRouter();
  const [status, setStatus] = useState('Novo');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="close" size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Typography.H5 style={styles.headerTitle}>New Listing</Typography.H5>
        <TouchableOpacity>
          <Typography.Body2 style={{ color: colors.primary, fontWeight: '700' }}>Post</Typography.Body2>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <TouchableOpacity style={styles.photoUploadArea}>
          <View style={styles.addIconCircle}>
            <AntDesign name="plus" size={24} color={colors.primary} />
          </View>
          <Typography.H5 style={{ marginTop: 12, color: '#1A4632' }}>Adicionar Fotos</Typography.H5>
          <Typography.Caption style={{ color: '#9CA3AF' }}>Até 10 fotos</Typography.Caption>
        </TouchableOpacity>

        <View style={styles.form}>
          
          <View style={styles.inputGroup}>
            <Typography.Caption style={styles.label}>TÍTULO DO OBJETO</Typography.Caption>
            <TextInput 
              placeholder="Ex: Cadeira de Escritório Ergonômica" 
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Typography.Caption style={styles.label}>CATEGORIA</Typography.Caption>
            <TouchableOpacity style={styles.selectInput}>
              <Typography.Body3 style={{ color: '#9CA3AF' }}>Selecionar categoria</Typography.Body3>
              <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Typography.Caption style={styles.label}>DESCRIÇÃO DETALHADA</Typography.Caption>
            <TextInput 
              placeholder="Descreva o estado, dimensões e motivo da doação/venda..." 
              multiline
              numberOfLines={4}
              style={[styles.input, styles.textArea]}
            />
          </View>

          <View style={styles.inputGroup}>
            <Typography.Caption style={styles.label}>ESTADO DE CONSERVAÇÃO</Typography.Caption>
            <View style={styles.chipRow}>
              {['Novo', 'Excelente', 'Bom', 'OK'].map((item) => (
                <TouchableOpacity 
                  key={item} 
                  onPress={() => setStatus(item)}
                  style={[
                    styles.statusChip, 
                    status === item ? styles.activeChip : styles.inactiveChip
                  ]}
                >
                  <Typography.Body3 style={{ color: status === item ? '#FFF' : '#111827' }}>
                    {item}
                  </Typography.Body3>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.publishButton}>
          <Typography.H5 style={styles.publishButtonText}>Publicar Anúncio</Typography.H5>
          <MaterialCommunityIcons name="send-outline" size={20} color="#FFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: { fontWeight: '700' },
  scrollContent: { padding: 20 },
  photoUploadArea: {
    height: 200,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginBottom: 24,
  },
  addIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#19E65E20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  label: { color: '#4B6358', fontWeight: '700', letterSpacing: 0.5 },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    fontSize: 14,
    color: '#9CA3AF',
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  selectInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statusChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  activeChip: { backgroundColor: '#19E65E', borderColor: '#19E65E' },
  inactiveChip: { backgroundColor: '#FFF' },
  publishButton: {
    backgroundColor: '#19E65E',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    borderRadius: 16,
    marginTop: 32,
    marginBottom: 20,
  },
  publishButtonText: { color: '#FFF', fontWeight: '700' },
});