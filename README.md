# youtube-video-to-frames

Download and convert a youtube video to pictures/frames.

![youtube-video-to-frames](https://c1.staticflickr.com/4/3318/3219874303_134538d190_b.jpg)

## Installation

## Usage:

Install the package with:

```
npm install --save youtube-video-to-frames
```
## How to use
youtube-video-to-frames takes two arguments. The first is the youtube url of the video you want to convert to frames. The second is an options object. The options object takes four arguments: videoName, fps, imgFileName, and downloadLocation.

```js
let youtubeVideoToFrames = require('youtube-video-to-frames')
let youtubeUrl = 'https://www.youtube.com/watch?v=9sxMr4IdXaU'
let options = {videoName: 'video', fps: 1, imgFileName: "img", downloadLocation: './'}
youtubeVideoToFrames(youtubeUrl, options)
```

## Options
By default the options object internally has the default values 

```js
{videoName: 'video', fps: 1, imgFileName: "img", downloadLocation: './'}
```
All of the above values can be overwritten. The first value(videoName) is the name the video will be saved as on your computer before it's converted. The second value(fps) stands for frames per second. This is the number of frames that will be screenshotted for you per second. The third property is the name you want to give the frames when they're downloaded, which will be the name combined with the frame number. For example, if you pass an image name of myImage and there's 100 screenshots the names will range from myImage001-myImage100. Finally the last argument is the download location for your frames. 

# Example
node example.js
### Usage

```js
let youtubeVideoToFrames = require('./index.js')
let youtubeUrl = 'https://www.youtube.com/watch?v=9sxMr4IdXaU'
let options = {videoName: 'cat', fps: 1, imgFileName: "cat", downloadLocation: './'}
youtubeVideoToFrames(youtubeUrl, options)
```
The output of the above example will save 692 frames from the video to the root directory:

## License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.