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

    private static final String RECIPIENT_EMAIL = "akaniketkumar532015@gmail.com"; // Static recipient email

    @PostMapping
    public String sendEmail(@RequestBody ContactForm form) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setFrom("aniket.uk.mail@gmail.com"); // Your configured sender email
            helper.setTo(RECIPIENT_EMAIL); // Static recipient email
            helper.setSubject( form.getSubject()+ form.getName());

            // Email content
            String emailContent = "New contact form submission:\n\n"
                    + "Name: " + form.getName() + "\n"
                    + "Email: " + form.getEmail() + "\n"
                    + "PhoneNumber:\n" + form.getPhonenumber()+"\n"
                    + "Subject:\n" + form.getSubject()+"\n"
                    + "Message:\n" + form.getMessage();

            helper.setText(emailContent);

            javaMailSender.send(message);
            return "{\"message\":\"Message sent successfully!\"}";

        } catch (MessagingException | MailException e) {
            e.printStackTrace();
            return "{\"message\":\"Failed to send the message.\"}";
        }
    }
}
