
// Declare VAR'S up here

var frequencies;

var T;
var F;
var Tchange;
var Fchange;

var Q; // Low Q -> High Quality

var controlSensitivity;

var maxFreq;

var upToFreq;

var scene;

var first;
var on;


function setup() {

	frequencies = [2,3,4,7];
	
	T = 2;
	F = 3;
	
	Q = 8; // Low Q -> High Quality
	
	controlSensitivity = 1/(4*Q);
	
	
	Tchange = 0;
	Fchange = 0;
	
	
	maxFreq = 0;
	
	for (var f=0; f<frequencies.length; f+=1){
		if (frequencies[f]>maxFreq){
		    maxFreq = frequencies[f];
		}
	}
	
	upToFreq = maxFreq;
	
	
	scene = 1;
	
	first = true;
	
	textFont('Avenir Next',15);
	
	cursor(HAND)

	W = window.innerWidth;
	H = window.innerHeight;
	canvas = createCanvas(W, H);
	
	angleMode(DEGREES);
	
	on = false;
	
}


function helpInfo(s){
	var initControls = "Controls:\n\n - RIGHT/LEFT arrow keys: increase/decrease winding frequency\n - UP/DOWN arrow keys: increase/decrease Time Captured (more/less data)\n\nScene Explanation:\n\n"
	if (s===1){
		alert(initControls+"The "+str(frequencies.length)+" grey cosine waves of frequencies: "+str(frequencies)+" are added together to form a single blue wave (below). The aim of the fourier transform is to reverse this process, ie: given an initial 'blue' wave, can we find its individual components (in terms of cosine graphs of pure frequencies).");
	} else if (s===2){
		alert(initControls+"Fourier's solution to this problem was to wrap the 'blue' wave around a point with a certain 'winding frequency' (green wave). Then if the winding frequency lined up with any of the component frequencies (one of the previous grey waves), then the whole green 'wrapped' graph would line up on one side. If we record the position of the average X-coordinate, we can determine when this takes place – which allows us to determine the frequencies of the previous grey waves");
	} else if (s===3){
		alert(initControls+"This final scene plots (average X-coordinate) against (winding frequency). This therefore effectively does the same calulation as in the previous scene to calculate the average point, but this time with a whole range of frequencies, as opposed to the current user determined winding frequency (indicated by the red dot). The spikes on this graph should roughly line up with component frequencies. NB: For a greater Time Captured, the calculation will take longer, however the results should become more accurate – as there is more data to average. ie: The spikes will become more defined.");
	}
}

function draw() {
	on = false;
// 	if (keyIsPressed || mouseIsPressed || first){
    switch (scene){
        case 1: scene1(); break;
        case 2: scene2(); break;
        case 3: scene3(); break;
    }
    
    fill(31, 31, 31);
    strokeWeight(1);
    stroke(255, 203, 135);
    textAlign(LEFT,CENTER);
    text('Cosine Frequencies = '+str(frequencies),15,25);
    text(" ~ PRESS 'H' FOR HELP ~ ",15,height-25);
    textAlign(RIGHT,CENTER);
    text('Coil Frequency = '+str(parseFloat(Math.round(F * 100) / 100).toFixed(2)),width-15,25);
    text('Time Captured = '+str(parseFloat(Math.round(T * 100) / 100).toFixed(2)),width-15,50);
    text(' ~ USE ARROW KEYS ~ ',width-15,height-50);
    text(' ~ CLICK TO ADVANCE ~ ',width-15,height-25);
	on = true;
//     }
    first = false;
    paramaterChange();
}


window.onresize = function() {
	first = true;
    resizeCanvas(windowWidth, windowHeight);
    W = windowWidth;
    H = windowHeight
}



function cosine(t,f,fit){
    return cos((f*t/fit)) * height/(6*(frequencies.length+3));
}

function cosineIntegralPair(X,f,t){
    return 40*((sin((X+f)*t))/(X+f) + (sin((X-f)*t))/(X-f));
}

function sumCosines(t,fit){
    var Y = 0;
    for (var f=0; f<frequencies.length; f+=1){
        Y += cosine(t,frequencies[f],fit);
    }
    return Y;
}

function sumCosineIntegralPair(X,t){
    var Y = 0;
    for (var f=0; f<frequencies.length; f+=1){
        Y += cosineIntegralPair(X,frequencies[f],t);
    }
    return Y;
}

