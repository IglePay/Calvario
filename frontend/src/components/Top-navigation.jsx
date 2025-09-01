"use client"

export default function TopNavigation({ onMenuClick, navigation }) {
    const navItems = [
        "Actividades",
        "Miembros",
        "Finanzas",
        "Asistencias",
        "Usuarios",
    ]
    const { searchQuery, handleSearch, setSearchQuery } = navigation

    return (
        <header className=" shadow-sm border-b border-gray-400">
            <div className="flex items-center justify-between px-4 md:px-6 py-4">
                {/* Left side - Toggle and Search */}
                <div className="flex items-center space-x-2 md:space-x-4 flex-1">
                    <button
                        onClick={onMenuClick}
                        className="text-blue-600 hover:text-blue-800 lg:hidden">
                        <i className="fas fa-bars text-lg"></i>
                    </button>

                    <div className="relative flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Buscar nombre, ID o apellido"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) =>
                                e.key === "Enter" && handleSearch(searchQuery)
                            }
                            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base text-gray-700"
                        />
                        <button
                            onClick={() => handleSearch(searchQuery)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <i className="fas fa-search"></i>
                        </button>
                    </div>
                </div>

                {/* Right side - Navigation Menu */}
                <nav className="hidden lg:flex items-center space-x-3">
                    {navItems.map((item, index) => (
                        <a
                            key={index}
                            href="#"
                            className="text-gray-700 hover:text-blue-600 font-medium transition-colors whitespace-nowrap text-base">
                            {item}
                        </a>
                    ))}

                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Nuevo
                    </button>
                </nav>

                <div className="flex items-center space-x-2 lg:hidden">
                    <button className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        <i className="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </header>
    )
}
