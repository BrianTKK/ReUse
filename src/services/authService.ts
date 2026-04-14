import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveUserSession = async (userName: string) => {
  try {
    // Salvando o nome do usuário para persistência 
    await AsyncStorage.setItem('@user_name', userName);
  } catch (e) {
    console.error("Erro ao salvar sessão", e);
  }
};

export const getUserSession = async () => {
  try {
    return await AsyncStorage.getItem('@user_name');
  } catch (e) {
    console.error("Erro ao recuperar sessão", e);
  }
};