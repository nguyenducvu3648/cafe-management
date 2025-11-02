package cafe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CafeApplication {

	public static void main(String[] args) {
        SpringApplication.run(CafeApplication.class, args);
        System.out.println("\n==============================================");
        System.out.println("🎉 Cafe Management System Started Successfully!");
        System.out.println("📍 Server running at: http://localhost:8080");
        System.out.println("📚 API Documentation available soon");
        System.out.println("==============================================\n");
    }

}
