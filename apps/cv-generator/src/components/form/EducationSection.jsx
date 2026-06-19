import FormField from './FormField'

const empty = () => ({ institution: '', degree: '', field: '', startDate: '', endDate: '' })

export default function EducationSection({ items, onChange }) {
  function update(i, field, value) {
    onChange(items.map((item, idx) => idx === i ? { ...item, [field]: value } : item))
  }
  return (
    <section className="form-section">
      <div className="section-header">
        <span className="section-dot" />
        <h2 className="section-title">Education</h2>
      </div>
      {items.map((item, i) => (
        <div key={i} className="list-item">
          <div className="list-item-header">
            <span className="list-item-title">{item.institution || `Education ${i + 1}`}</span>
            <button type="button" className="btn-remove-item" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>
              Remove
            </button>
          </div>
          <FormField label="Institution" name="institution" value={item.institution} onChange={e => update(i, 'institution', e.target.value)} />
          <div className="field-row" style={{ marginTop: '10px' }}>
            <FormField label="Degree" name="degree" value={item.degree} onChange={e => update(i, 'degree', e.target.value)} placeholder="Bachelor of Science" />
            <FormField label="Field"  name="field"  value={item.field}  onChange={e => update(i, 'field',  e.target.value)} placeholder="Computer Science" />
          </div>
          <div className="field-row">
            <FormField label="Start" name="startDate" value={item.startDate} onChange={e => update(i, 'startDate', e.target.value)} placeholder="2016" />
            <FormField label="End"   name="endDate"   value={item.endDate}   onChange={e => update(i, 'endDate',   e.target.value)} placeholder="2019" />
          </div>
        </div>
      ))}
      <button type="button" className="btn-add" onClick={() => onChange([...items, empty()])}>+ Add education</button>
    </section>
  )
}
