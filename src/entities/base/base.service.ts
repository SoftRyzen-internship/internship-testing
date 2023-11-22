import { Injectable } from '@nestjs/common';

@Injectable()
export class BaseService {
  public getInfo() {
    const info = `
		<body style="box-sizing: border-box; padding: 0; margin: 0; font-family: Roboto, sans-serif;">
			<div style="padding: 25px";>
				<h4 style="font-size: 24px;">This is the backend for the SoftRyzen project, built using the NestJS framework.</h4> 
				<a href='${process.env.BASE_URL}/api/docs' style="display: inline-block; margin-bottom: 15px; font-size: 22px;">Documentation</a>
				<div style="border: 1px solid #c4c4c4c4; border-radius: 5px; padding: 10px; width: 400px; margin-bottom: 15px;">
					<p style="font-weight: bold;">Building</p>
					<p style="margin-left: 10px;">npm run build</p>
					<p style="margin-left: 10px;">npm run start</p>
				</div>
				<div style="border: 1px solid #c4c4c4c4; border-radius: 5px; padding: 10px; width: 400px; margin-bottom: 15px;">
					<p style="font-weight: bold;">Required Versions</p>
					<p style="margin-left: 10px;">node v18.17.1</p>
					<p style="margin-left: 10px;">yarn v1.22.19</p>
				</div>
				<div style="border: 1px solid #c4c4c4c4; border-radius: 5px; padding: 10px; width: 400px; margin-bottom: 15px;">
					<p style="font-weight: bold;">Database</p>
					<p>This project uses PostgreSQL as its database. Make sure you have PostgreSQL installed and properly configured.</p>
				</div>
				<div style="border: 1px solid #c4c4c4c4; border-radius: 5px; padding: 10px; width: 400px; margin-bottom: 15px;">
					<p style="font-weight: bold;">Environment variables</p>
					<p style="margin-left: 10px;">PORT=number</p>
					<p style="margin-left: 10px;">ACCESS_TOKEN_PRIVATE_KEY=string</p>
					<p style="margin-left: 10px;">REFRESH_TOKEN_PRIVATE_KEY=string</p>
					<p style="margin-left: 10px;">POSTGRES_HOST=string</p>
					<p style="margin-left: 10px;">POSTGRES_PORT=number</p>
					<p style="margin-left: 10px;">POSTGRES_USER=string</p>
					<p style="margin-left: 10px;">POSTGRES_PASSWORD=string</p>
					<p style="margin-left: 10px;">POSTGRES_DB=string</p>
					<p style="margin-left: 10px;">BASE_URL=string</p>
					<p style="margin-left: 10px;">CLIENT_ID_GOOGLE=string</p>
					<p style="margin-left: 10px;">CLIENT_SECRET_GOOGLE=string</p>
					<p style="margin-left: 10px;">CALLBACK_URL_GOOGLE=url</p>
					<p style="margin-left: 10px;">REDIRECT_TO_PASSWORD_CHANGE_FORM=url</p>
					<p style="margin-left: 10px;">REDIRECT_TO_SITE_INTERNSHIP=url</p>
					<p style="margin-left: 10px;">EMAIL_TO_SEND_FROM=email</p>
					<p style="margin-left: 10px;">ELASTIC_API_KEY=key</p>
					<p style="margin-left: 10px;">GOOGLE_CLIENT_EMAIL=string</p>
					<p style="margin-left: 10px;">GOOGLE_PRIVATE_KEY=string</p>
					<p style="margin-left: 10px;">TARGET_FOLDER_ID=string</p>
				</div>
				<div style="border: 1px solid #c4c4c4c4; border-radius: 5px; padding: 10px; width: 400px">
					<p style="font-weight: bold;">Migration data base</p>
					<p style="margin-left: 10px;">npm run migrations:generate -- src/migrations/name</p>
					<p style="margin-left: 10px;">npm run migrations:create -- src/migrations/name</p>
					<p style="margin-left: 10px;">npm run migrations:run</p>
					<p style="margin-left: 10px;">npm run migrations:down</p>
				</div>
			</div>
		</body>
		`;
    return info;
  }
}
