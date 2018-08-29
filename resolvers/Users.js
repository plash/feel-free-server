function users(parent, args, context, info) {
  return context.db.query.users(
    {
      where: {
        id_in: parent.userIds
      }
    },
    info
  );
}

module.exports = {
  users
};
