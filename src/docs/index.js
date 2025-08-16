const basicinfo = require("./basicinfo");
const components = require("./components");
const posts = require("./posts");
const comments = require("./comments");
const auth = require("./auth");

module.exports = {
  ...basicinfo,
  paths: {
    ...auth.paths,
    ...posts.paths,
    ...comments.paths,
  },
  components: {
    ...components.components,
  },
};


