if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

var Thesis = {};

Thesis.Settings = (function () {
    return {
        device: {
            phonegap: false,
            tizen: false,
            firefox: false,
        },

        isPhoneGap: function () {
            return this.device.phonegap;
        },

        isTizen: function () {
            return this.device.tizen;
        },

        isFireFox: function () {
            return this.device.firefox;
        }
    }
})();

Thesis.Gallery = (function() {
    var s = null;
    
    return {
        settings: {
            this: null,
            maxWidth: 0,
            maxHeight: 0,
            min: 0,
            max: 10,
            step: 10,
            fileList: [],
            fullscreenImg: {
                fullPath: null,
                imageData: null,
                angle: 0
            }
        },

        init: function () {
            console.log("INIT");
            
            s = this.settings;
            s.this = this;

            s.maxWidth = Math.floor(($(document).width()-12-40) / 2);
            s.maxHeight = Math.floor((($(document).width()-12-40) / 2)*0.8);
  
            document.getElementById("ratio").innerHTML = s.maxWidth + " - " + s.maxHeight;

            if(Thesis.Settings.isPhoneGap()) {
                var printDirPath = function(fileList){
                    console.log("DIRS: " + JSON.stringify(fileList) );

                    Thesis.Gallery.bindUIActions(fileList);
                    Thesis.Gallery.loadGallery(fileList, 10);
                }

                Thesis.PhoneGap.listDirectory("DCIM/Camera","jpg",printDirPath);  
            } else {
                var fileList = [
                                {   name: "img1.jpg",
                                    fullPath: "img/img1.jpg" },
                                    {   name: "img2.jpg",
                                        fullPath: "img/img2.jpg" },
                                        {   name: "img3.jpg",
                                            fullPath: "img/img3.jpg" },
                                            {   name: "img4.jpg",
                                                fullPath: "img/img4.jpg" },
                                                {   name: "img1.jpg",
                                                    fullPath: "img/img1.jpg" },
                                                    {   name: "img2.jpg",
                                                        fullPath: "img/img2.jpg" },
                                                        {   name: "img3.jpg",
                                                            fullPath: "img/img3.jpg" },
                                                            {   name: "img4.jpg",
                                                                fullPath: "img/img4.jpg" },
                                                                {   name: "img1.jpg",
                                                                    fullPath: "img/img1.jpg" },
                                                                    {   name: "img1.jpg",
                                                                        fullPath: "img/img1.jpg" },
                                                                        {   name: "img2.jpg",
                                                                            fullPath: "img/img2.jpg" },
                                                                            {   name: "img3.jpg",
                                                                                fullPath: "img/img3.jpg" },
                                                                                {   name: "img4.jpg",
                                                                                    fullPath: "img/img4.jpg" },
                                                                                    {   name: "img1.jpg",
                                                                                        fullPath: "img/img1.jpg" },
                                                                                        {   name: "img2.jpg",
                                                                                            fullPath: "img/img2.jpg" },
                                                                                            {   name: "img3.jpg",
                                                                                                fullPath: "img/img3.jpg" },
                                                                                                {   name: "img4.jpg",
                                                                                                    fullPath: "img/img4.jpg" },
                                                                                                    {   name: "img1.jpg",
                                                                                                        fullPath: "img/img1.jpg" },
                                                                                                        {   name: "img2.jpg",
                                                                                                            fullPath: "img/img2.jpg" },
                                                                                                            {   name: "img3.jpg",
                                                                                                                fullPath: "img/img3.jpg" },
                                                                                                                {   name: "img4.jpg",
                                                                                                                    fullPath: "img/img4.jpg" },
                                                                                                                    {   name: "img1.jpg",
                                                                                                                        fullPath: "img/img1.jpg" },
                                                                                                                        {   name: "img2.jpg",
                                                                                                                            fullPath: "img/img2.jpg" },
                                                                                                                            {   name: "img3.jpg",
                                                                                                                                fullPath: "img/img3.jpg" },
                                                                                                                                {   name: "img4.jpg",
                                                                                                                                    fullPath: "img/img4.jpg" },
                                                                                                                                    {   name: "img1.jpg",
                                                                                                                                        fullPath: "img/img1.jpg" },
                                                                                                                                        ];
                this.bindUIActions(fileList);
                this.loadGallery(fileList, s.step);
            }

        },

        bindUIActions: function (images) {
            if(s.fileList.length == 0) {
                s.fileList = images;
            }


            $(window).scroll(function() {
                var g = Thesis.Gallery;
                if($(window).scrollTop() == $(document).height() - $(window).height()) {
                    g.loadGallery(g.settings.fileList, g.settings.step);    

                }
            });

            $("#fullscreen-image-container").on("click", function(event){
                $(this).parent().hide();
            });

            $("#rotate-left").on("click", function(event){
                console.log("Rotate left.");
                var canvas = document.getElementById("fullscreen-img");
                var image = s.fullscreenImg.imageData;

                s.this.rotateCanvas(canvas, image, s.fullscreenImg.angle -= 30);
            }); 

            $("#rotate-right").on("click", function(event){
                console.log("Rotate right.");
                var canvas = document.getElementById("fullscreen-img");
                var image = s.fullscreenImg.imageData;
                           
                s.this.rotateCanvas(canvas, image, s.fullscreenImg.angle += 30);
            });

            $("#invert").on("click", function(event){
                console.log("Rotate right.");
                var canvas = document.getElementById("fullscreen-img");
                var image = s.fullscreenImg.imageData;

                s.this.invertCanvas(canvas, image);
            });          

            $("#content").on("click","canvas", function(event){
                var canvas = $(this)[0];

                console.log(canvas);
                var canvasFullscreen = document.getElementById("fullscreen-img");
                canvasFullscreen.setAttribute("data-id",canvas.id);
                
                var ctx = canvasFullscreen.getContext("2d");
                var pixelRatio = window.devicePixelRatio;
                ctx.scale(pixelRatio, pixelRatio);

                var image = new Image();
                image.id = "pic"

                image.onload = function () {
                    var maxWidth = $(window).width()-100;
                    var maxHeight = $(window).height()-100;
                    var ratio = 1;

                    ratio = maxWidth / image.width;
                    var sourceWidth = image.width * ratio;
                    var sourceHeight = image.height * ratio;

                    if (image.height > image.width) {
                        ratio = maxHeight / image.height;
                        var sourceWidth = image.width * ratio;
                        var sourceHeight = image.height * ratio;
                    } else if(sourceHeight > maxHeight) {
                        ratio = maxHeight / image.height;
                        sourceWidth = image.width * ratio;
                        sourceHeight = image.height * ratio;
                    }

                    canvasFullscreen.width = image.width*ratio;
                    canvasFullscreen.height = image.height*ratio;

                    /*
                    console.log("Ratio: " + ratio);

                    console.log("Max w: " + maxWidth);
                    console.log("Max h: " + maxHeight);

                    console.log("Src w: " + sourceWidth);
                    console.log("Src h: " + sourceHeight);

                    console.log("Dest w: " + canvasFullscreen.width);
                    console.log("Dest h: " + canvasFullscreen.height);*/
                    
                    ctx.drawImage(image, 0,0, sourceWidth, sourceHeight);
                        
                };

                
                image.src = images[canvas.id].fullPath;
                s.fullscreenImg.imageData = image;
                
                //  image.src = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                // canvasFullscreen.parentNode.style.visibility='visible';
                $("#fullscreen").show();
                
                console.log(ctx);
            });
        }, 

        rotateCanvas: function (canvas, image, degrees) {
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.save();
            ctx.translate(canvas.width/2,canvas.height/2);
            ctx.rotate(degrees*Math.PI/180);
            if(image.height > image.width) {
                ctx.drawImage(image,-canvas.width/2,-canvas.width/2-200, canvas.width, canvas.height);    
            } else {
                ctx.drawImage(image,-canvas.width/2,-canvas.width/2+350, canvas.width, canvas.height);
            }
            
            ctx.restore();
        },

        invertCanvas: function (canvas, image) {
            var ctx = canvas.getContext("2d");
            ctx.drawImage(image,canvas.width,canvas.height);

            var imgData = ctx.getImageData(0,0,canvas.width,canvas.height);
            // invert colors
            for (var i=0;i<imgData.data.length;i+=4) {
              imgData.data[i]=255-imgData.data[i];
              imgData.data[i+1]=255-imgData.data[i+1];
              imgData.data[i+2]=255-imgData.data[i+2];
              imgData.data[i+3]=255;
            }
            ctx.putImageData(imgData,0,0);            
        },

        loadGallery: function (images, step) {
            var canvas = [];
            var ctx = [];
            var imageObj = [];
            var min = s.min;
            var max = s.max;

            if(s.fileList.length == 0) {
                s.fileList = images;
            }

            if(images.length >= min) {
                for (var i = min; i < images.length && i < max; i++) {
                    console.log(images[i].name);
                    if(!images[i].fullPath.endsWith("jpg")) {
                        console.log(images[i].name);
                        continue;
                    }

                    canvas[i] = document.createElement("canvas");
                    canvas[i].id = i;
                    canvas[i].className = "thumb";

                    ctx[i] = canvas[i].getContext("2d");

                    imageObj[i] = new Image();

                    imageObj[i].onload = (function(n){
                        return function(){
                            canvas[n].width = s.maxWidth;
                            canvas[n].height = s.maxHeight;

                            var sourceX = 0;
                            var sourceY = 0;
                            var destX = 0;
                            var destY = 0;
                            // http://zsprawl.com/iOS/2012/03/cropping-scaling-images-with-canvas-html5/
                            if (imageObj[n].height > imageObj[n].width) {
                                // console.log("Portrait");
                                var stretchRatio = ( imageObj[n].width / canvas[n].width );
                                var sourceWidth = Math.floor(imageObj[n].width);
                                var sourceHeight = Math.floor(canvas[n].height*stretchRatio);
                                //sourceY = Math.floor((imageObj[n].height - sourceHeight)/2);
                            } else {
                                //console.log("Landscape");                    
                                var stretchRatio = ( imageObj[n].height / canvas[n].height );
                                var sourceWidth = Math.floor(canvas[n].width*stretchRatio);
                                var sourceHeight = Math.floor(imageObj[n].height);
                                // sourceX = Math.floor((imageObj[n].width - sourceWidth)/2);
                            }            
                            var destWidth = Math.floor(canvas[n].width);
                            var destHeight = Math.floor(canvas[n].height);
                            /*
                        console.log("Pixelratio: " + pixelRatio);
                        console.log("Ratio: " + stretchRatio);

                        console.log("Max w: " + canvas[n].width);
                        console.log("Max h: " + canvas[n].height);

                        console.log("Src w: " + sourceWidth);
                        console.log("Src h: " + sourceHeight);

                        console.log("Dest w: " + destWidth);
                        console.log("Dest h: " + destHeight);


                        console.log("sourceY: " + sourceY);
                        console.log("sourceX: " + sourceX);
                             */
                            ctx[n].drawImage(imageObj[n], sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
                        }
                    }(i));
                    imageObj[i].src = images[i].fullPath;
                    document.getElementById('content').appendChild(canvas[i]);
                };
            };

            s.min += step;
            s.max += step;
        },
        LeakMemory: function (){
            for(var i = 0; i < 5000; i++){
                var parentDiv = document.createElement("div");
                parentDiv.onclick = function() {
                    foo();
                };
            }
        }
    }
})();

Thesis.PhoneGap = (function() {
    var rootDir = null;
    var s;

    return {
        settings: {
            
        },

        init: function () {
            Thesis.Settings.device.phonegap = true;

            s = this.settings;
            console.log("Load filesystem init");
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, this.onFileSystemSuccess, this.fail);
        },

        listDirectory: function (path, suffix, callback) {
            if(rootDir === null) {
                console.log("Error! fileSystem not initiated! run init() first!");
                return;
            }

            var dirs = path.split("/").reverse();
            var root = rootDir;

            var getDir = function(dir){
                root.getDirectory(dir, { create : false, exclusive : false}, successGet, failGet);
            };

            var successGet = function(entry){
                root = entry;
                if(dirs.length > 0){
                    getDir(dirs.pop());
                }else{
                    var directoryReader = root.createReader();
                    directoryReader.readEntries(successList,failList);
                }
            };

            var failGet = function(){
                console.log("failed to get dir " + dir);
            };

            var successList = function (entries) {
                var i;
                var dirs = [];

                for (i=entries.length-1; i >= 0; i--) {
                    if(entries[i].name.endsWith(suffix)) {
                        var dir = {
                                name: entries[i].name,
                                fullPath: entries[i].fullPath
                        }

                        dirs.push(dir);
                    }
                }
                callback(dirs);
            }

            var failList = function(error) {
                alert("Failed to list directory contents: " + error.code);
            }

            getDir(dirs.pop());
        },

        onFileSystemSuccess: function(fileSystem) {
            var g = Thesis.PhoneGap;
            console.log(fileSystem.name);
            console.log(fileSystem.root.fullPath);

            rootDir = fileSystem.root;
        },

        fail: function(evt) {
            console.log(evt.target.error.code);
        }

    }
})();

