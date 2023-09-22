
import { Application } from "express";
import { OpenApi } from "ts-openapi";
import swaggerUi from "swagger-ui-express";

// create an OpenApi instance to store definitions
export const openApiInstance = new OpenApi(
  "v1.0.0", // API version
  "Martian Task", // API title
  "Delivery Price Calculator - PoC", // API description
  "martin.pavic97@gmail.com" // API maintainer
);

// declare servers for the API
openApiInstance.setServers([{ url: "http://localhost:8000" }]);

// set API license
openApiInstance.setLicense(
  "Apache License, Version 2.0", // API license name
  "http://www.apache.org/licenses/LICENSE-2.0", // API license url
  "http://dummy.io/terms/" // API terms of service
);

export function initOpenApi(app: Application) {
  // generate our OpenApi schema
  const openApiJson = openApiInstance.generateJson();

  // we'll create an endpoint to reply with openapi schema
  app.get("/openapi.json", function (_req, res) {
    res.json(openApiJson);
  });
  // this will make openapi UI available with our definition
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiJson));
}