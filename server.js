/**
 * This is the main Node.js server script for your project
 * Check out the two endpoints this back-end API provides in fastify.get and fastify.post below
 */

const path = require("path");
const connectDB = require('./db'); // Import MongoDB connection
const Employee = require('./models/Employee'); // Import Employee model
const fastifyPlugin = require('fastify-plugin');
const fastifyCors = require('fastify-cors');

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // Set this to true for detailed logging:
  logger: false,
});

// Connect to MongoDB
connectDB();

// Enable CORS for API requests (adjust allowed origins as needed)
fastify.register(fastifyCors, {
  origin: '*'
});


//API routes defined below
// Fastify MongoDB plugin
fastify.register(fastifyPlugin(async (fastify, opts, done) => {
  fastify.decorate('Employee', Employee);
  done();
}));

// CRUD routes
fastify.post('/employees', async (request, reply) => {
  try {
    const newEmployee = new fastify.Employee(request.body);
    await newEmployee.save();
    reply.code(201).send(newEmployee);
  } catch (err) {
    reply.code(500).send(err);
  }
});

fastify.get('/employees', async (request, reply) => {
  try {
    const employees = await fastify.Employee.find();
    reply.send(employees);
  } catch (err) {
    reply.code(500).send(err);
  }
});

fastify.get('/employees/:id', async (request, reply) => {
  try {
    const employee = await fastify.Employee.findById(request.params.id);
    if (employee) {
      reply.send(employee);
    } else {
      reply.code(404).send({ message: 'Employee not found' });
    }
  } catch (err) {
    reply.code(500).send(err);
  }
});

fastify.put('/employees/:id', async (request, reply) => {
  try {
    const updatedEmployee = await fastify.Employee.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true }
    );
    if (updatedEmployee) {
      reply.send(updatedEmployee);
    } else {
      reply.code(404).send({ message: 'Employee not found' });
    }
  } catch (err) {
    reply.code(500).send(err);
  }
});

fastify.delete('/employees/:id', async (request, reply) => {
  try {
    const deletedEmployee = await fastify.Employee.findByIdAndDelete(request.params.id);
    if (deletedEmployee) {
      reply.send({ message: 'Employee deleted' });
    } else {
      reply.code(404).send({ message: 'Employee not found' });
    }
  } catch (err) {
    reply.code(500).send(err);
  }
});


// ADD FAVORITES ARRAY VARIABLE FROM TODO HERE

// Setup our static files
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", // optional: default '/'
});

// Formbody lets us parse incoming forms
fastify.register(require("@fastify/formbody"));

// View is a templating manager for fastify
fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
});

// Load and parse SEO data
const seo = require("./src/seo.json");
if (seo.url === "glitch-default") {
  seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
}

/**
 * Our home page route
 *
 * Returns src/pages/index.hbs with data built into it
 */
fastify.get("/", function (request, reply) {
  // params is an object we'll pass to our handlebars template
  let params = { seo: seo };

  // If someone clicked the option for a random color it'll be passed in the querystring
  if (request.query.randomize) {
    // We need to load our color data file, pick one at random, and add it to the params
    const colors = require("./src/colors.json");
    const allColors = Object.keys(colors);
    let currentColor = allColors[(allColors.length * Math.random()) << 0];

    // Add the color properties to the params object
    params = {
      color: colors[currentColor],
      colorError: null,
      seo: seo,
    };
  }

  // The Handlebars code will be able to access the parameter values and build them into the page
  return reply.view("/src/pages/index.hbs", params);
});

/**
 * Our POST route to handle and react to form submissions
 *
 * Accepts body data indicating the user choice
 */
fastify.post("/", function (request, reply) {
  // Build the params object to pass to the template
  let params = { seo: seo };

  // If the user submitted a color through the form it'll be passed here in the request body
  let color = request.body.color;

  // If it's not empty, let's try to find the color
  if (color) {
    // ADD CODE FROM TODO HERE TO SAVE SUBMITTED FAVORITES

    // Load our color data file
    const colors = require("./src/colors.json");

    // Take our form submission, remove whitespace, and convert to lowercase
    color = color.toLowerCase().replace(/\s/g, "");

    // Now we see if that color is a key in our colors object
    if (colors[color]) {
      // Found one!
      params = {
        color: colors[color],
        colorError: null,
        seo: seo,
      };
    } else {
      // No luck! Return the user value as the error property
      params = {
        colorError: request.body.color,
        seo: seo,
      };
    }
  }

  // The Handlebars template will use the parameter values to update the page with the chosen color
  return reply.view("/src/pages/index.hbs", params);
});

// Run the server and report out to the logs
fastify.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);
