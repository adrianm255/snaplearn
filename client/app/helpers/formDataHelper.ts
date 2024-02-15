export const convertToFormData = (obj: any) => {
  let formData = objectToFormData(obj);
  formData = appendCsrfToken(formData);
  return formData;
};

const objectToFormData = (obj: any, namespace = null, formData = new FormData()) => {
  for (let propertyName in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, propertyName)) {
      const formKey = getFormKey(namespace, propertyName);
      appendToFormData(formData, formKey, obj[propertyName]);
    }
  }
  return formData;
};

const getFormKey = (namespace, propertyName) => {
  if (propertyName && propertyName in FORM_KEY_MAP) {
    propertyName = FORM_KEY_MAP[propertyName];
  }
  return namespace ? `${namespace}[${propertyName}]` : propertyName;
};

const appendToFormData = (formData, formKey, value) => {
  if (value instanceof Date) {
    appendAsDate(formData, formKey, value);
  } else if (isObjectButNotFile(value)) {
    objectToFormData(value, formKey, formData);
  } else {
    formData.append(formKey, value);
  }
};

const appendAsDate = (formData, formKey, date) => {
  formData.append(formKey, date.toISOString());
};

const isObjectButNotFile = (value) => {
  return typeof value === "object" && !(value instanceof File);
};

const appendCsrfToken = (formData) => {
  const csrfParam = document.querySelector('meta[name="csrf-param"]')?.getAttribute('content');
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  if (csrfParam && csrfToken) {
    formData.append(csrfParam, csrfToken);
  }
  return formData;
};

const FORM_KEY_MAP = {
  'course_sections': 'course_sections_attributes'
};