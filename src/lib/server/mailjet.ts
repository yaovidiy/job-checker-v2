import { MAILJET_API_KEY, MAILJET_SECRET_KEY } from '$env/static/private';
import Mailjet from 'node-mailjet';

const mailjet = Mailjet.apiConnect(
  MAILJET_API_KEY,
  MAILJET_SECRET_KEY
);

export default mailjet;
