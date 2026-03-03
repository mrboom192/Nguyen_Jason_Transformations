// Helper functions by Dr. Demirel for the Computer Graphics Class


//---------------------------VAO---------------------------//
//create VAO
function setVAO(){
  _vao = gl.createVertexArray();
  bindVAO(_vao);
  return _vao;
}
//unbind VAO
function unbindVAO(){
  gl.bindVertexArray(null);
}
//bind VAO
function bindVAO(_name){
  gl.bindVertexArray(_name);
}
//---------------------------VAO---------------------------//

//---------------------------Buffers and Attributes---------------------------//
//Buffer
function SetBuffer(_data, _type) {
  var _Buffer = gl.createBuffer();
  if (_type === "index") {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _Buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(_data), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  } else {
    gl.bindBuffer(gl.ARRAY_BUFFER, _Buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_data), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }
  return _Buffer;
}

//Attribute
function SetAttribute(webglHelper, _name, _size, _stride, _offset) {

  var _AttributeLocation = gl.getAttribLocation(webglHelper.program, _name);
	gl.enableVertexAttribArray(_AttributeLocation);
	var size = _size;
	var type = gl.FLOAT;
	var normalize = false;
	var stride = _stride * Float32Array.BYTES_PER_ELEMENT;
	var offset = _offset * Float32Array.BYTES_PER_ELEMENT;
	gl.vertexAttribPointer(_AttributeLocation, size, type, normalize, stride, offset);

  if (webglHelper.attribLocations[_name] !== undefined)
        return webglHelper.attribLocations[_name];
  webglHelper.attribLocations[_name] = _AttributeLocation;
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return _AttributeLocation;
}

//Buffer and Attribute
function SetBufferAndAttribute(webglHelper, _name,_data, _size, _stride, _offset) {

  var _Buffer=SetBuffer(_data);
	gl.bindBuffer(gl.ARRAY_BUFFER, _Buffer);
	SetAttribute(webglHelper, _name, _size, _stride, _offset);
}

function SetIndexBuffer(_data) {
  var _Buffer=SetBuffer(_data,"index");
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _Buffer);
}

 // Get and cache a uniform location by name
function getUniformLocation(webglHelper,_name) {
    if (webglHelper.uniformLocations[_name] !== undefined)
      return webglHelper.uniformLocations[_name];

    var loc = gl.getUniformLocation(webglHelper.program, _name);
    webglHelper.uniformLocations[_name] = loc;
    return loc;
  }

  // Convenience: set a float uniform (1f)
function setUniform1f(webglHelper,_name, x) {
    gl.uniform1f(getUniformLocation(webglHelper, _name), x);
  }

  // Convenience: set an int uniform (1i) (used for samplers and toggles)
function setUniform1i(webglHelper,_name, x) {
    gl.uniform1i(getUniformLocation(webglHelper, _name), x);
  }

  // Convenience: set a vec2 uniform (2f)
function setUniform2f(webglHelper,_name, x, y) {
    gl.uniform2f(getUniformLocation(webglHelper, _name), x, y);
  }

  // Convenience: set a vec3 uniform (3f)
function setUniform3f(webglHelper,_name, x, y, z) {
    gl.uniform3f(getUniformLocation(webglHelper, _name), x, y, z);
  }

  // Convenience: set a vec4 uniform (4f)
function setUniform4f(webglHelper, _name, x, y, z, w) {
    gl.uniform4f(getUniformLocation(webglHelper, _name), x, y, z, w);
  }

  // Convenience: set a mat4 uniform
function setUniformMatrix4fv(webglHelper,_name, mat4Array, transpose = false) {
    gl.uniformMatrix4fv(getUniformLocation(webglHelper, _name), transpose, mat4Array);
  }

//---------------------------Buffers and Attributes---------------------------//

//---------------------------Matricies---------------------------//
//Scale Matrix
function Scale(webglHelper, Sx, Sy, Sz) {
	var ScaleMatrix = new Float32Array([
		Sx, 0.0, 0.0, 0.0,
		0.0, Sy, 0.0, 0.0,
		0.0, 0.0, Sz, 0.0,
		0.0, 0.0, 0.0,1.0
	]);
	setUniformMatrix4fv(webglHelper,'uScale', ScaleMatrix);

	return ScaleMatrix;
}

//Translation
function Translate(webglHelper, Tx, Ty, Tz) {
	var TranslationMatrix = new Float32Array([
		1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		Tx,  Ty,  Tz,  1.0
	]);
	
  setUniformMatrix4fv(webglHelper,'uTranslate', TranslationMatrix);

	return TranslationMatrix;
}
//---------------------------Matricies---------------------------//

//---------------------------Interaction---------------------------//
var w=false;
var a=false;
var s=false;
var d=false;
var e=false;
var q=false;
//keydown
function KeyButtonDownEvent(event){
	switch (event.key.toLowerCase()){
		case 'w': //w
			w=true;
			//console.log(w);
		break;

		case 'a': //a
			a=true;
		break;

		case 's': //s
			s=true;
		break;

		case 'd': //d
			d=true;
		break;

		case 'e': //e
			e=true;
		break;

		case 'q': //q
			q=true;
		break;

	}
}
window.addEventListener('keydown', KeyButtonDownEvent);

//keyup
function KeyButtonUpEvent(event){
	switch (event.key.toLowerCase()){
		case 'w': //w
			w=false;
			//console.log(w);
		break;

		case 'a': //a
			a=false;
		break;

		case 's': //s
			s=false;
		break;

		case 'd': //d
			d=false;
		break;

		case 'e': //e
			e=false;
		break;

		case 'q': //q
			q=false;
		break;

	}
}

window.addEventListener('keyup', KeyButtonUpEvent);


var button0=false;
var button2=false;

function MouseButtonEvent(event){
    var x=event.clientX;
    var y=event.clientY;
    console.log("X: "+x+" ,Y: "+y);
    console.log("Button: "+event.button);

    if(event.button==0)
    	{
            button0=true;
        }

    if(event.button==2)
        {
            button2=true;
        }
}
window.addEventListener('mousedown', MouseButtonEvent);
//---------------------------Interaction---------------------------//