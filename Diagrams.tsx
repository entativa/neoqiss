/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Cpu, BarChart2, Code, Coffee, Zap } from 'lucide-react';

// --- THE GENIUS LOOP DIAGRAM (Was Surface Code) ---
export const TheGeniusLoop: React.FC = () => {
  // A circular loop of nodes representing the cycle of bad code -> genius
  const [activeNodes, setActiveNodes] = useState<number[]>([]);
  const totalNodes = 8;
  
  const toggleNode = (index: number) => {
    setActiveNodes(prev => {
        if (prev.includes(index)) return prev.filter(i => i !== index);
        return [...prev, index];
    });
  };

  // Calculate if "Genius" is achieved (all nodes active)
  const isGenius = activeNodes.length === totalNodes;

  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-sm border border-stone-200 my-8">
      <h3 className="font-serif text-xl mb-4 text-stone-800">Interactive: The Complexity Loop</h3>
      <p className="text-sm text-stone-500 mb-6 text-center max-w-md">
        Click the nodes to iterate. My code starts chaotic, but if you keep pushing, it loops back to genius.
      </p>
      
      <div className="relative w-64 h-64 bg-[#F5F4F0] rounded-full border border-stone-200 flex items-center justify-center">
         {/* Connecting Lines */}
         <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            <circle cx="50%" cy="50%" r="40%" fill="none" stroke="currentColor" strokeWidth="1" className="text-stone-400" />
         </svg>

         {/* Center Status */}
         <div className={`z-10 text-center transition-all duration-500 ${isGenius ? 'scale-110' : 'scale-100'}`}>
             <div className={`font-serif text-2xl font-bold ${isGenius ? 'text-nobel-gold' : 'text-stone-300'}`}>
                 {isGenius ? "GENIUS" : "CHAOS"}
             </div>
             {isGenius && <div className="text-[10px] uppercase tracking-widest text-stone-500 mt-1">Citation Needed</div>}
         </div>

         {/* Nodes */}
         {[...Array(totalNodes)].map((_, i) => {
             const angle = (i / totalNodes) * 2 * Math.PI;
             const radius = 40; // Percentage
             const x = 50 + radius * Math.cos(angle);
             const y = 50 + radius * Math.sin(angle);
             
             return (
                 <button
                    key={i}
                    onClick={() => toggleNode(i)}
                    className={`absolute w-10 h-10 -ml-5 -mt-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${activeNodes.includes(i) ? 'bg-stone-900 border-stone-900 text-nobel-gold shadow-lg scale-110' : 'bg-white border-stone-300 hover:border-nobel-gold hover:text-nobel-gold text-stone-300'}`}
                    style={{ left: `${x}%`, top: `${y}%` }}
                 >
                    <Code size={16} />
                 </button>
             );
         })}
      </div>

      <div className="mt-8 h-6 text-sm font-serif italic text-stone-600 transition-all">
        {isGenius 
            ? "System Status: Transcendence Achieved." 
            : activeNodes.length > 0 
                ? "Iterating... refactoring... almost there." 
                : "Starting from spaghetti code."}
      </div>
    </div>
  );
};

