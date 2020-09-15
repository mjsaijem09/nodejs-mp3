(function () {

  var AudioContext = window.AudioContext || window.webkitAudioContext
  var oldNode
  var audioContext
  var playing = false
  var file
  var pauseButton
  var analyser

  const MAXBYTE = 255
  const HALFBYTE = 128
  const PI2 = Math.PI * 2

  //sizing info
  var container = document.querySelector("#container")
  var clientWidth, clientHeight
  var offset
  var ORIGIN
  const smallScreen = 750

  var canvas = document.getElementById("scope");
  var ctx = canvas.getContext('2d');
  setSizingInfo()

  ctx.font = `${factor>smallScreen?150:100}% monospace`
  ctx.fillStyle = "#97DEF0"
  ctx.textAlign = "center"
  ctx.fillText('Please select a track', ORIGIN.x, ORIGIN.y)

  /*** main method ***/
  analyzeTrack = (audioContext, srcNode) => {

      analyser = audioContext.createAnalyser();
      analyser.fftSize = 512
      analyser.connect(audioContext.destination);
      srcNode.connect(analyser);

      //fftSize/2 = frequency bin count
      //var frequencies = new Uint8Array(analyser.frequencyBinCount);
      var waveform = new Uint8Array(analyser.fftSize);
      setSizingInfo()

      /*main drawing function*/
      //var i = 0;
      const loop = (time) => {
          //var t0 = performance.now();

          requestAnimationFrame(loop)
          analyser.getByteTimeDomainData(waveform)
          //analyser.getByteFrequencyData(frequencies)
          ctx.clearRect(0, 0, canvas.width, canvas.height)

          //loop init variables
          const MAX = Math.max(...waveform)
          const growthFactor = MAX / MAXBYTE

          //GROWTH FACTOR IS .5 on pure silence                    
          var colorfunc = growthFactor > .85 ? complement : growthFactor > .75 ? triad : analog

          //top left diagonal
          let start = new Point(offset, offset)
          let hue = 320 * growthFactor
          DoubleSlopedLine(ctx, start, ORIGIN, hsl(hue), colorfunc(hue),
              waveform, .15)

          //bottom left diagonal
          start = new Point(offset, canvas.height - offset)
          hue = 210 * growthFactor
          DoubleSlopedLine(ctx, start, ORIGIN, hsl(hue), colorfunc(hue),
              waveform, .15)

          //top right diagonal
          start = new Point(canvas.width - offset, offset)
          hue = 200 * growthFactor
          DoubleSlopedLine(ctx, start, ORIGIN, hsl(hue), colorfunc(hue),
              waveform, .15)

          //bottom right diagonal
          hue = 340 * growthFactor
          start = new Point(canvas.width - offset, canvas.height - offset)
          DoubleSlopedLine(ctx, start, ORIGIN, hsl(hue), colorfunc(hue), waveform,
              .15)

          Box(ctx, offset, offset, canvas.width - offset * 2, canvas.height - offset *
              2, waveform, growthFactor, colorfunc)

          //center woofer
          hue = growthFactor * 360
          let radius = factor * .08
          radius = radius + radius * (growthFactor - .5)
          let cf = growthFactor > .8 ? analog : twin
          Circle(ctx, ORIGIN, radius, hsl(hue), cf(hue))

          //var t1 = performance.now();
          //console.log("requestAnimFrame took:" + (t1 - t0) + " milliseconds.");
      }

      if(srcNode instanceof MediaElementAudioSourceNode){
          srcNode.created = true
      } else {
          srcNode.start()   
      }
      playing = true

      loop()
      return srcNode
  }

  /*** colors ***/
  var hsl = (h, s = "100%", l = "50%") => {
      return `hsl(${h}, ${s}, ${l})`
  }
  var changingColor = (change, h, s = "100%", l = "50%") => {
      h = h * change
      return `hsl(${h}, ${s}, ${l})`
  }
  var complement = (h, s = "100%", l = "50%") => {
      h = h - 180
      return `hsl(${h}, ${s}, ${l})`
  }
  var triad = (h, s = "100%", l = "50%") => {
      h = h - 120
      return `hsl(${h}, ${s}, ${l})`
  }
  var cousin = (h, s = "100%", l = "50%") => {
      h = h - 90
      return `hsl(${h}, ${s}, ${l})`
  }
  var analog = (h, s = "100%", l = "50%") => {
      h = h - 30
      return `hsl(${h}, ${s}, ${l})`
  }
  var twin = (h, s = "100%", l = "50%") => {
      h = h - 10
      return `hsl(${h}, ${s}, ${l})`
  }

  /*** canvas painters ***/
  var HorizontalLine = (ctx, x, y, data, length, color, multiplier) => {

      ctx.beginPath()
      ctx.moveTo(x, y)
      data.forEach((w, i) => {
          ctx.lineTo(WaveAxis(i, length) + x, valueScale(w, canvas.height, i,
                  multiplier) +
              y)
      })
      ctx.strokeStyle = color;
      ctx.stroke()
  }

  var VerticalLine = (ctx, x, y, data, length, color, multiplier) => {
      ctx.beginPath()
      ctx.moveTo(x, y)
      data.forEach((w, i) => {
          ctx.lineTo(valueScale(w, canvas.height, i, multiplier) + x, WaveAxis(i,
              length) + y)
      })
      ctx.strokeStyle = color;
      ctx.stroke()

  }

  var Box = (ctx, x, y, width, height, waves, growthFactor, colorFunc) => {

      const pixels = 4

      //top of box
      let hue = growthFactor * 500
      HorizontalLine(ctx, x, y, waves, width, hsl(hue), .2)
      HorizontalLine(ctx, x, y + pixels, waves, width, colorFunc(hue), .2)

      //left side
      hue = growthFactor * 500
      VerticalLine(ctx, x, y, waves, height, hsl(hue), .1)
      VerticalLine(ctx, x + pixels, y, waves, height, colorFunc(hue), .1)

      //bottom
      hue = growthFactor * 500
      HorizontalLine(ctx, x, height + y, waves, width, hsl(hue), .2)
      HorizontalLine(ctx, x, height + y - pixels, waves, width, colorFunc(hue), .2)

      //right side
      hue = growthFactor * 500
      VerticalLine(ctx, width + x, y, waves, height, hsl(hue), .1)
      VerticalLine(ctx, width + x - pixels, y, waves, height, colorFunc(hue), .1)

      const RADIUS = factor * .05

      //top left corner
      let point = new Point(x, y)
      Circle(ctx, point, RADIUS, "blue", "#7B68EE")

      //bottom right corner
      point = new Point(width + x, height + y)
      Circle(ctx, point, RADIUS, "blue", "#7B68EE")

      //top right corner
      point = new Point(width + x, y)
      Circle(ctx, point, RADIUS, "#7B68EE", "blue")

      //bottom left corner
      point = new Point(x, height + y)
      Circle(ctx, point, RADIUS, "#7B68EE", "blue")

  }

  var SlopeValue = (i, byteValue, x, m, scale, multiplier) => {
      multiplier = multiplier || 1

      let adjustedPercent = (byteValue - HALFBYTE) / MAXBYTE
      let b = adjustedPercent * scale * multiplier
      b = b * cosine(i)
      m = m === Infinity ? 0 : m
      y = (m * x + b)
      return y
  }

  var SlopeLine = (ctx, p1, p2, color, data, multiplier) => {

      const width = p2.x - p1.x
      const height = p2.y - p1.y
      const slope = height / width
      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)
      data.forEach((w, i) => {

          let deltaX = WaveAxis(i, width)
          ctx.lineTo(deltaX + p1.x, SlopeValue(i, w, deltaX, slope, canvas.width,
              multiplier) + p1.y)
      })
      ctx.strokeStyle = color;
      ctx.stroke()
  }

  var DoubleSlopedLine = (ctx, p1, p2, color1, color2, data, multiplier) => {
      SlopeLine(ctx, p1, p2, color1, data, multiplier)
      const pixels = 5
      let newStart = new Point(p1.x + pixels, p1.y)
      let newEnd = new Point(p2.x + pixels, p2.y)
      SlopeLine(ctx, newStart, newEnd, color2, data, multiplier)

  }

  var Circle = (ctx, p, r, color1, color2) => {

      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, PI2, true)
      ctx.fillStyle = color1
      ctx.fill()
      ctx.beginPath()
      ctx.arc(p.x, p.y, (2 * r) / 3, 0, PI2, true)
      ctx.fillStyle = color2
      ctx.fill()

  }

  var valueScale = (byteValue, availableWidth, index, multiplier) => {
      //y values for waveform decibels are from 0-255 with 128 being "0"                  
      multiplier = multiplier || 1
      value = ((byteValue - HALFBYTE) / MAXBYTE * (availableWidth)) * multiplier
      return (value * cosine(index))
  }

  var WaveAxis = (i, totalWidth) => {
      return i / analyser.fftSize * (totalWidth)
  }


  /*** HELPERS ***/
  var readAudioFile = (context, file) => {

      var reader = new FileReader();
      var src = context.createBufferSource();

      return new Promise((resolve, reject) => {

          reader.onload = function (e) {
              var arrayBuffer = e.currentTarget.result;
              context.decodeAudioData(arrayBuffer, function (audioBuffer) {
                  src.buffer = audioBuffer;
                  resolve(src);
              })
          }
          reader.readAsArrayBuffer(file);
      })
  }
  var readExternalUrl = (url) => {

  }

  songChanged = () => {

      file = document.querySelector("#songDropdown").files[0];
      if (!file) return false;

      if (audioContext) audioContext.close();
      audioContext = new AudioContext()

      //change to spinner while loading:
      pauseButton = document.querySelector(".pause")
      pauseButton.style["pointer-events"] = "none"
      pauseButton.classList.remove("fa-play")
      pauseButton.classList.add("fa-pause")
      pauseButton.classList.add("fa-spin")

      readAudioFile(audioContext, file).then(srcNode => {
          srcNode.onended = function (event) {
              audioContext.close();
              playing = false;
              //if we get to end of track change button back to play.
              pauseButton.classList.remove("fa-pause")
              pauseButton.classList.add("fa-play")
          }.bind(this);
          oldNode = analyzeTrack(audioContext, srcNode);

          //song should be playing, so stop spinning:
          pauseButton.style["pointer-events"] = "auto"
          pauseButton.classList.remove("fa-spin")


      }).catch(reason => {
          console.log("Song changed():" + reason);
      })
  }

  function hann(i) {
      /*https://github.com/scijs/window-function*/
      return 0.5 * (1 - Math.cos(6.283185307179586 * i / (analyser.fftSize - 1)))
  }

  function cosine(i) {
      return Math.sin(3.141592653589793 * i / (analyser.fftSize - 1))
  }

  function setSizingInfo() {
      const cssWidth = clientWidth = container.clientWidth;
      const cssHeight = clientHeight = container.clientHeight;

      factor = clientWidth > clientHeight ? clientHeight : clientWidth
      offset = factor > smallScreen ? 110 : 70

      if (canvas.width !== cssWidth || canvas.height !== cssHeight) {
          canvas.width = cssWidth;
          canvas.height = cssHeight;
      }
      ORIGIN = new Point(canvas.width / 2, canvas.height / 2)
      ctx.lineWidth = factor > 1200 ? 9 : (factor > 1000 ? 7 : (factor > 750 ? 5 : (factor > 640 ? 4 : (
          factor > 500 ? 3 : (factor > 360 ? 2 : 1)))))
      console.log(`factor:${factor},linewidth:${ctx.lineWidth}`)
  }

  function Point(x, y) {
      this.x = x;
      this.y = y;
  }

  function getRandomInt(min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min)) + min
      //The maximum is exclusive and the minimum is inclusive -mdn
  }

  autoPlay = () => {
      
      if (audioContext) audioContext.close();
      audioContext = new AudioContext()
      let audio = new Audio()
      
      audio.crossOrigin = "anonymous"
      audio.src = "https://cors-anywhere.herokuapp.com/http://us4.internet-radio.com:8266/;stream"
      audio.type = "audio/mpeg"    
      audio.preload = "preload"
      audio.autoplay = "autoplay"
   
      audio.volume = 1;
      let src = audioContext.createMediaElementSource(audio);
      analyzeTrack(audioContext, src)

  }
  pauseSong = (el) => {
      if(!pauseButton) pauseButton = document.querySelector(".pause")
      if (!audioContext) {
          return false;
      }
      if (audioContext.state === 'running') {
          //pause:
          audioContext.suspend().then(function () {
              playing = false;
              pauseButton.classList.remove("fa-pause")
              pauseButton.classList.add("fa-play")
          }.bind(this));
      } else if (!playing && audioContext.state === 'suspended') {
          //resume:
          audioContext.resume().then(function () {
              playing = true;
              pauseButton.classList.remove("fa-play")
              pauseButton.classList.add("fa-pause")
          }.bind(this));
      } else if (!playing && audioContext.state === 'closed') {
          //play last selected song:
          songChanged();
      } else {

      }
  }

})("Visit me at sweaverD.com");