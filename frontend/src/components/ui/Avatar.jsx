'use client';

import { useImgUrl } from '@/hooks/useImgUrl';

export function Avatar({ src, name, size = 32, className = '', style = {} }) {
  const { src: avatarSrc, onError } = useImgUrl(src);

  const initial = (name || '?')[0].toUpperCase();

  const baseStyle = {
    width:          size,
    height:         size,
    borderRadius:   '50%',
    flexShrink:     0,
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    overflow:       'hidden',
    fontSize:       Math.max(10, Math.round(size * 0.38)),
    fontWeight:     700,
    background:     'linear-gradient(135deg, #C9A227, #8A6A0A)',
    color:          '#fff',
    userSelect:     'none',
    ...style,
  };

  return (
    <div className={className} style={baseStyle}>
      {avatarSrc ? (
        <img
          src={avatarSrc}
          alt={name || ''}
          onError={onError}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
        />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
}