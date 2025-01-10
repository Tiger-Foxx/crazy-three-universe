import * as yup from 'yup';

export const configSchema = yup.object().shape({
  VITE_BASE_URL: yup.string().required(),
  VITE_DESCRIPTION: yup.string().required(),
  VITE_TITLE: yup.string().required(),
});
