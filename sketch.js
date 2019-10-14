
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
	
	T = 5;
	F = 2;
	
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
	
	cursor(HAND)

	W = window.innerWidth;
	H = window.innerHeight;
	canvas = createCanvas(W, H);
	
	angleMode(DEGREES);
	
	on = false;
	
}


function helpInfo(s){
	var Controls = "\n\nControls:\n\nRIGHT & LEFT arrow keys: increase/decrease the rotation frequency\n\nUP & DOWN arrow keys: increase/decrease time captured (more data/less data)\n\nCLICK anywhere on the page to advance to the next scene\n\n";
	var sceneExplanation = "Explanation of Scene "+str(s)+"\n\n"
	if (s===1){
		alert(sceneExplanation+""+str(frequencies.length)+" cosine graphs (in grey) of frequencies "+str(frequencies.slice(0,-1))+" & "+str(frequencies.slice(-1))+" are added together to form one single graph (in blue). The aim of the Fourier Transform is to reverse this process, ie: given an initial 'blue' graph, can we find its individual components (in terms of cosine graphs of pure frequencies)?"+Controls);
	} else if (s===2){
		alert(sceneExplanation+"Fourier's solution to this problem was the equivalent of wrapping the 'blue' graph around a point with a certain 'rotation frequency' (green graph). Then, if that specific rotation frequency is equal to any one of the component frequencies (grey graphs from scene 1), then the whole green 'wrapped' graph would line up on one side. If we record the position of the average X-coordinate, we can determine when this takes place – which allows us to determine the frequencies of the grey graphs from scene 1."+Controls);
	} else if (s===3){
		alert(sceneExplanation+"This final scene plots the average X-coordinate against the rotation frequency. This is the graph of the final Fourier Transform: the original time domain function (blue graph from scene 1) has been mapped onto a frequency domain function (purple graph in scene 3). The calculations for this scene are effectively the same as in scene 2 (computing the average x-coordinate), however this time it is done across a whole range of frequencies, as opposed to only the rotation frequency determined by the user (indicated by the red dot). The spikes on this graph should roughly line up with component frequencies. NB: for a greater Time Captured, the calculation will take longer, however the results should become more accurate – as there is more data to average, ie: the spikes will become more defined."+Controls);
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
    textFont('Quicksand');
    fill(31, 31, 31);
    strokeWeight(1);
    stroke(255, 203, 135);
    textAlign(LEFT,CENTER);
    textSize(20);
    text("Fourier Transform Simulator: scene " + str(scene) + " of 3",15,25);
    textSize(15);
    text("PRESS THE 'D' KEY FOR SCENE DESCRIPTIONS & CONTROLS",15,height-25);
    
    textAlign(RIGHT,CENTER);
    text('Cosine frequencies = '+str(frequencies),width-15,height-25);
    text('Rotation frequency = '+str(parseFloat(Math.round(F * 100) / 100).toFixed(2)),width-15,25);
    text('Time captured = '+str(parseFloat(Math.round(T * 100) / 100).toFixed(2)),width-15,50);
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
    for (var x=0; x<T*360; x+=Qual){
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
    
    stroke(100, 100, 100,150);
    for (var f=0; f<frequencies.length; f+=1){
        beginShape();
        for (var x=0; x<T*360; x+=1/frequencies[f]){
            vertex(width*x/(360*T),-cosine(x,frequencies[f],1) + (f+1)*(height-20)/(frequencies.length+3) + 50); 
        }
        endShape();
    }
    
    strokeWeight(2);
    stroke(71, 158, 204);
    beginShape();
    for (var x=0; x<T*360; x+=2){
        vertex(width*x/(360*T),-sumCosines(x,1) + (frequencies.length+1)*(height-20)/(frequencies.length+3) + 70); 
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
        vertex(p*width*(intevals/(upToFreq+2)),-75*fourierCurve[p]+height/2+60);    
    }
    endShape();
    
    strokeWeight(2);
    stroke(120, 41, 148);
    textAlign(CENTER,BOTTOM);
    for (var f=0; f<frequencies.length; f+=1){
        var xCoor = frequencies[f]*width*(1/(upToFreq+2));
        var yCoor = -75*fourierCurve[round(frequencies[f]/intevals)]+height/2;
        noFill();
        ellipse(xCoor,yCoor+60,7,7);
        fill(120, 41, 148);
        text(str(frequencies[f]),xCoor,yCoor-10+60);
    }
    
    noStroke();
    fill(235, 5, 5);
    ellipse(F*width*(1/(upToFreq+2)),-75*fourierCurve[round(F/intevals)]+height/2+ 60,7,7);
    
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
    if (keyCode===68){
        helpInfo(scene);
    }
}

function keyReleased(){
	Fchange = 0;
	Tchange = 0;
}

