import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import type { View } from 'react-native';
import { setDraggedTransaction } from './utils/dragState';
import { buildDragGhost, removeDragGhost } from './utils/dragGhost';

interface DragSourceColors {
  bg: string;
  text: string;
  subText: string;
  border: string;
}

interface DragSourceOptions {
  transactionId: string;
  description: string;
  amount: string;
  date: string;
  colors: DragSourceColors;
}

/** Attaches native HTML5 drag listeners to a View ref, bypassing RNW's
 *  synthetic event system which doesn't reliably expose dataTransfer. */
export default function useDragSource(options: DragSourceOptions) {
  const { transactionId, description, amount, date, colors } = options;
  const ref = useRef<View>(null);
  const ghostRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const node = ref.current as unknown as HTMLElement | null;
    if (!node) return;

    node.setAttribute('draggable', 'true');

    const handleDragStart = (e: DragEvent) => {
      if (!e.dataTransfer) return;

      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', transactionId);
      setDraggedTransaction(transactionId);
      setIsDragging(true);

      const rect = node.getBoundingClientRect();
      const ghost = buildDragGhost(description, amount, date, rect.width, colors);

      document.body.appendChild(ghost);
      ghostRef.current = ghost;

      e.dataTransfer.setDragImage(ghost, e.clientX - rect.left, e.clientY - rect.top);
    };

    const handleDragEnd = () => {
      setDraggedTransaction(null);
      setIsDragging(false);
      removeDragGhost(ghostRef.current);
      ghostRef.current = null;
    };

    node.addEventListener('dragstart', handleDragStart);
    node.addEventListener('dragend', handleDragEnd);

    return () => {
      node.removeEventListener('dragstart', handleDragStart);
      node.removeEventListener('dragend', handleDragEnd);
    };
  }, [transactionId, description, amount, date, colors]);

  return { ref, isDragging };
}
