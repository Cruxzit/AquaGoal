import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { Button } from 'react-native';

export default function App() {
  const [totalCups, setTotalCups] = useState(0);
  const [dailyGoal, setDailyGoal] = useState('');
  const numericGoal = Number(dailyGoal);
  const [confirmedGoal, setConfirmedGoal] = useState(null);
  const [page, setPage] = useState('home');

  const setConfirmedDailyGoal = () => {
    const g = Number(dailyGoal);
    if (!Number.isNaN(g) && g > 0) {
      setConfirmedGoal(g);
      alert(`Daily goal set to ${g} cups!`);
    } else {
      alert('Please enter a valid number for the daily goal.');
    }
  };
  return (
    <View style={styles.container}>
      {page === 'home' ? (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Total cups today: {totalCups}</Text>
          {confirmedGoal > 0 && (
            <Text style={{ marginBottom: 8 }}>Daily goal: {confirmedGoal} cups</Text>
          )}
          <Button title="Add Cup" onPress={() => setTotalCups(c => c + 1)} />
          <View style={{ height: 10 }} />
          <Button title="Reset" onPress={() => setTotalCups(0)} />
          {confirmedGoal > 0 && totalCups >= confirmedGoal && (
            <Text style={{ marginTop: 12, fontWeight: 'bold' }}>Goal reached!</Text>
          )}
        </View>
      ) : (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Set your daily goal</Text>
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 8, width: 140, textAlign: 'center' }}
            keyboardType="numeric"
            placeholder="Daily Goal"
            value={dailyGoal}
            onChangeText={setDailyGoal}
          />
          <View style={{ height: 10 }} />
          <Button title="Set Daily Goal" onPress={setConfirmedDailyGoal} />
          {confirmedGoal > 0 && (
            <Text style={{ marginTop: 12 }}>Current confirmed goal: {confirmedGoal} cups</Text>
          )}
        </View>
      )}

      <StatusBar style="auto" />

      <View style={styles.navbar}>
        <Button title="Home" onPress={() => setPage('home')} />
        <Button title="Goal" onPress={() => setPage('goal')} />
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
  },
});
