window.jQuery = Zepto;
var Gallery = {};

Gallery.image = (function() {
    "use strict";

    var images = [
        "img1.jpg",
        "img2.jpg",
        "img3.jpg",
        "img4.jpg",
        "img2.jpg",
        "img3.jpg",
        "img4.jpg",
        "img2.jpg",
        "img3.jpg",
        "img1.jpg",
    ];

    var canvas = [];
    var ctx = [];
    var imageObj = [];

    function go() {
        $('<div/>')
          .html(new Array(1000).join('text')) // div with a text 
      .click(function() { })
    }

    return {
        init: function () {

            $("#content").on("click","canvas", function(event){
                var canvas = $(this)[0];

                console.log(canvas);
                var canvasFullscreen = document.getElementById("fullscreen-img");
                var ctx = canvasFullscreen.getContext("2d");
                var pixelRatio = window.devicePixelRatio;
                ctx.scale(pixelRatio, pixelRatio);

                var image = new Image();
                image.id = "pic"

                image.onload = function () {
                    var maxWidth = document.width-80;
                    var maxHeight = document.height-40;
                    var ratio = 1;

                    if (image.height > image.width && image.height > maxHeight) {
                        ratio = maxHeight / image.height;
                        var sourceWidth = image.width * ratio;
                        var sourceHeight = image.height * ratio;
                    } else  if (image.width > maxWidth) {
                        ratio = maxWidth / image.width;
                        var sourceWidth = image.width * ratio;
                        var sourceHeight = image.height * ratio;
                    }
                    
                    canvasFullscreen.width = image.width*ratio;
                    canvasFullscreen.height = image.height*ratio;

                    console.log("Ratio: " + ratio);

                    console.log("Max w: " + maxWidth);
                    console.log("Max h: " + maxHeight);

                    console.log("Src w: " + sourceWidth);
                    console.log("Src h: " + sourceHeight);

                    console.log("Dest w: " + canvasFullscreen.width);
                    console.log("Dest h: " + canvasFullscreen.height);

                    ctx.drawImage(image, 0,0, sourceWidth, sourceHeight);
                   
                };
                
                image.src = "img/"+images[canvas.id];
              //  image.src = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                canvasFullscreen.parentNode.style.visibility='visible';

                console.log(ctx);
            });

            for (var i = 0; i < images.length; i++) {
                console.log(i);
                canvas[i] = document.createElement("canvas");
                canvas[i].id = i;
                canvas[i].className = "thumb";

                ctx[i] = canvas[i].getContext("2d");
                var pixelRatio = window.devicePixelRatio;
                ctx[i].scale(pixelRatio, pixelRatio);

                imageObj[i] = new Image();
                
                imageObj[i].onload = (function(n){
                    return function(){
                        canvas[n].width = 300;
                        canvas[n].height = 250;
                        var sourceX = 0;
                        var sourceY = 0;
                        var destX = 0;
                        var destY = 0;
                    // http://zsprawl.com/iOS/2012/03/cropping-scaling-images-with-canvas-html5/
                    if (imageObj[n].height > imageObj[n].width) {
                        console.log("Portrait");
                        var stretchRatio = ( imageObj[n].width / canvas[n].width );
                        var sourceWidth = Math.floor(imageObj[n].width);
                        var sourceHeight = Math.floor(canvas[n].height*stretchRatio);
                        sourceY = Math.floor((imageObj[n].height - sourceHeight)/2);
                      } else {
                        console.log("Landscape");                    
                        var stretchRatio = ( imageObj[n].height / canvas[n].height );
                        var sourceWidth = Math.floor(canvas[n].width*stretchRatio);
                        var sourceHeight = Math.floor(imageObj[n].height);
                        sourceX = Math.floor((imageObj[n].width - sourceWidth)/2);
                      }            
                      var destWidth = Math.floor(canvas[n].width / pixelRatio);
                      var destHeight = Math.floor(canvas[n].height / pixelRatio);

                        ctx[n].drawImage(imageObj[n], sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
                    }
                }(i));
                imageObj[i].src = "img/"+images[i];
                document.getElementById('content').appendChild(canvas[i]);
            };
        },

        LeakMemory: function (){
            var interval = setInterval(go, 10)
        }
    }
})();


//window.onload = function(){
$(function() {
    Gallery.image.init();
    //Gallery.image.LeakMemory();

    
	
});