function polarGraph(Draw,Qual,frequency){
    var avgX = 0;
    if (Draw){
        beginShape();
    }
    for (var x=0; x<T*360*3; x+=Qual){
        var sumCoses = (height/4)/sumCosines(0,frequency) * sumCosines(x,frequency);
        if (Draw){
            vertex(sumCoses * cos(x)+width/2,sumCoses * sin(x) + height/2);
        }
        avgX += sumCoses * cos(x);
    }
    if (Draw){
        endShape();
    }
    
    avgX /= T*360;
    return avgX;
}

function scene1(){
    background(255, 255, 255);
    strokeWeight(1);
    noFill();
    
    stroke(143, 143, 143,150);
    for (var f=0; f<frequencies.length; f+=1){
        beginShape();
        for (var x=0; x<T*360; x+=1/frequencies[f]){
            vertex(width*x/(360*T),cosine(x*3,frequencies[f],F) + (f+1)*(height-20)/(frequencies.length+3) + 10); 
        }
        endShape();
    }
    
    strokeWeight(2);
    stroke(71, 158, 204);
    beginShape();
    for (var x=0; x<T*360; x+=2){
        vertex(width*x/(360*T),sumCosines(x*3,F) + (frequencies.length+1)*(height-20)/(frequencies.length+3) + 10); 
    }
    endShape();
}


function scene2(){
    background(255, 255, 255);
    strokeWeight(1);
    noFill();
    
    strokeWeight(2);
    stroke(104, 158, 38,200);
    
    var avgX = polarGraph(true,1,F);
    fill(255, 255, 255);
    
    stroke(104, 158, 38);
    ellipse(width/2, height/2, 10, 10);
    
    stroke(52, 79, 19);
    // println(sumCosineIntegralPair(F,T));
    // println(sumCosineIntegralPair(F,T));
    // println(F);
    // ellipse(sumCosineIntegralPair(F,T) + width/2, height/2, 10, 10);
    
    
    ellipse(avgX + width/2, height/2, 10, 10);
}


function scene3(){
    background(255, 255, 255);
    strokeWeight(1);
    noFill();
    
    if (F>maxFreq){
        upToFreq = F;    
    } else {
        upToFreq = maxFreq;
    }
    
    var fourierCurve = [];
    var intevals = Q/200;
    for (var f=0; f<(upToFreq+2); f+=intevals){
        fourierCurve.push(polarGraph(false,Q,f));
    }
    
    stroke(133, 82, 133);
    noFill();
    beginShape();
    for (var p=0; p<fourierCurve.length; p+=1){
        vertex(p*width*(intevals/(upToFreq+2)),-25*fourierCurve[p]+height/2);    
    }
    endShape();
    
    strokeWeight(2);
    stroke(120, 41, 148);
    textAlign(CENTER,BOTTOM);
    for (var f=0; f<frequencies.length; f+=1){
        var xCoor = frequencies[f]*width*(1/(upToFreq+2));
        var yCoor = -25*fourierCurve[round(frequencies[f]/intevals)]+height/2;
        noFill();
        ellipse(xCoor,yCoor,7,7);
        fill(120, 41, 148);
        text(str(frequencies[f]),xCoor,yCoor-10);
    }
    
    noStroke();
    fill(235, 5, 5);
    ellipse(F*width*(1/(upToFreq+2)),-25*fourierCurve[round(F/intevals)]+height/2,7,7);
    
}

function paramaterChange(){
	if (Fchange===1){
		F += controlSensitivity*F/3;
	} else if (Fchange===-1){
		F -= controlSensitivity*F/3;
	}
	
	if (Tchange===1){
		T += controlSensitivity;
	} else if (Tchange===-1){
		T -= controlSensitivity;
	}
}


function mouseClicked(){
	if (on){
	    if (scene<3){
	        scene += 1;
	    } else {
	        scene = 1;    
	    }
    }
}

function keyPressed(){
	if (keyCode===39){
		Fchange = 1;
    }
    if (keyCode===37 && F > 0.05){
	    Fchange = -1;
    }
    if (keyCode===38){
	    Tchange = 1;
    }
    if (keyCode===40 && T > 0.0){
	    Tchange = -1;
    }
    if (keyCode===72){
        helpInfo(scene);
    }
}

function keyReleased(){
	Fchange = 0;
	Tchange = 0;
}

