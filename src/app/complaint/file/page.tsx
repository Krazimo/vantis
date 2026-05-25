'use client'

import { useState } from 'react'
import { TX, generateRef, type Language, type Step, type Project } from './_data/file-complaint.data'
import ComplaintHeader from './_components/ComplaintHeader'
import StepIndicator from './_components/StepIndicator'
import Step1Form from './_components/Step1Form'
import Step2Form from './_components/Step2Form'
import Step3Form from './_components/Step3Form'
import SuccessScreen from './_components/SuccessScreen'

export default function FileComplaint() {
  const [lang, setLang] = useState<Language>('en')
  const [step, setStep] = useState<Step>(1)
  const [ref] = useState(generateRef)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [nature, setNature] = useState('')
  const tx = TX[lang]

  const steps = [tx.step1, tx.step2, tx.step3]
  const currentStepNum = step === 'success' ? 3 : (step as number)

  if (step === 'success') {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <ComplaintHeader lang={lang} setLang={setLang} tx={tx} />
        <SuccessScreen lang={lang} tx={tx} ref={ref} selectedProject={selectedProject} nature={nature} />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <ComplaintHeader lang={lang} setLang={setLang} tx={tx} />
      <div className="flex-1 px-5 py-8 max-w-lg mx-auto w-full">
        <StepIndicator steps={steps} currentStep={currentStepNum} />
        {step === 1 && (
          <Step1Form lang={lang} tx={tx} onNext={() => setStep(2)} />
        )}
        {step === 2 && (
          <Step2Form
            lang={lang}
            tx={tx}
            onNext={(project, nat) => { setSelectedProject(project); setNature(nat); setStep(3) }}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <Step3Form lang={lang} tx={tx} onNext={() => setStep('success')} onBack={() => setStep(2)} />
        )}
      </div>
    </main>
  )
}
