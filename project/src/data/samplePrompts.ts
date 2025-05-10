// Sample data for prompts
export const samplePrompts = [
  {
    id: '1',
    title: 'SOAP Note Template for Primary Care',
    description: 'Comprehensive SOAP note template for primary care visits, with structured sections for subjective, objective, assessment, and plan information.',
    content: `Create a comprehensive SOAP note for a primary care visit with the following details:

PATIENT INFORMATION:
- [AGE] year-old [GENDER]
- Chief Complaint: [CHIEF_COMPLAINT]
- Vitals: [VITALS]

SUBJECTIVE:
- History of Present Illness (HPI):
  * Onset and duration
  * Quality and severity
  * Associated symptoms
  * Aggravating/alleviating factors
  * Prior treatments attempted
- Review of Systems (ROS): [RELEVANT_SYSTEMS]
- Past Medical History (PMH): [RELEVANT_PMH]
- Medications: [CURRENT_MEDICATIONS]
- Allergies: [ALLERGIES]
- Social History: [RELEVANT_SOCIAL_HISTORY]
- Family History: [RELEVANT_FAMILY_HISTORY]

OBJECTIVE:
- Physical Examination:
  * General appearance
  * Vital signs
  * [RELEVANT_BODY_SYSTEMS] examination
- Laboratory/Diagnostic Results: [LAB_RESULTS]

ASSESSMENT:
- Primary diagnosis with ICD-10 code
- Differential diagnoses with rationale
- Clinical reasoning

PLAN:
- Diagnostic: Additional tests or referrals
- Therapeutic: Medications with dosage, frequency, and duration
- Patient education provided
- Follow-up recommendations
- Preventive measures addressed`,
    category: 'Documentation',
    specialty: 'Internal Medicine',
    compatibleTools: ['GPT-4', 'Claude', 'Gemini'],
    author: {
      id: 'user123',
      name: 'Dr. Jane Doe',
      type: 'Clinician',
      avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    createdAt: '2024-06-01T12:00:00Z',
    rating: 4.8,
    ratingCount: 45,
    usageCount: 528,
    featured: true,
    comments: [
      {
        id: 'c1',
        author: {
          id: 'user456',
          name: 'Dr. Mark Johnson',
          type: 'Clinician',
          avatar: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        },
        text: 'This template has saved me so much time during my clinic days. The structured format ensures I don\'t miss any important details.',
        createdAt: '2024-06-05T15:30:00Z',
      },
      {
        id: 'c2',
        author: {
          id: 'user789',
          name: 'Sarah Williams',
          type: 'Administrator',
          avatar: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        },
        text: 'I\'ve been using this for the past month and my documentation quality has improved significantly. Highly recommended!',
        createdAt: '2024-06-10T09:15:00Z',
      },
    ],
  },
  {
    id: '2',
    title: 'Differential Diagnosis Generator for Chest Pain',
    description: 'Generate comprehensive differential diagnoses for patients presenting with chest pain, organized by system and probability.',
    content: `Based on the following patient information, generate a comprehensive differential diagnosis for chest pain, organized by body system and probability (high, medium, low). For each diagnosis, include key supporting features from the case and diagnostic next steps.

PATIENT INFORMATION:
- Age: [AGE] years
- Sex: [SEX]
- Chest Pain Characteristics:
  * Location: [LOCATION]
  * Quality: [QUALITY]
  * Duration: [DURATION]
  * Onset: [ONSET]
  * Radiation: [RADIATION]
  * Alleviating/aggravating factors: [FACTORS]
- Associated Symptoms: [ASSOCIATED_SYMPTOMS]
- Past Medical History: [PMH]
- Medications: [MEDICATIONS]
- Family History: [FAMILY_HISTORY]
- Social History: [SOCIAL_HISTORY]
- Vitals: [VITALS]
- Physical Examination Findings: [EXAM_FINDINGS]
- ECG Results (if available): [ECG_RESULTS]
- Laboratory Results (if available): [LAB_RESULTS]

FORMAT YOUR RESPONSE AS FOLLOWS:

CARDIOVASCULAR ETIOLOGIES:
- High Probability:
  * [Diagnoses, supporting features, next steps]
- Medium Probability:
  * [Diagnoses, supporting features, next steps]
- Low Probability:
  * [Diagnoses, supporting features, next steps]

PULMONARY ETIOLOGIES:
- High Probability:
  * [Diagnoses, supporting features, next steps]
- Medium Probability:
  * [Diagnoses, supporting features, next steps]
- Low Probability:
  * [Diagnoses, supporting features, next steps]

GASTROINTESTINAL ETIOLOGIES:
- High Probability:
  * [Diagnoses, supporting features, next steps]
- Medium Probability:
  * [Diagnoses, supporting features, next steps]
- Low Probability:
  * [Diagnoses, supporting features, next steps]

MUSCULOSKELETAL ETIOLOGIES:
- High Probability:
  * [Diagnoses, supporting features, next steps]
- Medium Probability:
  * [Diagnoses, supporting features, next steps]
- Low Probability:
  * [Diagnoses, supporting features, next steps]

PSYCHIATRIC ETIOLOGIES:
- High Probability:
  * [Diagnoses, supporting features, next steps]
- Medium Probability:
  * [Diagnoses, supporting features, next steps]
- Low Probability:
  * [Diagnoses, supporting features, next steps]

OTHER ETIOLOGIES:
- [Any other relevant diagnoses not captured above]

RECOMMENDED IMMEDIATE NEXT STEPS:
- [List in order of priority]`,
    category: 'Diagnosis Support',
    specialty: 'Cardiology',
    compatibleTools: ['GPT-4', 'Claude', 'Gemini', 'Med-PaLM'],
    author: {
      id: 'user456',
      name: 'Dr. Mark Johnson',
      type: 'Clinician',
      avatar: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    createdAt: '2024-05-15T09:30:00Z',
    rating: 4.9,
    ratingCount: 78,
    usageCount: 892,
    featured: true,
    comments: [
      {
        id: 'c3',
        author: {
          id: 'user123',
          name: 'Dr. Jane Doe',
          type: 'Clinician',
          avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        },
        text: 'This has been a lifesaver in the ER. The organization by probability helps quickly prioritize what needs to be ruled out first.',
        createdAt: '2024-05-20T14:45:00Z',
      },
      {
        id: 'c4',
        author: {
          id: 'user789',
          name: 'Sarah Williams',
          type: 'Administrator',
          avatar: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        },
        text: 'Excellent resource for teaching residents about the approach to chest pain. I particularly like the inclusion of next steps for each diagnosis.',
        createdAt: '2024-05-22T11:20:00Z',
      },
    ],
  },
  {
    id: '3',
    title: 'Patient Education Template for New Medications',
    description: 'Generate clear, patient-friendly explanations of medications, including benefits, side effects, and important instructions.',
    content: `Create a patient-friendly explanation of [MEDICATION_NAME] that can be used for patient education. The patient is [AGE] years old with [RELEVANT_MEDICAL_CONDITIONS] and an education level of [EDUCATION_LEVEL].

FORMAT YOUR RESPONSE WITH THE FOLLOWING SECTIONS:

MEDICATION OVERVIEW:
- Simple explanation of what [MEDICATION_NAME] is
- What condition(s) it treats and how it works using simple analogies
- Why this medication was chosen for the patient

HOW TO TAKE THIS MEDICATION:
- Dosage, frequency, and timing
- With or without food
- Any special instructions (crushing, splitting, etc.)
- What to do if a dose is missed

IMPORTANT BENEFITS:
- Primary benefits explained in patient-friendly terms
- Expected timeline for when benefits might be noticed
- How this medication helps manage their specific condition

POTENTIAL SIDE EFFECTS:
- Common side effects (explain likelihood with words, not percentages)
- Rare but serious side effects that require immediate attention
- Specific side effects this patient should watch for based on their medical history

IMPORTANT WARNINGS:
- Interactions with other medications they take
- Foods, activities, or substances to avoid
- When to contact the doctor immediately

MONITORING AND FOLLOW-UP:
- Tests or monitoring needed while on this medication
- When to follow up with the doctor
- Signs that the medication is working effectively

Use simple language (6th-8th grade reading level), avoid medical jargon, and use bullet points for readability. Include analogies where helpful to explain complex concepts.`,
    category: 'Patient Education',
    specialty: 'Internal Medicine',
    compatibleTools: ['GPT-4', 'Claude', 'Gemini', 'LLaMA'],
    author: {
      id: 'user789',
      name: 'Sarah Williams',
      type: 'Administrator',
      avatar: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    createdAt: '2024-05-28T14:15:00Z',
    rating: 4.7,
    ratingCount: 62,
    usageCount: 735,
    featured: true,
    comments: [
      {
        id: 'c6',
        author: {
          id: 'user456',
          name: 'Dr. Mark Johnson',
          type: 'Clinician',
          avatar: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        },
        text: 'My patients love these explanations. They\'re much more comprehensive than the standard medication handouts.',
        createdAt: '2024-06-02T10:15:00Z',
      },
    ],
  },
  {
    id: '4',
    title: 'Psychiatric Assessment Template',
    description: 'Comprehensive psychiatric assessment template with all essential elements for initial evaluation and follow-up visits.',
    content: `Create a comprehensive psychiatric assessment for a [AGE] year-old [GENDER] patient presenting with [CHIEF_COMPLAINT]. Use the following format:

IDENTIFYING INFORMATION:
- Patient demographics
- Date and time of assessment 
- Referral source

CHIEF COMPLAINT:
- Document in patient's own words when possible

HISTORY OF PRESENT ILLNESS:
- Detailed chronological development of symptoms
- Onset, duration, and progression
- Contextual factors and stressors
- Previous episodes and treatments
- Impact on functioning (work, social, self-care)

PSYCHIATRIC HISTORY:
- Previous diagnoses
- Hospitalizations and outpatient treatment
- Medication trials and responses
- History of self-harm or suicide attempts
- History of violence or aggression

SUBSTANCE USE HISTORY:
- Current and past substance use
- Patterns of use, amounts, frequency
- Periods of sobriety
- Treatment attempts
- Last use of each substance

MEDICAL HISTORY:
- Relevant medical conditions
- Current medications
- Allergies
- Recent physical health changes

FAMILY HISTORY:
- Psychiatric disorders in family members
- Family dynamics and relationships
- Relevant medical conditions

DEVELOPMENTAL HISTORY:
- Prenatal/birth complications
- Developmental milestones
- Early childhood experiences
- Educational history
- Occupational history
- Relationship history

SOCIAL HISTORY:
- Current living situation
- Support systems
- Employment/financial status
- Legal issues
- Cultural factors

MENTAL STATUS EXAMINATION:
- Appearance and behavior
- Speech
- Mood and affect
- Thought process and content
- Perceptual disturbances
- Cognitive functioning
- Insight and judgment

RISK ASSESSMENT:
- Suicidal ideation, plan, intent
- Homicidal ideation
- Self-harm behaviors
- Violence risk factors

DIAGNOSTIC FORMULATION:
- DSM-5 diagnoses (including codes)
- Rule-out diagnoses
- Differential diagnoses
- Case formulation with biopsychosocial perspective

TREATMENT PLAN:
- Immediate safety planning
- Psychopharmacological interventions
- Psychotherapeutic approaches
- Level of care recommendations
- Consultations and referrals
- Follow-up planning`,
    category: 'Documentation',
    specialty: 'Psychiatry',
    compatibleTools: ['GPT-4', 'Claude', 'Gemini'],
    author: {
      id: 'user321',
      name: 'Dr. Robert Chen',
      type: 'Clinician',
      avatar: 'https://images.pexels.com/photos/5327964/pexels-photo-5327964.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    createdAt: '2024-05-10T11:30:00Z',
    rating: 4.6,
    ratingCount: 38,
    usageCount: 412,
    featured: false,
    comments: [],
  },
  {
    id: '5',
    title: 'Radiology Report Template for Chest X-Ray',
    description: 'Structured template for comprehensive chest X-ray reporting, covering all relevant anatomical structures and findings.',
    content: `Generate a comprehensive radiology report for a chest X-ray based on the following findings and clinical information:

CLINICAL INFORMATION:
- Patient: [AGE] year-old [GENDER]
- Indication: [INDICATION]
- Relevant History: [RELEVANT_HISTORY]
- Comparison: [PREVIOUS_STUDIES]

TECHNIQUE:
- [PA/AP] and lateral chest radiographs obtained on [DATE]
- Technical quality: [QUALITY]

FINDINGS:

LUNGS:
- Aeration and volume: [FINDINGS]
- Opacities or infiltrates: [FINDINGS]
- Nodules or masses: [FINDINGS]
- Interstitial patterns: [FINDINGS]

PLEURA:
- Effusions: [FINDINGS]
- Pneumothorax: [FINDINGS]
- Thickening: [FINDINGS]

HEART:
- Size (cardiothoracic ratio): [FINDINGS]
- Contour: [FINDINGS]
- Pericardial effusion: [FINDINGS]

MEDIASTINUM:
- Width: [FINDINGS]
- Air or mass: [FINDINGS]
- Hilar contours: [FINDINGS]

BONES:
- Ribs: [FINDINGS]
- Spine: [FINDINGS]
- Shoulder girdles: [FINDINGS]

SOFT TISSUES:
- Subcutaneous emphysema: [FINDINGS]
- Breast shadows: [FINDINGS]
- Other: [FINDINGS]

LINES AND TUBES (if present):
- Endotracheal tube: [FINDINGS]
- Central venous catheter: [FINDINGS]
- Chest tube: [FINDINGS]
- Other devices: [FINDINGS]

UPPER ABDOMEN (visualized portion):
- [FINDINGS]

IMPRESSION:
1. [PRIMARY_FINDING]
2. [SECONDARY_FINDING]
3. [ADDITIONAL_FINDINGS]

RECOMMENDATIONS:
- [RECOMMENDATIONS]

Format the report professionally as would be seen in a radiology information system. Use appropriate radiological terminology while maintaining clarity. For normal findings, use concise language. For abnormal findings, provide descriptions including location, size, characteristics, and clinical significance where appropriate.`,
    category: 'Documentation',
    specialty: 'Radiology',
    compatibleTools: ['GPT-4', 'Claude', 'Med-PaLM'],
    author: {
      id: 'user456',
      name: 'Dr. Mark Johnson',
      type: 'Clinician',
      avatar: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    createdAt: '2024-05-20T16:45:00Z',
    rating: 4.5,
    ratingCount: 29,
    usageCount: 384,
    featured: false,
    comments: [],
  },
  {
    id: '6',
    title: 'Patient Visit Summary Generator',
    description: 'Create clear, patient-friendly visit summaries that can be shared via patient portals or printed as visit takeaways.',
    content: `Create a patient-friendly summary of today's visit that can be shared through our patient portal. The patient is a [AGE] year-old [GENDER] who presented for [VISIT_TYPE]. Use plain language (6th-8th grade reading level) and avoid medical jargon.

VISIT SUMMARY:

Dear [PATIENT_NAME],

Thank you for coming in today. This message summarizes what we discussed during your visit on [DATE].

What We Talked About:
- [MAIN_CONCERNS_DISCUSSED]
- [DIAGNOSES_IN_SIMPLE_TERMS]

What We Found:
- [KEY_EXAM_FINDINGS_IN_SIMPLE_TERMS]
- [TEST_RESULTS_IN_SIMPLE_TERMS]

Your Treatment Plan:
- Medications:
  * [MEDICATION_CHANGES_WITH_SIMPLE_INSTRUCTIONS]
- Lifestyle Recommendations:
  * [LIFESTYLE_RECOMMENDATIONS]
- Tests or Referrals:
  * [ORDERED_TESTS_OR_REFERRALS]

Important Next Steps:
- [SPECIFIC_INSTRUCTIONS_FOR_PATIENT]
- Follow-up appointment: [FOLLOW_UP_DETAILS]
- When to call us: [CONCERNING_SYMPTOMS]

Your Questions:
- [PATIENT_QUESTIONS_AND_ANSWERS]

Additional Resources:
- [EDUCATIONAL_RESOURCES_OR_LINKS]

If you have any questions before your next visit, please message us through the patient portal or call our office at [OFFICE_PHONE].

Sincerely,
[PROVIDER_NAME]
[CREDENTIALS]`,
    category: 'Patient Education',
    specialty: 'Internal Medicine',
    compatibleTools: ['GPT-4', 'Claude', 'Gemini', 'LLaMA'],
    author: {
      id: 'user123',
      name: 'Dr. Jane Doe',
      type: 'Clinician',
      avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    createdAt: '2024-06-03T10:20:00Z',
    rating: 4.7,
    ratingCount: 15,
    usageCount: 212,
    featured: false,
    comments: [],
  },
  {
    id: '7',
    title: 'Procedure Note Template for Minor Procedures',
    description: 'Comprehensive yet concise procedure note template for minor procedures, suitable for various specialties.',
    content: `Generate a comprehensive procedure note for [PROCEDURE_NAME] performed on a [AGE] year-old [GENDER] for [INDICATION]. Use the following format:

PROCEDURE NOTE: [PROCEDURE_NAME]

DATE OF PROCEDURE: [DATE]
PROVIDER: [PROVIDER_NAME], [CREDENTIALS]
ASSISTANT(S): [ASSISTANT_NAMES_AND_ROLES]

PRE-PROCEDURE DIAGNOSIS: [PRE_PROCEDURE_DIAGNOSIS]

POST-PROCEDURE DIAGNOSIS: [POST_PROCEDURE_DIAGNOSIS]

PROCEDURE PERFORMED: [SPECIFIC_PROCEDURE_NAME_WITH_CPT_CODE]

INDICATION: [CLINICAL_INDICATION]

INFORMED CONSENT:
- Informed consent was obtained after discussion of risks, benefits, and alternatives.
- Risks discussed included [SPECIFIC_RISKS].
- Questions were answered to the patient's satisfaction.

ANESTHESIA: [TYPE_OF_ANESTHESIA]

MEDICATIONS ADMINISTERED:
- [MEDICATION_NAME], [DOSE], [ROUTE]
- [MEDICATION_NAME], [DOSE], [ROUTE]

ESTIMATED BLOOD LOSS: [BLOOD_LOSS]

FLUIDS: [FLUIDS_ADMINISTERED]

SPECIMENS: [SPECIMENS_COLLECTED]

COMPLICATIONS: [COMPLICATIONS_OR_NONE]

PROCEDURE DETAILS:
1. Patient identification and time-out performed.
2. Patient positioned [POSITION].
3. [PROCEDURE_AREA] prepped and draped in usual sterile fashion.
4. [DETAILED_PROCEDURAL_STEPS]
5. [FINDINGS_DURING_PROCEDURE]
6. [CLOSURE_METHODS]
7. Patient tolerated the procedure well.
8. All counts correct at conclusion of procedure.

DISPOSITION:
- Vital signs stable post-procedure.
- [POST_PROCEDURE_CONDITION]
- [IMMEDIATE_POST_PROCEDURE_CARE]

POST-PROCEDURE INSTRUCTIONS:
- [WOUND_CARE_INSTRUCTIONS]
- [ACTIVITY_RESTRICTIONS]
- [MEDICATIONS]
- [FOLLOW_UP_PLAN]

Include all relevant details and ensure documentation is compliant with billing and regulatory requirements. Use appropriate medical terminology while maintaining clarity.`,
    category: 'Documentation',
    specialty: 'Surgery',
    compatibleTools: ['GPT-4', 'Claude', 'Gemini'],
    author: {
      id: 'user789',
      name: 'Sarah Williams',
      type: 'Administrator',
      avatar: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    createdAt: '2024-05-25T08:30:00Z',
    rating: 4.8,
    ratingCount: 22,
    usageCount: 298,
    featured: false,
    comments: [],
  },
  {
    id: '8',
    title: 'Pediatric Developmental Milestone Assessment',
    description: 'Comprehensive assessment of developmental milestones for pediatric patients, organized by age and domain.',
    content: `Create a comprehensive pediatric developmental milestone assessment for a [AGE_MONTHS/YEARS] old child. Include both typical milestones for this age and red flags for potential developmental delays. Organize the assessment by developmental domains.

PATIENT INFORMATION:
- Name: [PATIENT_NAME]
- DOB: [DOB]
- Age: [AGE_MONTHS/YEARS]
- Parent/Guardian: [PARENT_NAME]
- Date of Assessment: [DATE]

DEVELOPMENTAL HISTORY:
- Pregnancy and birth history: [HISTORY]
- Previous developmental concerns: [CONCERNS]
- Family history of developmental disorders: [FAMILY_HISTORY]
- Current interventions or therapies: [INTERVENTIONS]

DEVELOPMENTAL DOMAINS ASSESSMENT:

GROSS MOTOR:
- Expected milestones for age:
  * [LIST_OF_AGE-APPROPRIATE_MILESTONES]
- Patient's current abilities:
  * [PATIENT_ABILITIES]
- Red flags (if any):
  * [RED_FLAGS]

FINE MOTOR:
- Expected milestones for age:
  * [LIST_OF_AGE-APPROPRIATE_MILESTONES]
- Patient's current abilities:
  * [PATIENT_ABILITIES]
- Red flags (if any):
  * [RED_FLAGS]

LANGUAGE/COMMUNICATION:
- Expected milestones for age:
  * [LIST_OF_AGE-APPROPRIATE_MILESTONES]
- Patient's current abilities:
  * [PATIENT_ABILITIES]
- Red flags (if any):
  * [RED_FLAGS]

COGNITIVE:
- Expected milestones for age:
  * [LIST_OF_AGE-APPROPRIATE_MILESTONES]
- Patient's current abilities:
  * [PATIENT_ABILITIES]
- Red flags (if any):
  * [RED_FLAGS]

SOCIAL/EMOTIONAL:
- Expected milestones for age:
  * [LIST_OF_AGE-APPROPRIATE_MILESTONES]
- Patient's current abilities:
  * [PATIENT_ABILITIES]
- Red flags (if any):
  * [RED_FLAGS]

ADAPTIVE/SELF-HELP:
- Expected milestones for age:
  * [LIST_OF_AGE-APPROPRIATE_MILESTONES]
- Patient's current abilities:
  * [PATIENT_ABILITIES]
- Red flags (if any):
  * [RED_FLAGS]

SCREENING TOOLS USED:
- [SCREENING_TOOL_NAMES]
- Scores: [SCORES]
- Interpretation: [INTERPRETATION]

OVERALL ASSESSMENT:
- Areas of strength: [STRENGTHS]
- Areas of concern: [CONCERNS]
- Developmental age equivalent: [DEVELOPMENTAL_AGE]

RECOMMENDATIONS:
- Further evaluations needed: [EVALUATIONS]
- Referrals: [REFERRALS]
- Parent guidance: [GUIDANCE]
- Follow-up timeline: [FOLLOW_UP]

RESOURCES FOR FAMILY:
- [RECOMMENDED_RESOURCES]`,
    category: 'Documentation',
    specialty: 'Pediatrics',
    compatibleTools: ['GPT-4', 'Claude', 'Gemini', 'Med-PaLM'],
    author: {
      id: 'user321',
      name: 'Dr. Robert Chen',
      type: 'Clinician',
      avatar: 'https://images.pexels.com/photos/5327964/pexels-photo-5327964.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    createdAt: '2024-05-18T13:45:00Z',
    rating: 4.9,
    ratingCount: 31,
    usageCount: 347,
    featured: false,
    comments: [],
  },
];