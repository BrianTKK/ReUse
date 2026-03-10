import React from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';
// 1. Importaremos as cores que criamos
import { colors } from '../../constants/theme';
// 2. Importamos o componente de texto de botão que criamos
import * as Typography from '../Typography/typography';

// "Regras" do que esse botão precisa receber para funcionar
interface PrimaryButtonProps extends TouchableOpacityProps {
    title: string;       // O texto do botão (ex: "Começar Agora")
    style?: ViewStyle;   // Para permitir mudar espaçamentos extras na tela se precisar
}

export default function PrimaryButton({ title, style, ...props }: PrimaryButtonProps) {
    return (
        <TouchableOpacity
            style={[styles.button, style]}
            activeOpacity={0.8} // Efeito quando o usuário aperta o botão
            {...props}
        >
            <Typography.ButtonText style={styles.text}>
                {title}
            </Typography.ButtonText>
        </TouchableOpacity>
    );
}

// Estilos padrão do nosso botão global
const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.greenLight,
        width: '100%',                   // Ocupa a largura da tela (ajustável na hora de usar)
        height: 56,                      // Uma altura confortável para o dedo
        borderRadius: 48,                // Arredonda as bordas (metade da altura deixa ele em forma de pílula)
        justifyContent: 'center',        // Centraliza o texto verticalmente
        alignItems: 'center',            // Centraliza o texto horizontalmente
        marginVertical: 10,              // Espacinho em cima e embaixo para não colar em outros itens
    },
    text: {
        color: colors.white,             // Texto branco contrastando com o fundo verde
    }
});
