async function users(root, args, context, info) {
  const where = args.filter
    ? {
        OR: [{ username_contains: args.filter }, { name_contains: args.filter }]
      }
    : [];

  const queriedUsers = await context.db.query.users(
    {
      where,
      skip: args.skip,
      first: args.first,
      orderBy: args.orderBy
    },
    `{ id }`
  );

  const countSelectionSet = `{
      aggregate {
          count
      }
  }`;

  const usersConnection = await context.db.query.usersConnection(
    {},
    countSelectionSet
  );

  return {
    count: usersConnection.aggregate.count,
    userIds: queriedUsers.map(user => user.id)
  };
}

module.exports = {
  users
};
