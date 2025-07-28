import React, { useState, useEffect } from 'react';
import { History, Trash2 } from 'lucide-react';

interface CalculationHistory {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
}

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousOperand, setPreviousOperand] = useState('');
  const [operation, setOperation] = useState('');
  const [waitingForNewOperand, setWaitingForNewOperand] = useState(false);
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem('productivityApp_calculatorHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory).map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('productivityApp_calculatorHistory', JSON.stringify(history));
  }, [history]);

  const inputNumber = (num: string) => {
    if (waitingForNewOperand) {
      setDisplay(num);
      setWaitingForNewOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForNewOperand) {
      setDisplay('0.');
      setWaitingForNewOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousOperand('');
    setOperation('');
    setWaitingForNewOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousOperand === '') {
      setPreviousOperand(String(inputValue));
    } else if (operation) {
      const currentValue = previousOperand || '0';
      const result = calculate(currentValue, display, operation);

      setDisplay(String(result));
      setPreviousOperand(String(result));

      // Add to history
      const calculation: CalculationHistory = {
        id: Date.now().toString(),
        expression: `${currentValue} ${operation} ${display}`,
        result: String(result),
        timestamp: new Date()
      };
      setHistory([calculation, ...history.slice(0, 49)]); // Keep last 50 calculations
    }

    setWaitingForNewOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstOperand: string, secondOperand: string, operation: string): number => {
    const prev = parseFloat(firstOperand);
    const current = parseFloat(secondOperand);

    switch (operation) {
      case '+':
        return prev + current;
      case '-':
        return prev - current;
      case '×':
        return prev * current;
      case '÷':
        return prev / current;
      default:
        return current;
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const buttons = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
  ];

  const isOperator = (btn: string) => ['÷', '×', '-', '+', '='].includes(btn);
  const isNumber = (btn: string) => /\d/.test(btn);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Calculator</h2>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
        >
          <History size={18} />
          History
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
            <div className="text-right">
              {operation && previousOperand && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {previousOperand} {operation}
                </div>
              )}
              <div className="text-3xl font-mono font-bold text-gray-800 dark:text-white truncate">
                {display}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {buttons.flat().map((btn, index) => (
              <button
                key={index}
                onClick={() => {
                  if (btn === 'C') clear();
                  else if (btn === '=') performOperation('');
                  else if (isOperator(btn)) performOperation(btn);
                  else if (isNumber(btn)) inputNumber(btn);
                  else if (btn === '.') inputDecimal();
                  else if (btn === '±') setDisplay(String(-parseFloat(display)));
                  else if (btn === '%') setDisplay(String(parseFloat(display) / 100));
                }}
                className={`h-12 rounded-lg font-semibold transition-colors ${
                  btn === '0' ? 'col-span-2' : ''
                } ${
                  isOperator(btn)
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : btn === 'C' || btn === '±' || btn === '%'
                    ? 'bg-gray-500 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white'
                }`}
              >
                {btn}
              </button>
            ))}
          </div>
        </div>

        {showHistory && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 dark:text-white">History</h3>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            
            <div className="max-h-80 overflow-y-auto space-y-2">
              {history.map((calc) => (
                <div
                  key={calc.id}
                  className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => setDisplay(calc.result)}
                >
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {calc.expression}
                  </div>
                  <div className="font-mono font-bold text-gray-800 dark:text-white">
                    = {calc.result}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    {calc.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>

            {history.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No calculations yet
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}