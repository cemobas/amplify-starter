import type {
  PreSignUpTriggerHandler,
} from "aws-lambda";

export const handler: PreSignUpTriggerHandler = async (event) => {
  const email = event.request.userAttributes.email as string;
  if (!email.endsWith('@protonmail.com')) {
    throw new Error('Only ProtonMail emails are allowed');
  }
  return event;
};
