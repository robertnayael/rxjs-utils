# RxJS helper for preloading images

With this utility, you can preload an image so it’s instantly available for the browser. 

It’s intended for scenarios where you’re not really interesed in getting the actual contents of the image file, but you need to make sure to that if that file is requested later on (e.g. from a stylesheet), the browser will have already downloaded it and will use the cached version*. For instance, you might want to display an overlay that covers a part of your app that makes no sense, or simply doesn’t look that great, without these images.

Note that while it emits no file contents, it does report preload progress so that you can improve UX even more: not just by hiding areas that are not ready to be revealed yet, but also by showing the user *when* they will be ready.

<small>_* This, of course, will fail if browser cache is disabled for whatever reason._</small>

## Usage

```typescript
preloadImage(url: string): Observable<number>
```

The function accepts a string parameter that points to the requested image, and exposes an `Observable` which:
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