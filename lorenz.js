/* canvas */
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.display = "block";
//document.body.appendChild(canvas);

/* globals */
var particlearray = Array();
var centerx = canvas.width / 2;
var centery = canvas.height / 2;
var offsetx = 0;
var offsety = 0;
var offsetz = 20;
var sigma = 10;
var rho = 28;
var beta = 8/3;
var deletearray = Array();

/* requestanimframe shim */
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();


/* particle constructor */
var Particle = function(x,y,z){
	this.x = x;
	this.y = y;
	this.z = z;
}

Particle.prototype.move = function(dt){
	var xdot=sigma*(this.y-this.x);
	var ydot=this.x*(rho-this.z)-this.y;
	var zdot=this.x*this.y - beta*this.z;
	this.x=this.x+xdot*dt;
	this.y=this.y+ydot*dt;
	this.z=this.z+zdot*dt;
}

/* adds a particle */
canvas.addEventListener('click',function(evt){
	var newparticle=new Particle(
		evt.clientX - centerx + Math.random(),
		evt.clientY - centery + Math.random(),
		0+Math.random());
	particlearray.push(newparticle);
});

/* draw some cirlces */
var makeshape = function(x,y,z){
	ctx.beginPath();
	ctx.arc(x, y, Math.abs(z)+1, 0, 2*Math.PI,false);
	if (z>0)
		ctx.fillStyle= 'blue';
	else
		ctx.fillStyle='red';
	ctx.fill();
	ctx.strokeStyle='black';
	ctx.strokeWidth=2;
	ctx.stroke();
};

var blit = function(particle){
	var blitx = particle.x + centerx + offsetx;
	var blity = particle.y + centery + offsety;
	var blitz = particle.z + offsetz;
	makeshape(blitx,blity,blitz);
}

var sane = function(particle){
	return (!isNaN(particle.x + particle.y + particle.z));
}

function animate(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for(var i = 0;i<particlearray.length;i++){
		particlearray[i].move(.002);
		blit(particlearray[i]);
		if (!sane(particlearray[i]))
			deletearray.push(i);
	}
	for(var i = 0;i<deletearray.length;i++){
		particlearray.splice(deletearray[i],1);
	}
	deletearray=[];
	requestAnimFrame(animate);
}

animate();
