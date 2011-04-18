var BRIEF_PREFIX = "brief-";
var brief={
	"move": function(actorName, x, y){
			var curScene = document.getElementById(BRIEF_PREFIX + "scene-" + escapeId(this.currentScene));
			
			actor.style.left = x + "px";
			actor.style.top = y + "px";
			console.log("move" + actor.style.left + actor.style.top);
		},
	"show": function(actorName){
			var actor = document.getElementById(BRIEF_PREFIX + "actor-" + escapeId(actorName));
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
	"currentScene" : ""
};
function escapeId(str){
	return str.replace(/\ /g, "-");
}
