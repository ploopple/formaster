import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Smart PDF Filler - Fill PDF Forms Smarter & Faster';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)',
          padding: '60px 80px',
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            left: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(59, 130, 246, 0.3)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -150,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'rgba(30, 64, 175, 0.3)',
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: 16,
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 20,
            }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M10 5L30 5L30 35L10 35L10 5Z" fill="#3b82f6" />
              <path d="M5 10L25 10L25 40L5 40L5 10Z" fill="#1e40af" />
              <path d="M15 20L35 20L35 25L15 25Z" fill="#60a5fa" />
              <path d="M15 28L30 28L30 33L15 33Z" fill="#60a5fa" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: 'white',
            lineHeight: 1.1,
            marginBottom: 20,
          }}
        >
          Smart PDF Filler
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            color: '#bfdbfe',
            marginBottom: 40,
          }}
        >
          Fill PDF Forms Smarter & Faster
        </div>

        {/* Features */}
        <div
          style={{
            display: 'flex',
            gap: 30,
          }}
        >
          {['Drag & Drop Editor', 'Cloud Storage', 'Team Collaboration'].map(
            (feature) => (
              <div
                key={feature}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: '#22c55e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M3 7L6 10L11 4"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span style={{ color: '#e0f2fe', fontSize: 20 }}>{feature}</span>
              </div>
            )
          )}
        </div>

        {/* PDF mockup on the right */}
        <div
          style={{
            position: 'absolute',
            right: 60,
            top: 120,
            width: 380,
            height: 380,
            background: 'white',
            borderRadius: 16,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header bar */}
          <div
            style={{
              height: 45,
              background: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              padding: '0 15px',
              gap: 8,
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#eab308' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />
          </div>
          {/* Form fields */}
          <div style={{ padding: 25, display: 'flex', flexDirection: 'column', gap: 15 }}>
            <div
              style={{
                height: 40,
                background: '#eff6ff',
                border: '2px solid #3b82f6',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                padding: '0 15px',
                color: '#64748b',
                fontSize: 14,
              }}
            >
              Full Name
            </div>
            <div
              style={{
                height: 40,
                background: '#eff6ff',
                border: '2px solid #3b82f6',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                padding: '0 15px',
                color: '#64748b',
                fontSize: 14,
              }}
            >
              Email Address
            </div>
            <div style={{ display: 'flex', gap: 15 }}>
              <div
                style={{
                  flex: 1,
                  height: 40,
                  background: '#eff6ff',
                  border: '2px solid #3b82f6',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 15px',
                  color: '#64748b',
                  fontSize: 14,
                }}
              >
                Date
              </div>
              <div
                style={{
                  flex: 1,
                  height: 40,
                  background: '#eff6ff',
                  border: '2px solid #3b82f6',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 15px',
                  color: '#64748b',
                  fontSize: 14,
                }}
              >
                Phone
              </div>
            </div>
            <div
              style={{
                height: 80,
                background: '#fefce8',
                border: '2px dashed #eab308',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#a16207',
                fontSize: 14,
              }}
            >
              Signature
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
