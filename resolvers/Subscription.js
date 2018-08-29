function newUserSubscribe(root, args, context, info) {
  return context.db.subscription.user(
    { where: { mutation_in: ["CREATED"] } },
    info
  );
}

const newUser = {
  subscribe: newUserSubscribe
};

module.exports = {
  newUser
};
