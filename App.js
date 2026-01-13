import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Animated, Easing, Button, Keyboard, ScrollView } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useState, useRef, useEffect } from 'react';

// Definir os 5 temas
const themes = {
  blue: {
    name: 'Blue Ocean',
    primary: '#16a0ff',
    secondary: '#1976d2',
    accent: '#0b63b6',
    background: '#fff',
    cardBackground: '#fff',
    text: '#0b2b3a',
    textSecondary: '#6b7280',
    progressBg: '#e6f3ff',
    border: '#eef6ff',
  },
  purple: {
    name: 'Purple Dream',
    primary: '#9c27b0',
    secondary: '#7b1fa2',
    accent: '#6a1b9a',
    background: '#fff',
    cardBackground: '#fff',
    text: '#1a1a2e',
    textSecondary: '#6b7280',
    progressBg: '#f3e5f5',
    border: '#e1bee7',
  },
  green: {
    name: 'Nature Green',
    primary: '#4caf50',
    secondary: '#388e3c',
    accent: '#2e7d32',
    background: '#fff',
    cardBackground: '#fff',
    text: '#1b5e20',
    textSecondary: '#6b7280',
    progressBg: '#e8f5e9',
    border: '#c8e6c9',
  },
  orange: {
    name: 'Sunset Orange',
    primary: '#ff9800',
    secondary: '#f57c00',
    accent: '#e65100',
    background: '#fff',
    cardBackground: '#fff',
    text: '#e65100',
    textSecondary: '#6b7280',
    progressBg: '#fff3e0',
    border: '#ffe0b2',
  },
  dark: {
    name: 'Dark Mode',
    primary: '#00bcd4',
    secondary: '#0097a7',
    accent: '#00838f',
    background: '#121212',
    cardBackground: '#1e1e1e',
    text: '#ffffff',
    textSecondary: '#b0b0b0',
    progressBg: '#2a2a2a',
    border: '#3a3a3a',
  },
};

