const fs = require('fs');
const ytdl = require('ytdl-core');
const util = require('util')
const fsAccessAsync = util.promisify(fs.access)
let spawn = require('child_process').spawn
const exec = require('child_process').exec
const readline = require('readline')
const path = require('path')
let videoWriteStream;
let ffmpeg;

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

let defaultVideoOptions = {videoName: 'video', fps: 1, imgFileName: "img", downloadLocation: path.resolve(__dirname)}

const setOptions = (options) => {
  options.fps = options.fps < 1 ? 1 : options.fps
  defaultVideoOptions = Object.assign(defaultVideoOptions, options)
}

const getOptions = () => defaultVideoOptions

const changeDownloadLocationToCwd = () => {
  let optionsWithNewDownloadLocation = Object.assign(getOptions(), {downloadLocation: path.resolve(__dirname)})
  setOptions(optionsWithNewDownloadLocation)
  checkThatFfmpegIsInstalled()
}

const checkThatFfmpegIsInstalled = () => {
  exec('brew list | grep ffmpeg', (err, stdout, stderr) => {
    if(err || stderr) {
      promptUser()
    }
    else {
      downloadVideo()
    }
  })
}

const ensureDirExists = () => {
  let path = getOptions().downloadLocation
  return fsAccessAsync(path, fs.constants.R_OK | fs.constants.W_OK)
}

const errAndExit = (msg) => {
  console.error(msg)
  process.exit()
}

const downloadVideo = () => {
  options = Object.assign(defaultVideoOptions, {})
  videoWriteStream = fs.createWriteStream(`${options.videoName}.mp4`)
  ytdl(options.videoUrl).pipe(videoWriteStream);
  videoWriteStream.on('open', (data) => {
    console.log("Downloading video before converting to frames.")
  })
  videoWriteStream.on('error', (err) => {
    errAndExit(err)
  })
  videoWriteStream.on('close', () => {
    let pluralOrSingular = options.fps > 1 ? 'frames' : 'frame'
    console.log(`Finished downloading video. Now screenshotting ${options.fps} ${pluralOrSingular} per second.`)
    convertVideoToFrames()
  })
}

const convertVideoToFrames = () => {
  let options = getOptions()
  let ffmpegVideoFrameProcess = spawn('ffmpeg', [
   '-i', `./${options.videoName}.mp4`,
   '-f', 'image2',
   '-bt', '20M',
   '-vf', `fps=${options.fps}`,
   `./${options.imgFileName}%03d.jpg`
  ])

  ffmpegVideoFrameProcess.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  ffmpegVideoFrameProcess.stderr.on('data', (err) => {
    console.log(err.toString());
  });

  ffmpegVideoFrameProcess.stdout.on('close', (data) => {
    process.exit()
  });
}

const installFfmpegUsingBrew = () => {
  console.log("Installing ffmpeg")
  let imagemagickInstall = spawn('brew', ['install', 'ffmpeg'])
  imagemagickInstall.stderr.on('data', (data) => {
    console.log(data.toString('utf8'));
  });
  imagemagickInstall.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  imagemagickInstall.on('exit', (data) => {
    console.log("Finished instaling ffmpeg.")
    downloadVideo()
  });
}

const checkOperatingSystemForMac = () => {
  exec('uname -s', (err, stdout, stderr) => {
    stdout = stdout.trim()
    if(stdout === 'Darwin') {
      installFfmpegUsingBrew()
    }
  })
}


const promptUser = () => {
  rl.question('Looks like you do not have ffmpeg installed. \n\nThis module requires ffmpeg for the video to frame conversion.\n\nWould you like to install it?  Yes or No?', (answer) => {
    answer = answer.trim()
    if(answer === 'y' || 'yes' ) {
      checkOperatingSystemForMac()
    }
    else {
      rl.close()
    }
  })
}


module.exports = (videoUrl, options = {}) => {
  let errMsg;
  if(!videoUrl || typeof videoUrl != 'string') {
    errMsg = 'Looks like you forgot to pass a url. Try passing the youtube url of the video you want converted.'
    errAndExit(errMsg)
  }
  let youtubeRegex = /https?:\/\/(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed|time_continue)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/
  if (youtubeRegex.test(videoUrl)) {
    options = Object.assign({}, {videoUrl}, options)
    setOptions(options)
    if(options.downloadLocation !== path.resolve(__dirname)) {
      ensureDirExists().then(res => checkThatFfmpegIsInstalled()).catch(err => changeDownloadLocationToCwd())
    }
  }
  else {
    errMsg = "You didn't pass a valid Youtube url. Try passing a youtube url such as https://www.youtube.com/watch?v=9sxMr4IdXaU"
    errAndExit(errMsg)
  }
}
