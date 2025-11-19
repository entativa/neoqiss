
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import { Play, Terminal, Coffee, Heart, X, CheckCircle, DollarSign, Cpu, Send, GraduationCap, CreditCard, ShieldCheck, ArrowRight, Sparkles, Lock, Wallet, Banknote, Smartphone, Shield, Scale, TrendingUp, FileText, Calculator, PieChart, Briefcase } from 'lucide-react';

// --- CODE PLAYGROUND COMPONENT ---

interface Problem {
  id: string;
  title: string;
  difficulty: 'Hard' | 'Genius' | 'Impossible';
  language: 'Rust' | 'Kotlin' | 'Swift';
  description: string;
  initialCode: string;
  output: string;
}

const PROBLEMS: Problem[] = [
  {
    id: 'twosum',
    title: 'The Two Sum Paradox',
    difficulty: 'Genius',
    language: 'Rust',
    description: 'Find two numbers that add up to the target, but make it memory safe and overly complex.',
    initialCode: `fn two_sum_genius(nums: Vec<i32>, target: i32) -> Option<(usize, usize)> {
    // Utilizing a HashMap for O(1) lookup complexity
    // But adding a layer of abstraction because why not?
    let mut complexity_map = std::collections::HashMap::new();

    for (i, &num) in nums.iter().enumerate() {
        let complement = target - num;
        
        // The Loop Back Logic
        if let Some(&index) = complexity_map.get(&complement) {
            // Genius moment: Found it before the borrow checker complained
            return Some((index, i));
        }
        
        complexity_map.insert(num, i);
    }
    
    None // Should never happen in my code
}`,
    output: `Compiling...
Finished release [optimized] target(s) in 0.04s
Running \`target/release/genius_algo\`
Result: Some((0, 1))
Memory Usage: Minimal
Genius Level: High`
  },
  {
    id: 'tree',
    title: 'Invert Binary Tree (Alex Style)',
    difficulty: 'Hard',
    language: 'Kotlin',
    description: 'Invert a binary tree using recursive patterns inspired by Johannesburg traffic routes.',
    initialCode: `fun invertTree(root: TreeNode?): TreeNode? {
    // If the root is null, we've reached the end of the road (cul-de-sac)
    if (root == null) return null

    // Swap the lanes (Left becomes Right)
    val temp = root.left
    root.left = root.right
    root.right = temp

    // Recursively navigate the sub-streets
    invertTree(root.left)
    invertTree(root.right)

    // Return the re-mapped neighborhood
    return root
}`,
    output: `> Task :compileKotlin
> Task :run
Output: 
       4
     /   \\
    7     2
   / \\   / \\
  9   6 3   1

Status: Tree Inverted Successfully.
Citation: Needed.`
  },
  {
    id: 'ride',
    title: 'Ride-Hailing Optimization',
    difficulty: 'Impossible',
    language: 'Swift',
    description: 'Calculate the optimal route to maximize profit while studying for CA(SA) in the passenger seat.',
    initialCode: `func optimizeRoute(requests: [RideRequest]) -> Route {
    var profit = 0.0
    var studyTime = 0.0
    
    // The Hustle Algorithm
    return requests.sorted { 
        $0.surgeMultiplier > $1.surgeMultiplier 
    }.filter { request in
        // Only accept rides that fund the shack projects
        if request.distance < 5.0 && request.price > 50.0 {
            profit += request.price
            return true
        }
        // Else, use the time to study Accounting standards
        studyTime += 15.0
        return false
    }.first!.route
}`,
    output: `Building target NeoHustle...
Build succeeded.
Calculated Optimal Route:
- Profit: R450.00
- Study Time Gained: 45 mins (IAS 12 Income Taxes covered)
- Fuel Consumed: Low`
  }
];

const SyntaxHighlight = ({ code, language }: { code: string, language: string }) => {
  // A very basic mock syntax highlighter
  const keywords = ['fn', 'let', 'mut', 'if', 'else', 'return', 'for', 'in', 'fun', 'val', 'var', 'null', 'func', 'true', 'false'];
  const types = ['i32', 'usize', 'Vec', 'Option', 'TreeNode', 'RideRequest', 'Route'];
  
  const parts = code.split(/(\s+|[(){}[\],.;])/g);

  return (
    <pre className="font-mono text-sm leading-relaxed text-stone-300">
      {parts.map((part, i) => {
        if (keywords.includes(part)) return <span key={i} className="text-nobel-gold font-bold">{part}</span>;
        if (types.includes(part)) return <span key={i} className="text-purple-400">{part}</span>;
        if (part.startsWith('//')) return <span key={i} className="text-stone-500 italic">{part}</span>;
        if (!isNaN(Number(part))) return <span key={i} className="text-blue-400">{part}</span>;
        return <span key={i}>{part}</span>;
      })}
    </pre>
  );
};

