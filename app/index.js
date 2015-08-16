var scope = document.querySelector('template[is="dom-bind"]');

// Dom elements
var ribbonToggle = document.getElementById('toggleRibbon');
var editor = document.getElementsByTagName('markdown-editor')[0];
var history = document.getElementById('history');
var title = document.getElementById('title');
var historyPanel = document.getElementsByTagName('history-panel')[0];

// helper functions

/*
 * Count the number of words in a string of text
 * @param {String} String to be matched
 */
function countWords(str) {
  var matches = str.match(/[\w\d]+/gi);
  return matches ? matches.length : 0;
}

// Adjust height of editor when window is resized
window.addEventListener('resize', function(){
  editor.resizeEditor();
}, true);

editor.addEventListener('file-opened', function(){
  title.textContent = editor.filepath.replace(/^.*(\\|\/|\:)/, '') + ' - ' + countWords(editor.aceEditor.getValue()) + ' words';
}, false);

editor.addEventListener('editor-changed', function(){
  if (editor.filepath){
    title.textContent = editor.filepath.replace(/^.*(\\|\/|\:)/, '') + ' - ' + countWords(editor.aceEditor.getValue()) + ' words';
  }else{
    title.textContent = 'untitled.md - ' + countWords(editor.aceEditor.getValue()) + ' words';
  }
});

// Toggle ribbon when the toggle button is clicked
ribbonToggle.addEventListener('click', function(){
  editor.toggleRibbon();
}, false);

// open
history.addEventListener('click', function(){
  historyPanel.show();
}, false);

// Allow user to drag a file into the editor to open it

var holder = document.getElementById('editor');

holder.ondragover = function () {
  editor.style.opacity = '.6';
  return false;
};
holder.ondragleave = holder.ondragend = function () {
  editor.style.opacity = '1';
  return false;
};
holder.ondrop = function (e) {
  e.preventDefault();
  editor.style.opacity = '1';
  var file = e.dataTransfer.files[0];
  console.log(file.type);
  // only allow file drag if there is no filepath already specified
  // only accept markdown and plaintext files into the editor
  if (editor.filepath === null && (file.type === 'text/markdown' || file.type === 'text/plain')){
    editor.setFilePath(file.path);
    historyPanel.filepath = file.path;
    historyPanel.getHistoryItems();
  }
  // if file is an image, insert the image into the editor
  else if (file.type === 'image/jpg' || file.type === 'image/png'){
    editor.aceEditor.insert('![](' + file.path + ')');
  }
  return false;
};
