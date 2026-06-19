import { useState } from 'react'
import FormField from './FormField'

const emptyGroup = () => ({ category: '', items: [] })

function SkillTagInput({ items, onChange }) {
  const [draft, setDraft] = useState('')

  function add() {
    const trimmed = draft.trim()
    if (!trimmed) return
    onChange([...items, trimmed])
    setDraft('')
  }

  function remove(i) {
    onChange(items.filter((_, idx) => idx !== i))
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      add()
    }
    if (e.key === 'Backspace' && draft === '' && items.length > 0) {
      onChange(items.slice(0, -1))
    }
  }

  return (
    <div>
      {items.length > 0 && (
        <div className="skills-tags">
          {items.map((item, i) => (
            <span key={i} className="skill-tag">
              {item}
              <button type="button" onClick={() => remove(i)}>×</button>
            </span>
          ))}
        </div>
      )}
      <div className="skills-input-row">
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type a skill and press Enter"
        />
        <button type="button" onClick={add}>Add</button>
      </div>
    </div>
  )
}

export default function SkillsSection({ items, languages, onSkillsChange, onLanguagesChange }) {
  function updateGroup(i, field, value) {
    onSkillsChange(items.map((g, idx) => idx === i ? { ...g, [field]: value } : g))
  }

  return (
    <section className="form-section">
      <div className="section-header">
        <span className="section-dot" />
        <h2 className="section-title">Skills</h2>
      </div>

      {items.map((group, i) => (
        <div key={i} className="list-item">
          <div className="list-item-header">
            <span className="list-item-title">{group.category || `Skill group ${i + 1}`}</span>
            <button type="button" className="btn-remove-item" onClick={() => onSkillsChange(items.filter((_, idx) => idx !== i))}>
              Remove
            </button>
          </div>
          <FormField
            label="Category"
            name="category"
            value={group.category}
            onChange={e => updateGroup(i, 'category', e.target.value)}
            placeholder="e.g. Tools, Languages, Frameworks"
          />
          <span className="bullet-label" style={{ marginTop: '10px', display: 'block' }}>Skills</span>
          <SkillTagInput
            items={group.items}
            onChange={val => updateGroup(i, 'items', val)}
          />
        </div>
      ))}
      <button type="button" className="btn-add" onClick={() => onSkillsChange([...items, emptyGroup()])}>+ Add skill group</button>

      <div className="section-header" style={{ marginTop: '24px' }}>
        <span className="section-dot" />
        <h2 className="section-title">Languages</h2>
      </div>
      {languages.map((lang, i) => (
        <div key={i} className="list-item">
          <div className="list-item-header">
            <span className="list-item-title">{lang.language || `Language ${i + 1}`}</span>
            <button type="button" className="btn-remove-item" onClick={() => onLanguagesChange(languages.filter((_, li) => li !== i))}>
              Remove
            </button>
          </div>
          <div className="field-row">
            <FormField label="Language"    name="language"    value={lang.language}    onChange={e => onLanguagesChange(languages.map((l, li) => li === i ? { ...l, language:    e.target.value } : l))} />
            <FormField label="Proficiency" name="proficiency" value={lang.proficiency} onChange={e => onLanguagesChange(languages.map((l, li) => li === i ? { ...l, proficiency: e.target.value } : l))} placeholder="Native / Fluent / B2" />
          </div>
        </div>
      ))}
      <button type="button" className="btn-add" onClick={() => onLanguagesChange([...languages, { language: '', proficiency: '' }])}>+ Add language</button>
    </section>
  )
}
