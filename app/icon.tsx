import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: '#2563eb',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 6,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
          <path d="M12 6L28 6L28 34L12 34L12 6Z" fill="white" />
          <path d="M16 18L32 18L32 22L16 22Z" fill="#bfdbfe" />
          <path d="M16 25L28 25L28 29L16 29Z" fill="#bfdbfe" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
