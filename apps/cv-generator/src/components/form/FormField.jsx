export default function FormField({ label, name, value, onChange, multiline = false, placeholder = '' }) {
  return (
    <div className="field">
      <label>{label}</label>
      {multiline
        ? <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} rows={3} />
        : <input type="text" name={name} value={value} onChange={onChange} placeholder={placeholder} />
      }
    </div>
  )
}
