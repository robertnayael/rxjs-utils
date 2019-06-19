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

## Under the hood

This utility requires two API's: `XMLHttpRequest` and `Image`. The former provides progress information and does the actual fetching; the `Image` object is then created, and its `src` set to the image URL.

The rationale for using these two is that with `XHMHttpRequest` alone, browser don't seem to hit the cache if the same resource is later requested in a non-AJAX context, e.g. if you set a `background-image` property in CSS. Whereas with `Image` alone, there's no way to check the download progress, and that information might be quite useful.