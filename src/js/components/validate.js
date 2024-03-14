import JustValidate from 'just-validate';
import Inputmask from "inputmask";
import { fadeIn, fadeOut } from '../functions/fadein';

const siteContainer = document.querySelector('.site-container');
const checkboxInput = document?.querySelector('.custom-checkbox__field');
const checkboxLabel = document?.querySelector('.contact-form__checkbox');
const mainFormBtn = document?.querySelector('.contact-form__submit');
const rulesSmall = [
  {
    ruleSelector: '.input-name',
    rules: [
      {
        rule: 'minLength',
        value: 1,
        errorMessage: 'Введите ваше имя полностью',
      },
      {
        rule: 'required',
        value: true,
        errorMessage: 'Заполните имя'
      }
    ]
  },
  {
    ruleSelector: '.input-mail',
    rules: [
      {
        rule: 'required',
        value: true,
        errorMessage: 'Email обязателен',
      },
      {
        rule: 'email',
        value: true,
        errorMessage: 'Введите корректный Email',
      },
    ]
  },
];
const rulesMain = [
  {
    ruleSelector: '.input-file',
    rules: [
      {
        rule: 'files',
        value: {
          files: {
            // maxSize: 26214400,
            maxSize: 26400,
          },
        },
        errorMessage: 'Файл должен весить меньше 25MB',
      }
    ]
  },
  {
    ruleSelector: '.input-name',
    rules: [
      {
        rule: 'minLength',
        value: 1,
        errorMessage: 'Введите ваше имя полностью',
      },
      {
        rule: 'required',
        value: true,
        errorMessage: 'Заполните имя'
      }
    ]
  },
  {
    ruleSelector: '.input-mail',
    rules: [
      {
        rule: 'required',
        value: true,
        errorMessage: 'Email обязателен',
      },
      {
        rule: 'email',
        value: true,
        errorMessage: 'Введите корректный Email',
      },
    ]
  },
  {
    ruleSelector: '.input-tel',
    tel: true,
    telError: 'Введите корректный телефон',
    rules: [
      {
        rule: 'required',
        value: true,
        errorMessage: 'Заполните телефон'
      }
    ]
  },
];

if (checkboxLabel) {
  checkboxLabel.addEventListener('click', (e) => {
    if (e.target.classList.contains('custom-checkbox__field')) {
      if (checkboxInput.checked) {
        mainFormBtn.classList.remove('contact-form__submit--disabled');
      } else {
        mainFormBtn.classList.add('contact-form__submit--disabled');
      }
    }
  });
}

const createThanksPopup = () =>
  `
  <div class="modal-popup">
    <div class="modal-content">
      <p>Спасибо!</p>
      <p>Ваша заявка отправлена.</p>
    </div>
  </div>
  `

const afterForm = () => {
  siteContainer.insertAdjacentHTML('beforeend', createThanksPopup());
  const popup = document?.querySelector('.modal-popup');

  if (popup) {
    fadeIn(popup, 1000, 'flex');

    setTimeout(() => {
      fadeOut(popup, 1000);
      popup.remove();
    }, 2000);
  }
};

const validateForms = (selector, rules, afterSend) => {
  const form = document?.querySelector(selector);
  const telSelector = form?.querySelector('input[type="tel"]');

  if (!form) {
    console.error('Нет такого селектора!');
    return false;
  }

  if (telSelector) {
    const inputMask = new Inputmask('+7 (999) 999-99-99');
    inputMask.mask(telSelector);

    for (let item of rules) {
      if (item.tel) {
        item.rules.push({
          rule: 'function',
          validator: function () {
            const phone = telSelector.inputmask.unmaskedvalue();
            return phone.length === 10;
          },
          errorMessage: item.telError
        });
      }
    }
  }

  const validation = new JustValidate(selector);

  for (let item of rules) {
    validation
      .addField(item.ruleSelector, item.rules);
  }

  validation.onSuccess((ev) => {

    let formData = new FormData(ev.target);
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          if (afterSend) {
            afterSend();
          }
        }
      }
    }

    xhr.open('POST', 'mail.php', true);
    xhr.send(formData);

    ev.target.reset();
  })
};

validateForms('.contact-form', rulesMain, afterForm);
validateForms('.small-form', rulesSmall, afterForm);
