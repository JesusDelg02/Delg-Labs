import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#09090B',
          color: '#FAFAFA',
          fontSize: 64,
          fontWeight: 700,
        }}
      >
        Delg Labs
        <div style={{ fontSize: 28, color: '#A1A1AA', marginTop: 20, fontWeight: 400 }}>
          Digital Product Developer
        </div>
      </div>
    ),
    size
  )
}
