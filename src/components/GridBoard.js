import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TETROMINOS } from '../constants/tetrominos';

const { width } = Dimensions.get('window');
// Calculate cell size: (Screen Width - Padding) / 10 columns
const CELL_SIZE = (width - 40) / 10; 

const GridBoard = ({ stage, player }) => {
  // Create a display grid that combines the saved stage + the moving player
  const getDisplayStage = () => {
    const displayStage = stage.map(row => [...row]); // Copy
    
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