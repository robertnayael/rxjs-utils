import { Observable } from 'rxjs'

export function preloadImage(url: string) {
    return new Observable((subscriber) => {
        const request = new XMLHttpRequest()
        request.open('get', url)
        request.send()

        request.onerror = () =>
            subscriber.error(new Error(`Error loading image ${url}`))

        request.ontimeout = () =>
            subscriber.error(new Error(`Request timeout: ${url}`))

        request.onreadystatechange = () => {
            if (request.readyState !== 4) {
                return
            }
            request.status === 200
                ? subscriber.complete()
                : subscriber.error(new Error(`Error loading image ${url} (HTTP response status: ${request.status})`))
        }

        request.onprogress = ({ loaded, total }) =>
            subscriber.next(loaded / total)

        return () => {
            request.onerror = null
            request.ontimeout = null
            request.onreadystatechange = null
            request.abort()
        }
    })
}
