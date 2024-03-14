const inputFile = document.querySelector('.custom-file__input');
const inputFileText = document.querySelector('.custom-file__text');
const inputFileTextValue = document.querySelector('.custom-file__text').innerText;

inputFile.addEventListener('change', function (e) {
  let countFiles = '';

  if (inputFile.files && inputFile.files.length >= 1) {
    countFiles = inputFile.files.length;
    inputFileText.innerText = 'Выбрано файлов: ' + countFiles;
  } else {
    inputFileText.innerText = inputFileTextValue;
  }
});
