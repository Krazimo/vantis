import base64, os

docs_path = 'public/documents/divya-villas'

pdfs = {
    'reraCertificate':     'PRMKARERA1268378PR180924007034 Divya Villas RERA Certificate.pdf',
    'reraApplication':     'Divya Villas RERA application.pdf',
    'ecMerged':            'EC from 01042023 to 21112025 Divya Villas-Merged.pdf',
    'ec83':                'EC Sy No. 83 2 01042023 to 21112025.pdf',
    'ec84':                'EC Sy No. 84 2 01042023 to 21112025.pdf',
    'caFundUtilisation':   'Form Ex3 C A Certificate For Fund Utilization Divya Villas-Compressed.pdf',
    'caFundRequired':      'Form Ex 4 C A Certificate For Fund Required Divya Villas-Compressed.pdf',
    'engineerWorkStatus':  'Form Ex5 Engineer Certificate Project Ext Divya Villas.pdf',
    'engineerPendingWork': 'Form Ex6 Engineer Certificate Project Ext Divya Villas.pdf',
    'affidavitExtension':  'Form Ex7 Affidavit for Extension Divya Villas.pdf',
    'formB':               'Form B Affidavit Cum Declaration Divya Villas.pdf',
    'buildingPlan':        'Plan Divya Villas.pdf',
    'cescomNoc':           'Divya Villas CESCOM NOC.pdf',
    'waterNoc':            'Divya Villas Water supply Noc.pdf',
    'supremeCourtOrder':   'Divya Villas Supreme Court Order.pdf',
    'extensionScreenshot': 'Divya Villas RERA Screenshot-01.12.2025 to 23.12.2025-Extension.pdf',
    'feeReceipt':          'RE1225021623111714-RERA Extension fee paid receipt.pdf',
}

lines = []
lines.append('// @ts-nocheck')
lines.append('// Divya Villas PDFs — base64 encoded from real PDF files')
lines.append('')
lines.append('export const divyaVillasPDFs: Record<string, string> = {')

for key, filename in pdfs.items():
    path = os.path.join(docs_path, filename)
    if os.path.exists(path):
        with open(path, 'rb') as f:
            data = base64.b64encode(f.read()).decode('utf-8')
        lines.append('  ' + key + ': "' + data + '",')
        print('OK ' + key + ': ' + str(len(data)//1024) + 'KB')
    else:
        print('MISSING: ' + filename)

lines.append('}')
lines.append('')
lines.append('export function openPDF(key, filename) {')
lines.append('  const base64Data = divyaVillasPDFs[key]')
lines.append('  if (!base64Data) { alert("Document not found: " + key); return }')
lines.append('  try {')
lines.append('    const byteCharacters = atob(base64Data)')
lines.append('    const byteNumbers = new Array(byteCharacters.length)')
lines.append('    for (let i = 0; i < byteCharacters.length; i++) {')
lines.append('      byteNumbers[i] = byteCharacters.charCodeAt(i)')
lines.append('    }')
lines.append('    const byteArray = new Uint8Array(byteNumbers)')
lines.append('    const blob = new Blob([byteArray], { type: "application/pdf" })')
lines.append('    const url = URL.createObjectURL(blob)')
lines.append('    const a = document.createElement("a")')
lines.append('    a.href = url')
lines.append('    a.target = "_blank"')
lines.append('    a.rel = "noopener noreferrer"')
lines.append('    document.body.appendChild(a)')
lines.append('    a.click()')
lines.append('    document.body.removeChild(a)')
lines.append('    setTimeout(() => URL.revokeObjectURL(url), 1000)')
lines.append('  } catch(e) {')
lines.append('    alert("Error: " + e)')
lines.append('  }')
lines.append('}')

with open('lib/divya-villas-pdfs.ts', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print('Done — lib/divya-villas-pdfs.ts regenerated from real PDFs')