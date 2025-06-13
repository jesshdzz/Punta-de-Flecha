export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200" data-theme="school">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body text-center">
          <h1 className="card-title text-4xl text-error justify-center mb-4">Acceso Denegado</h1>
          <p className="text-base-content/70 mb-4">No tienes permisos para acceder a esta página</p>
          <div className="card-actions justify-center">
            <a href="/login" className="btn btn-primary">
              Volver al inicio de sesión
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
