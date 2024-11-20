function setup() {

    var canvas = document.getElementById('mystictree')
	var context = canvas.getContext('2d')
	
    var slider1 = document.getElementById('slider1')
	slider1.value = 100
	
	var slider2 = document.getElementById('slider2')
    slider2.value = 30

	var viewAngle = 0

    function draw() {

		canvas.width = canvas.width

		var pHeight = slider1.value*0.1
		var pBranches = slider2.value*0.1
		viewAngle = viewAngle + 0.002 % 2*Math.PI

		
		function moveToTx(loc,Tx)
		{var res=vec3.create(); vec3.transformMat4(res,loc,Tx); context.moveTo(res[0],res[1]);}

		function lineToTx(loc,Tx)
		{var res=vec3.create(); vec3.transformMat4(res,loc,Tx); context.lineTo(res[0],res[1]);}

		function drawFloor(Tx) {
			context.fillStyle = "#3369b5"
			context.fillRect(0, 0, canvas.width, canvas.height)
			context.fillStyle = "#ccbf85"
			context.fillRect(0, canvas.height/3, canvas.width, canvas.height)
		}

		function drawTree(Tx, height, numBranches) {
			
			context.strokeStyle = "#1c6115"
			context.beginPath()
			context.lineWidth = 6
			context.lineCap = "round"

			moveToTx([0,0,0], Tx)
			lineToTx([0,height,0], Tx)
			context.closePath()
			context.stroke()

			var TbranchesLevel1 = mat4.create()
			mat4.fromTranslation(TbranchesLevel1,[0,height,0])

			var i
			for (i = 0; i < numBranches; i++) {
				var newBranch = mat4.create() // creates a new branch
				mat4.multiply(newBranch, newBranch, TbranchesLevel1) // brings it to lvl 1 height
				mat4.rotateY(newBranch, newBranch, i*2*Math.PI/numBranches) // rotates around Y axis
				mat4.rotateZ(newBranch, newBranch, Math.PI/4) // rotates around Z axis
				var j
				for (j=0; j < numBranches; j++) { // creates lvl 2 branches off of lvl 1 branch
					var newBranch2 = mat4.create()
					mat4.fromTranslation(newBranch2, [0,3*height/4, 0]) // brings it to lvl 2 height
					mat4.rotateY(newBranch2, newBranch2, j*2*Math.PI/numBranches) // rotates around lvl 2 branch
					mat4.rotateZ(newBranch2, newBranch2, Math.PI/4) // rotates around Z axis
					var Tbranch2ToBranch1 = mat4.create() // translates branch2 coords to branch1 coords
					mat4.multiply(Tbranch2ToBranch1, newBranch, newBranch2)
					var TbranchToTx = mat4.create()
					mat4.multiply(TbranchToTx, Tx, Tbranch2ToBranch1) // translates branch2 to canvas
					moveToTx([0,0,0], TbranchToTx)
					lineToTx([0,height/2,0], TbranchToTx)
				}
				var TbranchToTx = mat4.create()
				mat4.multiply(TbranchToTx, Tx, newBranch) // translates branch1 to canvas
				moveToTx([0,0,0], TbranchToTx)
				lineToTx([0,3*height/4,0], TbranchToTx)
				context.stroke()
			}
		}

		function drawDude(Tx, dist) {
			context.strokeStyle = "#000000"
			context.lineWidth = 2
			context.beginPath()
			moveToTx([1.5,0,dist],Tx)
			lineToTx([0,3,dist], Tx)
			moveToTx([-1.5,0,dist],Tx)
			lineToTx([0,3,dist], Tx)
			lineToTx([0,7,dist], Tx)
			moveToTx([0,6,dist],Tx)
			lineToTx([1,4,dist], Tx)
			moveToTx([0,6,dist],Tx)
			lineToTx([-1,4,dist], Tx)
			moveToTx([1,7,dist],Tx)
			lineToTx([-1,7,dist], Tx)
			lineToTx([-1,9,dist], Tx)
			lineToTx([1,9,dist], Tx)
			lineToTx([1,7,dist], Tx)
			context.stroke()
		}

		function drawPattern(Tx) {
			context.strokeStyle = "#948c69"
			context.lineWidth = 5
			var i
			for (i = 1; i < 8; i++){
				context.beginPath()
				moveToTx([5*i,0,5*i],Tx)
				lineToTx([5*i,0,-5*i],Tx)
				lineToTx([-5*i,0,-5*i],Tx)
				lineToTx([-5*i,0,5*i],Tx)
				context.closePath()
				context.stroke()
			}
		}   
	
		// Create ViewPort transform
		var Tviewport = mat4.create()
		mat4.fromTranslation(Tviewport,[300,300,0])
		mat4.scale(Tviewport,Tviewport,[100,-100,1])

		// Create projection transform
		var Tprojection = mat4.create()
		mat4.perspective(Tprojection,Math.PI/5,1,-1,1)

		// Combined transform for viewport and projection
		var tVP_PROJ = mat4.create()
		mat4.multiply(tVP_PROJ,Tviewport,Tprojection)

		// Create Camera (lookAt) transform
		var locCamera = vec3.create()
		var distCamera = 40.0
		locCamera[0] = distCamera*Math.sin(viewAngle)
		locCamera[1] = 33
		locCamera[2] = distCamera*Math.cos(viewAngle)
		var locTarget = vec3.fromValues(0,20,0)
		var vecUp = vec3.fromValues(0,1,0)
		var TlookAt = mat4.create()
		mat4.lookAt(TlookAt, locCamera, locTarget, vecUp)
		
		// Viewport and Camera transformations
		var tVP_PROJ_CAM = mat4.create()
		mat4.multiply(tVP_PROJ_CAM,tVP_PROJ,TlookAt)
		drawFloor(tVP_PROJ_CAM)
		drawPattern(tVP_PROJ_CAM)
		drawDude(tVP_PROJ_CAM, 20)
		drawTree(tVP_PROJ_CAM, pHeight, pBranches)

		window.requestAnimationFrame(draw)
	}
	
	window.requestAnimationFrame(draw)
    draw()
}

window.onload = setup