// The shape of all CV data flowing through the app.
// Both the form and the renderers (PDF + DOCX) consume this structure.

export const emptyCvData = {
  personal: {
    firstName: '',
    lastName: '',
    title: '',          // e.g. "Senior Consultant"
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    summary: '',        // short professional bio
  },
  experience: [
    // {
    //   company: '',
    //   role: '',
    //   startDate: '',  // e.g. "Jan 2021"
    //   endDate: '',    // e.g. "Present"
    //   location: '',
    //   bullets: [''],  // list of achievements / responsibilities
    // }
  ],
  education: [
    // {
    //   institution: '',
    //   degree: '',
    //   field: '',
    //   startDate: '',
    //   endDate: '',
    // }
  ],
  skills: [
    // {
    //   category: '',   // e.g. "Languages", "Tools", "Frameworks"
    //   items: [''],
    // }
  ],
  languages: [
    // { language: '', proficiency: '' }  // e.g. "Norwegian", "Native"
  ],
  certifications: [
    // { name: '', issuer: '', year: '' }
  ],
}
