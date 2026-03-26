import { memo } from 'react';
import { Text, View } from 'react-native';
import type { Transaction } from '../types/transaction';
import { transactionRowStyles as styles } from '../styles/transactionRow.styles';

interface TransactionRowProps {
  transaction: Transaction;
}

function TransactionRow({ transaction }: TransactionRowProps) {
  const amount = parseFloat(transaction.amount);
  const isDebit = amount < 0;
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Text style={styles.description} numberOfLines={1}>
          {transaction.description}
        </Text>
        <Text style={styles.meta}>
          {transaction.date} · {transaction.account_name}
        </Text>
      </View>
      <Text style={[styles.amount, isDebit ? styles.debit : styles.credit]}>
        {isDebit ? '-' : '+'}${Math.abs(amount).toFixed(2)}
      </Text>
    </View>
  );
}

export default memo(TransactionRow);
