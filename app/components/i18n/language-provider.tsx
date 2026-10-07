'use client';

import type { ReactNode } from 'react';
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import type { Language } from '../../data/site-copy';

const LANGUAGE_STORAGE_KEY = 'site-language';
const LANGUAGE_COOKIE_NAME = 'site-language';

interface LanguageContextValue {
	language: Language;
	setLanguage: (language: Language) => void;
	toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function writeLanguageCookie(language: Language) {
	if (typeof document === 'undefined') {
		return;
	}

	// biome-ignore lint/suspicious/noDocumentCookie: intentional persistence fallback
	document.cookie = `${LANGUAGE_COOKIE_NAME}=${language}; path=/; max-age=31536000; samesite=lax`;
}

interface LanguageProviderProps {
	children: ReactNode;
	initialLanguage: Language;
}

export function LanguageProvider({
	children,
	initialLanguage,
}: LanguageProviderProps) {
	const [language, setLanguageState] = useState<Language>(initialLanguage);

	useEffect(() => {
		try {
			const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
			if (stored === 'en' || stored === 'vi') {
				setLanguageState(stored);
			}
		} catch {
			// ignore storage failures
		}
	}, []);

	useEffect(() => {
		try {
			window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
		} catch {
			// ignore storage failures
		}

		writeLanguageCookie(language);
		document.documentElement.lang = language;
	}, [language]);

	const setLanguage = useCallback((nextLanguage: Language) => {
		try {
			window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
		} catch {
			// ignore storage failures
		}
		writeLanguageCookie(nextLanguage);
		document.documentElement.lang = nextLanguage;
		setLanguageState(nextLanguage);
	}, []);

	const value = useMemo<LanguageContextValue>(
		() => ({
			language,
			setLanguage,
			toggleLanguage: () => setLanguage(language === 'en' ? 'vi' : 'en'),
		}),
		[language, setLanguage],
	);

	return (
		<LanguageContext.Provider value={value}>
			{children}
		</LanguageContext.Provider>
	);
}

export function useLanguage() {
	const context = useContext(LanguageContext);

	if (!context) {
		throw new Error('useLanguage must be used within a LanguageProvider');
	}

	return context;
}

export function getInitialLanguage(): Language {
	if (typeof document === 'undefined') {
		return 'en';
	}

	const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
	if (stored === 'vi') {
		return 'vi';
	}

	return 'en';
}
