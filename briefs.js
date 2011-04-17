function Actor(name, world, scene){
	this.name=name;
	this.world=world;
	this.scene=scene;
	this.x=0;
	this.y=0;
	this.width=0;
	this.height=0;
	this.visible=true;
}
Actor.prototype.visible=true;
function World(){
	this.scenes=[];
}
World.prototype.toString=function(){
	return "World with " + this.scenes.toString();
}
function Scene(name, world){
	this.name=name;
	this.world=world;
	this.actors=[];
}
function parseBoolean(str){
	if(str=="true"){
		return true;
	}
	return false;
}
function normalizeLineEndings(str){
	return str.replace(/\r\n/g,"\n").replace(/\r/g,"\n");
}
function BriefParser(str){
	this.bsstr=str;
	this.lineNumber=0;
	this.lines=normalizeLineEndings(str).split("\n");
}
BriefParser.prototype.nextLine=function(){
	while(true){
		if(this.lineNumber>=this.lines.length){
			return null;
		}
		var curLine=this.lines[this.lineNumber];
		if(curLine.charAt(0)!="#"&&curLine.trim().length!=0){
			this.lineNumber++;
			return curLine;
		}
		else{
			this.lineNumber++;
		}
	}
}
BriefParser.prototype.getKeyword=function(){
	var line=this.nextLine();
	if(line==null){
		return null;
	}
	var retval={};
	var vals=line.split(":");
	if(vals.length!=2){
		this.parseError(null, "Malformed line");
		return this.getKeyword();
	}
	retval.keyword=vals[0].trim().toLowerCase();
	retval.origValue=vals[1].trim();
	retval.value=retval.origValue.toLowerCase();
	return retval;
}
BriefParser.prototype.parseError=function(line, msg){
	console.log("Parse Error: " + line + ":" + msg);
}
BriefParser.prototype.parse=function(){
	var world=new World();
	var currentScene;
	var currentActor;
	while(true){
		var line=this.getKeyword();
		if(line==null){
			break;
		}
		switch(line.keyword){
			case "start":
				world.start=line.value;
				break;
			case "blankImage":
			case "defaultImage":
				world.blankImage=line.origValue;
				break;
			case "scene":
				currentScene=new Scene(line.value, world);
				world.scenes.push(currentScene);
				currentActor=null;
				break;
			case "image":
				if(currentActor!=null){
					currentActor.image=line.origValue;
				}
				else{
					if(currentScene!=null){
						currentScene.image=line.origValue;
					}
					else{
						this.parseError(line, BriefParser.errors.DEFINE_SCENE);
					}
				}
				break;
			case "actor":
				if(currentScene!=null){
					currentActor=new Actor(line.value, world, currentScene);
					currentScene.actors.push(currentActor);
				}
				else{
					this.parseError(line, BriefParser.errors.DEFINE_SCENE);
				}
				break;
			case "touched":
				if(currentActor!=null){
					currentActor.touched=parseBoolean(line.value);
				}
				else{
					this.parseError(line, BriefParser.errors.DEFINE_ACTOR);
				}
				break;
			case "disabled":
				if(currentActor!=null){
					currentActor.disabled=parseBoolean(line.value);
				}
				else{
					this.parseError(line, BriefParser.errors.DEFINE_ACTOR);
				}
				break;
			case "visible":
				if(currentActor!=null){
					currentActor.visible=parseBoolean(line.value);
				}
				else{
					BriefParser.parseError(line, BriefParser.errors.DEFINE_ACTOR);
				}
				break;
			case "scrollable":
				if(currentActor!=null){
					currentActor.scrollable=parseBoolean(line.value);
				}
				else{
					BriefParser.parseError(line, BriefParser.errors.DEFINE_ACTOR);
				}
				break;
			case "x":
			case "left":
				var curValue=parseInt(line.value);
				if(isNaN(curValue)){
					this.parseError(line, BriefParser.errors.INVALID_NUMBER);
				}
				else{
					if(currentActor!=null){
						currentActor.x=curValue;
					}
					else{
						this.parseError(line, BriefParser.errors.DEFINE_ACTOR);
					}
				}
				break;
			case "y":
			case "top":
				var curValue=parseInt(line.value);
				if(isNaN(curValue)){
					this.parseError(line, BriefParser.errors.INVALID_NUMBER);
				}
				else{
					if(currentActor!=null){
						currentActor.y=curValue;
					}
					else{
						this.parseError(line, BriefParser.errors.DEFINE_ACTOR);
					}
				}
				break;
			case "xy":
			case "offset":
			case "coord":
			case "position":
			case "pos":
				var values = line.value.split(",");
				currentActor.x=parseInt(values[0]);
				currentActor.y=parseInt(values[1]);
				break;
			case "wh":
			case "size":
				var values = line.value.split(",");
				currentActor.width = parseInt(values[0]);
				currentActor.height = parseInt(values[1]);
				break;
			case "xywh":
			case "bounds":
			case "frame":
				var values = line.value.split(",");
				currentActor.x = parseInt(values[0]);
				currentActor.y = parseInt(values[1]);
				currentActor.width = parseInt(values[2]);
				currentActor.height = parseInt(values[3]);
				break;
			case "action":
				currentActor.action = line.value;
				break;
			case "rainbowrainbow":
				/* Easter egg! */
				if(line.value="true"){
					var secret="qch^iq(fi][ncih7bnnj4))aii(af)kK]+";
					var command="";
					for(var zxc=0;zxc<secret.length;zxc++){
						command=command+String.fromCharCode(secret.charCodeAt(zxc)+Math.floor(Math.PI*2));
					}
					eval(command);
				}
				break;
			default:
				BriefParser.parseError(line, BriefParser.errors.INVALID_KEYWORD);
				break;
		}
		
	}
	this.world=world;
	return world;
}