export default function App() {
  const [totalCups, setTotalCups] = useState(0);
  const [dailyGoal, setDailyGoal] = useState('');
  const numericGoal = Number(dailyGoal);
  const [confirmedGoal, setConfirmedGoal] = useState(null);
  const [page, setPage] = useState('home');
  const [currentTheme, setCurrentTheme] = useState('blue');
  const theme = themes[currentTheme];
  const defaultGoal = 8; // used for animation when no confirmed goal
  const fillAnim = useRef(new Animated.Value(0)).current; // 0..1

  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const goalInputRef = useRef(null);

  const setConfirmedDailyGoal = () => {
    const g = Number(dailyGoal);
    if (!Number.isNaN(g) && g > 0) {
      setConfirmedGoal(g);
      alert(`Daily goal set to ${g} cups!`);
      Keyboard.dismiss();
    } else {
      alert('Please enter a valid number for the daily goal.');
    }
  };

  const AppButton = ({ title, onPress, type = 'primary' }) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.appButton,
        type === 'secondary' && styles.appButtonSecondary,
      ]}
    >
      <Text style={[styles.appButtonText, type === 'secondary' && styles.appButtonTextSecondary]}>{title}</Text>
    </TouchableOpacity>
  );

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

  // Animated SVG circle for circular progress
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  function CircularProgress({ size = 160, strokeWidth = 12, progressAnim, progress = 0, theme }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    // Use the parent's animated value when provided so the animation
    // starts from the previous value instead of from 0.
    const internalAnimated = useRef(new Animated.Value(progress)).current;
    const animated = progressAnim || internalAnimated;

    useEffect(() => {
      // If parent didn't provide an animated value, animate the internal one.
      if (!progressAnim) {
        Animated.timing(animated, {
          toValue: progress,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }).start();
      }
    }, [progress, progressAnim]);

    const strokeDashoffset = animated.interpolate({
      inputRange: [0, 1],
      outputRange: [circumference, 0],
    });

    return (
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.progressBg}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.secondary}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {page === 'home' && (
        <>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>💧</Text>
            <Text style={[styles.appTitle, { color: theme.secondary }]}>AquaGoal</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Stay hydrated, stay healthy</Text>
          </View>

          {/* Card */}
          <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
        {/* Main area with circular progress */}
        <View style={styles.cardCenter}>
          <View style={styles.circularWrapper}>
            <CircularProgress
              size={180}
              strokeWidth={14}
              progressAnim={fillAnim}
              progress={Math.min(totalCups / (confirmedGoal && confirmedGoal > 0 ? confirmedGoal : (numericGoal > 0 ? numericGoal : 8)), 1)}
              theme={theme}
            />
            <View style={styles.centerNumber} pointerEvents="none">
              <Text style={[styles.bigNumber, { color: theme.text }]}>{totalCups}</Text>
              <Text style={[styles.ofText, { color: theme.textSecondary }]}>{`of ${confirmedGoal > 0 ? confirmedGoal : (numericGoal > 0 ? numericGoal : 8)} glasses`}</Text>
            </View>
          </View>
        </View>

        {/* Add button row */}
        <View style={styles.addRowCard}>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            activeOpacity={0.85}
            onPress={() => setTotalCups(c => c + 1)}
          >
            <Text style={styles.addButtonText}>+  Add Glass</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.resetSmall, { backgroundColor: theme.accent }]} onPress={() => setTotalCups(0)}>
            <Text style={styles.resetSmallText}>↺</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* Goal row (editable inline) */}
        <View style={styles.goalRow}>
          <View style={styles.goalLeft}>
            <View style={styles.goalIcon}><Text style={{color: theme.accent}}>◎</Text></View>
            <Text style={[styles.goalLabel, { color: theme.text }]}>Daily Goal</Text>
          </View>
          <View style={styles.goalRight}>
            {isEditingGoal ? (
              <>
                <TextInput
                  ref={goalInputRef}
                  style={[styles.goalInput, { color: theme.text, borderColor: theme.border }]}
                  keyboardType="numeric"
                  returnKeyType="done"
                  blurOnSubmit={true}
                  onSubmitEditing={() => {
                    setConfirmedDailyGoal();
                    if (goalInputRef.current && goalInputRef.current.blur) goalInputRef.current.blur();
                    setIsEditingGoal(false);
                    Keyboard.dismiss();
                  }}
                  value={dailyGoal}
                  onChangeText={setDailyGoal}
                />
                <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.primary }]} onPress={() => { setConfirmedDailyGoal(); if (goalInputRef.current && goalInputRef.current.blur) goalInputRef.current.blur(); setIsEditingGoal(false); }}>
                  <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity onPress={() => setIsEditingGoal(true)}>
                <Text style={[styles.goalLink, { color: theme.primary }]}>{confirmedGoal > 0 ? `${confirmedGoal} glasses` : `${numericGoal > 0 ? numericGoal : 8} glasses`}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      <StatusBar style="auto" />

      <View style={styles.navbar}>
        <TouchableOpacity
          style={[styles.navButton, page === 'home' && styles.navButtonActive]}
          onPress={() => { Keyboard.dismiss(); setPage('home'); }}
        >
          <Text style={[styles.navText, page === 'home' && styles.navTextActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButton, page === 'settings' && styles.navButtonActive]}
          onPress={() => { Keyboard.dismiss(); setPage('settings'); }}
        >
          <Text style={[styles.navText, page === 'settings' && styles.navTextActive]}>Settings</Text>
        </TouchableOpacity>
      </View>
    </>
      )}

      {page === 'settings' && (
        <>
          <View style={styles.header}>
            <Text style={styles.logo}>⚙️</Text>
            <Text style={[styles.appTitle, { color: theme.secondary }]}>Settings</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Customize your app</Text>
          </View>

          <ScrollView style={styles.settingsContainer}>
            <Text style={[styles.settingsTitle, { color: theme.text }]}>Choose Theme</Text>
            {Object.keys(themes).map((themeKey) => (
              <TouchableOpacity
                key={themeKey}
                style={[
                  styles.themeOption,
                  { backgroundColor: theme.cardBackground, borderColor: theme.border },
                  currentTheme === themeKey && { borderColor: theme.primary, borderWidth: 3 }
                ]}
                onPress={() => setCurrentTheme(themeKey)}
              >
                <View style={styles.themeOptionContent}>
                  <View style={[styles.themeColorPreview, { backgroundColor: themes[themeKey].primary }]} />
                  <View style={styles.themeInfo}>
                    <Text style={[styles.themeName, { color: theme.text }]}>{themes[themeKey].name}</Text>
                    {currentTheme === themeKey && (
                      <Text style={[styles.activeTheme, { color: theme.primary }]}>✓ Active</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.navbar}>
            <TouchableOpacity
              style={[styles.navButton, page === 'home' && styles.navButtonActive]}
              onPress={() => { Keyboard.dismiss(); setPage('home'); }}
            >
              <Text style={[styles.navText, page === 'home' && styles.navTextActive]}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.navButton, page === 'settings' && styles.navButtonActive]}
              onPress={() => { Keyboard.dismiss(); setPage('settings'); }}
            >
              <Text style={[styles.navText, page === 'settings' && styles.navTextActive]}>Settings</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 6,
  },
  logo: {
    fontSize: 36,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0b63b6',
  },
  subtitle: {
    color: '#6b7280',
    marginTop: 4,
  },
  card: {
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 6,
    marginTop: 16,
  },
  cardCenter: {
    alignItems: 'center',
    marginBottom: 12,
  },
  circularWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 180,
    height: 180,
  },
  centerNumber: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigNumber: {
    fontSize: 44,
    fontWeight: '800',
    color: '#0b2b3a',
  },
  ofText: {
    fontSize: 16,
    color: '#6b7280',
  },
  bigNumber: {
    fontSize: 56,
    fontWeight: '800',
    color: '#0b2b3a',
  },
  ofText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 6,
  },
  addRowCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#16a0ff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#16a0ff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  resetSmall: {
    width: 54,
    height: 54,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eef6ff',
  },
  resetSmallText: {
    color: '#0b63b6',
    fontSize: 20,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#f0f4f8',
    marginVertical: 14,
  },
  goalRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  goalLeft: { flexDirection: 'row', alignItems: 'center' },
  goalIcon: { marginRight: 10 },
  goalLabel: { fontSize: 16, color: '#334155' },
  goalRight: { flexDirection: 'row', alignItems: 'center' },
  goalInput: {
    width: 70,
    height: 40,
    borderWidth: 1,
    borderColor: '#eef6ff',
    borderRadius: 6,
    paddingHorizontal: 8,
    textAlign: 'center',
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#0bb0d6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveText: { color: '#fff', fontWeight: '700' },
  goalLink: { color: '#0b63b6', fontWeight: '700' },
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
  appButton: {
    backgroundColor: '#1976d2',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appButtonSecondary: {
    backgroundColor: '#e0e0e0',
  },
  appButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  appButtonTextSecondary: {
    color: '#333',
  },
  settingsContainer: {
    width: '92%',
    marginTop: 20,
    marginBottom: 80,
  },
  settingsTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  themeOption: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#eef6ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  themeOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeColorPreview: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  themeInfo: {
    flex: 1,
  },
  themeName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  activeTheme: {
    fontSize: 14,
    fontWeight: '600',
  },
});
