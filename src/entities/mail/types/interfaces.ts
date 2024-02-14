export interface ITemplateEmail {
  title: string;
  name: string;
  baseUrl: string;
  path: string;
  verifyToken: string;
  message: string;
  confirmationMessage: string;
  confirmationLink: string;
}
