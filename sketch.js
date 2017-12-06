var sogliaPrimaDiRichiamare=0.1;
var timerRichiamo;
var canDrop=false;
var sogliaMinimaRumore=0.1;


var spriteAlbero;
var spriteAlberoRatio=1633/913;

var spritePallina;
var spritePallina2;
var spritePallinaRatio=158/136;

var spriteEsplosione;
var spriteEsplosioneRatio=341/266;

var spriteStereo;
var spriteStereoRatio=453/266;

var lineaPavimento;
var palleDiNatale=[];
var ondeEnergetiche=[];
var esplosioni=[];

var puntiSpawnPalline=4;

var puntoSpawn1=[];
var puntoSpawn2=[];
var puntoSpawn3=[];
var puntoSpawn4=[];

var pallinaCaduta;

function preload()
{
    spriteAlbero=loadImage("./assets/Albero.png");
    spritePallina=loadImage("./assets/Pallina.png");
    spritePallina2=loadImage("./assets/Pallina2.png");
    spriteEsplosione=loadImage("./assets/Esplosione.png");
    spriteStereo=loadImage("./assets/Stereo.png");
    
}

function setup() {

	// Create the canvas
	createCanvas(windowWidth, windowHeight);

	// Deal with microphone
	mic = new p5.AudioIn();
	mic.start();
    
    settaPuntiSpawn();
    palleDiNatale.push(new Pallina(puntoSpawn1[0],puntoSpawn1[1],0));
    palleDiNatale.push(new Pallina(puntoSpawn2[0],puntoSpawn2[1],1));
    palleDiNatale.push(new Pallina(puntoSpawn3[0],puntoSpawn3[1],2));
    palleDiNatale.push(new Pallina(puntoSpawn4[0],puntoSpawn4[1],3));
}

function settaPuntiSpawn()
{
     puntoSpawn1[0]=width/2-height*.1;
   puntoSpawn1[1]=height*.4;
    
     puntoSpawn2[0]=width/2+height*.1;
    puntoSpawn2[1]=height*.5;
    
     puntoSpawn3[0]=width/2;
    puntoSpawn3[1]=height*.25;
    
    puntoSpawn4[0]=width/2-height*.1;
    puntoSpawn4[1]=height*.6;
    

}

function draw() {

   
    settaPuntiSpawn();
    
    
    lineaPavimento=height*.95;
    
    
	//get the volume
	var volume = mic.getLevel();

	background(0);
    fill(238,234,150);
    noStroke();
    rect(0,0,width,height);
    
    push();
    fill(50,10,10);
    noStroke();
    rect(0,lineaPavimento-height*.1,width,height);
    fill(80,20,20);
    rect(0,lineaPavimento-height*.07,width,height);
    
    pop();
    
    push();
    imageMode(CENTER);
    image(spriteAlbero,width/2,height/2,height*.5,(height*.5)*spriteAlberoRatio);
    pop();
    
     push();
    imageMode(CENTER);
    image(spriteStereo,width*.1,height*.1,height*.1,(height*.1)*spriteStereoRatio);
    pop();
    
    push();
    noStroke();
    fill(30);
    var minSize = height *.02;
	var maxSize = height*.5;
	var size = map(volume, 0, 1, minSize, maxSize);

	//draw an ellipse
	ellipse(width*.1,height*.1, size);
    pop();

	
    
    if(timerRichiamo<sogliaPrimaDiRichiamare)
         {
             timerRichiamo+=1/frameRate();
         }
    else
        {
            canDrop=true;
        }
    
    if(canDrop && volume>sogliaMinimaRumore)
        {
            creaOndaEnergetica();
            cadiPalla();
        }
    
    for(var i=0;i<palleDiNatale.length;i++)
    {
    palleDiNatale[i].update();
    }
    
    for(var i=0;i<ondeEnergetiche.length;i++)
        {
            ondeEnergetiche[i].update();
        }
    
    for(var i=0;i<esplosioni.length;i++)
        {
            esplosioni[i].update();
        }
    
    /* for(var i=0;i<puntiSpawnPalline.length;i++)
        {
            
        }*/
    
    
    
    //line(0,lineaPavimento,width,lineaPavimento);
    
}

