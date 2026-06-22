import { useState } from 'react'
// import { authClient } from './lib/auth'  // Uncomment when MS365 auth is ready

// ─── Colour map for status badges ───────────────────────────────────────────
const STATUS = {
  Active:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  Pending:  'bg-amber-50   text-amber-700   border-amber-200',
  Expiring: 'bg-red-50     text-red-700     border-red-200',
  Closed:   'bg-gray-100   text-gray-500    border-gray-200',
}

// ─── Sample data — replace or load from API ─────────────────────────────────
const INITIAL = [
  { id: 1, consultant: 'Anna Bergström', client: 'Equinor ASA', role: 'Senior Java Developer', start: '2026-02-01', end: '2026-08-31', rate: 1400, status: 'Active'   },
  { id: 2, consultant: 'Erik Haugen',    client: 'DNB Bank',    role: 'Cloud Architect',       start: '2026-01-15', end: '2026-07-14', rate: 1600, status: 'Expiring' },
  { id: 3, consultant: 'Sara Lund',      client: 'Telenor',     role: 'Data Engineer',         start: '2026-04-01', end: '2026-09-30', rate: 1200, status: 'Pending'  },
]

const BLANK = { consultant: '', client: '', role: '', start: '', end: '', rate: '', status: 'Pending' }

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  // const { data: session } = authClient.useSession()  // Uncomment when auth is ready
  const [rows, setRows]       = useState(INITIAL)
  const [modal, setModal]     = useState(false)
  const [form, setForm]       = useState(BLANK)
  const [editId, setEditId]   = useState(null)

  function openNew()  { setForm(BLANK); setEditId(null); setModal(true) }
  function openEdit(r){ setForm({ ...r, rate: String(r.rate) }); setEditId(r.id); setModal(true) }
  function close()    { setModal(false) }

  function save(e) {
    e.preventDefault()
    const entry = { ...form, rate: Number(form.rate) }
    if (editId) {
      setRows(rs => rs.map(r => r.id === editId ? { ...entry, id: editId } : r))
    } else {
      setRows(rs => [...rs, { ...entry, id: Date.now() }])
    }
    close()
  }

  function remove(id) { setRows(rs => rs.filter(r => r.id !== id)) }

  return (
    <div className="min-h-screen bg-bg px-6 py-10">
      <div className="mx-auto max-w-5xl space-y-8">

        {/* Page header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">Contract Tracker</h1>
            <p className="mt-1 text-sm text-tx-muted">{rows.filter(r => r.status === 'Active').length} active · {rows.filter(r => r.status === 'Expiring').length} expiring soon</p>
          </div>
          <button
            onClick={openNew}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/80 transition-colors"
          >
            + New contract
          </button>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg/60">
                {['Consultant', 'Client', 'Role', 'Period', 'Rate / day', 'Status', ''].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-tx-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map(r => (
                <tr key={r.id} className="group hover:bg-bg/50 transition-colors">
                  <td className="px-5 py-4 font-medium text-tx">{r.consultant}</td>
                  <td className="px-5 py-4 text-tx-muted">{r.client}</td>
                  <td className="px-5 py-4 text-tx-muted">{r.role}</td>
                  <td className="px-5 py-4 text-tx-muted whitespace-nowrap">{r.start} → {r.end}</td>
                  <td className="px-5 py-4 font-semibold text-tx">NOK {r.rate.toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${STATUS[r.status]}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(r)} className="text-xs text-tx-muted hover:text-tx transition-colors">Edit</button>
                      <button onClick={() => remove(r.id)} className="text-xs text-red-400 hover:text-red-600 transition-colors">Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-tx-muted">
                    No contracts yet. Click "+ New contract" to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Total contracts', value: rows.length },
            { label: 'Active',          value: rows.filter(r => r.status === 'Active').length },
            { label: 'Expiring soon',   value: rows.filter(r => r.status === 'Expiring').length },
            { label: 'Avg. day rate',   value: rows.length ? `NOK ${Math.round(rows.reduce((s, r) => s + r.rate, 0) / rows.length).toLocaleString()}` : '—' },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-border bg-card p-5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-tx-muted">{label}</div>
              <div className="mt-1.5 text-2xl font-bold text-primary">{value}</div>
            </div>
          ))}
        </div>

      </div>

      {/* ── Modal ─────────────────────────────────────────────────────────── */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) close() }}
        >
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl">
            <h2 className="mb-6 text-lg font-bold text-primary">
              {editId ? 'Edit contract' : 'New contract'}
            </h2>

            <form onSubmit={save} className="space-y-4">
              {[
                ['consultant', 'text',   'Consultant name'],
                ['client',     'text',   'Client'],
                ['role',       'text',   'Role / title'],
                ['rate',       'number', 'Day rate (NOK)'],
              ].map(([key, type, label]) => (
                <Field key={key} label={label}>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    required
                    className="input"
                  />
                </Field>
              ))}

              <div className="grid grid-cols-2 gap-3">
                {[['start', 'Start date'], ['end', 'End date']].map(([key, label]) => (
                  <Field key={key} label={label}>
                    <input
                      type="date"
                      value={form[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      required
                      className="input"
                    />
                  </Field>
                ))}
              </div>

              <Field label="Status">
                <select
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className="input"
                >
                  {Object.keys(STATUS).map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={close}
                  className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-tx-muted hover:bg-bg transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/80 transition-colors">
                  {editId ? 'Save changes' : 'Add contract'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-tx-muted">{label}</label>
      {children}
    </div>
  )
}

// Add .input to tailwind as a reusable class via @layer in index.css if you prefer,
// or just keep the className inline. Both work fine with Claude Code.
