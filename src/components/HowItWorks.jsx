const steps = [
  { num: '1', title: 'Describe', text: 'Tell Form Strat what you want to collect.' },
  { num: '2', title: 'Customize', text: 'Tweak the generated fields to fit your needs.' },
  { num: '3', title: 'Analyze', text: 'Share it, collect responses, and read the insights.' },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-5 bg-light">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold">How it works</h2>
          <p className="text-secondary">Three simple steps from idea to insights.</p>
        </div>
        <div className="row g-4 text-center">
          {steps.map((step) => (
            <div className="col-md-4" key={step.num}>
              <div className="step-number mx-auto mb-3">{step.num}</div>
              <h5 className="fw-semibold">{step.title}</h5>
              <p className="text-secondary mb-0">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