// --- TECH STACK FLOW (Was Transformer Decoder) ---
export const TechStackFlow: React.FC = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
        setStep(s => (s + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center p-8 bg-[#F5F4F0] rounded-xl border border-stone-200 my-8">
      <h3 className="font-serif text-xl mb-4 text-stone-900">The Production Pipeline</h3>
      <p className="text-sm text-stone-600 mb-6 text-center max-w-md">
        Transforming caffeine and anxiety into robust, type-safe applications.
      </p>

      <div className="relative w-full max-w-lg h-56 bg-white rounded-lg shadow-inner overflow-hidden mb-6 border border-stone-200 flex items-center justify-center gap-4 sm:gap-8 p-4">
        
        {/* Input Stage */}
        <div className="flex flex-col items-center gap-2">
            <div className={`w-16 h-16 rounded-lg border-2 flex flex-col items-center justify-center transition-colors duration-500 ${step === 0 ? 'border-stone-800 bg-stone-800 text-white' : 'border-stone-200 bg-stone-50'}`}>
                <Coffee size={24} />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500">Input</span>
        </div>

        {/* Arrows */}
        <motion.div animate={{ opacity: step >= 1 ? 1 : 0.3, x: step >= 1 ? 0 : -5 }}>→</motion.div>

        {/* Processing Stage */}
        <div className="flex flex-col items-center gap-2">
             <div className={`w-24 h-24 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-colors duration-500 relative overflow-hidden ${step === 1 || step === 2 ? 'border-nobel-gold bg-nobel-gold/10' : 'border-stone-200 bg-stone-50'}`}>
                <Cpu size={24} className={step === 1 || step === 2 ? 'text-nobel-gold animate-pulse' : 'text-stone-300'} />
                <div className="text-xs font-mono font-bold text-stone-600 mt-1">
                    {step === 1 ? "RUST" : step === 2 ? "KOTLIN" : "IDLE"}
                </div>
             </div>
             <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500">Compile</span>
        </div>

        {/* Arrows */}
        <motion.div animate={{ opacity: step >= 3 ? 1 : 0.3, x: step >= 3 ? 0 : -5 }}>→</motion.div>

        {/* Output Stage */}
        <div className="flex flex-col items-center gap-2">
            <div className={`w-16 h-16 rounded-lg border-2 flex flex-col items-center justify-center transition-colors duration-500 ${step === 3 ? 'border-green-500 bg-green-50 text-green-600' : 'border-stone-200 bg-stone-50'}`}>
                {step === 3 ? (
                    <Zap size={24} />
                ) : (
                    <span className="text-2xl font-serif text-stone-300">?</span>
                )}
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500">Ship It</span>
        </div>

      </div>

      <div className="flex gap-2">
          {[0, 1, 2, 3].map(s => (
              <div key={s} className={`h-1 rounded-full transition-all duration-300 ${step === s ? 'w-8 bg-stone-800' : 'w-2 bg-stone-300'}`}></div>
          ))}
      </div>
    </div>
  );
};

// --- HUSTLE METRICS (Was Performance Chart) ---
export const HustleMetrics: React.FC = () => {
    const [mode, setMode] = useState<'Day' | 'Night' | 'Weekend'>('Night');
    
    // Mock data for activity distribution
    const data = {
        'Day': { accounting: 80, coding: 10, driving: 10 },
        'Night': { accounting: 10, coding: 80, driving: 10 },
        'Weekend': { accounting: 20, coding: 30, driving: 50 } 
    };

    const currentData = data[mode];
    
    return (
        <div className="flex flex-col md:flex-row gap-8 items-center p-8 bg-stone-900 text-stone-100 rounded-xl my-8 border border-stone-800 shadow-lg">
            <div className="flex-1 min-w-[240px]">
                <h3 className="font-serif text-xl mb-2 text-nobel-gold">The Daily Hustle</h3>
                <p className="text-stone-400 text-sm mb-4 leading-relaxed">
                    Balancing the pursuit of a Chartered Accountant qualification with the burning desire to write code and the necessity of driving borrowed cars to pay the bills.
                </p>
                <div className="flex gap-2 mt-6">
                    {(['Day', 'Night', 'Weekend'] as const).map((m) => (
                        <button 
                            key={m}
                            onClick={() => setMode(m)} 
                            className={`px-3 py-1.5 rounded text-sm font-medium transition-all duration-200 border ${mode === m ? 'bg-nobel-gold text-stone-900 border-nobel-gold' : 'bg-transparent text-stone-400 border-stone-700 hover:border-stone-500 hover:text-stone-200'}`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
                <div className="mt-6 font-mono text-xs text-stone-500 flex items-center gap-2">
                    <BarChart2 size={14} className="text-nobel-gold" /> 
                    <span>RESOURCE ALLOCATION (%)</span>
                </div>
            </div>
            
            <div className="relative w-64 h-72 bg-stone-800/50 rounded-xl border border-stone-700/50 p-6 flex justify-around items-end">
                {/* Background Grid Lines */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none opacity-10">
                   <div className="w-full h-[1px] bg-stone-400"></div>
                   <div className="w-full h-[1px] bg-stone-400"></div>
                   <div className="w-full h-[1px] bg-stone-400"></div>
                   <div className="w-full h-[1px] bg-stone-400"></div>
                </div>

                {/* Bar 1: Accounting */}
                <div className="w-12 flex flex-col justify-end items-center h-full z-10">
                    <div className="flex-1 w-full flex items-end justify-center relative mb-3">
                        <motion.div 
                            className="w-full bg-stone-600 rounded-t-sm"
                            initial={{ height: 0 }}
                            animate={{ height: `${currentData.accounting}%` }}
                            transition={{ type: "spring", stiffness: 80, damping: 15 }}
                        />
                    </div>
                    <div className="h-6 flex items-center text-[10px] font-bold text-stone-500 uppercase tracking-wider rotate-0">Study</div>
                </div>

                 {/* Bar 2: Driving */}
                 <div className="w-12 flex flex-col justify-end items-center h-full z-10">
                    <div className="flex-1 w-full flex items-end justify-center relative mb-3">
                        <motion.div 
                            className="w-full bg-stone-500 rounded-t-sm"
                            initial={{ height: 0 }}
                            animate={{ height: `${currentData.driving}%` }}
                            transition={{ type: "spring", stiffness: 80, damping: 15 }}
                        />
                    </div>
                    <div className="h-6 flex items-center text-[10px] font-bold text-stone-500 uppercase tracking-wider rotate-0">Drive</div>
                </div>

                {/* Bar 3: Coding */}
                <div className="w-12 flex flex-col justify-end items-center h-full z-10">
                     <div className="flex-1 w-full flex items-end justify-center relative mb-3">
                        <motion.div 
                            className="w-full bg-nobel-gold rounded-t-sm shadow-[0_0_15px_rgba(197,160,89,0.3)]"
                            initial={{ height: 0 }}
                            animate={{ height: `${currentData.coding}%` }}
                            transition={{ type: "spring", stiffness: 80, damping: 15 }}
                        />
                    </div>
                     <div className="h-6 flex items-center text-[10px] font-bold text-nobel-gold uppercase tracking-wider rotate-0">Code</div>
                </div>
            </div>
        </div>
    )
}