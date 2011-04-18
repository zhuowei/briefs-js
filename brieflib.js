var BRIEF_PREFIX = "brief-";
var brief={
	"move": function(actorName, x, y){
			var actor = this.getActor(actorName);
			actor.style.left = x + "px";
			actor.style.top = y + "px";
		},
	"show": function(actorName){
			var actor = this.getActor(actorName);
			actor.style.display = "";
		},
	"toggle": function(actorName){
			alert("The toggle function is not yet supported.");
		},
	"goto": function(sceneName, transition){
			var newscene = document.getElementById(BRIEF_PREFIX + "scene-" + escapeId(sceneName));
			newscene.style.display = "";
			var oldscene = document.getElementById(BRIEF_PREFIX + "scene-" + escapeId(this.currentScene));
			oldscene.style.display="none";
			this.currentScene = sceneName;
		},
	"resize": function(actorName, width, height){
			var actor = this.getActor(actorName);
			actor.style.width = width + "px";
			actor.style.height = height + "px";
		},
	"currentScene" : "",
	"getActor":function(actorName){
			var curScene = document.getElementById(BRIEF_PREFIX + "scene-" + escapeId(this.currentScene));
			return curScene.getElementsByClassName(BRIEF_PREFIX + escapeId(actorName))[0];
		}
};
function escapeId(str){
	return str.replace(/\ /g, "-");
}
