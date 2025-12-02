'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import FormsList from '../../components/FormsList';
import { FormTemplate } from '../../formsData';

export default function TemplatesPage() {
  const router = useRouter();

  const handleSelectForm = async (form: FormTemplate) => {
    // Navigate directly to the form using its ID in the URL
    router.push(`/editor/${form.id}`);
  };

  return <FormsList onSelectForm={handleSelectForm} />;
}
