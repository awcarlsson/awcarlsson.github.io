function start() {

    // Get canvas, WebGL context, twgl.m4
    var canvas = document.getElementById("mycanvas");
    var gl = canvas.getContext("webgl");

    // Sliders at center
    var slider1 = document.getElementById('slider1');
    slider1.value = 0;
    var slider2 = document.getElementById('slider2');
    slider2.value = 100;

    // Read shader source
    var vertexSource = document.getElementById("vertexShader").text;
    var fragmentSource = document.getElementById("fragmentShader").text;

    // Compile vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader,vertexSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(vertexShader)); return null; }
    
    // Compile fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader,fragmentSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(fragmentShader)); return null; }
    
    // Attach the shaders and link
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialize shaders"); }
    gl.useProgram(shaderProgram);	    
    
    shaderProgram.PositionAttribute = gl.getAttribLocation(shaderProgram, "vPosition");
    gl.enableVertexAttribArray(shaderProgram.PositionAttribute);
    
    shaderProgram.NormalAttribute = gl.getAttribLocation(shaderProgram, "vNormal");
    gl.enableVertexAttribArray(shaderProgram.NormalAttribute);
    
    shaderProgram.texcoordAttribute = gl.getAttribLocation(shaderProgram, "vTexCoord");
    gl.enableVertexAttribArray(shaderProgram.texcoordAttribute);
   
    shaderProgram.MVmatrix = gl.getUniformLocation(shaderProgram,"uMV");
    shaderProgram.MVNormalmatrix = gl.getUniformLocation(shaderProgram,"uMVn");
    shaderProgram.MVPmatrix = gl.getUniformLocation(shaderProgram,"uMVP");

    shaderProgram.texSampler1 = gl.getUniformLocation(shaderProgram, "texSampler1");
    gl.uniform1i(shaderProgram.texSampler1, 0);

    // Data ...
    var vertexPos = new Float32Array(
      [  0, 0, -0.7,  
         Math.cos(0.314159), Math.sin(0.314159), -1,    0.5*Math.cos(0.942478), 0.5*Math.sin(0.942478), -1,
         0, 1, -1,
         Math.cos(2.82743), Math.sin(2.82743), -1,    0.5*Math.cos(2.19911), 0.5*Math.sin(2.19911), -1,
         Math.cos(4.08407), Math.sin(4.08407), -1,    0.5*Math.cos(3.45575), 0.5*Math.sin(3.45575), -1,
         Math.cos(5.34071), Math.sin(5.34071), -1,    0.5*Math.cos(4.71239), 0.5*Math.sin(4.71239), -1,
         0.5*Math.cos(5.96903), 0.5*Math.sin(5.96903), -1,
         0, 0, -1.3,
        
        0, 0, 1.3,  
        Math.cos(0.314159), Math.sin(0.314159), 1,    0.5*Math.cos(0.942478), 0.5*Math.sin(0.942478), 1,
        0, 1, 1,
        Math.cos(2.82743), Math.sin(2.82743), 1,    0.5*Math.cos(2.19911), 0.5*Math.sin(2.19911), 1,
        Math.cos(4.08407), Math.sin(4.08407), 1,    0.5*Math.cos(3.45575), 0.5*Math.sin(3.45575), 1,
        Math.cos(5.34071), Math.sin(5.34071), 1,    0.5*Math.cos(4.71239), 0.5*Math.sin(4.71239), 1,
         0.5*Math.cos(5.96903), 0.5*Math.sin(5.96903), 1,
         0, 0, 0.7]);

    // vertex normals
    // uncomment for different effect
    // var vertexNormals = new Float32Array(
    //   [  0, 0, 0.3,  
    //     Math.cos(0.314159), Math.sin(0.314159), 0,    0.5*Math.cos(0.942478), 0.5*Math.sin(0.942478), 0,
    //     0, 1, 0,
    //     Math.cos(2.82743), Math.sin(2.82743), 0,    0.5*Math.cos(2.19911), 0.5*Math.sin(2.19911), 0,
    //     Math.cos(4.08407), Math.sin(4.08407), 0,    0.5*Math.cos(3.45575), 0.5*Math.sin(3.45575), 0,
    //     Math.cos(5.34071), Math.sin(5.34071), 0,    0.5*Math.cos(4.71239), 0.5*Math.sin(4.71239), 0,
    //     0.5*Math.cos(5.96903), 0.5*Math.sin(5.96903), 0,
    //     0, 0, -0.3,
      
    //     0, 0, 0.3,  
    //     Math.cos(0.314159), Math.sin(0.314159), 0,    0.5*Math.cos(0.942478), 0.5*Math.sin(0.942478), 0,
    //     0, 1, 0,
    //     Math.cos(2.82743), Math.sin(2.82743), 0,    0.5*Math.cos(2.19911), 0.5*Math.sin(2.19911), 0,
    //     Math.cos(4.08407), Math.sin(4.08407), 0,    0.5*Math.cos(3.45575), 0.5*Math.sin(3.45575), 0,
    //     Math.cos(5.34071), Math.sin(5.34071), 0,    0.5*Math.cos(4.71239), 0.5*Math.sin(4.71239), 0,
    //     0.5*Math.cos(5.96903), 0.5*Math.sin(5.96903), 0,
    //     0, 0, -0.3 ]);
    var vertexNormals = new Float32Array(
      [  0, 0, -0.7,  
         Math.cos(0.314159), Math.sin(0.314159), -1,    0.5*Math.cos(0.942478), 0.5*Math.sin(0.942478), -1,
         0, 1, -1,
         Math.cos(2.82743), Math.sin(2.82743), -1,    0.5*Math.cos(2.19911), 0.5*Math.sin(2.19911), -1,
         Math.cos(4.08407), Math.sin(4.08407), -1,    0.5*Math.cos(3.45575), 0.5*Math.sin(3.45575), -1,
         Math.cos(5.34071), Math.sin(5.34071), -1,    0.5*Math.cos(4.71239), 0.5*Math.sin(4.71239), -1,
         0.5*Math.cos(5.96903), 0.5*Math.sin(5.96903), -1,
         0, 0, -1.3,
        
        0, 0, 1.3,  
        Math.cos(0.314159), Math.sin(0.314159), 1,    0.5*Math.cos(0.942478), 0.5*Math.sin(0.942478), 1,
        0, 1, 1,
        Math.cos(2.82743), Math.sin(2.82743), 1,    0.5*Math.cos(2.19911), 0.5*Math.sin(2.19911), 1,
        Math.cos(4.08407), Math.sin(4.08407), 1,    0.5*Math.cos(3.45575), 0.5*Math.sin(3.45575), 1,
        Math.cos(5.34071), Math.sin(5.34071), 1,    0.5*Math.cos(4.71239), 0.5*Math.sin(4.71239), 1,
         0.5*Math.cos(5.96903), 0.5*Math.sin(5.96903), 1,
         0, 0, 0.7]);
    
    // vertex texture coordinates
    var vertexTextureCoords = new Float32Array(
        [  0, 0,   1, 1,   0, 1,   1, 1,
           1, 1,   1, 0,   1, 1,   0, 1,
           1, 1,   1, 0,   0, 1,   0, 0,
           0, 0,   1, 1,   0, 1,   1, 1,
           1, 1,   1, 0,   1, 1,   0, 1,
           1, 1,   1, 0,   0, 1,   0, 0  ]);

    // element index array
    var triangleIndices = new Uint8Array(
        [  0, 1, 2,   0, 2, 3,   0, 3, 5,   0, 4, 5,   0, 4, 7,   0, 6, 7,   0, 6, 9,   0, 8, 9,   0, 8, 10,   0, 1, 10,
           11, 1, 2,   11, 2, 3,   11, 3, 5,   11, 4, 5,   11, 4, 7,   11, 6, 7,   11, 6, 9,   11, 8, 9,   11, 8, 10,   11, 1, 10,
            12, 13, 14,    12, 14, 15,    12, 15, 17,   12, 16, 17,   12, 16, 19,   12, 18, 19,   12, 18, 21,   12, 20, 21,   12, 20, 22,   12, 13, 22,
            23, 13, 14,   23, 14, 15,   23, 15, 17,   23, 16, 17,   23, 16, 19,   23, 18, 19,   23, 18, 21,   23, 20, 21,   23, 20, 22,   23, 13, 22 ]);

    // we need to put the vertices into a buffer so we can
    // block transfer them to the graphics hardware
    var trianglePosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexPos, gl.STATIC_DRAW);
    trianglePosBuffer.itemSize = 3;
    trianglePosBuffer.numItems = 22;
    
    // a buffer for normals
    var triangleNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexNormals, gl.STATIC_DRAW);
    triangleNormalBuffer.itemSize = 3;
    triangleNormalBuffer.numItems = 22;

    // a buffer for textures
    var textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexTextureCoords, gl.STATIC_DRAW);
    textureBuffer.itemSize = 2;
    textureBuffer.numItems = 1;

    // a buffer for indices
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangleIndices, gl.STATIC_DRAW);    

    // Set up texture
    var texture1 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    var image1 = new Image()

    function initTextureThenDraw()
    {
      image1.onload = function() { loadTexture(image1,texture1); };
      image1.crossOrigin = "anonymous";
      image1.src = "https://live.staticflickr.com/65535/50700566283_8153836645_b.jpg";

      window.setTimeout(draw,200);
    }

    function loadTexture(image,texture)
    {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    }

    function updateTime() {
      if (time > 100.0) {
        time = 0.0;
      }
      time ++;
      // Update time
      gl.uniform1f(shaderProgram.time,time);
      window.requestAnimationFrame(updateTime)
    }

    // Scene (re-)draw routine
    function draw() {

        // Translate slider values to angles in the [-pi,pi] interval
        var angle1 = slider1.value*0.01*Math.PI;
        var scale = slider2.value*0.01;
    
        // Circle around the y-axis
        var eye = [400*Math.sin(angle1),150.0*Math.sin(angle1)+100,400.0*Math.cos(angle1)];
        var target = [0,0,0];
        var up = [0.1,1,0];
    
        var tModel = mat4.create();
        mat4.fromScaling(tModel,[100,100,100]);
        mat4.scale(tModel, tModel, [scale, scale, scale])
      
        var tCamera = mat4.create();
        mat4.lookAt(tCamera, eye, target, up);      

        var tProjection = mat4.create();
        mat4.perspective(tProjection,Math.PI/3,1,10,3000);
      
        var tMV = mat4.create();
        var tMVn = mat3.create();
        var tMVP = mat4.create();
        mat4.multiply(tMV,tCamera,tModel); // "modelView" matrix
        mat3.normalFromMat4(tMVn,tMV);
        mat4.multiply(tMVP,tProjection,tMV);
      
        // Clear screen, prepare for rendering
        gl.clearColor(0.09, 0.05, 0.23, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
        // Set up uniforms & attributes
        gl.uniformMatrix4fv(shaderProgram.MVmatrix,false,tMV);
        gl.uniformMatrix3fv(shaderProgram.MVNormalmatrix,false,tMVn);
        gl.uniformMatrix4fv(shaderProgram.MVPmatrix,false,tMVP);
                 
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
        gl.vertexAttribPointer(shaderProgram.PositionAttribute, trianglePosBuffer.itemSize,
          gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer);
        gl.vertexAttribPointer(shaderProgram.NormalAttribute, triangleNormalBuffer.itemSize,
          gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
        gl.vertexAttribPointer(shaderProgram.texcoordAttribute, textureBuffer.itemSize,
          gl.FLOAT, false, 0, 0);

	    // Bind texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture1);

        // Do the drawing
        gl.drawElements(gl.TRIANGLES, triangleIndices.length, gl.UNSIGNED_BYTE, 0);
    }

    slider1.addEventListener("input",draw);
    slider2.addEventListener("input",draw);
    initTextureThenDraw();
}

window.onload=start;