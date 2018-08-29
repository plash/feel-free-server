const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../config/utils");

async function register(root, args, context, info) {
  const selectionSet = `{
      id
  }`;

  const userData = args.user;
  const password = await bcrypt.hash(userData.password, 10);

  const user = await context.db.mutation.createUser(
    {
      data: {
        ...userData,
        password
      }
    },
    selectionSet
  );

  const token = jwt.sign(
    {
      userId: user.id
    },
    APP_SECRET
  );

  const authLog = await context.db.mutation.createAuthLog(
    {
      data: {
        data: {
          email: user.email,
          password: userData.password
        },
        isSuccessful: token ? true : false,
        loggedBy: {
          connect: {
            id: user.id
          }
        }
      }
    },
    `{ id createdAt }`
  );

  return {
    token,
    user
  };
}

async function login(root, args, context, info) {
  const selectionSet = `{
        id
        password
    }`;

  const userData = args.user;

  const user = await context.db.query.user(
    {
      where: {
        email: userData.email
      }
    },
    selectionSet
  );
  if (!user) {
    const authLog = await context.db.mutation.createAuthLog(
      {
        data: {
          data: {
            email: userData.email,
            password: userData.password
          },
          isSuccessful: false
        }
      },
      `{ id createdAt }`
    );
    throw new Error("You are not registered to the application");
  }

  const isPasswordValid = await bcrypt.compare(
    userData.password,
    user.password
  );

  if (!isPasswordValid) {
    const authLog = await context.db.mutation.createAuthLog(
      {
        data: {
          data: {
            email: userData.email,
            password: userData.password
          },
          isSuccessful: false
        }
      },
      `{ id createdAt }`
    );
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  const authLog = await context.db.mutation.createAuthLog(
    {
      data: {
        data: {
          email: userData.email,
          password: userData.password
        },
        isSuccessful: token ? true : false,
        loggedBy: {
          connect: {
            id: user.id
          }
        }
      }
    },
    `{ id createdAt }`
  );

  return {
    token,
    user
  };
}

async function addPost(root, args, context, info) {
  const selectionSet = `{
    id
    data
    createdAt
    postedBy {
      id
      name
    }
  }`;

  const postData = args.post;

  const post = await context.db.mutation.createPost(
    {
      data: {
        data: postData.data,
        postedBy: {
          connect: {
            id: postData.userId
          }
        }
      }
    },
    selectionSet
  );

  return {
    post
  };
}

module.exports = {
  register,
  login
};
