import {useState} from 'react'
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import {useAuthContext} from '../../context/AuthContext'
import { InlineSpinner} from '../shared/LoadingSpinner'
import { Ionicons } from '@expo/vector-icons'  

export default function RegisterForm() {
    const {register, error} = useAuthContext()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [loading, setLoading] = useState(false)
    

    async function handleRegister() {
        setErrorMessage('')
        setSuccessMessage('')

        if (!email || !password || !confirmPassword) {
            setErrorMessage('Please fill in all the fields.')
            return
        }

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.')
            return
        }

        if (password.length < 6) {
            setErrorMessage('Password must be at least 6 characters.')
            return
        }

        try {
            setLoading(true)
            await register(email.trim(), password)
            setSuccessMessage('Account successfully created!')
        } catch (error) {
            setErrorMessage(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
            <View style={styles.container}>
                <Text style={styles.title}>Register</Text>

                {successMessage ? (
                    <View style={styles.successContainer}>
                        <Text style={styles.successText}>{successMessage}</Text>
                    </View>
                ) : null}
    
                {errorMessage ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    </View>
                ) : null}

                {error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : null}
    
                <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                />
    
                <View style={styles.inputWrapper}>
                <TextInput
                style={styles.inputWithIcon}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                />
                <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(prev => !prev)}
                >
                <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#52796F"
                />
                </TouchableOpacity>
            </View>

            <View style={styles.inputWrapper}>
                <TextInput
                style={styles.inputWithIcon}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                />
                <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(prev => !prev)}
                >
                <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#52796F"
                />
                </TouchableOpacity>
            </View>
    
                <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={loading}
                >
                {loading ? (
                    InlineSpinner({})
                ) : (
                    <Text style={styles.buttonText}>Create Account</Text>
                )}
                </TouchableOpacity>
    
            </View>
        )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },

    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1B4332',
        marginBottom: 24,
    },

    successContainer: {
        backgroundColor: '#DCFCE7',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },

    successText: {
        color: '#15803D',
        fontSize: 14,
    },

    error: {
        backgroundColor: '#FDECEA',
        color: '#691b29',
        fontSize: 14,
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        overflow: 'hidden',
    },

    input: {
        borderWidth: 1,
        borderColor: '#95D5B2',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
        backgroundColor: '#F0FAF4',
        color: '#1B4332',
    },

    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#95D5B2',
        borderRadius: 8,
        backgroundColor: '#F0FAF4',
        marginBottom: 16,
    },

    inputWithIcon: {
        flex: 1,
        padding: 12,
        fontSize: 16,
        color: '#1B4332',
    },

    eyeButton: {
        padding: 12,
    },

    button: {
        backgroundColor: '#2D6A4F',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 8
    },

    buttonDisabled: {
        opacity: 0.6,   
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600'
    }

})