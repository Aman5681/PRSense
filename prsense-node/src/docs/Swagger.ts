import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PRSense',
      version: '1.0.0',
      description: 'API documentation for PRSense services',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      }
    ]
    // No components.securitySchemes or security since auth is not implemented
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