function cadiPalla()
{
    canDrop=false;
    timerRichiamo=0;
    
    //var randomPalla=random(0,3);
    
    for(var i=0;i<palleDiNatale.length;i++)
        {
            if(palleDiNatale[i].indicePalla==i)
                {palleDiNatale[i].isDropping=true;}
        
        }
    
    //if(!palleDiNatale[randomPalla].isGenerating)
  //  palleDiNatale[randomPalla].isDropping=true;
    console.log("cadi");
}

function Pallina(x,y,indicePalla)
{
    this.indicePalla=indicePalla;
    

    if(random()<.5)
    this.spritePallina=spritePallina2;
    else
        this.spritePallina=spritePallina;
    
    this.x=x;
    this.y=x;
 
        
    this.startX=this.x;
    this.startY=this.y;
    this.gravita=height*.01;
    
    
    
    this.isDropping=false;
    this.isDead=false;
    this.isGenerating=true;
    this.tinta=0;
    
     this.miaX=0;
    this.miaY=0;
    
    
    this.update=function()
    {
         push();
                if(this.indicePalla==0)
            {
                
                this.miaX=puntoSpawn1[0];
                this.miaY=puntoSpawn1[1];
            }
            else
                if(this.indicePalla==1)
            {
                this.miaX=puntoSpawn2[0];
                this.miaY=puntoSpawn2[1];
            }
            else
                if(this.indicePalla==2)
            {
                this.miaX=puntoSpawn3[0];
                this.miaY=puntoSpawn3[1];
            }
            else
                if(this.indicePalla==3)
            {
                this.miaX=puntoSpawn4[0];
                this.miaY=puntoSpawn4[1];
            }
        
        
       
        this.radius=height*.05;
        
       // console.log(this.miaX);
       
        
        this.x=this.miaX;
        if(!this.isDropping)
        this.y=this.miaY;
        if(this.isGenerating)
            {
                if(this.tinta<=255)
                {
                    this.tinta+=50;
                    tint(255,this.tinta);
                
                }
                else
                    {this.isGenerating=false;}
        
            }
        image(this.spritePallina,this.x-this.radius*.5,this.y,this.radius,this.radius*spritePallinaRatio);
        if(this.isDropping)
            {
                this.y+=this.gravita;
                if(this.y>=lineaPavimento-this.radius)
                {
                    pallaEsplosa(this.x,this.y);
                    //this.isDead=true;
                    this.isGenerating=true;
                    this.tinta=0;
                    this.isDropping=false;
                    this.x=this.startX;
                    this.y=this.startY;
                    
                }
                
            }
        pop();
    }
}

function pallaEsplosa(x,y)
{
    esplosioni.push(new Esplosione(x,y));
    
}

function Esplosione(x,y)
{
    
    this.scala=0;
    this.update=function()
    {
        push();
        this.scala+=(1/frameRate())*1000;
        imageMode(CENTER);
        if(this.scala<height*.4)
            {
                tint(255, 255-map(this.scala,0,height*.4,0,255));
        image(spriteEsplosione,x+height*.03,y,this.scala,this.scala*spriteEsplosioneRatio);
            }
                pop();
    }
}

function creaOndaEnergetica()
{
    
    ondeEnergetiche.push(new OndaEnergetica(width*.1,height*.1));
}

function OndaEnergetica(x,y,raggio)
{
    
    this.x=x;
    this.y=y;
    this.radius=20;
    this.velocitaOnde=1000;
    
    
    this.update=function()
        {
        this.radius+=(1/frameRate())*this.velocitaOnde;
        push();
        noFill();
        stroke(0,0,0,100);
        strokeWeight(height*.05);
        ellipse(x,y,this.radius);
        pop();
        }
    
}

//if the window is resized, update the sketchs
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}