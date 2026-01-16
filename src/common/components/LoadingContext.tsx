import FullLoading from "./FullLoading";

// LoadingContext.tsx
const LoadingContext = createContext({
    loading: false,
    showLoading: () => { },
    hideLoading: () => { }
});

export function LoadingProvider({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(false);

    const value = useMemo(() => ({
        loading,
        showLoading: () => setLoading(true),
        hideLoading: () => setLoading(false)
    }), [loading]);

    return (
        <LoadingContext.Provider value={value}>
            {children}
            {loading && <FullLoading />}
        </LoadingContext.Provider>
    );
}

export const useLoading = () => useContext(LoadingContext);
