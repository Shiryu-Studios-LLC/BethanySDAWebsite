// JavaScript Document
updateLanguage();

function updateLanguage(){
	const langIndicator1 = document.getElementById('cur-lang');
	
	const langOption1 = document.getElementById('change-lang-opt1');
	const langOption2 = document.getElementById('change-lang-opt2');

	langOption1.click(function () { if (langIndicator1.textContent == "En") langIndicator1.textContent = "Fr"; });
	langOption2.click(function () { if (langIndicator1.textContent == "Fr") langIndicator1.textContent = "En"; });
	
	setInterval(function(){
		langIndicator1.textContent = "En";
		
		langOption1.textContent = langIndicator1.textContent == "En" ? "*En" : "En";
		langOption2.textContent = langIndicator1.textContent == "Fr" ? "*Fr" : "Fr";
	}, 3000);
}