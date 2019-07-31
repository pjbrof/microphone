window.onload = function() {
  const mic = document.querySelector(".circle");
  const audio = new Audio(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/358807/f1_radio.wav"
  );

  mic.addEventListener("click", () => {
    //audio.play();
    startStream();
  });

  const hasGetUserMedia = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  };

  const startStream = () => {
    if (hasGetUserMedia()) {
      const constraints = {
        video: false,
        audio: true
      };

      navigator.mediaDevices.getUserMedia(constraints).then(stream => {
        var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        var src = audioCtx.createMediaStreamSource(stream);
        var analyser = audioCtx.createAnalyser();
        src.connect(analyser);

        analyser.fftSize = 2048;
        var bufferLength = analyser.frequencyBinCount;
        var dataArray = new Uint8Array(bufferLength);

        var width =
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth;

        var height =
          window.innerHeight ||
          document.documentElement.clientHeight ||
          document.body.clientHeight;

        const canvas = document.getElementById("viz");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.webkitImageSmoothingEnabled = true;

        const halfWidth = canvas.width / 2;
        const halfHeight = canvas.height / 2;

        const draw = () => {
          analyser.getByteTimeDomainData(dataArray);

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.beginPath();
          ctx.arc(
            halfWidth,
            halfHeight,
            Math.abs(dataArray[0]),
            0,
            2 * Math.PI
          );
          ctx.fillStyle = "rgba(256,256,256,0.3)";
          ctx.fill();

          requestAnimationFrame(draw);
        };

        requestAnimationFrame(draw);
      });
    } else {
      console.log("This app is not supported by your browser");
    }
  };
};
