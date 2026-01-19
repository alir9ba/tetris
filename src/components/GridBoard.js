import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TETROMINOS } from '../constants/tetrominos'; // Make sure this path matches your file structure

const { width, height } = Dimensions.get('window');

// --- THE FIX: MAKE THE GRID SMALLER ---
// We use 65% of the screen width (0.65) to ensure the height (which is 2x width) fits.
const GRID_WIDTH = width * 0.65;
const CELL_SIZE = GRID_WIDTH / 10; 

const GridBoard = ({ stage, player }) => {
  const getDisplayStage = () => {
    const displayStage = stage.map(row => [...row]); 
    
    if (!player.collided) {
      player.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            const boardY = y + player.pos.y;
            const boardX = x + player.pos.x;
            if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10) {
              displayStage[boardY][boardX] = [value, 'merged'];
            }
          }
        });
      });
    }
    return displayStage;
  };

  const grid = getDisplayStage();

  return (
    <View style={styles.board}>
      {grid.map((row, y) => (
        <View key={y} style={styles.row}>
          {row.map((cell, x) => (
            <View
              key={x}
              style={[
                styles.cell,
                {
                  backgroundColor: cell[0] === 0 ? '#fff' : TETROMINOS[cell[0]].color,
                  borderColor: cell[0] === 0 ? '#f0f0f0' : '#333',
                },
              ]}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#fff',
    // Center the board itself if needed
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 1,
  },
});

export default GridBoard;