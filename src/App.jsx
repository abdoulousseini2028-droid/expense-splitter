import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import './App.css'

function App() {
  const [expenses, setExpenses] = useState([])
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState('')
  const [splitBetween, setSplitBetween] = useState('2')

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) console.error('Error:', error)
    else setExpenses(data)
  }

  const addExpense = async (e) => {
    e.preventDefault()
    
    const { error } = await supabase
      .from('expenses')
      .insert([{ 
        description, 
        amount: parseFloat(amount), 
        paid_by: paidBy,
        split_between: parseInt(splitBetween)
      }])
    
    if (error) console.error('Error:', error)
    else {
      setDescription('')
      setAmount('')
      setPaidBy('')
      setSplitBetween('2')
      fetchExpenses()
    }
  }

  const deleteExpense = async (id) => {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
    
    if (error) console.error('Error deleting:', error)
    else fetchExpenses()
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
  const totalSplitPeople = expenses.reduce((sum, exp) => sum + (exp.split_between || 1), 0) / (expenses.length || 1)
  const perPerson = total / (totalSplitPeople || 1)

  return (
    <div className="app">
      <div className="container">
        <h1>💰 Expense Splitter</h1>
        
        <div className="card">
          <h2>Add Expense</h2>
          <form onSubmit={addExpense}>
            <input
              type="text"
              placeholder="Description (e.g., Groceries)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Paid by (name)"
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              required
            />
            <input
              type="number"
              min="1"
              placeholder="Split between how many people?"
              value={splitBetween}
              onChange={(e) => setSplitBetween(e.target.value)}
              required
            />
            <button type="submit">Add Expense</button>
          </form>
        </div>

        <div className="card">
          <h2>Expenses</h2>
          {expenses.length === 0 ? (
            <p className="empty">No expenses yet. Add one above!</p>
          ) : (
            <>
              <div className="expense-list">
                {expenses.map((expense) => (
                  <div key={expense.id} className="expense-item">
                    <div className="expense-details">
                      <p className="expense-desc">{expense.description}</p>
                      <p className="expense-payer">Paid by: {expense.paid_by}</p>
                      <p className="expense-date">📅 {formatDate(expense.created_at)}</p>
                      <p className="expense-split">
                        Split between: {expense.split_between || 1} people 
                        (${(expense.amount / (expense.split_between || 1)).toFixed(2)} each)
                      </p>
                    </div>
                    <div className="expense-actions">
                      <p className="expense-amount">${expense.amount.toFixed(2)}</p>
                      <button 
                        onClick={() => deleteExpense(expense.id)}
                        className="delete-btn"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="summary">
                <div className="total">
                  <strong>Total Spent:</strong> ${total.toFixed(2)}
                </div>
                <div className="per-person">
                  <strong>Average per person:</strong> ${perPerson.toFixed(2)}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App