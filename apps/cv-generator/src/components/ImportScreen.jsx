import { useState, useRef } from 'react'
import { extractText } from '../utils/extractText'
import { parseWithClaude } from '../utils/parseWithClaude'

const ACCEPT = '.pdf,.docx,.txt'

export default function ImportScreen({ onParsed, onStartBlank }) {
  const [dragging, setDragging] = useState(false)
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const inputRef = useRef(null)

  async function process(file) {
    setStatus('extracting')
    setErrorMsg('')
    try {
      const text = await extractText(file)
      setStatus('parsing')
      const data = await parseWithClaude(text)
      onParsed(data)
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message || 'Something went wrong. Please try again.')
    }
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) process(file)
  }

  function onFileChange(e) {
    const file = e.target.files[0]
    if (file) process(file)
  }

  const busy = status === 'extracting' || status === 'parsing'

  return (
    <div className="import-screen">
      <div className="import-card">

        <div className="import-header">
          <h1 className="import-title">CV Generator</h1>
          <p className="import-sub">Upload your existing CV or LinkedIn export and we'll fill in everything for you — instantly.</p>
        </div>

        <div
          className={`drop-zone${dragging ? ' dragging' : ''}${busy ? ' busy' : ''}`}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => !busy && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            style={{ display: 'none' }}
            onChange={onFileChange}
          />
          {busy ? (
            <div className="drop-loading">
              <div className="spinner" />
              <p>{status === 'extracting' ? 'Reading document…' : 'Parsing with AI…'}</p>
            </div>
          ) : (
            <>
              <div className="drop-icon">📄</div>
              <p className="drop-label">Drop your CV here</p>
              <p className="drop-hint">PDF, Word (.docx) or plain text — or click to browse</p>
            </>
          )}
        </div>

        {status === 'error' && (
          <p className="import-error">{errorMsg}</p>
        )}

        <div className="import-divider"><span>or use LinkedIn</span></div>

        <div className="linkedin-box">
          <p className="linkedin-heading">📋 How to export your LinkedIn PDF</p>
          <div className="linkedin-steps">
            <ol>
              <li>Go to your LinkedIn profile</li>
              <li>Click <strong>More</strong> → <strong>Save to PDF</strong></li>
              <li>Drop that PDF in the box above</li>
            </ol>
          </div>
        </div>

        <button className="btn-blank" onClick={onStartBlank}>
          Start from scratch instead →
        </button>

      </div>
    </div>
  )
}
