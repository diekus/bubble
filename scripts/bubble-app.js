window.dispatchEvent(new Event('resize'));

let bubble = document.querySelector('bubble-picture');

//events
let fileHandle;
const btnOpenFile = document.getElementById('btnOpenFile');
btnOpenFile.addEventListener('click', async () => {
    [fileHandle] = await window.showOpenFilePicker();
    const newImageBlob = await fileHandle.getFile();
    let newImageURL = URL.createObjectURL(newImageBlob);

    bubble.changeImage(newImageURL);
});




