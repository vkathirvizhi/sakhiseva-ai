export interface DocumentItem {
  id: string;
  nameKey: string;
  icon: string;
  verifiedOfficial: boolean;
  villageLocationHint: string;
}

export interface EligibilityQuestion {
  id: string;
  questionKey: string;
  whyWeAskKey: string;
  expectedAnswer: 'yes' | 'no';
  explanationIfMismatchKey: string;
}

export interface SchemeInfo {
  id: string;
  nameKey: string;
  shortName: string;
  ministry: string;
  officialPortal: string;
  officialTollFree: string;
  emergencyHelpline: string;
  benefits: {
    titleKey: string;
    descriptionKey: string;
    icon: string;
  }[];
  eligibilityQuestions: EligibilityQuestion[];
  requiredDocuments: DocumentItem[];
  applicationSteps: {
    stepNumber: number;
    titleKey: string;
    descriptionKey: string;
    icon: string;
    placeHintKey: string;
  }[];
}

export const PMUY_SCHEME: SchemeInfo = {
  id: 'pmuy',
  nameKey: 'scheme_pmuy_name',
  shortName: 'PM Ujjwala Yojana 2.0',
  ministry: 'Ministry of Petroleum & Natural Gas, Govt of India',
  officialPortal: 'https://www.pmuy.gov.in',
  officialTollFree: '1800-266-6696',
  emergencyHelpline: '1906',
  benefits: [
    {
      titleKey: 'benefit_free_cylinder',
      descriptionKey: 'benefit_free_cylinder_desc',
      icon: 'Flame',
    },
    {
      titleKey: 'benefit_free_stove',
      descriptionKey: 'benefit_free_stove_desc',
      icon: 'CookingPot',
    },
    {
      titleKey: 'benefit_zero_deposit',
      descriptionKey: 'benefit_zero_deposit_desc',
      icon: 'BadgePercent',
    },
    {
      titleKey: 'benefit_direct_subsidy',
      descriptionKey: 'benefit_direct_subsidy_desc',
      icon: 'Landmark',
    },
  ],
  eligibilityQuestions: [
    {
      id: 'existing_connection',
      questionKey: 'q_existing_connection',
      whyWeAskKey: 'why_existing_connection',
      expectedAnswer: 'no', // Should NOT already have an LPG connection in the same household
      explanationIfMismatchKey: 'mismatch_existing_connection',
    },
    {
      id: 'applicant_age',
      questionKey: 'q_applicant_age',
      whyWeAskKey: 'why_applicant_age',
      expectedAnswer: 'yes', // Must be female aged 18 or above
      explanationIfMismatchKey: 'mismatch_applicant_age',
    },
    {
      id: 'ration_or_bpl',
      questionKey: 'q_ration_or_bpl',
      whyWeAskKey: 'why_ration_or_bpl',
      expectedAnswer: 'yes', // Ration card / BPL / SECC list / 14-point declaration
      explanationIfMismatchKey: 'mismatch_ration_or_bpl',
    },
    {
      id: 'bank_and_aadhaar',
      questionKey: 'q_bank_and_aadhaar',
      whyWeAskKey: 'why_bank_and_aadhaar',
      expectedAnswer: 'yes', // Female applicant must have Aadhaar & bank account for subsidy
      explanationIfMismatchKey: 'mismatch_bank_and_aadhaar',
    },
  ],
  requiredDocuments: [
    {
      id: 'aadhaar',
      nameKey: 'doc_aadhaar',
      icon: 'CreditCard',
      verifiedOfficial: true,
      villageLocationHint: 'village_hint_aadhaar',
    },
    {
      id: 'ration_card',
      nameKey: 'doc_ration_card',
      icon: 'FileText',
      verifiedOfficial: true,
      villageLocationHint: 'village_hint_ration',
    },
    {
      id: 'bank_passbook',
      nameKey: 'doc_bank_passbook',
      icon: 'Building2',
      verifiedOfficial: true,
      villageLocationHint: 'village_hint_bank',
    },
    {
      id: 'photo',
      nameKey: 'doc_photo',
      icon: 'Camera',
      verifiedOfficial: true,
      villageLocationHint: 'village_hint_photo',
    },
    {
      id: 'self_declaration',
      nameKey: 'doc_self_declaration',
      icon: 'FileCheck',
      verifiedOfficial: true,
      villageLocationHint: 'village_hint_declaration',
    },
  ],
  applicationSteps: [
    {
      stepNumber: 1,
      titleKey: 'app_step1_title',
      descriptionKey: 'app_step1_desc',
      icon: 'FolderCheck',
      placeHintKey: 'app_step1_place',
    },
    {
      stepNumber: 2,
      titleKey: 'app_step2_title',
      descriptionKey: 'app_step2_desc',
      icon: 'MapPin',
      placeHintKey: 'app_step2_place',
    },
    {
      stepNumber: 3,
      titleKey: 'app_step3_title',
      descriptionKey: 'app_step3_desc',
      icon: 'Fingerprint',
      placeHintKey: 'app_step3_place',
    },
    {
      stepNumber: 4,
      titleKey: 'app_step4_title',
      descriptionKey: 'app_step4_desc',
      icon: 'CheckCircle2',
      placeHintKey: 'app_step4_place',
    },
  ],
};
