import FormField from './FormField'

export default function PersonalInfo({ data, onChange }) {
  function handle(e) {
    onChange({ ...data, [e.target.name]: e.target.value })
  }
  return (
    <section className="form-section">
      <div className="section-header">
        <span className="section-dot" />
        <h2 className="section-title">Personal Information</h2>
      </div>
      <div className="field-row">
        <FormField label="First name" name="firstName" value={data.firstName} onChange={handle} />
        <FormField label="Last name"  name="lastName"  value={data.lastName}  onChange={handle} />
      </div>
      <div className="field-row">
        <FormField label="Job title" name="title" value={data.title} onChange={handle} placeholder="e.g. Senior Consultant" />
      </div>
      <div className="field-row">
        <FormField label="Email"    name="email"    value={data.email}    onChange={handle} />
        <FormField label="Phone"    name="phone"    value={data.phone}    onChange={handle} />
      </div>
      <div className="field-row">
        <FormField label="Location" name="location" value={data.location} onChange={handle} />
        <FormField label="LinkedIn" name="linkedin" value={data.linkedin} onChange={handle} placeholder="linkedin.com/in/..." />
      </div>
      <FormField label="Professional summary" name="summary" value={data.summary} onChange={handle} multiline />
    </section>
  )
}
