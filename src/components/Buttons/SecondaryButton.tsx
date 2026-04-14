import React from 'react';
import { TouchableOpacity, StyleSheet, TouchableOpacityProps, ViewStyle } from 'react-native';
import { colors } from '../../../constants/theme';
import * as Typography from '../Typography/typography';

interface SecondaryButtonProps extends TouchableOpacityProps {
    title: string;
    style?: ViewStyle;
}

export default function SecondaryButton({ title, style, ...props }: SecondaryButtonProps) {
    return (
        <TouchableOpacity 
            style={[styles.button, style]} 
            activeOpacity={0.8}
            {...props}
        >
            <Typography.ButtonText style={styles.text}>
                {title}
            </Typography.ButtonText>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.white, 
        width: '100%',                   
        height: 56,                      
        borderRadius: 12,                
        justifyContent: 'center',        
        alignItems: 'center',            
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    text: {
        color: colors.textDark,
        fontSize: 14,
        lineHeight: 20,
    }
});
