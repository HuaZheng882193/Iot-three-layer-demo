import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wifi, 
  Cloud, 
  Monitor, 
  User, 
  Ruler, 
  Weight, 
  ArrowRight, 
  ArrowUp,
  Cpu,
  Radio,
  BarChart3,
  Table as TableIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell
} from 'recharts';

// Types
type StudentData = {
  id: string;
  name: string;
  height: number;
  weight: number;
  gender: '男' | '女';
  timestamp: number;
};

type LogEntry = {
  id: string;
  message: string;
  payload?: any;
  timestamp: number;
};

export default function App() {
  // State
  const [students, setStudents] = useState<StudentData[]>([
    { id: '1', name: '学生A', height: 165, weight: 50, gender: '男', timestamp: Date.now() - 10000 },
    { id: '2', name: '学生B', height: 156, weight: 45, gender: '男', timestamp: Date.now() - 5000 },
    { id: '3', name: '学生C', height: 158, weight: 45, gender: '女', timestamp: Date.now() },
  ]);
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 'init', message: '系统初始化完成，等待传感器数据...', timestamp: Date.now() }
  ]);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Form State
  const [currentName, setCurrentName] = useState('学生D');
  const [currentHeight, setCurrentHeight] = useState(160);
  const [currentWeight, setCurrentWeight] = useState(50);
  const [currentGender, setCurrentGender] = useState<'男' | '女'>('男');

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (message: string, payload?: any) => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substring(7),
      message,
      payload,
      timestamp: Date.now()
    }]);
  };

  const handleSimulateData = () => {
    if (isTransmitting) return;
    
    setIsTransmitting(true);
    
    const newData: StudentData = {
      id: Math.random().toString(36).substring(7),
      name: currentName,
      height: currentHeight,
      weight: currentWeight,
      gender: currentGender,
      timestamp: Date.now()
    };

    // Step 1: Perception Layer collects data
    addLog('感知层：传感器采集到新数据', { 
      sensor: '超声波/重量/按键', 
      rawData: { h: currentHeight, w: currentWeight, g: currentGender } 
    });

    // Step 2: Network Layer transmits data (simulate delay)
    setTimeout(() => {
      addLog('网络层：通过WiFi发送MQTT消息至云平台...', { topic: '/school/health/data' });
      
      setTimeout(() => {
        // Step 3: Application Layer receives and processes data
        setStudents(prev => [...prev, newData]);
        addLog('应用层：成功接收并解析数据，更新可视化面板。', newData);
        setIsTransmitting(false);
        
        // Auto-increment student name for next input
        const nextChar = String.fromCharCode(currentName.charCodeAt(currentName.length - 1) + 1);
        setCurrentName(`学生${nextChar}`);
      }, 1000);
    }, 800);
  };

  // Calculations
  const avgHeight = students.length > 0 ? (students.reduce((acc, curr) => acc + curr.height, 0) / students.length).toFixed(1) : '0';
  const avgWeight = students.length > 0 ? (students.reduce((acc, curr) => acc + curr.weight, 0) / students.length).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 tracking-tight">
          物联网核心优势演示系统
        </h1>
        <p className="text-lg text-slate-600 font-medium">
          数据自动化采集、传输与精准分析
        </p>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Perception & Network */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* 感知层 (Perception Layer) */}
          <section className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden flex flex-col">
            <div className="bg-blue-50/50 px-6 py-4 border-b border-blue-100 flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Cpu size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-blue-900">感知层</h2>
                <p className="text-sm text-blue-600">数据的源头 (传感器采集)</p>
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col gap-5">
              <div className="space-y-4">
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <User size={16} className="text-slate-400" />
                    学生姓名
                  </label>
                  <input 
                    type="text" 
                    value={currentName}
                    onChange={(e) => setCurrentName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                {/* Height Input (Ultrasonic simulation) */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <Ruler size={16} className="text-blue-500" />
                    身高 (cm) - <span className="text-xs text-slate-500 font-normal">模拟超声波传感器</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="range" 
                      min="120" max="200" 
                      value={currentHeight}
                      onChange={(e) => setCurrentHeight(Number(e.target.value))}
                      className="flex-1 accent-blue-600"
                    />
                    <span className="font-mono font-medium w-12 text-right">{currentHeight}</span>
                  </div>
                </div>

                {/* Weight Input (Weight sensor simulation) */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <Weight size={16} className="text-blue-500" />
                    体重 (kg) - <span className="text-xs text-slate-500 font-normal">模拟重量传感器</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="range" 
                      min="30" max="100" 
                      value={currentWeight}
                      onChange={(e) => setCurrentWeight(Number(e.target.value))}
                      className="flex-1 accent-blue-600"
                    />
                    <span className="font-mono font-medium w-12 text-right">{currentWeight}</span>
                  </div>
                </div>

                {/* Gender Input (Button simulation) */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <Monitor size={16} className="text-blue-500" />
                    性别 - <span className="text-xs text-slate-500 font-normal">模拟按键区分</span>
                  </label>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setCurrentGender('男')}
                      className={`flex-1 py-2 rounded-lg border font-medium transition-colors ${currentGender === '男' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      男
                    </button>
                    <button 
                      onClick={() => setCurrentGender('女')}
                      className={`flex-1 py-2 rounded-lg border font-medium transition-colors ${currentGender === '女' ? 'bg-pink-50 border-pink-200 text-pink-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      女
                    </button>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleSimulateData}
                disabled={isTransmitting}
                className="mt-auto w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-bold shadow-sm shadow-blue-200 transition-all flex items-center justify-center gap-2"
              >
                {isTransmitting ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                      <Radio size={20} />
                    </motion.div>
                    数据采集中...
                  </>
                ) : (
                  <>
                    <ArrowUp size={20} />
                    模拟采集并上传数据
                  </>
                )}
              </button>
            </div>
          </section>

          {/* 网络层 (Network Layer) */}
          <section className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden flex flex-col h-64">
            <div className="bg-emerald-50/50 px-6 py-4 border-b border-emerald-100 flex items-center gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <Wifi size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-emerald-900">网络层</h2>
                <p className="text-sm text-emerald-600">信息的桥梁 (WiFi & MQTT)</p>
              </div>
            </div>
            
            <div className="p-4 flex-1 bg-slate-900 text-emerald-400 font-mono text-xs overflow-y-auto relative">
              {/* Animation Overlay */}
              <AnimatePresence>
                {isTransmitting && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-4 right-4 text-emerald-300 flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-emerald-500/30 backdrop-blur-sm"
                  >
                    <Cloud size={14} />
                    <span>MQTT 上传中...</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                {logs.map((log) => (
                  <div key={log.id} className="border-l-2 border-emerald-500/30 pl-2 py-1">
                    <div className="flex gap-2 text-slate-500 mb-0.5">
                      <span>[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    </div>
                    <div className="text-emerald-300">{log.message}</div>
                    {log.payload && (
                      <pre className="mt-1 text-slate-400 bg-slate-950/50 p-2 rounded overflow-x-auto">
                        {JSON.stringify(log.payload, null, 2)}
                      </pre>
                    )}
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            </div>
          </section>

        </div>

        {/* Right Column: Application Layer */}
        <div className="lg:col-span-8 flex flex-col">
          <section className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden flex flex-col h-full">
            <div className="bg-orange-50/50 px-6 py-4 border-b border-orange-100 flex items-center gap-3">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                <BarChart3 size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-orange-900">应用层</h2>
                <p className="text-sm text-orange-600">价值的呈现 (远程可视化面板)</p>
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col gap-6">
              
              {/* Top Stats Row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col items-center justify-center text-center">
                  <span className="text-slate-500 text-sm font-medium mb-1">采集总人数</span>
                  <span className="text-3xl font-bold text-slate-800">{students.length}</span>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-100 flex flex-col items-center justify-center text-center">
                  <span className="text-orange-600/80 text-sm font-medium mb-1">平均身高 (cm)</span>
                  <span className="text-3xl font-bold text-orange-600">{avgHeight}</span>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex flex-col items-center justify-center text-center">
                  <span className="text-blue-600/80 text-sm font-medium mb-1">平均体重 (kg)</span>
                  <span className="text-3xl font-bold text-blue-600">{avgWeight}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                {/* Data Table */}
                <div className="flex flex-col border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                    <TableIcon size={16} className="text-slate-500" />
                    <h3 className="font-semibold text-slate-700">实时数据汇总表</h3>
                  </div>
                  <div className="flex-1 overflow-auto max-h-[300px]">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-slate-500 bg-slate-50/50 sticky top-0">
                        <tr>
                          <th className="px-4 py-3 font-medium">学生</th>
                          <th className="px-4 py-3 font-medium">身高</th>
                          <th className="px-4 py-3 font-medium">体重</th>
                          <th className="px-4 py-3 font-medium">性别</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <AnimatePresence initial={false}>
                          {students.slice().reverse().map((student) => (
                            <motion.tr 
                              key={student.id}
                              initial={{ opacity: 0, backgroundColor: '#fff7ed' }}
                              animate={{ opacity: 1, backgroundColor: '#ffffff' }}
                              transition={{ duration: 1 }}
                              className="hover:bg-slate-50"
                            >
                              <td className="px-4 py-3 font-medium text-slate-700">{student.name}</td>
                              <td className="px-4 py-3 text-slate-600">{student.height} cm</td>
                              <td className="px-4 py-3 text-slate-600">{student.weight} kg</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-md text-xs font-medium ${student.gender === '男' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                                  {student.gender}
                                </span>
                              </td>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Chart */}
                <div className="flex flex-col border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                    <BarChart3 size={16} className="text-slate-500" />
                    <h3 className="font-semibold text-slate-700">身高体重分布图</h3>
                  </div>
                  <div className="flex-1 p-4 min-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis 
                          type="number" 
                          dataKey="height" 
                          name="身高" 
                          unit="cm" 
                          domain={['dataMin - 5', 'dataMax + 5']} 
                          tick={{ fontSize: 12, fill: '#64748b' }}
                          label={{ value: '身高 (cm)', position: 'insideBottom', offset: -10, fontSize: 12, fill: '#64748b' }}
                        />
                        <YAxis 
                          type="number" 
                          dataKey="weight" 
                          name="体重" 
                          unit="kg" 
                          domain={['dataMin - 5', 'dataMax + 5']}
                          tick={{ fontSize: 12, fill: '#64748b' }}
                          label={{ value: '体重 (kg)', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#64748b' }}
                        />
                        <Tooltip 
                          cursor={{ strokeDasharray: '3 3' }}
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Scatter name="学生" data={students}>
                          {students.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.gender === '男' ? '#3b82f6' : '#ec4899'} />
                          ))}
                        </Scatter>
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

            </div>
          </section>
        </div>

      </div>
      
      {/* Footer explanation */}
      <div className="max-w-7xl mx-auto mt-8 text-center text-slate-500 text-sm">
        <p>本程序用于八年级信息技术课程演示，模拟物联网三层架构（感知层、网络层、应用层）的数据流转过程。</p>
      </div>
    </div>
  );
}
