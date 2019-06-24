# RxJS helper for preloading images

* get download progress details
* make sure the browser hits cache if the preloaded image is requested later on

## Usage

The `preloadImage` function exposes an observable which:
* emits progress values between `0` and `1` (where `0` corresponds to a progress of `0%` and `1` corresponds to `100%`);
* completes once the image has been successfuly preloaded.

Example:
```typescript
preloadImage('url/to/some-image.jpg')
    .subscribe({
        next: progress => console.log(`Preload progress: ${progress}`),
        complete: () => console.log('Preload complete!')
    })

// Sample output:
//
// > Preload progress: 0.1
// > Preload progress: 0.25
// > Preload progress: 0.481
// > Preload progress: 0.7
// > Preload progress: 1
// > Preload complete!
```