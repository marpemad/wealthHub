import { useState, useMemo } from 'react'
import { Trash2, Plus, Edit3 } from 'lucide-react'
import { useWealth } from '../context/WealthContext'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { formatCurrency, generateUUID } from '../utils'
import type { HistoryEntry } from '../types'

export default function History() {
  const { assets, history, setHistory } = useWealth()
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<HistoryEntry | null>(null)
  const [formData, setFormData] = useState({
    month: new Date().toISOString().slice(0, 7),
    assetId: '',
    nav: 0,
    contribution: 0
  })

  // Función para convertir mes en formato "2024-01" a "Enero 2024"
  const formatMonthDisplay = (monthStr: string): string => {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    const [year, month] = monthStr.split('-')
    const monthIndex = parseInt(month) - 1
    return `${months[monthIndex]} ${year}`
  }

  // Group history by year
  const groupedByYear = useMemo(() => {
    const groups: Record<string, Record<string, typeof history>> = {}

    history.forEach(entry => {
      const [year] = entry.month.split('-')
      if (!groups[year]) {
        groups[year] = {}
      }
      if (!groups[year][entry.month]) {
        groups[year][entry.month] = []
      }
      groups[year][entry.month].push(entry)
    })

    return groups
  }, [history])

  const years = Object.keys(groupedByYear).sort().reverse()
  const displayYear = selectedYear || years[0]
  const monthsData = groupedByYear[displayYear] || {}

  const handleOpenModal = (entry?: HistoryEntry) => {
    if (entry) {
      setEditingEntry(entry)
      setFormData({
        month: entry.month,
        assetId: entry.assetId,
        nav: entry.nav,
        contribution: entry.contribution
      })
    } else {
      setEditingEntry(null)
      setFormData({
        month: new Date().toISOString().slice(0, 7),
        assetId: '',
        nav: 0,
        contribution: 0
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.assetId) return

    if (editingEntry) {
      setHistory(history.map(entry =>
        entry.id === editingEntry.id
          ? {
              id: entry.id,
              month: formData.month,
              assetId: formData.assetId,
              nav: formData.nav,
              contribution: formData.contribution
            }
          : entry
      ))
    } else {
      const newEntry: HistoryEntry = {
        id: generateUUID(),
        month: formData.month,
        assetId: formData.assetId,
        nav: formData.nav,
        contribution: formData.contribution
      }
      setHistory([...history, newEntry])
    }

    setIsModalOpen(false)
    setEditingEntry(null)
  }

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de que desea eliminar este registro?')) {
      setHistory(history.filter(entry => entry.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter dark:text-white">
            Historial de Patrimonio
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Evolución mensual de tus activos
          </p>
        </div>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          <Plus size={20} className="inline mr-2" />
          Nuevo Registro
        </Button>
      </header>

      {/* Selector de año */}
      {years.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {years.map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year === displayYear ? null : year)}
              className={`px-4 py-2 rounded-2xl font-semibold transition-colors ${
                year === displayYear
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      )}

      {/* Historial por mes */}
      {Object.entries(monthsData).map(([month, entries]) => {
        const monthTotal = entries.reduce((sum, e) => sum + e.nav, 0)
        // Excluir Cash del cálculo de "Invertido"
        const cashAsset = assets.find(a => a.name === 'Cash')
        const monthInvested = entries
          .filter(e => !cashAsset || e.assetId !== cashAsset.id)
          .reduce((sum, e) => sum + e.contribution, 0)

        return (
          <Card key={month} title={formatMonthDisplay(month)}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">Total</p>
                  <p className="text-xl font-black dark:text-white">{formatCurrency(Math.round(monthTotal))}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">Invertido</p>
                  <p className="text-xl font-black text-slate-600 dark:text-slate-300">{formatCurrency(Math.round(monthInvested))}</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800">
                      <th className="text-left py-2 px-3 font-bold text-slate-600 dark:text-slate-400 text-sm">Activo</th>
                      <th className="text-right py-2 px-3 font-bold text-slate-600 dark:text-slate-400 text-sm">NAV</th>
                      <th className="text-right py-2 px-3 font-bold text-slate-600 dark:text-slate-400 text-sm">Aportación</th>
                      <th className="text-center py-2 px-3 font-bold text-slate-600 dark:text-slate-400 text-sm">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry) => {
                      const asset = assets.find(a => a.id === entry.assetId)
                      return (
                        <tr key={entry.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900">
                          <td className="py-2 px-3 font-semibold dark:text-white text-sm">
                            {asset ? (
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: asset.color }}></div>
                                {asset.name}
                              </div>
                            ) : (
                              'N/A'
                            )}
                          </td>
                          <td className="py-2 px-3 text-right font-bold dark:text-white text-sm">
                            {formatCurrency(Math.round(entry.nav))}
                          </td>
                          <td className="py-2 px-3 text-right font-bold text-indigo-600 text-sm">
                            {entry.contribution > 0 ? '+' : ''}{formatCurrency(Math.round(entry.contribution))}
                          </td>
                          <td className="py-2 px-3 text-center space-x-2 flex gap-1 justify-center">
                            <button
                              onClick={() => handleOpenModal(entry)}
                              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors"
                            >
                              <Edit3 size={14} className="text-blue-500" />
                            </button>
                            <button
                              onClick={() => handleDelete(entry.id)}
                              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors"
                            >
                              <Trash2 size={14} className="text-rose-500" />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        )
      })}

      {history.length === 0 && (
        <Card>
          <p className="text-center text-slate-600 dark:text-slate-400 py-8">
            Sin datos de historial aún
          </p>
        </Card>
      )}

      {/* Modal de Edición */}
      <Modal
        isOpen={isModalOpen}
        title={editingEntry ? 'Editar Registro' : 'Nuevo Registro'}
        onClose={() => setIsModalOpen(false)}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Mes"
            type="month"
            value={formData.month}
            onChange={(e) => setFormData({ ...formData, month: e.target.value })}
            required
          />

          <Select
            label="Activo"
            value={formData.assetId}
            onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
            options={assets.filter(a => !a.archived).map(a => ({ value: a.id, label: a.name }))}
          />

          <Input
            label="NAV (€)"
            type="number"
            value={formData.nav}
            onChange={(e) => setFormData({ ...formData, nav: parseFloat(e.target.value) })}
            step="0.01"
            required
          />

          <Input
            label="Aportación (€)"
            type="number"
            value={formData.contribution}
            onChange={(e) => setFormData({ ...formData, contribution: parseFloat(e.target.value) })}
            step="0.01"
            required
          />

          <div className="flex gap-2 justify-end pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {editingEntry ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
