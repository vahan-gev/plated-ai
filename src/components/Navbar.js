'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignInButton, UserButton } from '@clerk/nextjs'
import { useConvexAuth } from 'convex/react'
import { Sparkles, User, Menu, X, Home } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import logo from '@/assets/platedai_logo.png'

const NAV_LINKS = [
  { href: '/', label: 'Home', Icon: Home },
  { href: '/generate', label: 'Generate', Icon: Sparkles },
  { href: '/profile', label: 'Profile', Icon: User },
]

function navIsActive(pathname, href) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

function NavItem({ href, label, active }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`pill-nav-item ${active ? 'pill-nav-item--active' : ''}`}
    >
      {label}
    </Link>
  )
}

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const { isAuthenticated, isLoading } = useConvexAuth()
  const lastAuthRef = useRef(null)

  if (!isLoading) {
    lastAuthRef.current = isAuthenticated
  }

  const showAuthenticated = isLoading ? lastAuthRef.current === true : isAuthenticated
  const showUnauthenticated = isLoading ? lastAuthRef.current === false : !isAuthenticated
  const showSkeleton = isLoading && lastAuthRef.current === null

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav
        className={`pill-navbar ${scrolled ? 'pill-navbar--scrolled' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="pill-navbar__inner">

          <Link href="/" className="pill-navbar__logo" aria-label="Plated.ai home">
            <Image src={logo} alt="" className="pill-navbar__logo-img" priority aria-hidden />
            <span className="pill-navbar__logo-text">
              Plated<span className="gradient-text">.ai</span>
            </span>
          </Link>

          <div className="pill-navbar__center">
            <div className="pill-navbar__links">
              {NAV_LINKS.map(({ href, label, Icon }) => (
                <NavItem
                  key={href}
                  href={href}
                  label={label}
                  Icon={Icon}
                  active={navIsActive(pathname, href)}
                />
              ))}
            </div>
          </div>

          <div className="pill-navbar__right">
            {showSkeleton && (
              <div className="pill-navbar__avatar-skeleton" />
            )}

            {showAuthenticated && (
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'pill-navbar__avatar',
                  },
                }}
              />
            )}

            {showUnauthenticated && (
              <SignInButton mode="modal">
                <button type="button" className="pill-navbar__cta">
                  Sign In
                </button>
              </SignInButton>
            )}

            <button
              className="pill-navbar__hamburger"
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div
          className="pill-mobile-overlay"
          data-app-modal-backdrop
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="pill-mobile-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            {NAV_LINKS.map(({ href, label, Icon }) => {
              const active = navIsActive(pathname, href)
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={`pill-mobile-link ${active ? 'pill-mobile-link--active' : ''}`}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  {label}
                </Link>
              )
            })}

            <div className="pill-mobile-auth">
              {showUnauthenticated && (
                <SignInButton mode="modal">
                  <button type="button" className="pill-navbar__cta pill-navbar__cta--mobile">
                    Sign In
                  </button>
                </SignInButton>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}