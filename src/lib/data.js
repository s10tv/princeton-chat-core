import _ from 'underscore'

export const domains = [
  'alumni.princeton.edu',
  'princeton.edu'
]

export const classYears = _.range(1912, 2022).reverse().map((year) => `${year}`)

export const affiliationTypes = [
  { value: 'student', label: 'Student' },
  { value: 'alum', label: 'Alumni' },
  { value: 'faculty', label: 'Faculty / Staff' }
]

export const degrees = [
  { value: 'ND', label: '(No Degree Known) No Degree Known' },
  { value: 'AA', label: '(AA) Associate of Arts' },
  { value: 'AB', label: '(AB) Bachelor of Arts' },
  { value: 'AM', label: '(AM) Master of Arts' },
  { value: '16', label: '(BLET) Bachelor of Letters' },
  { value: 'BNS', label: '(BNS) Bachelor of Naval Science' },
  { value: 'BS', label: '(BS) Bachelor of Science' },
  { value: '06', label: '(BSE) Bachelor of Sci. in Engr' },
  { value: '46', label: '(BSME) Bachelor of Sci./Mech. Engr' },
  { value: 'CE', label: '(CE) Civil Engineer' },
  { value: '08', label: '(CHE) Chemical Engineer' },
  { value: '32', label: '(DD) Doctor of Divinity' },
  { value: '33', label: '(DE) Doctor of Engineering' },
  { value: '11', label: '(DFA) Doctor of Fine Arts' },
  { value: '12', label: '(DSC) Doctor of Science' },
  { value: 'EE', label: '(EE) Electrical Engineer' },
  { value: '18', label: '(LLD) Doctor of Laws' },
  { value: 'MFN', label: '(M.Fin) Masters of Finance' },
  { value: 'MA', label: '(MA) Master of Arts' },
  { value: '19', label: '(MARC) Master of Architecture' },
  { value: '20', label: '(MAUP) Master of Arch. & Urb. Plan' },
  { value: '22', label: '(MFA) Master of Fine Arts' },
  { value: '23', label: '(MNES) Master in Near Eastern Studies' },
  { value: '01', label: '(MNG) Master in Engineering' },
  { value: '24', label: '(MPA) Master in Public Affairs' },
  { value: '25', label: '(MPA-URP) M./Pub Affrs/Urb/Reg Plan' },
  { value: '35', label: '(MPA/JD) Master Public Aff.&Juris Dr' },
  { value: '36', label: '(MPA/MBA) Master/Public Aff.&Master/BusAdmin' },
  { value: '38', label: '(MPAUP) Master/Pub.Aff.&Urban Plan' },
  { value: 'MP', label: '(MPP) Master of Public Policy' },
  { value: 'MS', label: '(MS) Master of Science' },
  { value: '27', label: '(MSE) Master of Sci./Engineering' },
  { value: 'MSE', label: '(MSE) Master in Special Education' },
  { value: '28', label: '(MUP) Master in Urban Planning' },
  { value: '30', label: '(PHD) Doctor of Philosophy' }
]