const LogHighlight = ({ output }: { output: string }) => {
  // Split by whitespace and common separators to tokenize the log output
  const parts = output.split(/(\s+|[\[\]:>,()])/g);

  return (
    <div className="font-mono text-sm leading-relaxed text-stone-300 whitespace-pre-wrap">
      {parts.map((part, i) => {
        // Success/Green
        if (/^(Success|succeeded|Finished|passed|Completed|OK|Minimal|High|Successfully)$/i.test(part)) 
            return <span key={i} className="text-green-400 font-bold">{part}</span>;
        
        // Info/Blue
        if (/^(Compiling|Running|Building|Task|target|release|debug|optimized|Low)$/i.test(part) || part.startsWith('Compiling') || part.startsWith('Running')) 
            return <span key={i} className="text-blue-400">{part}</span>;
            
        // Key Labels/Gold
        if (/^(Result|Output|Status|Citation|Memory|Genius|Profit|Fuel|Study|Time|Gained|Consumed|Level)$/i.test(part) || part.endsWith(':')) 
            return <span key={i} className="text-nobel-gold font-bold">{part}</span>;
            
        // Numbers/Cyan (including durations like 0.04s)
        if (/^(\d+(\.\d+)?(s|ms|%|mins|m)?)$/.test(part))
            return <span key={i} className="text-cyan-300">{part}</span>;

        // Special chars
        if (['>', ':', '[', ']', '(', ')', ','].includes(part)) 
             return <span key={i} className="text-stone-500">{part}</span>;
             
        return <span key={i}>{part}</span>;
      })}
    </div>
  );
};

