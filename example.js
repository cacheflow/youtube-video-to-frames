let youtubeVideoToFrames = require('./index.js')
let youtubeUrl = 'https://www.youtube.com/watch?v=9sxMr4IdXaU'
let options = {videoName: 'cat', fps: 1, imgFileName: "cat", downloadLocation: './'}
youtubeVideoToFrames(youtubeUrl, options)