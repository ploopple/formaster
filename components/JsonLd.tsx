export function OrganizationJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://smartpdffiller.com';
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Smart PDF Filler',
    url: baseUrl,
    logo: `${baseUrl}/og-image.svg`,
    description: 'Create fillable PDF forms with our intuitive drag-and-drop editor. Upload any PDF, add form fields, signatures, and share with your team.',
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function SoftwareApplicationJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://smartpdffiller.com';
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Smart PDF Filler',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: baseUrl,
    description: 'Fill PDF forms smarter and faster with drag-and-drop editor, cloud storage, and team collaboration.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
    featureList: [
      'Drag-and-drop PDF form editor',
      'Cloud storage for forms',
      'Team collaboration',
      'Digital signatures',
      'Form templates',
      'PDF export',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebsiteJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://smartpdffiller.com';
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Smart PDF Filler',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/templates?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
