import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 36,
        }}
      >
        <svg width="100" height="100" viewBox="0 0 40 40" fill="none">
          <path d="M10 5L30 5L30 35L10 35L10 5Z" fill="white" />
          <path d="M5 10L25 10L25 40L5 40L5 10Z" fill="rgba(255,255,255,0.8)" />
          <path d="M15 20L35 20L35 25L15 25Z" fill="#bfdbfe" />
          <path d="M15 28L30 28L30 33L15 33Z" fill="#bfdbfe" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
