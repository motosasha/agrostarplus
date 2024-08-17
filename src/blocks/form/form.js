import ready from "../../js/utils/documentReady.js";
import JustValidate from "just-validate";

ready(function () {
  const contactsForm = document.querySelector(".contacts__form");
  if (contactsForm) {
    const actionUrl = contactsForm.getAttribute("action");
    const contactsFormValidate = new JustValidate(contactsForm, validationFormConfig);

    contactsFormValidate
      .addField("input[name='name']", [
        {
          rule: "required",
          errorMessage: "Обязательное поле",
        },
        {
          rule: "minLength",
          value: 2,
          errorMessage: "Значение слишком короткое",
        },
        {
          rule: "maxLength",
          value: 50,
          errorMessage: "Значение слишком длинное",
        },
      ])
      .addField("input[name='phone']", [
        {
          rule: "required",
          errorMessage: "Обязательное поле",
        },
        {
          rule: "customRegexp",
          value: /^(\+7)[\s-]([0-9]{3})[\s-]([0-9]{3})[\s-]([0-9]{2})[\s-]([0-9]{2})/gi,
          errorMessage: "Неверное значение",
        },
      ])
      .addField("input[name='email']", [
        {
          rule: "required",
          errorMessage: "Обязательное поле",
        },
        {
          rule: "email",
          errorMessage: "Неверное значение",
        },
      ])
      .addField(
        "input[name='isAgree']",
        [
          {
            rule: "required",
            errorMessage: "Обязательное поле",
          },
        ],
        {
          errorsContainer: ".checkbox",
          errorLabelCssClass: ["checkbox__error"],
          errorFieldCssClass: ["checkbox__input--invalid"],
        },
      )
      .onSuccess(() => {
        const formData = new FormData(contactsForm);
        const plainFormData = Object.fromEntries(formData.entries());
        fetch(actionUrl, formSendConfig(plainFormData)).then((response) => {
          if (response.ok) {
            window.thanks();
            resetForm(contactsForm, contactsFormValidate);
          } else {
            alert(response.message);
          }
        });
      });
  }
});

function formSendConfig(plainFormData) {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(plainFormData),
  };
}

const validationFormConfig = {
  errorFieldCssClass: "input--invalid",
  errorLabelStyle: {},
  errorLabelCssClass: ["field__error"],
};

function resetForm(form, validation) {
  form.reset();
  validation.refresh();
  form.querySelectorAll(".input").forEach((input) => {
    input.classList.remove("input--has-value");
  });
  form.querySelectorAll(".textarea").forEach((textarea) => {
    textarea.classList.remove("textarea--has-value");
    textarea.removeAttribute("style");
  });
}
