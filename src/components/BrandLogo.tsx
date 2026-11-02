import React from 'react'

interface BrandLogoProps {
  className?: string
  alt?: string
  variant?: 'auto' | 'dark' | 'light'
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = 'w-full h-full object-contain',
  alt = 'ETBridge Logo',
  variant = 'auto'
}) => {
  if (variant === 'dark') {
    return (
      <img
        src="/img/logo/logo-dark.png"
        alt={alt}
        className={className}
        loading="eager"
      />
    )
  }

  if (variant === 'light') {
    return (
      <img
        src="/img/logo/logo-light.png"
        alt={alt}
        className={className}
        loading="eager"
      />
    )
  }

  return (
    <>
      <img
        src="/img/logo/logo-dark.png"
        alt={alt}
        className={`${className} hidden dark:block`}
        loading="eager"
      />
      <img
        src="/img/logo/logo-light.png"
        alt={alt}
        className={`${className} block dark:hidden`}
        loading="eager"
      />
    </>
  )
}
