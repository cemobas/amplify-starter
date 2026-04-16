import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { preSignUp } from './auth/presignup/resource.js';

defineBackend({
  auth,
  data,
  preSignUp,
});
