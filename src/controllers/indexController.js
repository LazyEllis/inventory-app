export const renderHomePage = (req, res) => res.render("index");

export const render404Page = (req, res) => {
  res
    .status(404)
    .render("error", { message: "Page Not Found", statusCode: 404 });
};
