# Build stage
FROM maven:3.9-eclipse-temurin-20 AS builder

WORKDIR /app

# Copy pom.xml first (for layer caching)
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Production stage
FROM eclipse-temurin:20-jre-alpine

WORKDIR /app

# Copy jar from builder
COPY --from=builder /app/target/cafe-management-1.0.0.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]

#jjfiiffijfj