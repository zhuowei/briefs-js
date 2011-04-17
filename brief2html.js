var textArea;
var startButton;
var briefDom;
var BRIEF_PREFIX = "brief-"
function init(){
	textArea=document.getElementById("main-textarea");
	startButton=document.getElementById("startbutton");
	startButton.onclick=startParse;
}
function startParse(){
	var briefXML = brief2html(textArea.value);
	alert(briefXML);
}
function brief2html(briefScriptText){
	var parser = new BriefParser(briefScriptText);
	var world = parser.parse();
	alert(world);
	var doc = document.implementation.createDocument ('http://www.w3.org/1999/xhtml', 'html', null);
	var head = document.createElementNS('http://www.w3.org/1999/xhtml', 'head');
	doc.documentElement.appendChild(head);
	/* add stylesheet and javascript */
	var styleElem = document.createElementNS('http://www.w3.org/1999/xhtml', 'link');
	styleElem.setAttribute("type", "text/css");
	styleElem.setAttribute("rel", "stylesheet");
	styleElem.setAttribute("href", "brief2html.css");
	head.appendChild(styleElem);
	var scriptElem = document.createElementNS('http://www.w3.org/1999/xhtml', 'script');
	scriptElem.setAttribute("type", "text/javascript");
	scriptElem.setAttribute("src", "brief2html.js");
	head.appendChild(scriptElem);
	/* end stylesheet and js*/
	var body = document.createElementNS('http://www.w3.org/1999/xhtml', 'body');
	doc.documentElement.appendChild(body);
	for(var sceneNum=0;sceneNum<world.scenes.length;sceneNum++){
		var scene=world.scenes[sceneNum];
		var sceneElem = doc.createElementNS('http://www.w3.org/1999/xhtml', "div");
		sceneElem.setAttribute("id", BRIEF_PREFIX + "scene-"+scene.name);
		sceneElem.setAttribute("class", BRIEF_PREFIX + "scene");
		var scenestyle="";
		if(scene.name!=world.start){
			scenestyle+="display:none;";
		}
		scenestyle+="background-image:url('"+scene.image+"');";
		sceneElem.setAttribute("style", scenestyle);
		//TODO: Actors
		for(var actorNum=0;actorNum<scene.actors.length;actorNum++){
			var actor = scene.actors[actorNum];
			var actorElem = doc.createElementNS('http://www.w3.org/1999/xhtml', "div");
			actorElem.setAttribute("id", BRIEF_PREFIX + "actor-"+actor.name);
			actorElem.setAttribute("class", BRIEF_PREFIX + "actor");
			var actorstyle="left:"+actor.x+"px;top:"+actor.y+"px;width:"+actor.width+"px;" +
				"height:"+actor.height+"px;";
			if(actor.image){
				actorstyle+="background-image:url('"+actor.image+"');";
			}
			if(!actor.visible){
				actorstyle+="display:none;";
			}
			actorElem.setAttribute("style", actorstyle);
			sceneElem.appendChild(actorElem);
		}
		body.appendChild(sceneElem);
	}
	var serializer =new XMLSerializer();
	return serializer.serializeToString(doc);
}
window.onload=init;
