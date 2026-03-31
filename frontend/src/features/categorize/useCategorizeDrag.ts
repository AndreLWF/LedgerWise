import { useCallback, useRef, useState } from 'react';
import { Easing, runOnJS, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import type { Transaction } from '../../types/transaction';
import type { CategoryInfo } from '../../types/categorize';

// --- Animation constants ---
const CROSSFADE_EASING = Easing.out(Easing.cubic);
const CROSSFADE_LIST_MS = 200;
const CROSSFADE_GRID_MS = 250;
const CROSSFADE_EXIT_MS = 200;
const SOURCE_ROW_MS = 150;
const GRID_INITIAL_SCALE = 1.02;
const LIST_SHRUNK_SCALE = 0.95;
const GRID_SLIDE_OFFSET = -12;

interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

function pointInBounds(px: number, py: number, b: Bounds): boolean {
  return px >= b.x && px <= b.x + b.width && py >= b.y && py <= b.y + b.height;
}

export default function useCategorizeDrag(
  categories: CategoryInfo[],
  onAssign: (transactionId: string, categoryName: string) => void,
) {
  // React state for discrete events (start/end of drag, tile hover changes)
  const [isDragging, setIsDragging] = useState(false);
  const [draggedTransaction, setDraggedTransaction] = useState<Transaction | null>(null);
  const [activeTileIndex, setActiveTileIndex] = useState<number | null>(null);
  const [isOverCancel, setIsOverCancel] = useState(false);
  // Overlay stays mounted while animating out — cleared after exit animation
  const [overlayVisible, setOverlayVisible] = useState(false);

  // Shared values for UI-thread position tracking (no React state during drag)
  const dragX = useSharedValue(0);
  const dragY = useSharedValue(0);
  const isDragActive = useSharedValue(false);
  const dragCardScale = useSharedValue(0.8);
  const sourceRowOpacity = useSharedValue(1);
  const sourceRowScale = useSharedValue(1);

  // Crossfade shared values (list ↔ grid transition)
  const listOpacity = useSharedValue(1);
  const listScale = useSharedValue(1);
  const gridOpacity = useSharedValue(0);
  const gridScale = useSharedValue(GRID_INITIAL_SCALE);
  const gridTranslateY = useSharedValue(GRID_SLIDE_OFFSET);

  // Refs for synchronous hit testing
  const tileBoundsRef = useRef<Bounds[]>([]);
  const cancelBoundsRef = useRef<Bounds | null>(null);
  const draggedTxRef = useRef<Transaction | null>(null);
  const activeTileRef = useRef<number | null>(null);

  const registerTileBounds = useCallback((index: number, pageX: number, pageY: number, width: number, height: number) => {
    tileBoundsRef.current[index] = { x: pageX, y: pageY, width, height };
  }, []);

  const registerCancelBounds = useCallback((pageX: number, pageY: number, width: number, height: number) => {
    cancelBoundsRef.current = { x: pageX, y: pageY, width, height };
  }, []);

  const hitTest = useCallback((absX: number, absY: number) => {
    const cancel = cancelBoundsRef.current;
    if (cancel && pointInBounds(absX, absY, cancel)) {
      activeTileRef.current = null;
      setActiveTileIndex(null);
      setIsOverCancel(true);
      return;
    }

    setIsOverCancel(false);

    for (let i = 0; i < tileBoundsRef.current.length; i++) {
      const bounds = tileBoundsRef.current[i];
      if (bounds && pointInBounds(absX, absY, bounds)) {
        activeTileRef.current = i;
        setActiveTileIndex(i);
        return;
      }
    }
    activeTileRef.current = null;
    setActiveTileIndex(null);
  }, []);

  const clearAfterExit = useCallback(() => {
    draggedTxRef.current = null;
    activeTileRef.current = null;
    setIsDragging(false);
    setDraggedTransaction(null);
    setActiveTileIndex(null);
    setIsOverCancel(false);
    setOverlayVisible(false);
  }, []);

  const resetDragState = useCallback(() => {
    isDragActive.value = false;
    sourceRowOpacity.value = withTiming(1, { duration: SOURCE_ROW_MS });
    sourceRowScale.value = withTiming(1, { duration: SOURCE_ROW_MS });

    const exitConfig = { duration: CROSSFADE_EXIT_MS, easing: CROSSFADE_EASING };

    // Exit crossfade: grid out, list back in (overlapping)
    gridOpacity.value = withTiming(0, exitConfig);
    gridScale.value = withTiming(GRID_INITIAL_SCALE, exitConfig);
    gridTranslateY.value = withTiming(GRID_SLIDE_OFFSET, exitConfig);
    listOpacity.value = withTiming(1, exitConfig);
    listScale.value = withTiming(1, exitConfig, () => {
      runOnJS(clearAfterExit)();
    });
  }, [isDragActive, sourceRowOpacity, sourceRowScale, gridOpacity, gridScale, gridTranslateY, listOpacity, listScale, clearAfterExit]);

  const startDrag = useCallback((transaction: Transaction, pageX: number, pageY: number) => {
    draggedTxRef.current = transaction;
    dragX.value = pageX;
    dragY.value = pageY;
    isDragActive.value = true;

    // Drag card entrance: spring from 0.8 → 1.05
    dragCardScale.value = 0.8;
    dragCardScale.value = withSpring(1.05, { damping: 15, stiffness: 150 });

    // Source row: fade and shrink
    sourceRowOpacity.value = withTiming(0.3, { duration: SOURCE_ROW_MS });
    sourceRowScale.value = withTiming(0.97, { duration: SOURCE_ROW_MS });

    // Crossfade entrance: list out, grid in
    const listOutConfig = { duration: CROSSFADE_LIST_MS, easing: CROSSFADE_EASING };
    listOpacity.value = withTiming(0, listOutConfig);
    listScale.value = withTiming(LIST_SHRUNK_SCALE, listOutConfig);

    const gridInConfig = { duration: CROSSFADE_GRID_MS, easing: CROSSFADE_EASING };
    gridOpacity.value = 0;
    gridScale.value = GRID_INITIAL_SCALE;
    gridTranslateY.value = GRID_SLIDE_OFFSET;
    gridOpacity.value = withTiming(1, gridInConfig);
    gridScale.value = withTiming(1, gridInConfig);
    gridTranslateY.value = withSpring(0, { damping: 20, stiffness: 180 });

    setDraggedTransaction(transaction);
    setIsDragging(true);
    setOverlayVisible(true);
    setActiveTileIndex(null);
    setIsOverCancel(false);
  }, [dragX, dragY, isDragActive, dragCardScale, sourceRowOpacity, sourceRowScale, listOpacity, listScale, gridOpacity, gridScale, gridTranslateY]);

  const onDragMove = useCallback((pageX: number, pageY: number) => {
    hitTest(pageX, pageY);
  }, [hitTest]);

  const onDragEnd = useCallback(() => {
    const tx = draggedTxRef.current;
    const tileIdx = activeTileRef.current;

    if (tx && tileIdx !== null && tileIdx < categories.length) {
      onAssign(tx.id, categories[tileIdx].name);
    }

    resetDragState();
  }, [categories, onAssign, resetDragState]);

  return {
    isDragging,
    draggedTransaction,
    activeTileIndex,
    isOverCancel,
    overlayVisible,
    dragX,
    dragY,
    isDragActive,
    dragCardScale,
    sourceRowOpacity,
    sourceRowScale,
    listOpacity,
    listScale,
    gridOpacity,
    gridScale,
    gridTranslateY,
    startDrag,
    onDragMove,
    onDragEnd,
    cancelDrag: resetDragState,
    registerTileBounds,
    registerCancelBounds,
  };
}
