const bodyParser = require("body-parser");
const cors = require("cors");

//
const roles = require("./rolesRoutes");
const users = require("./usersRoutes");
const entityTypes = require("./entityTypesRoutes");
const conditions = require("./conditionsRoutes");
const entities = require("./entitiesRoutes");
const noteCategories = require("./noteCategoriesRoutes");
const notes = require("./notesRoutes");

module.exports = (app) => {
  app.use(bodyParser.json());
  app.use(cors({ origin: "*" }));
  app.use(roles);
  app.use(users);
  app.use(entityTypes);
  app.use(conditions);
  app.use(entities);
  app.use(noteCategories);
  app.use(notes);
};
