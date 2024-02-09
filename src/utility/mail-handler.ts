// import { ConfigService } from '@nestjs/config';
// import axios from 'axios';
// import FormData from 'form-data';

// export const sendEmail = async (
//   to: string,
//   templateName: string,
//   subject: string,
//   templateVars: Record<string, any> = {},
//   config: ConfigService,
// ) => {
//   const form = new FormData();
//   form.append('to', to);
//   form.append('template', templateName);
//   form.append('subject', subject);
//   form.append('from', 'mailgun@sandbox-123.mailgun.org');
//   Object.keys(templateVars).forEach((key) => {
//     form.append(`v:${key}`, templateVars[key]);
//   });
//   const username = 'api';
//   const password = config.get('password');
//   const token = Buffer.from(`${username}:${password}`).toString('base64');
//   const response = await axios({
//     method: 'POST',
//     url: `https://api.mailgun.net/v3/${config.get('TestDOMAIN')}/messages`,
//     headers: {
//       Authorization: `Bearer ${token}`,
//       contentType: 'multipart/form-data',
//     },
//     data: form,
//   });
//   return response;
// };
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import FormData from 'form-data';
//https://maps.app.goo.gl/5YagE1LReefheCfw8

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  async sendEmail(
    to: string,
    templateName: string,
    subject: string,
    templateVars: Record<string, any> = {},
  ) {
    try {
      const form = new FormData();
      form.append('to', to);
      form.append('template', templateName);
      form.append('subject', subject);
      form.append('from', 'mailgun@sandbox-123.mailgun.org');
      Object.keys(templateVars).forEach((key) => {
        form.append(`v:${key}`, templateVars[key]);
      });

      const username = 'api';
      const password = this.configService.get('PRIVATE_API_KEY');
      const token = Buffer.from(`${username}:${password}`).toString('base64');

      const response = await axios({
        method: 'POST',
        url: `https://api.mailgun.net/v3/${this.configService.get('TestDOMAIN')}/messages`,
        headers: {
          Authorization: `Bearer ${token}`,
          contentType: 'multipart/form-data',
        },
        data: form,
      });

      return response;
    } catch (error) {
      throw error;
    }
  }
}
