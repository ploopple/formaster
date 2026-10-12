'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import FormsList from '../../components/FormsList';
import type { FormTemplateData } from '../../lib/localForms';

function TemplatesContent() {
  const router = useRouter();

  const handleSelectForm = async (form: FormTemplateData) => {
    router.push(`/editor/${form.id}`);
  };

  return <FormsList onSelectForm={handleSelectForm} />;
}

export default function TemplatesPage() {
  return <TemplatesContent />;
}
