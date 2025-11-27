# Sử dụng OpenJDK 21 làm nền tảng
FROM openjdk:21-jdk

# Cài đặt các gói cần thiết
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    curl \
    bash \
    sudo \
    ca-certificates \
    lsb-release \
    && rm -rf /var/lib/apt/lists/*  # Dọn dẹp bộ nhớ cache apt để giảm kích thước image

# Cài đặt Docker trong container
RUN curl -fsSL https://get.docker.com | bash

# Cài đặt Docker Compose
RUN curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose \
    && chmod +x /usr/local/bin/docker-compose

# Tải Jenkins WAR file (cập nhật phiên bản mới nhất nếu cần)
RUN wget https://get.jenkins.io/war/2.319.1/jenkins.war -O /opt/jenkins.war

# Mở cổng 8080 cho Jenkins
EXPOSE 8080

# Tạo user jenkins và chuyển về user đó để chạy Jenkins
RUN useradd -m jenkins
USER jenkins

# Lệnh chạy Jenkins
CMD ["java", "-jar", "/opt/jenkins.war"]
