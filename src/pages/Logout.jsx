import { IconLogout } from '@tabler/icons-react'

export default function Logout() {
  // Create the logout URL with an explicit redirect to home
  const logoutUrl = `/cdn-cgi/access/logout`

  return (
    <div className="page-body">
      <div className="container-tight py-5">
        <div className="card card-md">
          <div className="card-body text-center">
            <div className="avatar avatar-xl bg-danger-lt mb-3 mx-auto">
              <IconLogout size={40} />
            </div>
            <h2 className="mb-3">Confirm Logout</h2>
            <p className="text-muted mb-4">
              Click the button below to complete your logout from Cloudflare Access
            </p>
            <div className="mb-3">
              <a
                href={logoutUrl}
                className="btn btn-danger w-100"
              >
                <IconLogout size={20} className="me-2" />
                Complete Logout
              </a>
            </div>
            <div className="text-center">
              <a href="/" className="text-muted text-decoration-none">
                &larr; Return to home without logging out
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
