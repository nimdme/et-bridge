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

    // 1. Direct data or blob URLs
    if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
      setResolvedSrc(trimmed)
      return
    }

    // 2. Resolve absolute URL
    let fullUrl = trimmed.replace(/\\/g, '')
    const cleanPath = fullUrl.replace(/^\/+/, '')
    const session = etlabClient.getSession()
    const institute = session?.instituteId

    if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
      if (institute) {
        fullUrl = cleanPath.startsWith('uploads/')
          ? `https://${institute}.etlab.app/${cleanPath}`
          : `https://${institute}.etlab.app/uploads/${cleanPath}`
      } else {
        fullUrl = `https://api.students.etlab.app/${cleanPath.startsWith('uploads/') ? cleanPath : `uploads/${cleanPath}`}`
      }
    } else if (fullUrl.startsWith('http://')) {
      fullUrl = fullUrl.replace(/^http:\/\//i, 'https://')
    }

    // 3. For ETLab hosted assets, use edge image proxy with auth & caching
    if (fullUrl.includes('etlab.app')) {
      const token = session?.token ? encodeURIComponent(session.token) : ''
      const inst = institute ? encodeURIComponent(institute) : ''
      const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(fullUrl)}${token ? `&token=${token}` : ''}${inst ? `&inst=${inst}` : ''}`
      setResolvedSrc(proxyUrl)
      return
    }

    setResolvedSrc(fullUrl)
  }, [src])

  const handleError = async () => {
    // Stage 1: If proxy route failed, try direct target URL with no-referrer
    if (!attemptedAuthFetch && resolvedSrc && resolvedSrc.includes('/api/image-proxy')) {
      setAttemptedAuthFetch(true)
      try {
        const urlParams = new URL(resolvedSrc, window.location.origin)
        const directUrl = urlParams.searchParams.get('url')
        if (directUrl) {
          setResolvedSrc(directUrl)
          setHasError(false)
          return
        }
      } catch {}
    }

    // Stage 2: If direct load failed, try authenticated fetch
    if (resolvedSrc && resolvedSrc.startsWith('http')) {
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
      } catch {}
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
