import { createContext, ReactNode, useEffect, useState } from 'react'
import { api } from './services/api';

interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: string;
  category: string;
  createdAt: string;
}
// Herda a interface Transaction omitindo id e createdAt
type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>

// Herda a interface Transaction escolhendo as tipagens a se manter
// type TransactionInput = Pick<Transaction, 'title' | 'amount' | 'type' | 'category'>

// interface TransactionInput {
//   title: string;
//   amount: number;
//   type: string;
//   category: string;
// }

interface TransactionsProviderProps {
  children: ReactNode;
}

interface TransactionsContextData {
  transactions: Transaction[];
  createTransaction: (transaction: TransactionInput) => void;
}

export const TransactionsContext = createContext<TransactionsContextData>(
  {} as TransactionsContextData
)

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    api.get('transactions')
      .then(response => setTransactions(response.data.transactions))
  }, [])

  function createTransaction(transaction: TransactionInput) {
    api.post('/transactions', transaction)
  }

  return (
    <TransactionsContext.Provider value={{ transactions, createTransaction }}>
      {children}
    </TransactionsContext.Provider>
  )
}