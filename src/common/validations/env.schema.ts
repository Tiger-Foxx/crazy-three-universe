import { Platform } from '/src/enums/platform';
import * as yup from 'yup';

export const envSchema = yup.object().shape({
  mode: yup.string().oneOf(Object.values(Platform)).required(),
});
