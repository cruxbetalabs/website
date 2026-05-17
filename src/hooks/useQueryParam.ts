import { useCallback } from 'react'

/**
 * Read and write a URL query parameter without a full router.
 * Uses pushState to update the URL without a page reload.
 */
export function useQueryParam(key: string): [string | null, (value: string | null) => void] {
    const value = new URLSearchParams(window.location.search).get(key)

    const setValue = useCallback(
        (newValue: string | null) => {
            const params = new URLSearchParams(window.location.search)
            if (newValue === null) {
                params.delete(key)
            } else {
                params.set(key, newValue)
            }
            const newSearch = params.toString()
            const newUrl = newSearch
                ? `${window.location.pathname}?${newSearch}`
                : window.location.pathname
            window.history.pushState({}, '', newUrl)
        },
        [key],
    )

    return [value, setValue]
}
