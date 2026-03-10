import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors } from '../../constants/theme';

const styles = StyleSheet.create({
    h1: {
        fontSize: RFValue(30),
        lineHeight: RFValue(37.5),
        fontWeight: '700',
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    h2: {
        fontSize: RFValue(24),
        lineHeight: RFValue(32),
        fontWeight: '600',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    h3: {
        fontSize: RFValue(20),
        lineHeight: RFValue(28),
        fontWeight: '600',
        fontFamily: 'PlusJakartaSans_600SemiBold',
    },
    h4: {
        fontSize: RFValue(18),
        lineHeight: RFValue(26),
        fontWeight: '500',
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    h5: {
        fontSize: RFValue(16),
        lineHeight: RFValue(24),
        fontWeight: '500',
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    h6: {
        fontSize: RFValue(14),
        lineHeight: RFValue(20),
        fontWeight: '500',
        fontFamily: 'PlusJakartaSans_500Medium',
        textTransform: 'uppercase',
    },
    body: {
        fontSize: RFValue(18),
        lineHeight: RFValue(29.3),
        fontWeight: '400',
        fontFamily: 'PlusJakartaSans_400Regular',
    },
    body2: {
        fontSize: RFValue(16),
        lineHeight: RFValue(28),
        fontWeight: '400',
        fontFamily: 'PlusJakartaSans_400Regular',
        //Para descrições
    },
    body3: {
        fontSize: RFValue(12),
        lineHeight: RFValue(16),
        fontWeight: '400',
        fontFamily: 'PlusJakartaSans_400Regular',
        //Dicas de formulario e afins
    },
    button: {
        fontSize: RFValue(16),
        lineHeight: RFValue(24),
        fontWeight: '700',
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    caption: {
        fontSize: RFValue(12),
        lineHeight: RFValue(16),
        fontWeight: '400',
        fontFamily: 'PlusJakartaSans_400Regular',
    },
});

interface TypographyProps extends TextProps {
    children: React.ReactNode;
}

export const H1 = ({ children, style, ...props }: TypographyProps) => {
    return (
        <Text style={[styles.h1, { color: colors.textDark }, style]} {...props}>
            {children}
        </Text>
    );
};

export const H2 = ({ children, style, ...props }: TypographyProps) => {
    return (
        <Text style={[styles.h2, { color: colors.textDark }, style]} {...props}>
            {children}
        </Text>
    );
};

export const H3 = ({ children, style, ...props }: TypographyProps) => {
    return (
        <Text style={[styles.h3, { color: colors.textDark }, style]} {...props}>
            {children}
        </Text>
    );
};

export const H4 = ({ children, style, ...props }: TypographyProps) => {
    return (
        <Text style={[styles.h4, { color: colors.textDark }, style]} {...props}>
            {children}
        </Text>
    );
};

export const H5 = ({ children, style, ...props }: TypographyProps) => {
    return (
        <Text style={[styles.h5, { color: colors.textDark }, style]} {...props}>
            {children}
        </Text>
    );
};

export const H6 = ({ children, style, ...props }: TypographyProps) => {
    return (
        <Text style={[styles.h6, { color: colors.textDark }, style]} {...props}>
            {children}
        </Text>
    );
};

export const Body = ({ children, style, ...props }: TypographyProps) => {
    return (
        <Text style={[styles.body, { color: colors.textDark }, style]} {...props}>
            {children}
        </Text>
    );
};

export const Body2 = ({ children, style, ...props }: TypographyProps) => {
    return (
        <Text style={[styles.body2, { color: colors.textDark }, style]} {...props}>
            {children}
        </Text>
    );
};

export const Body3 = ({ children, style, ...props }: TypographyProps) => {
    return (
        <Text style={[styles.body3, { color: colors.textDark }, style]} {...props}>
            {children}
        </Text>
    );
};

export const ButtonText = ({ children, style, ...props }: TypographyProps) => {
    return (
        <Text style={[styles.button, { color: colors.textDark }, style]} {...props}>
            {children}
        </Text>
    );
};

export const Caption = ({ children, style, ...props }: TypographyProps) => {
    return (
        <Text style={[styles.caption, { color: colors.textDark }, style]} {...props}>
            {children}
        </Text>
    );
};