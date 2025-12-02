# Whzan Solutions Document

This document goes hand in hand with the attached video below:

- [Assessment Demo & Explainer - video](https://drive.google.com/file/d/1SWTmGrKWwyuEYdfmyHLbyrt94s9gmCF5/view) - demo video explaining the task at hand

---

## Requirements Analysis:

I assumed CRUD operations to enable the catalog to exist firstly, which entails build a custom API or front-end local makeshift API. But due to the use of C# wihin Whzam thus I chose .NET CORE framework

Theres has to be existing products for the user to filter/sort through initially which entailed seeding the database with some product catalog

## Non-Functional Requirements

## Trade-offs

I hade time constraint trade-offs due to the size and specificity of the requierements only.
The exercise is fitting for the tools involved and more in the greater developer world

### Technology Choices

- backend:
  Made use of C# due to the mature framework for quicky creating and running an API app.
  Data is hosted in an SQS server and Databse - ensuring we are able to persist the users data across browser sessions

- frontend:
  React(with typescript) allows us to leverage the reactive paradigm embodied by this framework.
  Making use of reusable components, easy data binding, quick rendering and mature developer community, etc ...

---

### Final output:

- [AdobeXD designs of the solution](https://xd.adobe.com/view/2cbe9317-136b-4895-8c1d-c20792df7c39-79ed/) - designed by Yenzokuhle
- [Whzan Swagger Docs API](https://api.myplay360studio.co.za/swagger/index.html) - hosted on my personal AWS secure url
- [Whzan App - web app hosted on AWS S3 bucket & Cloudfront](https://d26jd7lozgfhgl.cloudfront.net/) - Give the app a spin on this secure web app

Both resources will be expired 1 month from `02 Dec 2025`

---

Thank you for the opportunity
