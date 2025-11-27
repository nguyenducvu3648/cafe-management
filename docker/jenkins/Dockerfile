# Sử dụng OpenJDK 21 làm nền tảng
FROM openjdk:21-jdk

# Cài đặt các gói cần thiết
RUN apt-get update && apt-get install -y wget gnupg

# Tải Jenkins WAR file
RUN wget https://get.jenkins.io/war/2.319.1/jenkins.war -O /opt/jenkins.war

# Mở cổng 8080 cho Jenkins
EXPOSE 8080

# Lệnh chạy Jenkins
CMD ["java", "-jar", "/opt/jenkins.war"]
