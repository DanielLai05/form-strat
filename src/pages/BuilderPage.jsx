import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { apiFetch } from '../lib/api'
import { createField } from '../lib/fieldTypes'
import BuilderTopbar from '../components/builder/BuilderTopbar'
import FieldPalette from '../components/builder/FieldPalette'
import FormCanvas from '../components/builder/FormCanvas'
import PropertiesPanel from '../components/builder/PropertiesPanel'
import FormRenderer from '../components/form/FormRenderer'
import './BuilderPage.css'

function BuilderPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formId, setFormId] = useState(id || null)
  const [title, setTitle] = useState('Untitled form')
  const [description, setDescription] = useState('')
  const [fields, setFields] = useState([])
  const [published, setPublished] = useState(false)

  const [selectedId, setSelectedId] = useState(null)
  const [mode, setMode] = useState('build')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [previewAnswers, setPreviewAnswers] = useState({})

  // Load existing form when editing.
  useEffect(() => {
    if (!id) return
    apiFetch(`/forms/${id}`, { auth: false })
      .then((res) => {
        const f = res.data
        setTitle(f.title || 'Untitled form')
        setDescription(f.description || '')
        setFields(Array.isArray(f.fields) ? f.fields : [])
        setPublished(Boolean(f.published))
      })
      .catch(() => {})
  }, [id])

  const selectedField = useMemo(
    () => fields.find((f) => f.id === selectedId) || null,
    [fields, selectedId]
  )

  // Any edit clears the "Saved" flag.
  const touch = () => setSaved(false)

  const addField = (type, index) => {
    const field = createField(type)
    setFields((prev) => {
      if (index === undefined || index < 0 || index > prev.length) {
        return [...prev, field]
      }
      const next = [...prev]
      next.splice(index, 0, field)
      return next
    })
    setSelectedId(field.id)
    touch()
  }

  const updateSelected = (patch) => {
    setFields((prev) => prev.map((f) => (f.id === selectedId ? { ...f, ...patch } : f)))
    touch()
  }

  const deleteField = (fieldId) => {
    setFields((prev) => prev.filter((f) => f.id !== fieldId))
    if (selectedId === fieldId) setSelectedId(null)
    touch()
  }

  const duplicateField = (fieldId) => {
    setFields((prev) => {
      const i = prev.findIndex((f) => f.id === fieldId)
      if (i === -1) return prev
      const copy = { ...prev[i], id: createField(prev[i].type).id }
      const next = [...prev]
      next.splice(i + 1, 0, copy)
      return next
    })
    touch()
  }

  const reorder = (from, to) => {
    setFields((prev) => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
    touch()
  }

  const onForm = (patch) => {
    if (patch.title !== undefined) setTitle(patch.title)
    if (patch.description !== undefined) setDescription(patch.description)
    touch()
  }

  const save = async ({ publish = false } = {}) => {
    setSaving(true)
    const nextPublished = publish ? true : published
    const payload = { title, description, fields, published: nextPublished }
    try {
      let res
      if (formId) {
        res = await apiFetch(`/forms/${formId}`, { method: 'PATCH', body: payload })
      } else {
        res = await apiFetch('/forms', { method: 'POST', body: payload })
        setFormId(res.data.id)
        navigate(`/builder/${res.data.id}`, { replace: true })
      }
      if (publish) setPublished(true)
      setSaved(true)
    } catch (err) {
      alert(`Couldn't save: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="builder">
      <BuilderTopbar
        name={title}
        onName={(v) => onForm({ title: v })}
        published={published}
        mode={mode}
        onMode={setMode}
        saving={saving}
        saved={saved}
        onSave={() => save()}
        onPublish={() => save({ publish: true })}
      />

      {mode === 'build' ? (
        <div className="work">
          <FieldPalette onAdd={addField} />
          <FormCanvas
            title={title}
            description={description}
            fields={fields}
            selectedId={selectedId}
            onForm={onForm}
            onSelect={setSelectedId}
            onDuplicate={duplicateField}
            onDelete={deleteField}
            onReorder={reorder}
            onAddField={addField}
          />
          <PropertiesPanel field={selectedField} onChange={updateSelected} />
        </div>
      ) : (
        <section className="canvas-wrap">
          <div className="canvas">
            <div className="form-sheet">
              <div className="sheet-banner"></div>
              <div className="sheet-body">
                <FormRenderer
                  title={title}
                  description={description}
                  fields={fields}
                  answers={previewAnswers}
                  onAnswer={(k, v) => setPreviewAnswers((a) => ({ ...a, [k]: v }))}
                />
                <button className="btn-primary" disabled>Submit (preview)</button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default BuilderPage
