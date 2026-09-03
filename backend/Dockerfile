FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .

RUN mvn dependency:go-offline

COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre

WORKDIR /app

RUN useradd --create-home --shell /bin/bash tripwise

COPY --from=build /app/target/*.jar app.jar

RUN chown -R tripwise:tripwise /app

USER tripwise

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
