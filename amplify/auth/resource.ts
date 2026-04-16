import { defineAuth } from "@aws-amplify/backend";
import { preSignUp } from "./presignup/resource";

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 *
 * Sign-in is email + password. `preferredUsername` is profile only: Cognito does
 * not allow `aliasAttributes` (e.g. preferred_username login) together with
 * `usernameAttributes` (email-as-username), which Amplify uses for email login.
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    preferredUsername: {
      mutable: true,
      required: true,
    },
  },
  triggers: {
    preSignUp: preSignUp,
  },
});
