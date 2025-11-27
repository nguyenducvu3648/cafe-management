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
            steps {
                echo "Building backend with Maven..."
                sh './mvnw clean package -DskipTests'
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "Building Docker images for backend and frontend..."
                sh 'docker build -t $BACKEND_IMAGE .'
                sh 'docker build -t $FRONTEND_IMAGE ./frontend'
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                echo "Deploying containers with Docker Compose..."
                
                // Đảm bảo rằng các container không bị dừng lại ngoài ý muốn
                sh 'docker-compose down --remove-orphans' // Dừng các container không còn được sử dụng
                sh 'docker-compose up -d --build' // Khởi động lại với Docker Compose, build lại các dịch vụ mới
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
