import { useState, useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useWealth } from '../context/WealthContext'
import { Card } from '../components/ui/Card'
import { MetricCard } from '../components/ui/MetricCard'
import { formatCurrency, calculateCompoundInterest } from '../utils'

export default function Projections() {
  const { darkMode, metrics, history } = useWealth()
  
  // Calculate default values based on current portfolio data
  const getDefaultCapital = useMemo(() => {
    return metrics?.totalNAV ? Math.round(metrics.totalNAV) : 10000
  }, [metrics])
  
  const getDefaultMonthlyContribution = useMemo(() => {
    if (!history || history.length === 0) return 500
    
    // Get current date and calculate 12 months ago
    const now = new Date()
    const monthsToCheck = new Set<string>()
    
    // Generate list of last 12 months in YYYY-MM format
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      monthsToCheck.add(date.toISOString().slice(0, 7))
    }
    
    // Calculate total contributions per month for the last 12 months
    const monthlyContributions: Record<string, number> = {}
    history.forEach(entry => {
      if (monthsToCheck.has(entry.month)) {
        if (!monthlyContributions[entry.month]) {
          monthlyContributions[entry.month] = 0
        }
        monthlyContributions[entry.month] += entry.contribution || 0
      }
    })
    
    // Calculate average
    const months = Object.values(monthlyContributions)
    if (months.length === 0) return 500
    const average = months.reduce((a, b) => a + b, 0) / months.length
    
    return Math.round(average)
  }, [history])
  
  const [initialCapital, setInitialCapital] = useState(getDefaultCapital)
  const [monthlyContribution, setMonthlyContribution] = useState(getDefaultMonthlyContribution)
  const [annualRate, setAnnualRate] = useState(7)
  const [months, setMonths] = useState(60)

  const projectionData = useMemo(() => {
    return calculateCompoundInterest(initialCapital, monthlyContribution, annualRate, months)
  }, [initialCapital, monthlyContribution, annualRate, months])

  const finalMetrics = useMemo(() => {
    if (projectionData.length === 0) return { finalValue: 0, totalCapital: 0, gains: 0, roi: 0 }

    const lastData = projectionData[projectionData.length - 1]
    const totalCapital = initialCapital + monthlyContribution * months
    const finalValue = lastData.totalValue
    const gains = finalValue - totalCapital
    const roi = totalCapital > 0 ? (gains / totalCapital) * 100 : 0

    return { finalValue, totalCapital, gains, roi }
  }, [projectionData, initialCapital, monthlyContribution, months])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter dark:text-white">
          Proyecciones Financieras
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Simula el crecimiento de tu patrimonio con interés compuesto
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Parámetros de Entrada */}
        <Card title="Parámetros de Proyección">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Capital Inicial (€)
              </label>
              <input
                type="range"
                min="1000"
                max={Math.max(100000, getDefaultCapital * 2)}
                step="1000"
                value={initialCapital}
                onChange={(e) => setInitialCapital(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-sm font-bold mt-1 dark:text-white">{formatCurrency(initialCapital)}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Aportación Mensual (€)
              </label>
              <input
                type="range"
                min="0"
                max={Math.max(5000, getDefaultMonthlyContribution * 2)}
                step="50"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-sm font-bold mt-1 dark:text-white">{formatCurrency(monthlyContribution)}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Retorno Anual (%)
              </label>
              <input
                type="range"
                min="0"
                max="20"
                step="0.5"
                value={annualRate}
                onChange={(e) => setAnnualRate(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-sm font-bold mt-1 dark:text-white">{annualRate.toFixed(1)}%</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Período (Meses): {months}
              </label>
              <input
                type="range"
                min="1"
                max="360"
                step="1"
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-sm font-bold mt-1 dark:text-white">
                {(months / 12).toFixed(1)} años
              </p>
            </div>
          </div>
        </Card>

        {/* Métricas de Proyección */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              title="Patrimonio Final Estimado"
              value={formatCurrency(Math.round(finalMetrics.finalValue))}
              subtitle="Proyección final"
              color="text-indigo-600"
            />
            <MetricCard
              title="Capital Total Invertido"
              value={formatCurrency(Math.round(finalMetrics.totalCapital))}
              subtitle="Aportaciones acumuladas"
              color="text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              title="Ganancias Proyectadas"
              value={formatCurrency(Math.round(finalMetrics.gains))}
              subtitle="Por interés compuesto"
              color={finalMetrics.gains >= 0 ? 'text-emerald-500' : 'text-rose-500'}
            />
            <MetricCard
              title="ROI Proyectado"
              value={`${finalMetrics.roi.toFixed(2)}%`}
              subtitle="Rentabilidad acumulada"
              color="text-indigo-600"
            />
          </div>
        </div>
      </div>

      {/* Gráfico de Proyección */}
      <Card title="Evolución de Patrimonio" className="overflow-hidden">
        {projectionData.length > 0 && (
          <div className="h-[400px] -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData} margin={{ top: 20, right: 30, bottom: 20, left: 60 }}>
                <defs>
                  <linearGradient id="colorCapital" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
                <XAxis
                  dataKey="monthLabel"
                  stroke={darkMode ? '#94a3b8' : '#64748b'}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  stroke={darkMode ? '#94a3b8' : '#64748b'}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                    border: `1px solid ${darkMode ? '#475569' : '#e2e8f0'}`,
                    borderRadius: '12px',
                    padding: '12px'
                  }}
                  formatter={(value) => `€${Number(value).toLocaleString('es-ES')}`}
                  labelFormatter={(label) => `Mes ${label}`}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />

                <Area
                  type="monotone"
                  dataKey="capitalInvested"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorCapital)"
                  name="Capital Invertido"
                  isAnimationActive={false}
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="totalValue"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                  name="Valor Total (con Intereses)"
                  isAnimationActive={false}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {/* Información */}
      <Card title="Cómo Funciona">
        <div className="space-y-4 text-slate-700 dark:text-slate-300">
          <p>
            <strong>Interés Compuesto:</strong> La fórmula utilizada es: FV = PV(1+r)^n + P×((1+r)^n-1)/r
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Capital Inicial (PV):</strong> Cantidad de dinero que inviertes al inicio</li>
            <li><strong>Aportación Mensual (P):</strong> Dinero que añades cada mes de forma regular</li>
            <li><strong>Retorno Anual (r):</strong> Porcentaje de ganancia anual esperada</li>
            <li><strong>Período (n):</strong> Número de meses para la proyección</li>
          </ul>
          <p className="text-sm">
            💡 <strong>Consejo:</strong> Ajusta los parámetros para ver cómo pequeños cambios en la aportación mensual o el retorno pueden impactar significativamente tu riqueza a largo plazo.
          </p>
        </div>
      </Card>
    </div>
  )
}
