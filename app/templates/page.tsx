'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import FormsList from '../../components/FormsList';
import { FormTemplate } from '../../formsData';

export default function TemplatesPage() {
  const router = useRouter();

  const handleSelectForm = async (form: FormTemplate) => {
    // Store form data in sessionStorage to pass to editor
    sessionStorage.setItem('selectedForm', JSON.stringify(form));
    router.push('/editor?mode=fill');
  };

  return <FormsList onSelectForm={handleSelectForm} />;
}
