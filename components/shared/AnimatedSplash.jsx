import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';

export default function AnimatedSplash({ onFinish }) {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../assets/animations/agrosense.json')}
        style={styles.animation}
        autoPlay
        loop={false}
        onAnimationFinish={onFinish}
        speed={1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  animation: {
    width: 300,
    height: 400,
  },
});