package com.portfolio;

public class ContactForm {
    private String name;
    private String email;
    private String message;
    private String subject; 
    private String phonenumber;

    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPhonenumber() { return phonenumber; }
    public void setPhonenumber(String phonenumber) { this.phonenumber = phonenumber; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public String getSubject() { return subject;}
    public void setSubject(String subject) {this.subject=subject;}

   
}
