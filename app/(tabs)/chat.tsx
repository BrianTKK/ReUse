import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';

type Chat = {
  id: number;
  nome: string;
  produto: string;
  mensagem: string;
};

export default function Chat() {

  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  async function carregarChats() {

    try {

      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users'
      );

      const data = await response.json();

      const produtos = [
        'Bicicleta',
        'Cadeira Gamer',
        'Mesa de Escritório',
        'Sofá',
        'Monitor',
        'Estante',
        'Vaso Decorativo',
        'Patins'
      ];

      const mensagens = [
        'Tenho interesse na troca. Ainda está disponível?',
        'Consigo retirar amanhã 😊',
        'Aceita troca por outro item?',
        'O produto ainda está em bom estado?',
        'Tenho interesse! Podemos combinar um local?',
        'A bicicleta ainda está disponível?',
        'Gostei muito do item!',
        'Você consegue entregar em Osasco?'
      ];

      const chatsFormatados = data.slice(0, 8).map((user: any, index: number) => ({
        id: user.id,
        nome: user.name,
        produto: produtos[index],
        mensagem: mensagens[index]
      }));

      setChats(chatsFormatados);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  }

  useEffect(() => {

    carregarChats();

  }, []);

  if (loading) {

    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2E8B57" />
        <Text>Carregando conversas...</Text>
      </View>
    );
  }

  return (

    <SafeAreaView style={styles.container}>

      <Text style={styles.title}>
        Conversas
      </Text>

      <Text style={styles.subtitle}>
        Usuários interessados nos seus itens
      </Text>

      <FlatList
        data={chats}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (

          <View style={styles.card}>

            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.nome.charAt(0)}
              </Text>
            </View>

            <View style={styles.content}>

              <Text style={styles.name}>
                {item.nome}
              </Text>

              <Text style={styles.product}>
                Interesse em: {item.produto}
              </Text>

              <Text style={styles.message}>
                {item.mensagem}
              </Text>

            </View>

          </View>

        )}
      />

    </SafeAreaView>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    padding: 20
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4
  },

  subtitle: {
    color: '#6B7280',
    marginBottom: 20
  },

  list: {
    paddingBottom: 100
  },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2E8B57',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14
  },

  avatarText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold'
  },

  content: {
    flex: 1
  },

  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4
  },

  product: {
    color: '#2E8B57',
    fontWeight: '600',
    marginBottom: 6
  },

  message: {
    color: '#555',
    lineHeight: 20
  },

  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10
  }

});