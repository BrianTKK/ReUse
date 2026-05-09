import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { getUserSession } from '../../src/services/authService';

export default function Profile() {
  const [userName, setUserName] = useState('Usuário');
  const [cidade, setCidade] = useState('Osasco, SP');
  const [pontos, setPontos] = useState(320);
  const [trocas, setTrocas] = useState(12);
  const [itens, setItens] = useState(4);

  async function carregarPerfil() {
    const savedName = await getUserSession();

    if (savedName) {
      setUserName(savedName);
    }

    const perfilSalvo = await AsyncStorage.getItem('@reuse_perfil');

    if (perfilSalvo) {
      const perfil = JSON.parse(perfilSalvo);

      setCidade(perfil.cidade);
      setPontos(perfil.pontos);
      setTrocas(perfil.trocas);
      setItens(perfil.itens);
    }
  }

  async function salvarPerfil() {
    const perfil = {
      cidade: 'Osasco, SP',
      pontos: 320,
      trocas: 12,
      itens: 4
    };

    await AsyncStorage.setItem('@reuse_perfil', JSON.stringify(perfil));

    setCidade(perfil.cidade);
    setPontos(perfil.pontos);
    setTrocas(perfil.trocas);
    setItens(perfil.itens);
  }

  useEffect(() => {
    carregarPerfil();
  }, []);

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {userName.charAt(0).toUpperCase()}
          </Text>
        </View>

        <Text style={styles.name}>{userName}</Text>

        <View style={styles.location}>
          <Ionicons name="location-outline" size={16} color="#6B7280" />
          <Text style={styles.locationText}>{cidade}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Resumo ReUse</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Pontos acumulados</Text>
          <Text style={styles.value}>{pontos}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Trocas concluídas</Text>
          <Text style={styles.value}>{trocas}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Itens publicados</Text>
          <Text style={styles.value}>{itens}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={salvarPerfil}>
        <Text style={styles.buttonText}>Salvar perfil no cache local</Text>
      </TouchableOpacity>

      <Text style={styles.explanation}>
        Esses dados ficam salvos localmente no aplicativo usando cache.
      </Text>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    padding: 20
  },

  header: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#2E8B57',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12
  },

  avatarText: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: 'bold'
  },

  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6
  },

  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },

  locationText: {
    color: '#6B7280'
  },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 20,
    marginBottom: 20
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 18
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },

  label: {
    color: '#555'
  },

  value: {
    fontWeight: 'bold',
    color: '#2E8B57'
  },

  button: {
    backgroundColor: '#2E8B57',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center'
  },

  buttonText: {
    color: '#FFF',
    fontWeight: 'bold'
  },

  explanation: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 14,
    fontSize: 13
  }
});