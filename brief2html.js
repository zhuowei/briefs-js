var textArea;
var outputTextArea;
var outputLink;
var startButton;
var briefDom;
var BRIEF_PREFIX = "brief-"
var BRIEF_XHTML_DOCTYPE = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n'


function init(){
	textArea=document.getElementById("main-textarea");
	outputTextArea=document.getElementById("output-textarea");
	outputLink=document.getElementById("output-link");
	startButton=document.getElementById("startbutton");
	startButton.onclick=startParse;
}
function startParse(){
	var briefXML = brief2html(textArea.value);
	alert(briefXML);
	outputTextArea.value = briefXML;
	outputLink.href = "data:text/application/xhtml+xml," + encodeURIComponent(briefXML);
}
function brief2html(briefScriptText){
	var parser = new BriefParser(briefScriptText);
	var world = parser.parse();
	//alert(world);
	var doc = document.implementation.createDocument ('http://www.w3.org/1999/xhtml', 'html', null);
	var head = document.createElementNS('http://www.w3.org/1999/xhtml', 'head');
	doc.documentElement.appendChild(head);
	/* add stylesheet and javascript */
	var titleElem = document.createElementNS('http://www.w3.org/1999/xhtml', 'title');
	titleElem.textContent = "A Brief converted to HTML";
	head.appendChild(titleElem);
	var styleElem = document.createElementNS('http://www.w3.org/1999/xhtml', 'link');
	styleElem.setAttribute("type", "text/css");
	styleElem.setAttribute("rel", "stylesheet");
	styleElem.setAttribute("href", "brief2html.css");
	head.appendChild(styleElem);
	var scriptElem = document.createElementNS('http://www.w3.org/1999/xhtml', 'script');
	scriptElem.setAttribute("type", "text/javascript");
	scriptElem.setAttribute("src", "brieflib.js");
	head.appendChild(scriptElem);
	var infoScriptElem = document.createElementNS('http://www.w3.org/1999/xhtml', 'script');
	infoScriptElem.setAttribute("type", "text/javascript");
	infoScriptElem.textContent = "brief.currentScene=\"" + world.start + "\";";
	head.appendChild(infoScriptElem);
	/* end stylesheet and js*/
	var body = document.createElementNS('http://www.w3.org/1999/xhtml', 'body');
	doc.documentElement.appendChild(body);
	for(var sceneNum=0;sceneNum<world.scenes.length;sceneNum++){
		var scene=world.scenes[sceneNum];
		var sceneElem = doc.createElementNS('http://www.w3.org/1999/xhtml', "div");
		sceneElem.setAttribute("id", BRIEF_PREFIX + "scene-"+escapeId(scene.name));
		sceneElem.setAttribute("class", BRIEF_PREFIX + "scene");
		var scenestyle="";
		if(scene.name!=world.start){
			scenestyle+="display:none;";
		}
		scenestyle+="background-image:url('"+scene.image+"');";
		sceneElem.setAttribute("style", scenestyle);
		//Actors
		for(var actorNum=0;actorNum<scene.actors.length;actorNum++){
			var actor = scene.actors[actorNum];
			var actorElem = doc.createElementNS('http://www.w3.org/1999/xhtml', "img");
			//actorElem.setAttribute("id", BRIEF_PREFIX + "actor-"+escapeId(actor.name));
			actorElem.setAttribute("class", BRIEF_PREFIX + "actor " + BRIEF_PREFIX + escapeId(actor.name));
			actorElem.setAttribute("alt", "");
			var actorstyle="left:"+actor.x+"px;top:"+actor.y+"px;width:"+actor.width+"px;" +
				"height:"+actor.height+"px;";
			if(actor.image){
				actorElem.setAttribute("src", actor.image);
			}
			else{
				actorElem.setAttribute("src", "");
			}
			if(!actor.visible){
				actorstyle+="display:none;";
			}
			if(actor.scrollable){
				actorstyle+="overflow:scroll;";
			}
			actorElem.setAttribute("style", actorstyle);
			if(actor.action){
				var actorOnClick = getScript(actor.action);
				actorElem.setAttribute("onclick", actorOnClick);
			}
			sceneElem.appendChild(actorElem);
		}
		body.appendChild(sceneElem);
	}
	var serializer =new XMLSerializer();
	return BRIEF_XHTML_DOCTYPE + serializer.serializeToString(doc);
}
function getScript(action){
	var command = action.substring(0, action.indexOf("(")).trim().toLowerCase();
	var options = action.substring(action.indexOf("(")+1, action.indexOf(")")).trim().toLowerCase().split(",");
	var jsOptionsStr = "";
	for(var opt=0;opt<options.length;opt++){
		options[opt]=options[opt].trim();
		jsOptionsStr = jsOptionsStr + "'" + options[opt] + "'" + (opt!=options.length-1? ",": "");
	}
	//console.log(command + options);
	switch(command){
		case "move":
		case "goto":
		case "resize":
		case "show":
		case "hide":
		case "toggle":
			return "brief."+command+"("+ jsOptionsStr + ")";
			break;
		default:
			throw new Error("Invalid command:" + action);
			break;
	}
}
function escapeId(str){
	return str.replace(/\ /g, "-");
}
window.onload=init;
