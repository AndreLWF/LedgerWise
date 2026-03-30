/** Module-level state shared between TransactionRow (drag source) and CategoryTarget (drop target).
 *  Avoids relying on dataTransfer.getData() which can be unreliable in React Native Web. */

let draggedTransactionId: string | null = null;

export function setDraggedTransaction(id: string | null): void {
  draggedTransactionId = id;
}

export function getDraggedTransaction(): string | null {
  return draggedTransactionId;
}
