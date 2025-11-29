import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Animated, Easing, Button } from 'react-native';
import { useState, useRef, useEffect } from 'react';

export default function App() {
  const [totalCups, setTotalCups] = useState(0);
  const [dailyGoal, setDailyGoal] = useState('');
  const numericGoal = Number(dailyGoal);
  const [confirmedGoal, setConfirmedGoal] = useState(null);
  const [page, setPage] = useState('home');
  const defaultGoal = 8; // used for animation when no confirmed goal
  const fillAnim = useRef(new Animated.Value(0)).current; // 0..1

  const setConfirmedDailyGoal = () => {
    const g = Number(dailyGoal);
    if (!Number.isNaN(g) && g > 0) {
      setConfirmedGoal(g);
      alert(`Daily goal set to ${g} cups!`);
    } else {
      alert('Please enter a valid number for the daily goal.');
    }
  };

  useEffect(() => {
    const goal = confirmedGoal && confirmedGoal > 0 ? confirmedGoal : defaultGoal;
    const toValue = Math.min(totalCups / goal, 1);
    Animated.timing(fillAnim, {
      toValue,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [totalCups, confirmedGoal]);

  return (
    <View style={styles.container}>
      {page === 'home' ? (
        <View style={styles.content}>
          <Text style={styles.title}>Total cups today</Text>
          <Text style={styles.total}>{totalCups}</Text>
          {confirmedGoal > 0 && (
            <Text style={styles.goalText}>Daily goal: {confirmedGoal} cups</Text>
          )}

          <View style={styles.cupArea}>
            <View style={styles.cupContainer}>
              <Animated.View
                style={[
                  styles.cupFill,
                  {
                    height: fillAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
                  },
                ]}
              />
            </View>
            <Text style={{ marginTop: 8 }}>Progress</Text>
          </View>

          <View style={styles.buttonArea}>
            <View style={styles.buttonWrapper}>
              <Button title="Add Cup" onPress={() => setTotalCups(c => c + 1)} />
            </View>
            <View style={styles.buttonWrapper}>
              <Button title="Reset" onPress={() => setTotalCups(0)} />
            </View>
          </View>

          {confirmedGoal > 0 && totalCups >= confirmedGoal && (
            <Text style={styles.reached}>Goal reached!</Text>
          )}
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.title}>Set your daily goal</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Daily Goal"
            value={dailyGoal}
            onChangeText={setDailyGoal}
          />
          <View style={{ height: 10 }} />
          <Button title="Set Daily Goal" onPress={setConfirmedDailyGoal} />
          {confirmedGoal > 0 && (
            <Text style={styles.goalText}>Current confirmed goal: {confirmedGoal} cups</Text>
          )}
        </View>
      )}

      <StatusBar style="auto" />

      <View style={styles.navbar}>
        <TouchableOpacity
          style={[styles.navButton, page === 'home' && styles.navButtonActive]}
          onPress={() => setPage('home')}
        >
          <Text style={[styles.navText, page === 'home' && styles.navTextActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButton, page === 'goal' && styles.navButtonActive]}
          onPress={() => setPage('goal')}
        >
          <Text style={[styles.navText, page === 'goal' && styles.navTextActive]}>Goal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  content: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  total: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1976d2',
    marginBottom: 8,
  },
  goalText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    height: 44,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8,
    width: 160,
    textAlign: 'center',
    borderRadius: 6,
    paddingHorizontal: 8,
  },
  buttonArea: {
    marginTop: 12,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonWrapper: {
    width: 120,
    marginHorizontal: 8,
  },
  reached: {
    marginTop: 12,
    fontWeight: '700',
    color: '#2e7d32',
    fontSize: 16,
  },
  cupArea: {
    alignItems: 'center',
    marginTop: 12,
  },
  cupContainer: {
    width: 80,
    height: 140,
    borderWidth: 3,
    borderColor: '#1976d2',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
  },
  cupFill: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1976d2',
    width: '100%',
  },
  navbar: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    height: 56,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
    paddingHorizontal: 10,
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  navButtonActive: {
    backgroundColor: '#1976d2',
  },
  navText: {
    color: '#333',
    fontWeight: '600',
  },
  navTextActive: {
    color: '#fff',
  },
});
