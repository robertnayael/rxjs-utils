import { Observable } from 'rxjs'

import { preloadImage } from './'

describe('preloadImage', () => {

    it('should return observable', () => {
        const result =  preloadImage('')
        expect(result).toBeInstanceOf(Observable)
    })

    it('should begin preloading on subscription', () => {
    })

    it('should abort preloading on unsubscription', () => {
    })

    it('should report preloading progress', () => {
    })

    it('should complete once preloading is done', () => {
    })

    it('should throw on http error', () => {
    })

    it('should throw on timeout', () => {
    })

})
