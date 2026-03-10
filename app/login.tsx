import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Components
import PrimaryButton from '../components/Buttons/PrimaryButton';
import SecondaryButton from '../components/Buttons/SecondaryButton';
import CustomTextInput from '../components/Inputs/CustomTextInput';
import * as Typography from '../components/Typography/typography';
import { colors } from '../constants/theme';

// Icons/SVGs
import EmailIcon from '../assets/images/icons/email.svg';
import EyeIcon from '../assets/images/icons/eye.svg';
import LockIcon from '../assets/images/icons/lock.svg';
import LogoReUseText from '../assets/images/ReUse.svg';
import ReUseLogo from '../assets/images/ReUse_SVG.svg';

type Tab = 'Entrar' | 'Cadastrar';

export default function LoginScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('Entrar');
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const validatePassword = (text: string) => {
        setPassword(text);
        if (activeTab === 'Cadastrar') {
            const hasUpperCase = /[A-Z]/.test(text);
            const hasLowerCase = /[a-z]/.test(text);
            const hasMinLength = text.length >= 8;

            if (!hasMinLength) {
                setPasswordError('A senha deve ter no mínimo 8 caracteres.');
            } else if (!hasUpperCase || !hasLowerCase) {
                setPasswordError('A senha deve conter letras maiúsculas e minúsculas.');
            } else {
                setPasswordError('');
            }
        }
    };

    const handleAction = () => {
        if (activeTab === 'Cadastrar') {
            if (passwordError) return;
            if (password !== confirmPassword) {
                setPasswordError('As senhas não coincidem.');
                return;
            }
        }
        console.log("Submit via " + activeTab);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* HEADER */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <AntDesign name="arrow-left" size={24} color={colors.textDark} />
                    </TouchableOpacity>
                    <LogoReUseText width={75} height={25} />
                </View>

                {/* HERO SECTION */}
                <View style={styles.heroSection}>
                    <View style={{ marginBottom: 18 }}>
                        <ReUseLogo width={40} height={40} />
                    </View>
                    <Typography.H2 style={{ fontWeight: '700', textAlign: 'center', marginBottom: 6 }}>
                        Bem Vindo de Volta
                    </Typography.H2>
                    <Typography.Body2 style={{ textAlign: 'center', color: '#6B7280' }}>
                        Junte-se ao movimento eco-friendly
                    </Typography.Body2>
                </View>

                {/* TABS */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'Entrar' && styles.activeTab]}
                        onPress={() => {
                            setActiveTab('Entrar');
                            setPasswordError('');
                        }}
                    >
                        <Typography.H5 style={{ color: activeTab === 'Entrar' ? colors.primary : '#6B7280' }}>
                            Entrar
                        </Typography.H5>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'Cadastrar' && styles.activeTab]}
                        onPress={() => {
                            setActiveTab('Cadastrar');
                            validatePassword(password);
                        }}
                    >
                        <Typography.H5 style={{ color: activeTab === 'Cadastrar' ? colors.primary : '#6B7280' }}>
                            Cadastrar
                        </Typography.H5>
                    </TouchableOpacity>
                </View>

                {/* FORM AREA */}
                <View style={styles.formContainer}>
                    {activeTab === 'Cadastrar' && (
                        <CustomTextInput
                            label="Nome"
                            placeholder="Seu nome completo"
                        />
                    )}

                    <CustomTextInput
                        label="Email"
                        placeholder="Email"
                        iconLeft={<EmailIcon width={20} height={20} />}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <CustomTextInput
                        label="Senha"
                        placeholder="Senha"
                        iconLeft={<LockIcon width={20} height={20} />}
                        iconRight={<EyeIcon width={20} height={20} />}
                        secureTextEntry={!isPasswordVisible}
                        onIconRightPress={() => setPasswordVisible(!isPasswordVisible)}
                        value={password}
                        onChangeText={validatePassword}
                    />

                    {activeTab === 'Cadastrar' && passwordError ? (
                        <Typography.Body3 style={{ color: 'red', marginTop: -16, marginBottom: 16 }}>
                            {passwordError}
                        </Typography.Body3>
                    ) : null}

                    {activeTab === 'Cadastrar' && (
                        <CustomTextInput
                            label="Confirmar Senha"
                            placeholder="Confirmar Senha"
                            iconLeft={<LockIcon width={20} height={20} />}
                            iconRight={<EyeIcon width={20} height={20} />}
                            secureTextEntry={!isConfirmPasswordVisible}
                            onIconRightPress={() => setConfirmPasswordVisible(!isConfirmPasswordVisible)}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                    )}

                    {activeTab === 'Entrar' && (
                        <TouchableOpacity style={styles.forgotPasswordContainer}>
                            <Typography.ButtonText style={{ color: '#9CA3AF', fontSize: 14 }}>
                                Esqueci minha senha
                            </Typography.ButtonText>
                        </TouchableOpacity>
                    )}

                    <PrimaryButton
                        title={activeTab === 'Entrar' ? 'Entrar' : 'Cadastrar'}
                        onPress={handleAction}
                        style={{ marginTop: 5 }}
                    />
                </View>

                {/* DIVIDER */}
                <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Typography.Body3 style={styles.dividerText}>OU CONTINUE COM</Typography.Body3>
                    <View style={styles.dividerLine} />
                </View>

                {/* SOCIAL BUTTONS */}
                <View style={styles.socialContainer}>
                    <View style={styles.socialButtonWrapper}>
                        <SecondaryButton title="Google" onPress={() => console.log('Google')} />
                    </View>
                    <View style={styles.socialButtonWrapper}>
                        <SecondaryButton title="Apple" onPress={() => console.log('Apple')} />
                    </View>
                </View>

                {/* FOOTER */}
                <View style={styles.footerContainer}>
                    <Typography.Caption style={{ textAlign: 'center', color: '#6B7280' }}>
                        By continuing, you agree to ReUse! <Typography.Caption style={{ color: colors.textDark, fontWeight: '700' }}>Terms of Service</Typography.Caption> and <Typography.Caption style={{ color: colors.textDark, fontWeight: '700' }}>Privacy Policy</Typography.Caption>.
                    </Typography.Caption>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    heroSection: {
        alignItems: 'center',
        marginTop: 14,
        marginBottom: 20,
    },
    recycleIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#19E65E20',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: colors.primary,
    },
    formContainer: {
        marginBottom: 20,
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginBottom: 20,
        marginTop: -8,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    dividerText: {
        color: '#9CA3AF',
        paddingHorizontal: 16,
        fontWeight: '500',
    },
    socialContainer: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
    },
    socialButtonWrapper: {
        flex: 1,
    },
    footerContainer: {
        paddingHorizontal: 20,
    }
});
