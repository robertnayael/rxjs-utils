import { Observable } from 'rxjs'

export function preloadImage(url: string) {
    return new Observable((subscriber) => {
        const request = new XMLHttpRequest()
        request.open('get', url)
        request.send()

        request.onerror = () =>
            subscriber.error(`Error loading image ${url}`)

        request.ontimeout = () =>
            subscriber.error(`Request timeout: ${url}`)

        request.onreadystatechange = () =>
            request.readyState === 4 && subscriber.complete()

        return () => {
            request.onerror = null
            request.ontimeout = null
            request.onreadystatechange = null
            request.abort()
        }
    })
}
