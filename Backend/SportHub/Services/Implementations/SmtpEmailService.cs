using System.Net;
using System.Net.Mail;
using SportHub.Services.Interfaces;

namespace SportHub.Services.Implementations
{
    public class SmtpEmailService : IEmailService
    {
        private readonly IConfiguration _config;
        private readonly ILogger<SmtpEmailService> _logger;

        public SmtpEmailService(IConfiguration config, ILogger<SmtpEmailService> logger)
        {
            _config = config;
            _logger = logger;
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            try
            {
                var host = _config["EmailSettings:Host"];
                var port = int.Parse(_config["EmailSettings:Port"] ?? "587");
                var senderEmail = _config["EmailSettings:SenderEmail"];
                var senderName = _config["EmailSettings:SenderName"];
                var password = _config["EmailSettings:Password"];

                if (string.IsNullOrEmpty(senderEmail) || string.IsNullOrEmpty(password) || senderEmail.Contains("YOUR_GMAIL_HERE"))
                {
                    _logger.LogWarning("Email settings are not configured properly. Falling back to mock console log.");
                    _logger.LogInformation($"[MOCK EMAIL] To: {to}, Subject: {subject}, Body: {body}");
                    return;
                }

                var message = new MailMessage
                {
                    From = new MailAddress(senderEmail, senderName),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };
                message.To.Add(new MailAddress(to));

                using var client = new SmtpClient(host, port)
                {
                    Credentials = new NetworkCredential(senderEmail, password),
                    EnableSsl = true
                };

                await client.SendMailAsync(message);
                _logger.LogInformation($"Email sent successfully to {to}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send email");
                throw;
            }
        }
    }
}
