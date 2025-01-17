const LoadingSpinner = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="w-12 h-12 border-4 border-t-[var(--main-color)] border-r-[var(--main-color)] border-b-[var(--main-color)] border-l-transparent rounded-full animate-spin"></div>
        </div>
    );
};

export default LoadingSpinner;