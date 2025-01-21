interface PageHeaderProps {
    title: string;
    greeting: string;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

export default function PageHeader({ 
    title, 
    greeting, 
    searchTerm, 
    setSearchTerm 
}: PageHeaderProps) {
    return (
        <header className="py-6 px-9 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
                <h1 className="text-2xl font-bold text-[var(--text-semi-bold-color)]">{title}</h1>
                <p className="text-sm text-gray-600">{greeting}</p>
            </div>

            <div className="mt-4 sm:mt-0">
                <div className="bg-white shadow rounded-lg py-2 px-2 sm:px-4 flex justify-between items-center w-56 h-12">
                    <i className='bx bx-search text-[var(--text-semi-bold-color)] text-lg mr-0 sm:mr-2 ml-2 sm:ml-0'></i>
                    <input
                        type="text"
                        placeholder="Cari data..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-0 focus:outline-none text-base w-40"
                    />
                </div>
            </div>
        </header>
    );
}