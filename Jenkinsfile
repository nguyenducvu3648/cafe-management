pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "cafe-backend"
        FRONTEND_IMAGE = "cafe-frontend"
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Pulling code from GitHub..."
                git branch: 'main', url: 'https://github.com/nguyenducvu3648/cafe-management'
            }
        }

        stage('Build Backend') {
            agent {
                docker {
                    image 'eclipse-temurin:20-jdk' // Container tạm để build Java 20
                    args '-u root:root'           // Nếu cần quyền root trong container
                }
            }
            steps {
                echo "Building backend with Maven (Java 20)..."
                sh './mvnw clean package -DskipTests'
                sh 'java -version'
                sh 'javac -version'
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "Building Docker images for backend and frontend..."
                sh "docker build -t ${BACKEND_IMAGE} ."
                sh "docker build -t ${FRONTEND_IMAGE} ./frontend"
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                echo "Deploying containers with Docker Compose..."
                dir('deployment') {
                    // dùng project name khác để tách container pipeline ra khỏi container host
                    sh "docker-compose -p cafe_pipeline_${BUILD_NUMBER} down --remove-orphans"
                    sh "docker-compose -p cafe_pipeline_${BUILD_NUMBER} up -d --build"
                }
            }
        }
    }

    post {
        success {
            echo "CI/CD pipeline completed successfully!"
        }
        failure {
            echo "CI/CD pipeline failed."
        }
    }
}
