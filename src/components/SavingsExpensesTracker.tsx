"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2, LogOut } from "lucide-react"
import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

type Transaction = {
  id: number
  description: string
  amount: number
  type: "income" | "expense"
  created_at: string
}

const AnimatedRadio = motion(RadioGroupItem);

const RadioButton = ({ value, label }: { value: string; label: string }) => (
  <div className="flex items-center">
    <AnimatedRadio
      value={value}
      id={value}
      className="radio radio-primary"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    />
    <Label htmlFor={value} className="ml-2">
      {label}
    </Label>
  </div>
);

export default function SavingsExpensesTracker() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [type, setType] = useState<"income" | "expense">("income")

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch('/api/transactions')
      if (!response.ok) throw new Error('Failed to fetch transactions')
      const data = await response.json()
      setTransactions(data)
    } catch (error) {
      console.error('Error fetching transactions:', error)
    }
  }, [])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const addTransaction = async (e: React.FormEvent) => {
    e.preventDefault()
    if (description && amount) {
      try {
        const response = await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ description, amount: parseFloat(amount), type }),
        })
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to add transaction: ${JSON.stringify(errorData)}`);
        }
        const newTransaction = await response.json()
        setTransactions(prevTransactions => [newTransaction, ...prevTransactions])
        setDescription("")
        setAmount("")
      } catch (error) {
        console.error('Error adding transaction:', error)
      }
    }
  }

  const deleteTransaction = async (id: number) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete transaction')
      setTransactions(prevTransactions => prevTransactions.filter(transaction => transaction.id !== id))
    } catch (error) {
      console.error('Error deleting transaction:', error)
    }
  }

  const balance = transactions.reduce((acc, transaction) => {
    return transaction.type === "income"
      ? acc + transaction.amount
      : acc - transaction.amount
  }, 0)

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h1 className="card-title text-2xl">Savings & Expenses Tracker</h1>
          <LogOut
            onClick={handleLogout}
            className="h-6 w-6 cursor-pointer text-gray-600 hover:text-gray-800 transition-colors"
          />
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Current Balance</h2>
          <motion.p 
            className={`text-2xl font-bold ${balance >= 0 ? "text-success" : "text-error"}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            ${balance.toFixed(2)}
          </motion.p>
        </div>
        <form onSubmit={addTransaction} className="mb-4 space-y-4">
          <div className="form-control">
            <Label htmlFor="description" className="label">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              required
              className="input input-bordered"
            />
          </div>
          <div className="form-control">
            <Label htmlFor="amount" className="label">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              step="0.01"
              min="0"
              required
              className="input input-bordered"
            />
          </div>
          <RadioGroup 
            value={type} 
            onValueChange={(value: "income" | "expense") => setType(value)} 
            className="flex space-x-4"
          >
            <RadioButton value="income" label="Income" />
            <RadioButton value="expense" label="Expense" />
          </RadioGroup>
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button type="submit" className="btn btn-primary w-full">
              Add Transaction
            </Button>
          </motion.div>
        </form>
        <div>
          <h2 className="text-xl font-semibold mb-2">Transactions</h2>
          <ScrollArea className="h-[200px] rounded-md border p-4">
            <AnimatePresence>
              {transactions.map((transaction) => (
                <motion.div
                  key={transaction.id}
                  className={`mb-2 p-2 rounded flex justify-between items-center ${
                    transaction.type === "income" ? "bg-success bg-opacity-10" : "bg-error bg-opacity-10"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <p className="font-semibold">{transaction.description}</p>
                    <p
                      className={`${
                        transaction.type === "income" ? "text-success" : "text-error"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.created_at).toLocaleString()}
                    </p>
                  </div>
                  <motion.button
                    onClick={() => deleteTransaction(transaction.id)}
                    className="btn btn-ghost btn-sm"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}