const features = [
  {
    icon: 'bi-magic',
    title: 'AI Form Generation',
    text: 'Describe the form you need in plain English and let AI build the fields, labels, and options for you in seconds.',
  },
  {
    icon: 'bi-lightbulb',
    title: 'Smart Suggestions',
    text: 'Get intelligent recommendations for extra or improved fields so your forms capture exactly what matters.',
  },
  {
    icon: 'bi-graph-up-arrow',
    title: 'Analytics & Insights',
    text: 'Turn raw responses into clear stats plus an AI-written summary of trends, highlights, and recommendations.',
  },
]

function Features() {
  return (
    <section id="features" className="py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Everything you need to build better forms</h2>
          <p className="text-secondary">From creation to insights — Form Strat does the heavy lifting.</p>
        </div>
        <div className="row g-4">
          {features.map((feature) => (
            <div className="col-md-4" key={feature.title}>
              <div className="card h-100 border-0 shadow-sm feature-card">
                <div className="card-body p-4">
                  <div className="feature-icon mb-3">
                    <i className={`bi ${feature.icon}`}></i>
                  </div>
                  <h5 className="card-title fw-semibold">{feature.title}</h5>
                  <p className="card-text text-secondary mb-0">{feature.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
