import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { apiFetch } from '../lib/api'
import { createField } from '../lib/fieldTypes'
import { uploadBanner } from '../lib/storage'
import { useAuth } from '../hooks/useAuth'
import BuilderTopbar from '../components/builder/BuilderTopbar'
import FieldPalette from '../components/builder/FieldPalette'
import FormCanvas from '../components/builder/FormCanvas'
import PropertiesPanel from '../components/builder/PropertiesPanel'
import FormRenderer from '../components/form/FormRenderer'
import Toast from '../components/Toast'
import './BuilderPage.css'

const seedField = (f) => {
  const base = createField(f.type)
  return {
    ...base,
    label: f.label || base.label,
    help: f.help || '',
    required: Boolean(f.required),
    ...(Array.isArray(f.options) ? { options: f.options } : {}),
    ...(f.max ? { max: f.max } : {}),
  }
}

function BuilderPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const generated = !id ? location.state?.generated : null

  const [formId, setFormId] = useState(id || null)
  const [title, setTitle] = useState(() => generated?.title || 'Untitled form')
  const [description, setDescription] = useState(() => generated?.description || '')
  const [fields, setFields] = useState(() => (generated?.fields || []).map(seedField))
  const [published, setPublished] = useState(false)
  const [bannerUrl, setBannerUrl] = useState('')

  const [selectedId, setSelectedId] = useState(null)
  const [mode, setMode] = useState('build')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)
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
        setBannerUrl(f.bannerUrl || '')
      })
      .catch(() => {})
  }, [id])

  const selectedField = useMemo(
    () => fields.find((f) => f.id === selectedId) || null,
    [fields, selectedId]
  )

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(''), 2500)
  }

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
    setSelectedId(field.id)  }

  const updateSelected = (patch) => {
    setFields((prev) => prev.map((f) => (f.id === selectedId ? { ...f, ...patch } : f)))  }

  const deleteField = (fieldId) => {
    setFields((prev) => prev.filter((f) => f.id !== fieldId))
    if (selectedId === fieldId) setSelectedId(null)  }

  const duplicateField = (fieldId) => {
    setFields((prev) => {
      const i = prev.findIndex((f) => f.id === fieldId)
      if (i === -1) return prev
      const copy = { ...prev[i], id: createField(prev[i].type).id }
      const next = [...prev]
      next.splice(i + 1, 0, copy)
      return next
    })  }

  const reorder = (from, to) => {
    setFields((prev) => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })  }

  const onForm = (patch) => {
    if (patch.title !== undefined) setTitle(patch.title)
    if (patch.description !== undefined) setDescription(patch.description)  }

  // Persist just the banner immediately (when the form already exists) so the
  // URL lands in the DB without waiting for a full Save. New, unsaved forms get
  // it on their first Save instead.
  const persistBanner = async (url) => {
    if (!formId) {
      return
    }
    try {
      await apiFetch(`/forms/${formId}`, { method: 'PATCH', body: { bannerUrl: url } })
    } catch (err) {
      alert(`Couldn't save banner: ${err.message}`)
    }
  }

  const handleBannerSelect = async (file) => {
    setUploadingBanner(true)
    try {
      const url = await uploadBanner(file, user?.uid)
      setBannerUrl(url)
      await persistBanner(url)
    } catch (err) {
      alert(`Couldn't upload banner: ${err.message}`)
    } finally {
      setUploadingBanner(false)
    }
  }

  const handleBannerRemove = async () => {
    setBannerUrl('')
    await persistBanner('')
  }

  const handleShare = async () => {
    if (!formId) {
      alert('Save the form first to get a shareable link.')
      return
    }
    const url = `${window.location.origin}/form/${formId}`
    try {
      await navigator.clipboard.writeText(url)
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2000)
    } catch {
      window.prompt('Copy this link:', url)
    }
  }

  const save = async ({ publish } = {}) => {
    setSaving(true)
    const nextPublished = publish === undefined ? published : publish
    const payload = { title, description, fields, published: nextPublished, bannerUrl }
    try {
      const isNew = !formId
      let res
      if (formId) {
        res = await apiFetch(`/forms/${formId}`, { method: 'PATCH', body: payload })
      } else {
        res = await apiFetch('/forms', { method: 'POST', body: payload })
        setFormId(res.data.id)
      }
      const savedId = formId || res.data.id
      setPublished(nextPublished)
      showToast(
        publish === true
          ? 'Form published'
          : publish === false
            ? 'Form unpublished'
            : 'Form saved'
      )
      // On publish, the natural next step is sharing — send them to the hub's
      // Share tab. Otherwise a brand-new form just gains its /builder/:id URL.
      if (publish === true) {
        navigate(`/forms/${savedId}?tab=share`)
      } else if (isNew) {
        navigate(`/builder/${res.data.id}`, { replace: true })
      }
    } catch (err) {
      alert(`Couldn't save: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="builder">
      <BuilderTopbar
        backTo={formId ? `/forms/${formId}` : '/forms'}
        name={title}
        onName={(v) => onForm({ title: v })}
        published={published}
        mode={mode}
        onMode={setMode}
        saving={saving}
        onSave={() => save()}
        onShare={handleShare}
        shareCopied={shareCopied}
        onPublish={() => save({ publish: true })}
        onUnpublish={() => save({ publish: false })}
      />

      {mode === 'build' ? (
        <div className="work">
          <FieldPalette onAdd={addField} />
          <FormCanvas
            title={title}
            description={description}
            fields={fields}
            bannerUrl={bannerUrl}
            uploadingBanner={uploadingBanner}
            onBannerSelect={handleBannerSelect}
            onBannerRemove={handleBannerRemove}
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
              <div
                className="sheet-banner"
                style={
                  bannerUrl
                    ? { backgroundImage: `url(${bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                    : undefined
                }
              ></div>
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

      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  )
}

export default BuilderPage
