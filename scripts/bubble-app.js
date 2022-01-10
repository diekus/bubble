window.dispatchEvent(new Event('resize'));

let bubble = document.querySelector('bubble-picture');
let menu_handle = document.querySelector('.menu-handle');
let menu_display = 1;

let isDark = window.matchMedia('(prefers-color-scheme: dark)');
if(isDark.matches)
    bubble.changeImage('images/bgd.jpg');

//events
let fileHandle = null;
const btnOpenFile = document.getElementById('btnOpenFile');
btnOpenFile.addEventListener('click', async () => {
    [fileHandle] = await window.showOpenFilePicker();
    const newImageBlob = await fileHandle.getFile();
    let newImageURL = URL.createObjectURL(newImageBlob);

    bubble.changeImage(newImageURL);
});

menu_handle.addEventListener('click', () => {
    switch(menu_display) {
        case 1:
            document.querySelector('.bubble-logo').style.display = 'none';
            document.querySelector('#btnOpenFile').style.display = 'none';
            document.getElementById('lblFile').style.display = 'none';
            menu_display = 0;
        break;
        case 0:
            document.querySelector('.bubble-logo').style.display = 'inline-block';
            showFileButtons();
            menu_display = 1;
        break;
    }
});

//for browsers that do not support file system access API
let hideFileButtons = () => {
    if(window.showOpenFilePicker == null)
        btnOpenFile.style.display = 'none';
    else
        document.getElementById('lblFile').style.display = 'none';
};

let showFileButtons = () => {
    if(window.showOpenFilePicker == null)
        document.getElementById('lblFile').style.display = 'inline-block';    
    else
        btnOpenFile.style.display = 'inline-block';
        
};

let showFile = (input) => {
    let file = input.files[0];
    bubble.changeImage(URL.createObjectURL(file));
};

hideFileButtons();





