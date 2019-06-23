import { Observable, Subscriber } from 'rxjs'

export function preloadImage(url: string) {
    return new Observable<number>((subscriber) => {
        const request = setupRequest(url, subscriber)
        return teardownRequest(request)
    })
}

function setupRequest(url: string, subscriber: Subscriber<number>) {
    const request = new XMLHttpRequest()
    request.open('get', url)
    request.send()

    request.onerror = () =>
        subscriber.error(new Error(`Error loading image ${url}`))

    request.ontimeout = () =>
        subscriber.error(new Error(`Request timeout: ${url}`))

    request.onprogress = ({ loaded, total }) =>
        subscriber.next(loaded / total)

    request.onreadystatechange = () => {
        if (request.readyState !== 4) {
            return
        }
        request.status === 200
            ? subscriber.complete()
            : subscriber.error(
                new Error(`Error loading image ${url} (HTTP response status: ${request.status})`),
            )
    }

    return request
}

function teardownRequest(request: XMLHttpRequest) {
    return () => {
        request.onerror = null
        request.ontimeout = null
        request.onreadystatechange = null
        request.abort()
    }
}