export const CodeArena: React.FC = () => {
  const [activeProblem, setActiveProblem] = useState<Problem>(PROBLEMS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  const handleRun = () => {
    setIsRunning(true);
    setOutput(null);
    setTimeout(() => {
      setIsRunning(false);
      setOutput(activeProblem.output);
    }, 1500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl border border-stone-700 flex flex-col md:flex-row h-[85vh] md:h-[600px]">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-[#252526] border-b md:border-b-0 md:border-r border-[#3e3e42] flex flex-col shrink-0 h-48 md:h-auto">
        <div className="p-4 border-b border-[#3e3e42] flex items-center gap-2 text-stone-300 bg-[#252526] sticky top-0 z-10 shrink-0">
           <Terminal size={18} />
           <span className="font-bold text-sm tracking-wider">NEO_IDE</span>
        </div>
        <div className="flex-1 overflow-y-auto">
           {PROBLEMS.map(problem => (
             <button
               key={problem.id}
               onClick={() => { setActiveProblem(problem); setOutput(null); }}
               className={`w-full text-left p-4 border-b border-[#3e3e42] hover:bg-[#2a2d2e] transition-colors ${activeProblem.id === problem.id ? 'bg-[#37373d] border-l-2 border-l-nobel-gold' : ''}`}
             >
               <div className="text-stone-200 font-medium text-sm mb-1">{problem.title}</div>
               <div className="flex justify-between items-center">
                 <span className={`text-[10px] px-2 py-0.5 rounded-full ${problem.language === 'Rust' ? 'bg-orange-900/30 text-orange-400' : problem.language === 'Kotlin' ? 'bg-purple-900/30 text-purple-400' : 'bg-blue-900/30 text-blue-400'}`}>
                   {problem.language}
                 </span>
                 <span className="text-[10px] text-stone-500 uppercase font-bold">{problem.difficulty}</span>
               </div>
             </button>
           ))}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col bg-[#1e1e1e] min-h-0">
         {/* Tabs/Header */}
         <div className="h-12 md:h-10 bg-[#1e1e1e] border-b border-[#3e3e42] flex items-center px-4 justify-between shrink-0">
            <div className="flex items-center gap-2">
               <div className="px-3 py-1 bg-[#1e1e1e] text-stone-300 text-xs border-t-2 border-nobel-gold pt-2">
                 {activeProblem.language === 'Rust' ? 'main.rs' : activeProblem.language === 'Kotlin' ? 'Solution.kt' : 'Algorithm.swift'}
               </div>
            </div>
            <button 
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center gap-2 px-3 py-1 bg-green-700 hover:bg-green-600 text-white text-xs rounded-sm transition-colors disabled:opacity-50"
            >
              <Play size={12} fill="currentColor" />
              {isRunning ? 'Compiling...' : 'Run'}
            </button>
         </div>

         {/* Description */}
         <div className="p-4 bg-[#252526]/50 border-b border-[#3e3e42] shrink-0 max-h-24 overflow-y-auto">
            <p className="text-stone-400 text-sm italic">" {activeProblem.description} "</p>
         </div>

         {/* Code Editor */}
         <div className="flex-1 p-4 overflow-y-auto font-mono text-sm custom-scrollbar relative">
            <div className="absolute top-4 left-0 w-8 text-right text-stone-600 select-none pr-2 text-xs leading-relaxed">
               {[...Array(15)].map((_, i) => <div key={i}>{i + 1}</div>)}
            </div>
            <div className="pl-8">
               <SyntaxHighlight code={activeProblem.initialCode} language={activeProblem.language} />
            </div>
         </div>

         {/* Console Output */}
         <div className="h-32 md:h-40 bg-[#1e1e1e] border-t border-[#3e3e42] p-4 overflow-y-auto shrink-0">
            <div className="text-xs font-bold text-stone-500 mb-2 uppercase">Console Output</div>
            {output ? (
              <div className="animate-fade-in">
                <LogHighlight output={output} />
              </div>
            ) : isRunning ? (
               <div className="flex items-center gap-2 text-stone-400 text-sm font-mono">
                  <span className="animate-spin">⟳</span> Building project...
               </div>
            ) : (
              <div className="text-stone-600 text-sm font-mono italic">
                Ready to compile. Waiting for genius input...
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

// --- ACCOUNTING SIMULATOR COMPONENT ---

const formatCurrency = (val: number) => `R${Math.abs(val).toLocaleString()}`;

export const AccountingSimulator: React.FC = () => {
  const [assets, setAssets] = useState({ cash: 15000, equipment: 5000, receivables: 2000 });
  const [liabilities, setLiabilities] = useState({ payables: 1000, loans: 12000 });
  const [equity, setEquity] = useState({ capital: 9000, retainedEarnings: 0 });
  const [journal, setJournal] = useState<{id: number, desc: string, dr: string, cr: string, amount: number}[]>([]);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const totalAssets = Object.values(assets).reduce((a, b) => a + b, 0);
  const totalLiabilities = Object.values(liabilities).reduce((a, b) => a + b, 0);
  const totalEquity = Object.values(equity).reduce((a, b) => a + b, 0);

  const addTransaction = (desc: string, effects: () => void, dr: string, cr: string, amount: number) => {
    effects();
    setJournal(prev => [{ id: Date.now(), desc, dr, cr, amount }, ...prev].slice(0, 5));
    setLastAction(desc);
    setTimeout(() => setLastAction(null), 1000);
  };

  // Transaction Handlers
  const invoiceClient = () => {
    addTransaction("Invoice Ride-Hail Client", () => {
      setAssets(prev => ({ ...prev, receivables: prev.receivables + 1500 }));
      setEquity(prev => ({ ...prev, retainedEarnings: prev.retainedEarnings + 1500 }));
    }, "Accounts Receivable", "Revenue", 1500);
  };

  const collectCash = () => {
    if (assets.receivables >= 1000) {
      addTransaction("Collect Payment", () => {
        setAssets(prev => ({ ...prev, cash: prev.cash + 1000, receivables: prev.receivables - 1000 }));
      }, "Cash", "Accounts Receivable", 1000);
    }
  };

  const buyEquipment = () => {
    if (assets.cash >= 2000) {
      addTransaction("Buy Server Hardware", () => {
        setAssets(prev => ({ ...prev, cash: prev.cash - 2000, equipment: prev.equipment + 2000 }));
      }, "Equipment", "Cash", 2000);
    }
  };

  const payLoan = () => {
    if (assets.cash >= 1000 && liabilities.loans >= 1000) {
       addTransaction("Pay Tuition Loan", () => {
         setAssets(prev => ({ ...prev, cash: prev.cash - 1000 }));
         setLiabilities(prev => ({ ...prev, loans: prev.loans - 1000 }));
       }, "Loans Payable", "Cash", 1000);
    }
  };

  const incurExpense = () => {
     addTransaction("Cloud Hosting Bill", () => {
       setLiabilities(prev => ({ ...prev, payables: prev.payables + 500 }));
       setEquity(prev => ({ ...prev, retainedEarnings: prev.retainedEarnings - 500 }));
     }, "OpEx Expense", "Accounts Payable", 500);
  }

  // Ratios
  const currentRatio = (assets.cash + assets.receivables) / (liabilities.payables + (liabilities.loans * 0.1)); // Assuming 10% of loan is current
  const debtRatio = totalLiabilities / totalAssets;

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden flex flex-col lg:flex-row">
      
      {/* Left Panel: The Books */}
      <div className="flex-1 p-6 md:p-8 bg-[#F9F8F4]">
         <div className="flex items-center gap-3 mb-6">
             <div className="p-2 bg-stone-900 text-nobel-gold rounded">
                 <Scale size={20} />
             </div>
             <div>
                 <h3 className="font-serif text-xl text-stone-900 font-bold">The Ledger Logic</h3>
                 <p className="text-xs text-stone-500 uppercase tracking-wider">Double-Entry Engine</p>
             </div>
         </div>

         {/* The Equation Visualization */}
         <div className="mb-8">
             <div className="flex justify-between text-xs font-bold text-stone-500 uppercase mb-2">
                 <span>Assets</span>
                 <span>=</span>
                 <span>Liabilities + Equity</span>
             </div>
             <div className="flex h-4 rounded-full overflow-hidden bg-stone-200">
                 <div className="bg-emerald-500 transition-all duration-500" style={{ width: '50%' }}></div>
                 <div className="bg-red-400 transition-all duration-500" style={{ width: `${(totalLiabilities / totalAssets) * 50}%` }}></div>
                 <div className="bg-nobel-gold transition-all duration-500" style={{ width: `${(totalEquity / totalAssets) * 50}%` }}></div>
             </div>
             <div className="flex justify-between mt-2 font-mono text-sm text-stone-700">
                 <span className="font-bold">{formatCurrency(totalAssets)}</span>
                 <span>{formatCurrency(totalLiabilities + totalEquity)}</span>
             </div>
         </div>

         {/* T-Account Cards */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
             {/* Assets */}
             <div className="bg-white p-4 rounded border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                 <div className="flex items-center gap-2 mb-3 text-emerald-600">
                     <PieChart size={16} />
                     <span className="text-xs font-bold uppercase">Assets</span>
                 </div>
                 <div className="space-y-2 text-sm">
                     <div className="flex justify-between">
                         <span className="text-stone-500">Cash</span>
                         <span className="font-mono text-stone-800">{formatCurrency(assets.cash)}</span>
                     </div>
                     <div className="flex justify-between">
                         <span className="text-stone-500">Equipment</span>
                         <span className="font-mono text-stone-800">{formatCurrency(assets.equipment)}</span>
                     </div>
                     <div className="flex justify-between">
                         <span className="text-stone-500">Receivables</span>
                         <span className="font-mono text-stone-800">{formatCurrency(assets.receivables)}</span>
                     </div>
                 </div>
                 <div className="mt-3 pt-2 border-t border-stone-100 font-mono font-bold text-right text-stone-900">
                     {formatCurrency(totalAssets)}
                 </div>
             </div>

             {/* Liabilities */}
             <div className="bg-white p-4 rounded border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                 <div className="flex items-center gap-2 mb-3 text-red-500">
                     <TrendingUp size={16} className="rotate-180" />
                     <span className="text-xs font-bold uppercase">Liabilities</span>
                 </div>
                 <div className="space-y-2 text-sm">
                     <div className="flex justify-between">
                         <span className="text-stone-500">Payables</span>
                         <span className="font-mono text-stone-800">{formatCurrency(liabilities.payables)}</span>
                     </div>
                     <div className="flex justify-between">
                         <span className="text-stone-500">Student Loans</span>
                         <span className="font-mono text-stone-800">{formatCurrency(liabilities.loans)}</span>
                     </div>
                 </div>
                 <div className="mt-3 pt-2 border-t border-stone-100 font-mono font-bold text-right text-stone-900">
                     {formatCurrency(totalLiabilities)}
                 </div>
             </div>

             {/* Equity */}
             <div className="bg-white p-4 rounded border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                 <div className="flex items-center gap-2 mb-3 text-nobel-gold">
                     <Briefcase size={16} />
                     <span className="text-xs font-bold uppercase">Equity</span>
                 </div>
                 <div className="space-y-2 text-sm">
                     <div className="flex justify-between">
                         <span className="text-stone-500">Capital</span>
                         <span className="font-mono text-stone-800">{formatCurrency(equity.capital)}</span>
                     </div>
                     <div className="flex justify-between">
                         <span className="text-stone-500">Ret. Earnings</span>
                         <span className="font-mono text-stone-800">{formatCurrency(equity.retainedEarnings)}</span>
                     </div>
                 </div>
                 <div className="mt-3 pt-2 border-t border-stone-100 font-mono font-bold text-right text-stone-900">
                     {formatCurrency(totalEquity)}
                 </div>
             </div>
         </div>
         
         {/* Ratios */}
         <div className="flex gap-4">
             <div className="px-4 py-2 bg-stone-100 rounded text-xs">
                 <span className="block text-stone-500 uppercase font-bold mb-1">Current Ratio</span>
                 <span className={`font-mono font-bold text-lg ${currentRatio > 1.5 ? 'text-green-600' : 'text-amber-500'}`}>{currentRatio.toFixed(2)}</span>
             </div>
             <div className="px-4 py-2 bg-stone-100 rounded text-xs">
                 <span className="block text-stone-500 uppercase font-bold mb-1">Debt Ratio</span>
                 <span className={`font-mono font-bold text-lg ${debtRatio < 0.5 ? 'text-green-600' : 'text-amber-500'}`}>{(debtRatio * 100).toFixed(0)}%</span>
             </div>
         </div>
      </div>

      {/* Right Panel: Operations */}
      <div className="w-full lg:w-80 bg-stone-900 text-stone-200 p-6 flex flex-col border-l border-stone-800">
          <div className="mb-6">
              <div className="flex items-center gap-2 text-nobel-gold text-xs font-bold uppercase tracking-widest mb-4">
                  <Calculator size={14} /> Operations
              </div>
              <div className="grid grid-cols-1 gap-3">
                  <button onClick={invoiceClient} className="w-full text-left px-4 py-3 bg-stone-800 hover:bg-stone-700 rounded border border-stone-700 transition-colors flex justify-between items-center group">
                      <span className="text-sm font-medium">Invoice Client</span>
                      <span className="text-xs text-stone-500 group-hover:text-nobel-gold">+R1,500</span>
                  </button>
                  <button onClick={collectCash} className="w-full text-left px-4 py-3 bg-stone-800 hover:bg-stone-700 rounded border border-stone-700 transition-colors flex justify-between items-center group">
                      <span className="text-sm font-medium">Collect Cash</span>
                      <span className="text-xs text-stone-500 group-hover:text-green-400">Asset Swap</span>
                  </button>
                  <button onClick={buyEquipment} className="w-full text-left px-4 py-3 bg-stone-800 hover:bg-stone-700 rounded border border-stone-700 transition-colors flex justify-between items-center group">
                      <span className="text-sm font-medium">Buy Hardware</span>
                      <span className="text-xs text-stone-500 group-hover:text-red-400">-R2,000</span>
                  </button>
                  <button onClick={incurExpense} className="w-full text-left px-4 py-3 bg-stone-800 hover:bg-stone-700 rounded border border-stone-700 transition-colors flex justify-between items-center group">
                      <span className="text-sm font-medium">Hosting Bill</span>
                      <span className="text-xs text-stone-500 group-hover:text-red-400">-R500</span>
                  </button>
                   <button onClick={payLoan} className="w-full text-left px-4 py-3 bg-stone-800 hover:bg-stone-700 rounded border border-stone-700 transition-colors flex justify-between items-center group">
                      <span className="text-sm font-medium">Pay Tuition Loan</span>
                      <span className="text-xs text-stone-500 group-hover:text-nobel-gold">Reduce Debt</span>
                  </button>
              </div>
          </div>

          <div className="flex-1 flex flex-col min-h-[200px]">
              <div className="flex items-center gap-2 text-stone-500 text-xs font-bold uppercase tracking-widest mb-3">
                  <FileText size={14} /> Journal Log
              </div>
              <div className="flex-1 bg-stone-950 rounded border border-stone-800 p-4 font-mono text-xs overflow-hidden relative">
                   {journal.length === 0 && <div className="text-stone-600 italic text-center mt-8">No transactions recorded today.</div>}
                   <div className="space-y-4">
                       {journal.map((entry) => (
                           <div key={entry.id} className="animate-fade-in">
                               <div className="text-stone-400 mb-1 border-b border-stone-900 pb-1 flex justify-between">
                                   <span>{entry.desc}</span>
                                   <span className="text-stone-600">{new Date(entry.id).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}</span>
                               </div>
                               <div className="pl-2">
                                   <div className="flex justify-between text-emerald-500">
                                       <span>Dr {entry.dr}</span>
                                       <span>{formatCurrency(entry.amount)}</span>
                                   </div>
                                   <div className="flex justify-between text-stone-300 pl-4">
                                       <span>Cr {entry.cr}</span>
                                       <span>{formatCurrency(entry.amount)}</span>
                                   </div>
                               </div>
                           </div>
                       ))}
                   </div>
                   {/* Fade out bottom */}
                   <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-stone-950 to-transparent pointer-events-none"></div>
              </div>
          </div>
      </div>
    </div>
  );
};

// --- PATRON MODAL COMPONENT ---

interface PatronModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DONATION_TIERS = [
    {
        id: 'coffee',
        label: 'Caffeine Fix',
        amount: 50,
        currency: 'R',
        icon: Coffee,
        description: 'Fuel for the 3AM debugging sessions.'
    },
    {
        id: 'hardware',
        label: 'Hardware Fund',
        amount: 500,
        currency: 'R',
        icon: Cpu,
        description: 'Contributing to the shack lab upgrades.'
    },
    {
        id: 'tuition',
        label: 'Tuition Block',
        amount: 2000,
        currency: 'R',
        icon: GraduationCap,
        description: 'Direct funding for CA(SA) university fees.'
    }
];

const PAYMENT_METHODS = [
    { id: 'card', label: 'Credit Card', icon: CreditCard },
    { id: 'paypal', label: 'PayPal', icon: Wallet },
    { id: 'crypto', label: 'Crypto (ETH)', icon: Cpu },
    { id: 'eft', label: 'EFT / Wire', icon: Banknote },
];

export const PatronModal: React.FC<PatronModalProps> = ({ isOpen, onClose }) => {
  // Step 1: Amount, 2: Details, 3: Method, 4: Card Entry, 5: Processing, 6: Success
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorName, setDonorName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('card');

  const handleTierSelect = (tierId: string, amount: number) => {
      setSelectedTier(tierId);
      setCustomAmount(amount.toString());
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCustomAmount(e.target.value);
      setSelectedTier('custom');
  };

  const proceedToDetails = () => {
      if (customAmount && Number(customAmount) > 0) {
          setStep(2);
      }
  };

  const submitDetails = (e: React.FormEvent) => {
      e.preventDefault();
      setStep(3);
  };

  const processPayment = (e: React.FormEvent) => {
      e.preventDefault();
      setStep(5);
      // Simulate secure payment processing
      setTimeout(() => {
          setStep(6);
      }, 3500);
  };

  const getActiveAmount = () => {
     return customAmount ? `R${Number(customAmount).toLocaleString()}` : 'R0';
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/90 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative bg-[#F9F8F4] w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-white p-6 border-b border-stone-200 flex justify-between items-center shrink-0">
            <div>
                <div className="flex items-center gap-2 text-nobel-gold text-xs font-bold tracking-widest uppercase mb-1">
                   <Sparkles size={12} /> The Neo Qiss Grant
                </div>
                <h3 className="font-serif text-2xl text-stone-900 font-medium">Invest in Potential</h3>
            </div>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-900 transition-colors">
                <X size={24} />
            </button>
        </div>

        {/* Progress Bar */}
        {step < 5 && (
            <div className="w-full bg-stone-200 h-1 shrink-0">
                <div 
                    className="h-full bg-nobel-gold transition-all duration-500"
                    style={{ width: `${(step / 4) * 100}%` }}
                ></div>
            </div>
        )}

        {/* Content Body */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
            
            {/* STEP 1: AMOUNT SELECTION */}
            {step === 1 && (
                <div className="animate-fade-in">
                    <p className="text-stone-600 mb-6 leading-relaxed">
                        Your contribution isn't just a donation; it's a venture capital investment in a student building the future from a shack. Choose your grant tier.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {DONATION_TIERS.map((tier) => (
                            <button 
                                key={tier.id}
                                onClick={() => handleTierSelect(tier.id, tier.amount)}
                                className={`p-4 rounded-lg border-2 text-left transition-all duration-200 relative overflow-hidden group ${selectedTier === tier.id ? 'border-nobel-gold bg-nobel-gold/5' : 'border-stone-200 hover:border-stone-300 bg-white'}`}
                            >
                                <div className={`mb-3 ${selectedTier === tier.id ? 'text-nobel-gold' : 'text-stone-400 group-hover:text-stone-600'}`}>
                                    <tier.icon size={28} />
                                </div>
                                <div className="font-serif text-lg font-bold text-stone-900 mb-1">{tier.label}</div>
                                <div className="text-xs text-stone-500 mb-3 h-8 leading-tight">{tier.description}</div>
                                <div className={`font-mono font-bold ${selectedTier === tier.id ? 'text-nobel-gold' : 'text-stone-800'}`}>
                                    {tier.currency}{tier.amount}
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-stone-200 flex items-center gap-4">
                        <div className="flex-1">
                             <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">Angel Grant Amount (ZAR)</label>
                             <input 
                                type="number" 
                                value={customAmount}
                                onChange={handleCustomAmountChange}
                                placeholder="Enter custom amount"
                                className="w-full text-lg font-serif text-stone-900 placeholder:text-stone-300 focus:outline-none"
                             />
                        </div>
                        {customAmount && (
                            <div className="text-stone-400 text-sm">ZAR</div>
                        )}
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button 
                            onClick={proceedToDetails}
                            disabled={!customAmount || Number(customAmount) <= 0}
                            className="px-6 py-3 bg-stone-900 text-white rounded font-medium hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <span>Continue to Details</span>
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 2: INVESTOR DETAILS */}
            {step === 2 && (
                 <form onSubmit={submitDetails} className="animate-fade-in max-w-lg mx-auto">
                    <div className="text-center mb-8">
                        <div className="text-stone-500 text-sm uppercase tracking-widest mb-2">Grant Allocation</div>
                        <div className="font-serif text-4xl text-nobel-gold">{getActiveAmount()}</div>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Investor Name</label>
                            <input 
                                type="text" 
                                required 
                                value={donorName}
                                onChange={(e) => setDonorName(e.target.value)}
                                className="w-full bg-white border border-stone-200 rounded p-3 text-stone-900 focus:outline-none focus:border-nobel-gold transition-colors" 
                                placeholder="e.g. Elon Musk" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Message of Encouragement</label>
                            <textarea 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full bg-white border border-stone-200 rounded p-3 text-stone-900 focus:outline-none focus:border-nobel-gold transition-colors h-32 resize-none" 
                                placeholder="Keep pushing the boundaries..." 
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex gap-4">
                        <button 
                            type="button"
                            onClick={() => setStep(1)}
                            className="px-6 py-3 bg-transparent border border-stone-300 text-stone-600 rounded font-medium hover:bg-stone-50 transition-colors"
                        >
                            Back
                        </button>
                        <button 
                            type="submit"
                            className="flex-1 px-6 py-3 bg-stone-900 text-white rounded font-medium hover:bg-nobel-gold transition-colors shadow-md flex items-center justify-center gap-2"
                        >
                            <span>Select Payment Method</span>
                            <ArrowRight size={16} />
                        </button>
                    </div>
                 </form>
            )}

            {/* STEP 3: PAYMENT METHOD */}
            {step === 3 && (
                <div className="animate-fade-in">
                    <div className="text-center mb-6">
                         <h4 className="font-serif text-xl text-stone-900 mb-2">Payment Method</h4>
                         <p className="text-stone-500 text-sm">Select how you'd like to transfer the grant.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 mb-8">
                        {PAYMENT_METHODS.map((method) => (
                            <button
                                key={method.id}
                                onClick={() => setSelectedPaymentMethod(method.id)}
                                className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${selectedPaymentMethod === method.id ? 'border-nobel-gold bg-nobel-gold/5 shadow-sm' : 'border-stone-200 bg-white hover:bg-stone-50'}`}
                            >
                                <div className={`p-2 rounded-full ${selectedPaymentMethod === method.id ? 'bg-nobel-gold text-white' : 'bg-stone-100 text-stone-500'}`}>
                                    <method.icon size={20} />
                                </div>
                                <span className={`font-medium ${selectedPaymentMethod === method.id ? 'text-stone-900' : 'text-stone-600'}`}>{method.label}</span>
                                {selectedPaymentMethod === method.id && <div className="ml-auto text-nobel-gold"><CheckCircle size={18} /></div>}
                            </button>
                        ))}
                    </div>
                    
                    <div className="bg-stone-50 p-4 rounded border border-stone-200 mb-8 flex justify-between items-center">
                         <span className="text-sm font-bold text-stone-500 uppercase tracking-widest">Total Charge</span>
                         <span className="font-serif text-xl text-stone-900">{getActiveAmount()}</span>
                    </div>

                    <div className="flex gap-4">
                         <button 
                            onClick={() => setStep(2)}
                            className="px-6 py-3 bg-transparent border border-stone-300 text-stone-600 rounded font-medium hover:bg-stone-50 transition-colors"
                        >
                            Back
                        </button>
                        <button 
                            onClick={() => setStep(4)}
                            className="flex-1 px-6 py-3 bg-stone-900 text-white rounded font-medium hover:bg-nobel-gold transition-colors shadow-md flex items-center justify-center gap-2"
                        >
                            <span>Enter Details</span>
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 4: ENTER DETAILS (CARD INPUT) */}
            {step === 4 && (
                <form onSubmit={processPayment} className="animate-fade-in">
                     <div className="text-center mb-6">
                         <h4 className="font-serif text-xl text-stone-900 mb-2">Secure Checkout</h4>
                         <p className="text-stone-500 text-sm">Enter your {PAYMENT_METHODS.find(m => m.id === selectedPaymentMethod)?.label || 'Payment'} details.</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm relative overflow-hidden mb-8">
                        {/* Top Bar Decoration */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-stone-100"></div>
                        
                        {/* Card Number */}
                        <div className="mb-5">
                           <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Card Number</label>
                           <div className="relative">
                              <CreditCard className="absolute left-3 top-3.5 text-stone-400" size={18} />
                              <input 
                                type="text" 
                                placeholder="0000 0000 0000 0000" 
                                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded focus:outline-none focus:border-stone-400 font-mono text-stone-800"
                              />
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-5 mb-6">
                           <div>
                              <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Expiry</label>
                              <input 
                                type="text" 
                                placeholder="MM / YY" 
                                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded focus:outline-none focus:border-stone-400 font-mono text-stone-800"
                              />
                           </div>
                           <div>
                              <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">CVC</label>
                              <div className="relative">
                                  <Lock className="absolute left-3 top-3.5 text-stone-400" size={14}/>
                                  <input 
                                    type="text" 
                                    placeholder="123" 
                                    className="w-full pl-9 pr-4 py-3 bg-stone-50 border border-stone-200 rounded focus:outline-none focus:border-stone-400 font-mono text-stone-800"
                                  />
                              </div>
                           </div>
                        </div>

                         {/* Security Badge */}
                        <div className="flex items-start gap-3 p-3 bg-blue-50/50 border border-blue-100/50 rounded-md">
                             <ShieldCheck className="text-green-600 shrink-0 mt-0.5" size={16} />
                             <div className="text-xs">
                                <p className="font-bold text-stone-800 mb-1">End-to-End Encrypted</p>
                                <p className="text-stone-500 leading-relaxed">
                                    Your credentials are tokenized and processed securely. 
                                    <span className="font-semibold text-stone-700"> Data is permanently deleted from our servers immediately after the transaction</span>, leaving no trace.
                                </p>
                             </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button 
                            type="button"
                            onClick={() => setStep(3)}
                            className="px-6 py-3 bg-transparent border border-stone-300 text-stone-600 rounded font-medium hover:bg-stone-50 transition-colors"
                        >
                            Back
                        </button>
                        <button 
                            type="submit"
                            className="flex-1 px-6 py-3 bg-stone-900 text-white rounded font-medium hover:bg-nobel-gold transition-colors shadow-md flex items-center justify-center gap-2"
                        >
                            <Lock size={16} />
                            <span>Pay {getActiveAmount()}</span>
                        </button>
                    </div>
                </form>
            )}

            {/* STEP 5: PROCESSING */}
            {step === 5 && (
                <div className="flex flex-col items-center justify-center py-12 animate-fade-in h-full">
                    <div className="relative w-20 h-20 mb-8">
                         <div className="absolute inset-0 border-4 border-stone-200 rounded-full"></div>
                         <div className="absolute inset-0 border-4 border-nobel-gold rounded-full border-t-transparent animate-spin"></div>
                         <div className="absolute inset-0 flex items-center justify-center text-nobel-gold">
                             <DollarSign size={24} />
                         </div>
                    </div>
                    <h4 className="font-serif text-2xl text-stone-900 mb-2">Processing Securely</h4>
                    <p className="text-stone-500 text-sm">Encrypting data and authorizing grant...</p>
                    
                    <div className="mt-8 flex flex-col gap-2 w-64">
                         <div className="flex items-center gap-2 text-xs text-stone-400">
                             <CheckCircle size={12} className="text-green-500" /> Tokenizing credentials...
                         </div>
                         <div className="flex items-center gap-2 text-xs text-stone-400 animate-fade-in" style={{ animationDelay: '1s' }}>
                             <CheckCircle size={12} className="text-green-500" /> Verifying with bank...
                         </div>
                         <div className="flex items-center gap-2 text-xs text-stone-400 animate-fade-in" style={{ animationDelay: '2s' }}>
                             <CheckCircle size={12} className="text-green-500" /> Deleting sensitive data...
                         </div>
                    </div>
                </div>
            )}

            {/* STEP 6: SUCCESS */}
            {step === 6 && (
                <div className="text-center animate-fade-in py-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full text-green-600 mb-6 border border-green-100">
                        <CheckCircle size={40} />
                    </div>
                    
                    <h3 className="font-serif text-3xl text-stone-900 mb-2">Grant Received</h3>
                    <p className="text-stone-600 max-w-md mx-auto mb-8">
                        Thank you, <span className="font-bold text-stone-900">{donorName || 'Investor'}</span>. 
                        Your contribution of <span className="font-bold text-nobel-gold">{getActiveAmount()}</span> has been successfully allocated.
                    </p>

                    <div className="bg-[#F5F4F0] p-6 rounded-lg border border-stone-200 max-w-sm mx-auto mb-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-stone-300 via-nobel-gold to-stone-300"></div>
                        <div className="flex justify-between items-end mb-4">
                             <div className="text-left">
                                 <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Receipt For</div>
                                 <div className="font-serif font-bold text-stone-900 text-lg">{donorName || 'Anonymous'}</div>
                             </div>
                             <div className="text-right">
                                 <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Date</div>
                                 <div className="font-mono text-stone-600 text-xs">{new Date().toLocaleDateString()}</div>
                             </div>
                        </div>
                        <div className="border-t border-stone-200 my-4 border-dashed"></div>
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-stone-600">Total Contribution</span>
                            <span className="font-bold text-xl text-stone-900">{getActiveAmount()}</span>
                        </div>
                        <div className="mt-6 text-center">
                            <div className="text-[10px] text-stone-400 italic">Authorized by Neo Qiss</div>
                        </div>
                    </div>

                    <button 
                        onClick={onClose} 
                        className="px-8 py-3 bg-stone-900 text-white rounded font-medium hover:bg-stone-800 transition-colors"
                    >
                        Return to Biosite
                    </button>
                </div>
            )}
        </div>
        
        {/* Footer Note */}
        {step < 5 && (
            <div className="bg-stone-50 p-4 border-t border-stone-200 text-center text-[10px] text-stone-400 shrink-0">
                <p>Contributions are non-refundable. This is a simulated environment for demonstration.</p>
            </div>
        )}
      </div>
    </div>
  );
};
