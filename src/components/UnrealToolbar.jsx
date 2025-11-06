import { Link, useLocation } from 'react-router-dom'
import {
  IconHome,
  IconPhoto,
  IconFiles,
  IconCalendar,
  IconMicrophone,
  IconFileText,
  IconSettings,
  IconLogout,
  IconBook,
  IconVideo
} from '@tabler/icons-react'
import { useAuth } from '../contexts/AuthContext'

// Unreal Engine inspired color palette
const unrealTheme = {
  toolbarBg: '#2d2d2d',
  toolbarBorder: '#1a1a1a',
  buttonBg: '#3a3a3a',
  buttonHover: '#4a4a4a',
  buttonActive: '#4a7ba7',
  text: '#e0e0e0',
  textMuted: '#a0a0a0',
  accent: '#4a7ba7',
  accentHover: '#5a8bc7',
}

export default function UnrealToolbar({ stats, loadingStats }) {
  const { user, logout } = useAuth()
  const location = useLocation()

  const menuItems = [
    { icon: IconHome, label: 'Dashboard', path: '/admin' },
    { icon: IconFiles, label: 'Pages', path: '/admin/pages' },
    { icon: IconPhoto, label: 'Media', path: '/admin/media' },
    { icon: IconCalendar, label: 'Events', path: '/admin/events' },
    { icon: IconMicrophone, label: 'Sermons', path: '/admin/sermons' },
    { icon: IconFileText, label: 'Bulletins', path: '/admin/bulletins' },
    { icon: IconSettings, label: 'Settings', path: '/admin/settings' },
    { icon: IconBook, label: 'Docs', path: '/admin/documentation' },
  ]

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div style={{
      height: '40px',
      backgroundColor: unrealTheme.toolbarBg,
      borderBottom: `1px solid ${unrealTheme.toolbarBorder}`,
      display: 'flex',
      alignItems: 'center',
      padding: '0 8px',
      gap: '4px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      {/* Logo/Brand Area with Title */}
      <div
        title="Manage your church website content"
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          height: '100%',
          borderRight: `1px solid ${unrealTheme.toolbarBorder}`,
          marginRight: '8px',
          gap: '12px'
        }}
      >
        <span style={{
          fontSize: '14px',
          fontWeight: '600',
          color: unrealTheme.text,
          letterSpacing: '-0.5px'
        }}>
          Bethany SDA
        </span>
        <div style={{
          width: '1px',
          height: '20px',
          backgroundColor: unrealTheme.toolbarBorder
        }} />
        <span style={{
          fontSize: '13px',
          fontWeight: '500',
          color: unrealTheme.textMuted,
          letterSpacing: '-0.3px'
        }}>
          Admin Dashboard
        </span>
      </div>

      {/* Menu Items */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1 }}>
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                height: '32px',
                borderRadius: '3px',
                color: active ? '#ffffff' : unrealTheme.textMuted,
                backgroundColor: active ? unrealTheme.buttonActive : 'transparent',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: active ? '500' : '400',
                transition: 'all 0.15s ease',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = unrealTheme.buttonHover
                  e.currentTarget.style.color = unrealTheme.text
                }
              }}
              onMouseOut={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = unrealTheme.textMuted
                }
              }}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>

      {/* Quick Stats */}
      {stats && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          paddingLeft: '12px',
          paddingRight: '12px',
          borderLeft: `1px solid ${unrealTheme.toolbarBorder}`,
          borderRight: `1px solid ${unrealTheme.toolbarBorder}`
        }}>
          <StatBadge icon={IconPhoto} value={loadingStats ? '...' : stats.images} label="Images" color="#4a7ba7" />
          <StatBadge icon={IconVideo} value={loadingStats ? '...' : stats.videos} label="Videos" color="#5a9b5a" />
          <StatBadge icon={IconFileText} value={loadingStats ? '...' : stats.documents} label="Docs" color="#7b8ba7" />
          <StatBadge icon={IconPhoto} value={loadingStats ? '...' : stats.totalFiles} label="Total" color="#9b7ba7" />
        </div>
      )}

      {/* Right Side - User Menu */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        paddingLeft: '8px'
      }}>
        {user?.email && (
          <span style={{
            fontSize: '12px',
            color: unrealTheme.textMuted,
            paddingRight: '8px'
          }}>
            {user.email}
          </span>
        )}
        <button
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            height: '32px',
            borderRadius: '3px',
            backgroundColor: 'transparent',
            border: 'none',
            color: unrealTheme.textMuted,
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = unrealTheme.buttonHover
            e.currentTarget.style.color = '#ff6b6b'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = unrealTheme.textMuted
          }}
        >
          <IconLogout size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

// Compact stat badge for toolbar
function StatBadge({ icon: Icon, value, label, color }) {
  return (
    <div
      title={`${value} ${label}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 8px',
        borderRadius: '3px',
        backgroundColor: color + '22',
        border: `1px solid ${color}44`,
        cursor: 'default'
      }}
    >
      <Icon size={14} style={{ color }} />
      <span style={{
        fontSize: '12px',
        fontWeight: '600',
        color: '#e0e0e0'
      }}>
        {value}
      </span>
      <span style={{
        fontSize: '11px',
        color: '#a0a0a0'
      }}>
        {label}
      </span>
    </div>
  )
}
