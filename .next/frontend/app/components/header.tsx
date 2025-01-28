const Header = () => {
    return (
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-700">Bem-vindo!</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Usuário: admin</span>
          <button className="bg-blue-600 text-white py-1 px-4 rounded hover:bg-blue-700">
            Perfil
          </button>
        </div>
      </header>
    );
  };
  
  export default Header;