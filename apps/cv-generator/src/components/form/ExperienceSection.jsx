import FormField from './FormField'

const empty = () => ({ company: '', role: '', startDate: '', endDate: '', location: '', bullets: [''] })

export default function ExperienceSection({ items, onChange }) {
  function update(i, field, value) {
    onChange(items.map((item, idx) => idx === i ? { ...item, [field]: value } : item))
  }
  function updateBullet(i, j, value) {
    onChange(items.map((item, idx) => {
      if (idx !== i) return item
      return { ...item, bullets: item.bullets.map((b, bi) => bi === j ? value : b) }
    }))
  }
  function addBullet(i) {
    onChange(items.map((item, idx) => idx === i ? { ...item, bullets: [...item.bullets, ''] } : item))
  }
  function removeBullet(i, j) {
    onChange(items.map((item, idx) => {
      if (idx !== i) return item
      return { ...item, bullets: item.bullets.filter((_, bi) => bi !== j) }
    }))
  }

  return (
    <section className="form-section">
      <div className="section-header">
        <span className="section-dot" />
        <h2 className="section-title">Experience</h2>
      </div>
      {items.map((item, i) => (
        <div key={i} className="list-item">
          <div className="list-item-header">
            <span className="list-item-title">{item.role || item.company || `Position ${i + 1}`}</span>
            <button type="button" className="btn-remove-item" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>
              Remove
            </button>
          </div>
          <div className="field-row">
            <FormField label="Role"    name="role"    value={item.role}    onChange={e => update(i, 'role', e.target.value)} />
            <FormField label="Company" name="company" value={item.company} onChange={e => update(i, 'company', e.target.value)} />
          </div>
          <div className="field-row">
            <FormField label="Start"    name="startDate" value={item.startDate} onChange={e => update(i, 'startDate', e.target.value)} placeholder="Jan 2022" />
            <FormField label="End"      name="endDate"   value={item.endDate}   onChange={e => update(i, 'endDate',   e.target.value)} placeholder="Present" />
            <FormField label="Location" name="location"  value={item.location}  onChange={e => update(i, 'location',  e.target.value)} />
          </div>
          <span className="bullet-label">Responsibilities / achievements</span>
          {item.bullets.map((b, j) => (
            <div key={j} className="bullet-row">
              <input value={b} onChange={e => updateBullet(i, j, e.target.value)} placeholder="Describe a key achievement or responsibility" />
              {item.bullets.length > 1 && (
                <button type="button" className="btn-remove" onClick={() => removeBullet(i, j)}>×</button>
              )}
            </div>
          ))}
          <button type="button" className="btn-add-minor" onClick={() => addBullet(i)}>+ Add bullet</button>
        </div>
      ))}
      <button type="button" className="btn-add" onClick={() => onChange([...items, empty()])}>+ Add experience</button>
    </section>
  )
}
