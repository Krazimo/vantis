import { VIOLATION_TYPES, TODAY_DISPLAY, NOTICE_NUMBER_BASE } from './notices.data'
import type { NoticeProject, ViolationValue } from './notices.data'

const FOOTER = `By order of the Authority,\n\nKarnataka Real Estate Regulatory Authority\n5th Floor, TTMC Building, Shivajinagar\nBengaluru – 560 001`

export function noticeMeta(projectId: string, violationType: string): string {
  const y = new Date('2026-05-13').getFullYear()
  const code = violationType.toUpperCase().slice(0, 3)
  return `${NOTICE_NUMBER_BASE}/${y}/${code}/${projectId.toUpperCase().slice(0, 4)}/001`
}

export function generateNoticeText(project: NoticeProject, violationType: ViolationValue, lang: 'en' | 'kn'): string {
  const ref = noticeMeta(project.id, violationType)
  const section = VIOLATION_TYPES.find(v => v.value === violationType)?.section ?? 'Section 64'
  const header = (title: string) => `Ref No: ${ref}\nDate: ${TODAY_DISPLAY}\n\n${title}\n${section} — Real Estate (Regulation and Development) Act, 2016\n\nTo,\nM/s ${project.developer_name}\n${project.location}\n\nRegistration No.: ${project.rera}\nProject Name: ${project.name}\n\n`

  if (lang === 'kn' && project.id === 'ozone-urbana' && violationType === 'qpr_default') {
    return `ಕ್ರಮ ಸಂಖ್ಯೆ: ${ref}\nದಿನಾಂಕ: ${TODAY_DISPLAY}\n\nಕಾರಣ ತೋರಿಸಿ ನೋಟೀಸ್\nನಿಯಮ 63 — ರಿಯಲ್ ಎಸ್ಟೇಟ್ (ನಿಯಂತ್ರಣ ಮತ್ತು ಅಭಿವೃದ್ಧಿ) ಕಾಯ್ದೆ 2016\n\nಗೆ,\nಮೆ/ಸ ಓಝೋನ್ ಗ್ರೂಪ್, ಬೆಂಗಳೂರು\n\nನೋಂದಣಿ: PRM/KA/RERA/1251/309/PR/170517/004521\nಯೋಜನೆ: ಓಝೋನ್ ಅರ್ಬಾನಾ\n\nಈ ಮೇರೆಗೆ ನಿಮ್ಮನ್ನು ತಿಳಿಸಲಾಗುತ್ತಿದೆ: RERA ಕಾಯ್ದೆ 2016 ರ ಸೆಕ್ಷನ್ 11(1) ಮತ್ತು ಕರ್ನಾಟಕ RERA ನಿಯಮಗಳ ನಿಯಮ 15 ರ ಪ್ರಕಾರ 5 ಸತತ ತ್ರೈಮಾಸಿಕ ಪ್ರಗತಿ ವರದಿಗಳನ್ನು ಸಲ್ಲಿಸಲು ವಿಫಲವಾಗಿದ್ದೀರಿ.\n\nಒಟ್ಟು ದಂಡ: ₹45,75,000\n\n21 ದಿನಗಳಲ್ಲಿ ಕಾರಣ ತೋರಿಸಿ.\n\nಪ್ರಾಧಿಕಾರದ ಆದೇಶದಂತೆ,\nಕರ್ನಾಟಕ ರಿಯಲ್ ಎಸ್ಟೇಟ್ ನಿಯಂತ್ರಣ ಪ್ರಾಧಿಕಾರ`
  }

  if (violationType === 'qpr_default') {
    const isOzone = project.id === 'ozone-urbana'
    const missedCount = isOzone ? 5 : project.id === 'skylark-arcadia' ? 1 : 3
    const penaltyDays = isOzone ? 1830 : missedCount * 90
    const penaltyAmt = isOzone ? 'Rs.45,75,000' : `Rs.${(penaltyDays * 25000).toLocaleString('en-IN')}`
    return header('SHOW CAUSE NOTICE') +
      `WHEREAS you have failed to submit Quarterly Progress Reports for ${missedCount} consecutive quarter${missedCount > 1 ? 's' : ''} in violation of Section 11(1) of the Real Estate (Regulation and Development) Act 2016 and Rule 15 of the Karnataka Real Estate (Regulation and Development) Rules, 2017.\n\n` +
      `WHEREAS ${section} of the Act provides for a penalty of Rs.25,000 per day for each day of default after the due date.\n\n` +
      `WHEREAS the total penalty accrued as of ${TODAY_DISPLAY} is calculated as follows:\n  — Applicable penalty rate: Rs.25,000 per day\n  — Number of days of default: ${penaltyDays} days\n  — Total penalty accrued: ${penaltyAmt}\n\n` +
      `YOU ARE HEREBY DIRECTED to show cause in writing within 21 days of receipt of this notice as to why penalty proceedings should not be initiated against you under the provisions of the Act.\n\nFailure to respond within the stipulated time shall be treated as an admission of the default, and penalty proceedings shall be initiated without further notice.\n\n` + FOOTER
  }

  if (violationType === 'registration') {
    return header('NOTICE FOR VIOLATION OF REGISTRATION CONDITIONS') +
      `WHEREAS it has been brought to the notice of this Authority that you have violated the conditions stipulated at the time of registration of the above project under ${section} of the Act.\n\nWHEREAS the observed violation relates to material non-compliance with the approved project plan and registration undertakings filed at the time of project registration.\n\n` +
      `YOU ARE HEREBY DIRECTED to show cause within 21 days as to why action should not be taken including revocation of registration under ${section} of the Act.\n\n` + FOOTER
  }

  if (violationType === 'false_info') {
    return header('NOTICE FOR FURNISHING FALSE INFORMATION') +
      `WHEREAS this Authority has reason to believe that you have willfully furnished false information or made a false statement in the documents / declarations submitted to the Authority in relation to the above project.\n\nWHEREAS ${section} of the Act provides for imprisonment up to one year or fine up to 10% of the estimated cost of the project, or both, for such violation.\n\n` +
      `YOU ARE HEREBY DIRECTED to submit your written response within 21 days of receipt of this notice. Produce all original documents and records pertaining to the project for verification before this Authority.\n\n` + FOOTER
  }

  if (violationType === 'unregistered') {
    return `Ref No: ${ref}\nDate: ${TODAY_DISPLAY}\n\nNOTICE FOR OPERATING WITHOUT VALID REGISTRATION\n${section} — Real Estate (Regulation and Development) Act, 2016\n\nTo,\nM/s ${project.developer_name}\n${project.location}\n\nSubject: Activities conducted in relation to ${project.name} without / beyond valid RERA registration.\n\n` +
      `WHEREAS it has been observed that certain activities pertaining to the above-named project are being carried out without a valid registration, or beyond the scope of the existing registration, in contravention of Section 3 of the Real Estate (Regulation and Development) Act, 2016.\n\nWHEREAS ${section} of the Act provides for penalty up to 10% of the estimated cost of the real estate project for such violation.\n\n` +
      `YOU ARE HEREBY DIRECTED to immediately cease all marketing, booking and sale activities and show cause within 21 days as to why penalty should not be imposed.\n\n` + FOOTER
  }

  return header('REGULATORY COMPLIANCE NOTICE') +
    `WHEREAS this Authority has observed regulatory non-compliance in the above project requiring your immediate attention and response.\n\n` +
    `YOU ARE HEREBY DIRECTED to appear before this Authority and submit a written explanation within 21 days of receipt of this notice, failing which this Authority shall proceed ex parte.\n\n` + FOOTER
}
