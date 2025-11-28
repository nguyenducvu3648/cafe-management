# Sử dụng OpenJDK 17 làm nền tảng
FROM eclipse-temurin:17-jdk

# Cài đặt các gói cần thiết và cập nhật CA certificates
RUN apt-get update && apt-get install -y \
    wget \
    curl \
    bash \
    sudo \
    ca-certificates \
    lsb-release \
    git \
    unzip \
    gnupg \
    && update-ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Cài đặt Docker trong container (nếu cần)
RUN curl -fsSL https://get.docker.com | bash

# Cài đặt Docker Compose (nếu cần)
RUN curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose \
    && chmod +x /usr/local/bin/docker-compose

# Tạo thư mục Jenkins home và user jenkins
RUN mkdir -p /var/jenkins_home && \
    useradd -m -d /var/jenkins_home jenkins && \
    chown -R jenkins:jenkins /var/jenkins_home

# Thiết lập biến môi trường Jenkins home
ENV JENKINS_HOME=/var/jenkins_home

# 🔥 TẢI JENKINS BẢN LTS MỚI NHẤT
RUN wget https://get.jenkins.io/war-stable/2.479.3/jenkins.war -O /opt/jenkins.war

# Mở cổng Jenkins
EXPOSE 8080

# Chuyển sang user jenkins để chạy Jenkins
USER jenkins

# Lệnh khởi chạy Jenkins
CMD ["java", "-jar", "/opt/jenkins.war"]
