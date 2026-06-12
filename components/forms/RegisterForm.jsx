import {useState} from 'react'
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import {useAuthContext} from '../../context/AuthContext'
import { InlineSpinner} from '../shared/LoadingSpinner'

export default function RegisterForm() {
    const {register, error} = useAuthContext()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleRegister() {
        setErrorMessage('')

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
        } catch (error) {
            setErrorMessage(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
            <View style={styles.container}>
                <Text style={styles.title}>Register</Text>
    
                {errorMessage ? (
                    <Text style={styles.error}>{errorMessage}</Text>
                ) : null}
    
                <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                />
    
                <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                />

                <TextInput 
                style={styles.input}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"/>
    
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