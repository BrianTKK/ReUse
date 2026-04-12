import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { getUserSession } from '../src/services/authService';
import ItemCard from '../src/components/ItemCard';

// Defina uma interface para o item (Boa prática de Engenharia!)
interface ReUseItem {
  id: string;
  title: string;
  category: string;
  points: number;
}

// Tipando a prop
export default function ItemCard({ item }: { item: ReUseItem }) {
   // seu código atual...
}
const DATA = [
  { id: '1', title: 'Cadeira de Escritório', category: 'Móveis', points: 50 },
  { id: '2', title: 'Monitor 24 polegadas', category: 'Eletrônicos', points: 120 },
];

export default function Home() {
  const [userName, setUserName] = useState('Usuário');

  useEffect(() => {
    async function loadUser() {
      const name = await getUserSession();
      if (name) setUserName(name);
    }
    loadUser();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {userName}!</Text>
          <Text style={styles.subGreeting}>O que vamos reutilizar hoje?</Text>
        </View>
        {/* Aqui você pode colocar o ícone de perfil depois */}
      </View>

      <FlatList
        data={DATA}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ItemCard item={item} />}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<Text style={styles.sectionTitle}>Vitrine de Reuso</Text>}
      />
    </SafeAreaView>
  );
}