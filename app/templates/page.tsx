'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import FormsList from '../../components/FormsList';
import { FormTemplateData } from '../../lib/firebase';
import AuthGuard from '../../components/AuthGuard';

function TemplatesContent() {
  const router = useRouter();

  const handleSelectForm = async (form: FormTemplateData) => {
    router.push(`/editor/${form.id}`);
  };

  return <FormsList onSelectForm={handleSelectForm} />;
}

export default function TemplatesPage() {
  return (
    <AuthGuard>
      <TemplatesContent />
    </AuthGuard>
  );
}
