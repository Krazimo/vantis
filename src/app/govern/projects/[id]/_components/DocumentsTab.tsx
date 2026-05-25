'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FileText, FileX, CheckCircle, ExternalLink } from 'lucide-react'

interface DocModules {
  openPDF: (key: string, filename: string) => void
  openImage: (key: string, filename: string) => void
  divyaVillasImages: Record<string, string>
}

interface Props { projectId: string }

function DocRow({ name, onView }: { name: string; onView: () => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border last:border-b-0">
      <div className="flex items-center gap-3 min-w-0">
        <FileText className="w-4 h-4 text-gray shrink-0" />
        <span className="text-off-white text-sm truncate">{name}</span>
      </div>
      <button onClick={onView} className="flex items-center gap-1 text-xs text-gold hover:text-gold-light transition-colors duration-150 shrink-0 ml-3">
        View <ExternalLink className="w-3 h-3" />
      </button>
    </div>
  )
}

function DocSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] text-gray uppercase tracking-widest font-semibold mb-3">{title}</div>
      <div className="border border-border rounded-sm overflow-hidden">{children}</div>
    </div>
  )
}

const PHOTO_KEYS = ['road1', 'road2', 'road3', 'site1', 'site2', 'road4', 'site3', 'drain', 'layout1', 'park', 'layout2', 'borewell', 'streetLight'] as const

export default function DocumentsTab({ projectId }: Props) {
  const [docModules, setDocModules] = useState<DocModules | null>(null)

  useEffect(() => {
    if (projectId !== 'divya-villas' || docModules) return
    Promise.all([
      import('@/lib/divya-villas-pdfs'),
      import('@/lib/divya-villas-images'),
    ]).then(([pdfs, images]) => {
      setDocModules({ openPDF: pdfs.openPDF, openImage: images.openImage, divyaVillasImages: images.divyaVillasImages })
    })
  }, [projectId, docModules])

  if (projectId !== 'divya-villas') {
    return (
      <div className="bg-surface border border-border rounded-sm p-8 text-center">
        <FileX className="w-8 h-8 text-gray mx-auto mb-3" />
        <div className="text-gray text-sm">No documents uploaded yet.</div>
      </div>
    )
  }

  if (!docModules) {
    return <div className="text-gray text-sm p-4">Loading documents...</div>
  }

  const { openPDF, openImage, divyaVillasImages } = docModules

  return (
    <div className="space-y-6">
      <div className="bg-green/10 border border-green/20 rounded-sm px-4 py-3 flex items-center gap-3">
        <CheckCircle className="w-4 h-4 text-green shrink-0" />
        <span className="text-green text-sm font-medium">All required documents submitted — 29 documents across 6 categories.</span>
      </div>

      <DocSection title="Registration Documents">
        <DocRow name="Project Application Form"                onView={() => openPDF('reraApplication', 'Divya_Villas_RERA_application.pdf')} />
        <DocRow name="Title Documents — Survey 83/2 and 84/2" onView={() => openPDF('ecMerged', 'EC_Divya_Villas_Merged.pdf')} />
        <DocRow name="CA Certificate — Project Cost"           onView={() => openPDF('caFundUtilisation', 'Form_Ex3_CA_Certificate.pdf')} />
        <DocRow name="Engineer Certificate — Land Area"        onView={() => openPDF('engineerWorkStatus', 'Form_Ex5_Engineer_Certificate.pdf')} />
        <DocRow name="Sanctioned Building Plan"                onView={() => openPDF('buildingPlan', 'Plan_Divya_Villas.pdf')} />
        <DocRow name="Encumbrance Certificate Survey 83/2"     onView={() => openPDF('ec83', 'EC_Survey_83_2.pdf')} />
        <DocRow name="Encumbrance Certificate Survey 84/2"     onView={() => openPDF('ec84', 'EC_Survey_84_2.pdf')} />
        <DocRow name="Registration Fee Receipt"                onView={() => openPDF('feeReceipt', 'RERA_Extension_fee_receipt.pdf')} />
      </DocSection>

      <DocSection title="QPR Supporting Documents — Q4 2025">
        <DocRow name="CA Certificate — Fund Utilisation Form Ex3"   onView={() => openPDF('caFundUtilisation', 'Form_Ex3_CA_Fund_Utilisation.pdf')} />
        <DocRow name="CA Certificate — Fund Required Form Ex4"      onView={() => openPDF('caFundRequired', 'Form_Ex4_CA_Fund_Required.pdf')} />
        <DocRow name="Engineer Certificate — Work Status Form Ex5"  onView={() => openPDF('engineerWorkStatus', 'Form_Ex5_Engineer_Work_Status.pdf')} />
        <DocRow name="Engineer Certificate — Pending Work Form Ex6" onView={() => openPDF('engineerPendingWork', 'Form_Ex6_Engineer_Pending_Work.pdf')} />
      </DocSection>

      <DocSection title="Extension Documents">
        <DocRow name="Affidavit for Extension Form Ex7" onView={() => openPDF('affidavitExtension', 'Form_Ex7_Affidavit.pdf')} />
        <DocRow name="Form B Affidavit Declaration"     onView={() => openPDF('formB', 'Form_B_Affidavit_Declaration.pdf')} />
        <DocRow name="Extension Application"            onView={() => openPDF('extensionScreenshot', 'RERA_Extension_Screenshot.pdf')} />
        <DocRow name="Supreme Court Order"              onView={() => openPDF('supremeCourtOrder', 'Supreme_Court_Order.pdf')} />
      </DocSection>

      <DocSection title="NOCs and Approvals">
        <DocRow name="CESCOM NOC"           onView={() => openPDF('cescomNoc', 'CESCOM_NOC.pdf')} />
        <DocRow name="Water Supply NOC"     onView={() => openPDF('waterNoc', 'Water_Supply_NOC.pdf')} />
        <DocRow name="Bank Account Details" onView={() => openImage('bankAccount', 'Bank_Account.jpeg')} />
      </DocSection>

      <div>
        <div className="text-[10px] text-gray uppercase tracking-widest font-semibold mb-3">Site Progress Photos</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PHOTO_KEYS.map(key => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={key}
              src={divyaVillasImages[key]}
              alt={key}
              className="w-full h-24 object-cover rounded-sm cursor-pointer border border-border hover:border-gold/50 transition-colors duration-150"
              onClick={() => openImage(key, `${key}.jpeg`)}
            />
          ))}
        </div>
      </div>

      <DocSection title="Certificates">
        <DocRow name="RERA Registration Certificate" onView={() => openPDF('reraCertificate', 'Divya_Villas_RERA_Certificate.pdf')} />
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <FileText className="w-4 h-4 text-gray shrink-0" />
            <span className="text-off-white text-sm truncate">Vantis Compliance Certificate</span>
          </div>
          <Link href="/certificate/VG-2026-007034-0001" className="flex items-center gap-1 text-xs text-gold hover:text-gold-light transition-colors duration-150 shrink-0 ml-3">
            View <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </DocSection>
    </div>
  )
}
