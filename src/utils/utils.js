module.exports = {
  toLowerCaseFilter: (value) => {
    return { $regex: value, $options: "i" };
  },
};
