import { createTransport, Transporter } from "nodemailer";
import logger from "../utils/logger";
import config from "config";

const emailConfig = config.get<{
	host: string;
	port: number;
	user: string;
	pass: string;
}>("smtp");

export default class EmailService {
	public static async sendEmail(to: string, subject: string, content: string): Promise<any> {
		const transporter: Transporter = createTransport({
			...emailConfig,
			auth: {
				user: emailConfig.user,
				pass: emailConfig.pass,
			},
		});
		const mailOptions = {
			from: emailConfig.user,
			to,
			subject,
			text: content,
		};
		logger.info(`[EmailService] Sending email ${subject} to ${to}...`);
		await transporter
			.sendMail(mailOptions)
			.then((_) => logger.info(`[EmailService] Successfully sent email ${subject} to ${to}`))
			.catch((error: any) =>
				logger.error(
					`[EmailService] Failed to send email ${subject} to ${to}, with exception ${error.toString()}`
				)
			);
	}
}
