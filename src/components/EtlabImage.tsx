import React, { useState, useEffect } from 'react'
import { etlabClient } from '../api/client'

interface EtlabImageProps {
  src?: string | null
  alt: string
  className?: string
  fallback?: React.ReactNode
  containerClassName?: string
}

export const EtlabImage: React.FC<EtlabImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallback,
  containerClassName = 'w-full h-full flex items-center justify-center'
}) => {
  const [resolvedSrc, setResolvedSrc] = useState<string | null>(null)
  const [hasError, setHasError] = useState(false)
  const [attemptedAuthFetch, setAttemptedAuthFetch] = useState(false)

  useEffect(() => {
    setHasError(false)
    setAttemptedAuthFetch(false)

    if (!src || typeof src !== 'string' || src.trim() === '') {
      setResolvedSrc(null)
      return
    }

    const trimmed = src.trim()

    // 1. Direct URLs (data, blob, https://)
    if (trimmed.startsWith('data:') || trimmed.startsWith('blob:') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      setResolvedSrc(trimmed)
      return
    }

    // 2. Relative ETLab uploads path
    const cleanPath = trimmed.replace(/^\/+/, '')
    const session = etlabClient.getSession()
    const institute = session?.instituteId

    // Try primary student API origin or college subdomain
    const fullUrl = cleanPath.startsWith('uploads/')
      ? `https://api.students.etlab.app/${cleanPath}`
      : institute
      ? `https://${institute}.etlab.app/uploads/${cleanPath}`
      : `https://api.students.etlab.app/uploads/${cleanPath}`

    setResolvedSrc(fullUrl)
  }, [src])

  const handleError = async () => {
    // If direct load failed and we haven't tried authenticated fetch yet
    if (!attemptedAuthFetch && resolvedSrc && resolvedSrc.startsWith('http')) {
      setAttemptedAuthFetch(true)
      try {
        const headers = etlabClient.getHeaders()
        const res = await fetch(resolvedSrc, {
          method: 'GET',
          headers,
          referrerPolicy: 'no-referrer',
          mode: 'cors'
        })

        if (res.ok) {
          const blob = await res.blob()
          if (blob.size > 0 && blob.type.startsWith('image/')) {
            const blobUrl = URL.createObjectURL(blob)
            setResolvedSrc(blobUrl)
            setHasError(false)
            return
          }
        }
      } catch (err) {
        // Authenticated fetch failed or blocked
      }
    }

    setHasError(true)
  }

  if (!resolvedSrc || hasError) {
    return (
      <div className={containerClassName}>
        {fallback || <span className="uppercase text-xs font-bold">{alt.slice(0, 2)}</span>}
      </div>
    )
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
      onError={handleError}
      className={className}
    />
  )
}
