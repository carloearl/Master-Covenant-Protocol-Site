import React from 'react';
import { useResponsive } from '@/components/hooks/useResponsive';

/**
 * ResponsiveWrapper - Conditionally render mobile or desktop versions
 * Usage: <ResponsiveWrapper mobile={<MobileVersion />} desktop={<DesktopVersion />} />
 */
export function ResponsiveWrapper({ mobile, desktop, tablet, children }) {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile && mobile) return mobile;
  if (isTablet && tablet) return tablet;
  if (isDesktop && desktop) return desktop;
  
  // Default fallback
  return children || desktop || mobile;
}

/**
 * MobileOnly - Render only on mobile devices
 */
export function MobileOnly({ children }) {
  const { isMobile } = useResponsive();
  return isMobile ? children : null;
}

/**
 * DesktopOnly - Render only on desktop
 */
export function DesktopOnly({ children }) {
  const { isDesktop } = useResponsive();
  return isDesktop ? children : null;
}

/**
 * TabletOnly - Render only on tablets
 */
export function TabletOnly({ children }) {
  const { isTablet } = useResponsive();
  return isTablet ? children : null;
}

/**
 * HideOnMobile - Hide content on mobile, show on desktop
 */
export function HideOnMobile({ children }) {
  return <div className="hidden md:block">{children}</div>;
}

/**
 * ShowOnMobile - Show only on mobile, hide on desktop
 */
export function ShowOnMobile({ children }) {
  return <div className="block md:hidden">{children}</div>;
}

export default ResponsiveWrapper;