import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

declare const window: any;

export default function TabPage() {
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState<any>(null);
  const [erro, setErro] = useState('');

  async function buscarCEP() {
    if (cep.length !== 8) {
      setErro('Digite um CEP válido');
      return;
    }

    try {
      setErro('');

      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setErro('CEP não encontrado');
        setEndereco(null);
      } else {
        setEndereco(data);
      }
    } catch (error) {
      setErro('Erro ao buscar CEP');
    }
  }

  function abrirGoogleMaps() {
    if (!endereco) return;

    const url = `https://www.google.com/maps/search/?api=1&query=${endereco.logradouro},${endereco.bairro},${endereco.localidade},${endereco.uf}`;

    window.open(url, '_blank');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ReUse ♻️</Text>

      <Text style={styles.subtitle}>Buscar endereço para troca</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite o CEP"
        keyboardType="numeric"
        maxLength={8}
        value={cep}
        onChangeText={setCep}
      />

      <TouchableOpacity style={styles.button} onPress={buscarCEP}>
        <Text style={styles.buttonText}>Buscar localização</Text>
      </TouchableOpacity>

      {erro ? <Text style={styles.error}>{erro}</Text> : null}

      {endereco && (
        <View style={styles.card}>
          <Text>Rua: {endereco.logradouro}</Text>
          <Text>Bairro: {endereco.bairro}</Text>
          <Text>Cidade: {endereco.localidade}</Text>
          <Text>Estado: {endereco.uf}</Text>
        </View>
      )}

      {endereco && (
        <TouchableOpacity style={styles.mapButton} onPress={abrirGoogleMaps}>
          <Text style={styles.mapButtonText}>
            Abrir localização no Google Maps
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F2F2F2'
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 10
  },

  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 18
  },

  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15
  },

  button: {
    backgroundColor: '#2E8B57',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },

  buttonText: {
    color: '#FFF',
    fontWeight: 'bold'
  },

  error: {
    color: 'red',
    marginTop: 15,
    textAlign: 'center'
  },

  card: {
    backgroundColor: '#FFF',
    padding: 20,
    marginTop: 20,
    borderRadius: 10
  },

  mapButton: {
    backgroundColor: '#FFF',
    marginTop: 20,
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2E8B57'
  },

  mapButtonText: {
    color: '#2E8B57',
    fontWeight: 'bold'
  }
});