Thesis.Firefox = (function() {
    var s;
    var context;

    return {
        settings: {
            gManifestName: location.protocol + "//" + location.host + location.pathname + "manifest.webapp",
            x: 100,
            y: 200,
            dx: 5,
            dy: 5
        },

        init: function () {
            Thesis.Settings.device.firefox = true;

            s = this.settings;
            this.bindUIActions();

            var request = navigator.mozApps.getSelf();

            request.onsuccess = function() {
                if (request.result) {
                    // we're installed
                    $("#install_button").text("INSTALLED!").show();
                    $("#install-button-container").hide();
                    Thesis.Gallery.init();                
                } else {
                    // not installed
                    $("#install_button").show();
                }
            }

            request.onerror = function() {
                alert('Error checking installation status: ' + this.error.message);
            }

            context = document.getElementById('bouncing-ball').getContext('2d');
            setInterval(this.drawBall,10);

        },

        bindUIActions: function () {
            $("#install_button").click(function() {
                console.log(s.gManifestName);
                var req = navigator.mozApps.install(s.gManifestName);
                req.onsuccess = function() {
                    $("#install_button").text("INSTALLED!").unbind('click');
                }
                req.onerror = function(errObj) {
                    alert("Couldn't install (" + errObj.code + ") " + errObj.message);
                }
            });
        },

        drawBall: function()
        {
          context.clearRect(0,0, 300,300);
          context.beginPath();
          context.fillStyle="#0000ff";
          // Draws a circle of radius 20 at the coordinates 100,100 on the canvas
          context.arc(s.x,s.y,20,0,Math.PI*2,true);
          context.closePath();
          context.fill();

          if( s.x<20 || s.x>280) s.dx=-s.dx;
          if( s.y<20 || s.y>280) s.dy=-s.dy;
          s.x+=s.dx;
          s.y+=s.dy;
        }
    }
})();

//Tizen initialize function
var init = function () {
    //TODO: Make this as a module
    Thesis.Settings.device.tizen = true;

    // TODO:: Do your initialization job
    console.log("init() called");

    Thesis.Gallery.init();

    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back")
            tizen.application.getCurrentApplication().exit();
    });
};
$(document).bind('pageinit', init);

//Init brower and phonegap
$(function() {
    if (navigator.userAgent.match(/(Firefox)/)) {
        Thesis.Firefox.init();
    } else if (navigator.userAgent.match(/(Tizen)/)) {
        console.log("Script start!");
    } else if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
        document.addEventListener("deviceready", function () {
            Thesis.PhoneGap.init();  
            Thesis.Gallery.init();
        }, false);
    } else {
        Thesis.Gallery.init();
    }

});



