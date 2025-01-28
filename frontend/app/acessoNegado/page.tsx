export default function UnauthorizedPage() {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="p-6 bg-white shadow-md rounded-md text-center">
          <h1 className="text-2xl font-semibold text-red-500">Acesso Negado</h1>
          <p className="mt-4 text-gray-600">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
      </div>
    );
  }