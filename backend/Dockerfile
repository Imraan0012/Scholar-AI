# =============================================================================
# SCHOLAR AI BACKEND — MULTI-STAGE DOCKERFILE FOR RENDER
# Stage 1: Build Java 21 Spring Boot Application using Maven
# Stage 2: Minimal Java 21 JRE Runtime
# =============================================================================

# --- Stage 1: Build ---
FROM maven:3.9.6-eclipse-temurin-21-jammy AS builder
WORKDIR /app

# Copy pom.xml and pre-fetch dependencies for cached layers
COPY pom.xml .
RUN mvn dependency:go-offline -B || true

# Copy source code
COPY src ./src

# Package production Spring Boot executable JAR
RUN mvn clean package -DskipTests -B

# --- Stage 2: Runtime ---
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Create a non-root system user for enhanced security
RUN groupadd -r scholarai && useradd -r -g scholarai scholarai

# Copy only the compiled JAR from builder stage
COPY --from=builder /app/target/scholar-ai-backend-1.0.0.jar app.jar

# Set permissions
RUN chown -R scholarai:scholarai /app
USER scholarai

# Default environment port (Render overrides this at runtime via $PORT)
ENV PORT=8000
EXPOSE 8000

# Execute Spring Boot application
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
