export type UserRole = "applicant" | "admin" | "evaluator";

export type ApplicationType =
  | "Development Permit"
  | "Certificate of Registration and License to Sell"
  | "Temporary License to Sell"
  | "Alteration of Plan"
  | "Application for Balanced Housing"
  | "Application for COC"
  | "Application for Additional Period of Time to Complete Project";

export type ApplicationStatus =
  | "Draft"
  | "For Payment"
  | "Received"
  | "Ongoing Evaluation"
  | "Ongoing Inspection"
  | "Ongoing Approval"
  | "Released"
  | "Disapproved";

export type RequirementStatus = "Compliant" | "Incorrect File" | "Missing";
export type PaymentStatus = "Pending" | "Paid" | "Expired";
export type NotificationType =
  | "application_update"
  | "payment_reminder"
  | "result_ready"
  | "new_message";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Application {
  id: string;
  reference_no: string;
  applicant_id: string;
  application_type: ApplicationType;
  applicant_type?: string;
  company_name?: string;
  authorized_representative?: string;
  contact_number?: string;
  email_address?: string;
  project_name?: string;
  project_location?: string;
  status: ApplicationStatus;
  date_submitted?: string;
  created_at: string;
  updated_at: string;
}

export interface Requirement {
  id: string;
  application_id: string;
  requirement_name: string;
  file_name?: string;
  file_path?: string;
  file_size?: number;
  status: RequirementStatus;
  uploaded_at?: string;
}

export interface Payment {
  id: string;
  application_id: string;
  reference_no: string;
  amount: number;
  date_issued: string;
  valid_until?: string;
  status: PaymentStatus;
  payment_method?: string;
}

export interface ApplicationTimeline {
  id: string;
  application_id: string;
  event_date: string;
  description: string;
  stage?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  application_id?: string;
  type?: NotificationType;
  title: string;
  message?: string;
  is_read: boolean;
  created_at: string;
}

export interface ApplicationFormState {
  applicantType: string;
  companyName: string;
  authorizedRepresentative: string;
  contactNumber: string;
  emailAddress: string;
  projectName: string;
  projectLocation: string;
  applicationId?: string;
  referenceNo?: string;
}
