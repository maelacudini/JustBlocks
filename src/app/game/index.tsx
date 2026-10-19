import { Stack, useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { FloatingPiece } from '@/components/molecules/FloatingPiece';
import { LivesIndicator } from '@/components/molecules/LivesIndicator';
import { GameBoard } from '@/components/organisms/GameBoard';
import { PieceTray } from '@/components/organisms/PieceTray';
import { useAppTheme } from '@/context/theme-provider';
import { PIECE_SHAPE_BY_ID } from '@/game/engine/const';
import { useGame } from '@/game/hooks/use-game';

export default function GameScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  const rootRef = useRef<View>(null);
  const [screenOrigin, setScreenOrigin] = useState({ x: 0, y: 0 });

  const measureScreen = useCallback(() => {
    rootRef.current?.measureInWindow((x, y) => {
      setScreenOrigin({ x, y });
    });
  }, []);

  const handleRootLayout = useCallback((_event: LayoutChangeEvent) => {
    requestAnimationFrame(measureScreen);
  }, [measureScreen]);

  const {
    state,
    dragPreview,
    updateBoardMetrics,
    startDrag,
    updateDrag,
    finishDrag,
    cancelDrag,
    restart,
    spendLife,
    boardMetrics,
    dragPoint,
  } = useGame();

  const activeShapeId = useMemo(
    () =>
      state.tray.find(
        (piece) => piece.id === dragPreview?.pieceId,
      )?.shapeId,
    [state.tray, dragPreview?.pieceId],
  );

  const isGameOver = state.status === 'game-over';
  const needsRefresh = state.status === 'needs-refresh';

  return (
    <View
      ref={rootRef}
      onLayout={handleRootLayout}
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <Stack.Screen options={{ headerShown: false }} />

        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={[styles.backButton, { backgroundColor: colors.card }]}
          >
            <Text style={[styles.backText, { color: colors.foreground }]}>
              ‹
            </Text>
          </Pressable>

          <Text style={[styles.title, { color: colors.foreground }]}>
            JustBlocks
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Restart game"
            onPress={restart}
            style={[styles.restartButton, { backgroundColor: colors.card }]}
          >
            <Text style={[styles.restartText, { color: colors.foreground }]}>
              ↻
            </Text>
          </Pressable>
        </View>

        <View style={styles.stats}>
          <View>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
              SCORE
            </Text>
            <Text style={[styles.score, { color: colors.foreground }]}>
              {state.score.toLocaleString()}
            </Text>
          </View>

          <View style={styles.livesBlock}>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
              LIVES
            </Text>
            <LivesIndicator lives={state.lives} />
          </View>
        </View>

        <GameBoard
          board={state.board}
          dragPreview={dragPreview}
          activeShapeId={activeShapeId}
          onMeasure={updateBoardMetrics}
        />

        <PieceTray
          pieces={state.tray}
          disabled={state.status !== 'playing'}
          onDragStart={startDrag}
          onDrag={updateDrag}
          onDragEnd={finishDrag}
          onDragCancel={cancelDrag}
        />

        {dragPoint && boardMetrics && (() => {
          const piece = state.tray.find(
            item => item.id === dragPoint.pieceId,
          );
          const shape = piece
            ? PIECE_SHAPE_BY_ID.get(piece.shapeId)
            : undefined;

          if (!shape) return null;

          const rows = Math.max(...shape.cells.map(([row]) => row)) + 1;
          const columns =
            Math.max(...shape.cells.map(([, column]) => column)) + 1;

          return (
            <FloatingPiece
              shape={shape}
              cellSize={boardMetrics.cellSize}
              cellPitch={boardMetrics.cellPitch}
              left={
                dragPoint.x -
                screenOrigin.x -
                (columns * boardMetrics.cellPitch) / 2
              }
              top={
                dragPoint.y -
                screenOrigin.y -
                rows * boardMetrics.cellPitch -
                60
              }
            />
          );
        })()}

        {needsRefresh && (
          <View
            style={[
              styles.messageCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.messageTitle, { color: colors.foreground }]}>
              No moves available
            </Text>
            <Text style={[styles.messageBody, { color: colors.mutedForeground }]}>
              Spend one life to get three new blocks.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={spendLife}
              style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            >
              <Text
                style={[
                  styles.primaryButtonText,
                  { color: colors.primaryForeground },
                ]}
              >
                Use life
              </Text>
            </Pressable>
          </View>
        )}

        {isGameOver && (
          <View
            style={[
              styles.messageCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.messageTitle, { color: colors.foreground }]}>
              Game over
            </Text>
            <Text style={[styles.messageBody, { color: colors.mutedForeground }]}>
              Final score: {state.score.toLocaleString()}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={restart}
              style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            >
              <Text
                style={[
                  styles.primaryButtonText,
                  { color: colors.primaryForeground },
                ]}
              >
                Play again
              </Text>
            </Pressable>
          </View>
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 40,
    justifyContent: 'center',
    position: 'relative'
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 32,
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 32,
    lineHeight: 36,
  },
  title: {
    fontSize: 23,
    fontWeight: '800',
  },
  restartButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restartText: {
    fontSize: 28,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 5,
  },
  score: {
    fontSize: 32,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  livesBlock: {
    alignItems: 'flex-end',
  },
  messageCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    gap: 10,
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24
  },
  messageTitle: {
    fontSize: 21,
    fontWeight: '800',
  },
  messageBody: {
    fontSize: 14,
    textAlign: 'center',
  },
  primaryButton: {
    minHeight: 46,
    paddingHorizontal: 18,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  primaryButtonText: {
    fontWeight: '700',
    fontSize: 14,
  },
});