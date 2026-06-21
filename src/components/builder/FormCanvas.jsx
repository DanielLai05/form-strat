import { useRef, useState } from 'react'
import CanvasField from './CanvasField'

/** Center canvas: editable title/description + the draggable list of fields. */
function FormCanvas({
  title,
  description,
  fields,
  bannerUrl,
  uploadingBanner,
  onBannerSelect,
  onBannerRemove,
  selectedId,
  onForm,
  onSelect,
  onDuplicate,
  onDelete,
  onReorder,
  onAddField,
}) {
  const dragIndex = useRef(null)
  const [dropActive, setDropActive] = useState(false)

  const makeDragProps = (index) => ({
    draggable: true,
    onDragStart: () => { dragIndex.current = index },
    onDragOver: (e) => e.preventDefault(),
    onDrop: (e) => {
      const newType = e.dataTransfer.getData('application/x-new-field')
      if (newType) {
        // Dropped a palette field onto an existing one -> insert before it.
        onAddField(newType, index)
      } else if (dragIndex.current !== null && dragIndex.current !== index) {
        onReorder(dragIndex.current, index)
      }
      dragIndex.current = null
    },
  })

  const onZoneDrop = (e) => {
    e.preventDefault()
    setDropActive(false)
    const newType = e.dataTransfer.getData('application/x-new-field')
    if (newType) onAddField(newType) // append at end
  }

  return (
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
          >
            <div className="banner-actions">
              <label className="banner-btn">
                <i className="bi bi-image"></i>
                {bannerUrl ? 'Change' : 'Upload banner'}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  disabled={uploadingBanner}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) onBannerSelect(file)
                    e.target.value = ''
                  }}
                />
              </label>
              {bannerUrl && (
                <button className="banner-btn" type="button" onClick={onBannerRemove}>
                  <i className="bi bi-trash"></i>Remove
                </button>
              )}
            </div>
            {uploadingBanner && (
              <div className="banner-uploading">
                <span className="spinner-border spinner-border-sm"></span>Uploading…
              </div>
            )}
          </div>
          <div className="sheet-body">
            <input
              className="sheet-title"
              value={title}
              onChange={(e) => onForm({ title: e.target.value })}
              placeholder="Form title"
            />
            <textarea
              className="sheet-desc"
              rows="2"
              value={description}
              onChange={(e) => onForm({ description: e.target.value })}
              placeholder="Add a description…"
            />

            {fields.map((field, i) => (
              <CanvasField
                key={field.id}
                field={field}
                selected={field.id === selectedId}
                onSelect={onSelect}
                onDuplicate={onDuplicate}
                onDelete={onDelete}
                dragProps={makeDragProps(i)}
              />
            ))}

            {fields.length === 0 && (
              <div className="empty-canvas">
                Your form is empty — drag a field here or click one on the left.
              </div>
            )}

            <div
              className={`dropzone${dropActive ? ' over' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDropActive(true) }}
              onDragLeave={() => setDropActive(false)}
              onDrop={onZoneDrop}
            >
              <i className="bi bi-plus-lg"></i>
              Drag a field here or click one on the left
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FormCanvas
