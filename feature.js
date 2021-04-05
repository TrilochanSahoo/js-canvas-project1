var input = prompt("Please enter your First name");
console.log(input)
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let publicArray = [];
adjustx = 10
adjusty = -20

// handle mouse
const mouse = {
    x:null,
    y:null,
    radius:120
};

window.addEventListener('mousemove',function(e)
{
    mouse.x = e.x;
    mouse.y = e.y;
    // console.log(mouse.x, mouse.y);
})

ctx.fillStyle = "white";
if(input.length<7){
    ctx.font = "17px monospace";
}
else if (input.length<11){
    ctx.font = "15px monospace";
}else{
    ctx.font = "11px monospace";
}
ctx.fillText(input, 0, 60);
const textCordinates = ctx.getImageData(0, 0, 100, 100);


class Particle{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.size = 3;
        this.basex = this.x;
        this.basey = this.y;
        this.density = (Math.random() * 40)+5;
    }
    draw()
    {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y ,this.size, 0, Math.PI*2);
        ctx.closePath();
        ctx.fill();
    }
    draw1()
    {
        ctx.fillStyle = 'aqua';
        ctx.beginPath();
        ctx.arc(this.x, this.y ,this.size, 0, Math.PI*2);
        ctx.closePath();
        ctx.fill();
    }
    update()
    {
        let dx = mouse.x-this.x;
        let dy = mouse.y-this.y;
        let distance = Math.sqrt(dx*dx+dy*dy)
        let forceDirectionX = dx/distance;
        let forceDirectionY = dy/distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance)/maxDistance;
        let directionX = forceDirectionX*force*this.density;
        let directionY = forceDirectionY*force*this.density;

        if(distance<mouse.radius)
        {
            this.x -= directionX;
            this.y -= directionY;
            
        }
        else{
            if(this.x != this.basex)
            {
                let dx = this.x-this.basex;
                this.x -= dx/5;
            }
            if(this.y != this.basey)
            {
                let dy = this.y-this.basey;
                this.y -= dy/5;
            }
        }
        
    }
}


function init()
{
    ParticleArray = [];
    for(let y=0, y2 = textCordinates.height; y<y2;y++)
    {
        for(let x =0, x2 = textCordinates.width; x < x2; x++)
        {
            if(textCordinates.data[(y*4*textCordinates.width) + (x*4)+3]>128)
            {
                let positionX = x + adjustx;
                let positionY = y + adjusty;
                ParticleArray.push(new Particle(positionX *15,positionY*15));
            }
        }
    }
    // for(let i = 0; i<1000; i++)
    // {
    //     let x = Math.random()*canvas.width;
    //     let y = Math.random()*canvas.height;
    //     ParticleArray.push(new Particle(x ,y));
    // }
    // ParticleArray.push(new Particle(240,700));
}
init();
// console.log(ParticleArray);


function animate()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i=0; i<ParticleArray.length;i++)
    {
        ParticleArray[i].draw();
        ParticleArray[i].update();
        let mousedx = mouse.x-ParticleArray[i].x;
        let mousedy = mouse.y-ParticleArray[i].y;
        let mouseDistance = Math.sqrt(mousedx*mousedx+mousedy*mousedy);
        if(mouseDistance<120)
        {
            ParticleArray[i].draw1();   
            
        }
    }
    connect();
    requestAnimationFrame(animate);
}
animate();

function connect()
{
    let opacityValue = 1;
    for(let a = 0; a < ParticleArray.length; a++)
    {
        for(let b = a; b<ParticleArray.length; b++)
        {
            let dx = ParticleArray[a].x - ParticleArray[b].x;
            let dy = ParticleArray[a].y - ParticleArray[b].y;
            let distance = Math.sqrt(dx*dx +dy*dy);
            if(distance<30)
            {
                opacityValue = 1-(distance/40);
                let mousedx = mouse.x-ParticleArray[a].x;
                let mousedy = mouse.y-ParticleArray[a].y;
                let mouseDistance = Math.sqrt(mousedx*mousedx+mousedy*mousedy);
                if(mouseDistance<150)
                {
                    ctx.strokeStyle = 'rgba(0,255,255,'+opacityValue+')';
                }
                else
                {
                    ctx.strokeStyle = 'rgba(255,255,255,'+opacityValue+')';
                }
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(ParticleArray[a].x, ParticleArray[a].y);
                ctx.lineTo(ParticleArray[b].x, ParticleArray[b].y);
                ctx.stroke();
            }
            

        }
    }
}