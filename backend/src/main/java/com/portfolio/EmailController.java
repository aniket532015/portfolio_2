package com.portfolio;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.MailException;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/send-email")
public class EmailController {

    @Autowired
    private JavaMailSender javaMailSender;

    private static final String RECIPIENT_EMAIL = "akaniketkumar532015@gmail.com";

    // Handle preflight OPTIONS request
    @RequestMapping(method = RequestMethod.OPTIONS)
    public String handleOptions() {
        return "OK";
    }

    @PostMapping
    public String sendEmail(@RequestBody ContactForm form) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom("aniket.uk.mail@gmail.com");
            helper.setTo(RECIPIENT_EMAIL);
            helper.setSubject(form.getSubject() + " " + form.getName());

            String emailContent = "New contact form submission:\n\n"
                    + "Name: " + form.getName() + "\n"
                    + "Email: " + form.getEmail() + "\n"
                    + "PhoneNumber: " + form.getPhonenumber() + "\n"
                    + "Subject: " + form.getSubject() + "\n"
                    + "Message: " + form.getMessage();

            helper.setText(emailContent);
            javaMailSender.send(message);

            return "{\"message\":\"Message sent successfully!\"}";
        } catch (MessagingException | MailException e) {
            e.printStackTrace();
            return "{\"message\":\"Failed to send the message.\"}";
        }
    }
}

