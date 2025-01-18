import java.io.*;
import java.net.*;
import java.sql.*;

public class FormHandler {
    private static final String DB_URL = "jdbc:sqlite:database/aniket.db";

    public static void main(String[] args) {
        int port = 8080;

        try (ServerSocket serverSocket = new ServerSocket(port)) {
            System.out.println("Server is running on port " + port + "...");

            // Create the database table if it doesn't exist
            initializeDatabase();

            while (true) {
                Socket clientSocket = serverSocket.accept();
                handleClient(clientSocket);
            }
        } catch (IOException | SQLException e) {
            e.printStackTrace();
        }
    }

    private static void initializeDatabase() throws SQLException {
        try (Connection conn = DriverManager.getConnection(DB_URL);
             Statement stmt = conn.createStatement()) {
            String createTableSQL = """
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT NOT NULL,
                    mobile_number TEXT,
                    subject TEXT,
                    message TEXT
                )
            """;
            stmt.execute(createTableSQL);
        }
    }

    private static void handleClient(Socket clientSocket) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
        BufferedWriter out = new BufferedWriter(new OutputStreamWriter(clientSocket.getOutputStream()));

        // Read HTTP request (we're expecting a POST request)
        String line;
        StringBuilder requestBody = new StringBuilder();
        boolean isPost = false;
        while ((line = in.readLine()) != null && !line.isEmpty()) {
            if (line.startsWith("POST")) {
                isPost = true;
            }
        }

        // Read the form data
        if (isPost) {
            char[] buffer = new char[1024];
            int bytesRead = in.read(buffer);
            requestBody.append(buffer, 0, bytesRead);
        }

        // Parse the form data
        String[] params = requestBody.toString().split("&");
        String name = null, email = null, mobileNumber = null, subject = null, message = null;
        for (String param : params) {
            String[] keyValue = param.split("=");
            if (keyValue.length == 2) {
                String key = URLDecoder.decode(keyValue[0], "UTF-8");
                String value = URLDecoder.decode(keyValue[1], "UTF-8");
                switch (key) {
                    case "name" -> name = value;
                    case "email" -> email = value;
                    case "mobile_number" -> mobileNumber = value;
                    case "subject" -> subject = value;
                    case "message" -> message = value;
                }
            }
        }

        // Insert data into the database
        if (name != null && email != null) {
            try (Connection conn = DriverManager.getConnection(DB_URL);
                 PreparedStatement pstmt = conn.prepareStatement(
                     "INSERT INTO users (name, email, mobile_number, subject, message) VALUES (?, ?, ?, ?, ?)")) {
                pstmt.setString(1, name);
                pstmt.setString(2, email);
                pstmt.setString(3, mobileNumber);
                pstmt.setString(4, subject);
                pstmt.setString(5, message);
                pstmt.executeUpdate();
                out.write("HTTP/1.1 200 OK\r\n\r\nData inserted successfully!");
            } catch (SQLException e) {
                e.printStackTrace();
                out.write("HTTP/1.1 500 Internal Server Error\r\n\r\nFailed to insert data.");
            }
        } else {
            out.write("HTTP/1.1 400 Bad Request\r\n\r\nMissing required fields.");
        }

        out.flush();
        clientSocket.close();
    }
}
