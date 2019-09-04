import { Observable, Subscription } from 'rxjs'
import { newMockXhr } from 'mock-xmlhttprequest'

import { preloadImage } from './'

jest.useFakeTimers()

describe('preloadImage', () => {

    let xhr: any
    let request: any
    let subscription: Subscription

    beforeEach(() => {
        subscription && subscription.unsubscribe()
        subscription = null

        request = {}
        xhr = newMockXhr()
        xhr.onSend = currentRequest => request = currentRequest
        global['XMLHttpRequest'] = xhr
    })

    it('should return observable', () => {
        const preloader = preloadImage('')

        expect(preloader).toBeInstanceOf(Observable)
    })

    it('should not begin preloading until subscribed to', () => {
        let preloadingStarted = false
        xhr.onSend = () => preloadingStarted = true

        const preloader = preloadImage('some-image.jpg')
        jest.runAllTimers()

        expect(preloadingStarted).toBe(false)
    })

    it('should begin preloading on subscription', () => {
        let preloadingStarted = false
        xhr.onSend = () => preloadingStarted = true

        const preloader = preloadImage('some-image.jpg')
        subscription = preloader.subscribe()
        jest.runAllTimers()

        expect(preloadingStarted).toBe(true)
    })

    it('should abort preloading on unsubscription', () => {
        const preloader = preloadImage('some-image.jpg')
        subscription = preloader.subscribe(() => { })
        jest.runAllTimers()

        expect(request.readyState).toBe(1)

        subscription.unsubscribe()
        jest.runAllTimers()

        expect(request.readyState).toBe(0)
    })

    it('should report preloading progress', () => {
        let progress = null

        const preloader = preloadImage('some-image.jpg')
        subscription = preloader.subscribe(p => progress = p)
        jest.runAllTimers()

        request.setResponseHeaders()
        request.downloadProgress(1, 10)
        expect(progress).toBe(0.1)
        request.downloadProgress(5, 10)
        expect(progress).toBe(0.5)
        request.downloadProgress(10, 10)
        expect(progress).toBe(1)
    })

    it('should complete once preloading is done', () => {
        let completed = false

        const preloader = preloadImage('some-image.jpg')
        subscription = preloader.subscribe({ complete: () => completed = true })
        jest.runAllTimers()

        expect(completed).toBe(false)
        request.respond(200)
        expect(completed).toBe(true)
    })

    it('should throw on http error', () => {
        let error = false

        const preloader = preloadImage('some-image.jpg')
        subscription = preloader.subscribe({ error: () => error = true })
        jest.runAllTimers()

        expect(error).toBe(false)
        request.respond(404)
        expect(error).toBe(true)
    })

    it('should throw on timeout', () => {
        let error = false

        const preloader = preloadImage('some-image.jpg')
        subscription = preloader.subscribe({ error: () => error = true })
        jest.runAllTimers()

        expect(error).toBe(false)
        request.setRequestTimeout()
        expect(error).toBe(true)
    })

})
