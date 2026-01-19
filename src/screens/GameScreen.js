import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Modal } from 'react-native';
import GridBoard from '../components/GridBoard';
import Controls from '../components/Controls';
import { useTetris } from '../hooks/useTetris';

const GameScreen = ({ navigation }) => {
  const { stage, player, score, gameOver, movePlayer, playerRotate, startGame } = useTetris();

  useEffect(() => {
    startGame();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerText}>{'< Main Menu'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Score: {score}</Text>
      </View>

      {/* Grid */}
      <View style={styles.gameArea}>
        <GridBoard stage={stage} player={player} />
      </View>

      {/* Controls */}
      <Controls 
        onLeft={() => movePlayer(-1)}
        onRight={() => movePlayer(1)}
        onRotate={playerRotate}
      />

      {/* Game Over Modal */}
      <Modal visible={gameOver} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.gameOverText}>GAME OVER</Text>
            <Text style={styles.scoreText}>Final Score: {score}</Text>
            
            <TouchableOpacity style={styles.modalBtn} onPress={startGame}>
              <Text style={styles.modalBtnText}>Replay</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalBtn, { marginTop: 10, backgroundColor: '#fff', borderWidth: 1 }]} 
              onPress={() => navigation.goBack()}
            >
              <Text style={[styles.modalBtnText, { color: '#000' }]}>Main Menu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // This pushes the Header to top, Controls to bottom, and Grid to middle
    justifyContent: 'space-between', 
    paddingBottom: 20, // Adds space at the very bottom so controls aren't on the edge
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 40, // Extra padding for status bar visibility
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameArea: {
    flex: 1, // Allows the grid to take up the available middle space
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // --- Modal Styles (Unchanged) ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5,
  },
  gameOverText: { fontSize: 30, fontWeight: 'bold', marginBottom: 10 },
  scoreText: { fontSize: 20, marginBottom: 20 },
  modalBtn: {
    width: '100%',
    padding: 15,
    backgroundColor: '#000',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalBtnText: { color: '#fff', fontWeight: 'bold' },
});

export default GameScreen;