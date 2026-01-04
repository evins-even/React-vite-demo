import { useContext } from 'react';
import { GlobalContext } from '../context';
import defaultLocale from "./defaultLocale"

function useLocale(locale = null) {
    const { lang } = useContext(GlobalContext);
    return (locale || defaultLocale)[lang!] || {};
}

export default useLocale;
