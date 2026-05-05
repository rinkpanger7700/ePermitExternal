"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { ApplicationFormState } from "@/lib/types";

interface ApplicationFormContextType {
  formState: ApplicationFormState;
  updateForm: (updates: Partial<ApplicationFormState>) => void;
  resetForm: () => void;
}

const defaultState: ApplicationFormState = {
  applicantType: "",
  companyName: "",
  authorizedRepresentative: "",
  contactNumber: "",
  emailAddress: "",
  projectName: "",
  projectLocation: "",
  applicationId: undefined,
  referenceNo: undefined,
};

const ApplicationFormContext = createContext<ApplicationFormContextType>({
  formState: defaultState,
  updateForm: () => {},
  resetForm: () => {},
});

export function ApplicationFormProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [formState, setFormState] = useState<ApplicationFormState>(defaultState);

  const updateForm = useCallback((updates: Partial<ApplicationFormState>) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetForm = useCallback(() => {
    setFormState(defaultState);
  }, []);

  return (
    <ApplicationFormContext.Provider value={{ formState, updateForm, resetForm }}>
      {children}
    </ApplicationFormContext.Provider>
  );
}

export function useApplicationForm() {
  return useContext(ApplicationFormContext);
}
