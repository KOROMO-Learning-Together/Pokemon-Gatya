jest.mock("./index.html");

test("test", () => {
  const test = jest.document.getElementById("root");
  expect(test).toBeInTheDocument();
});
