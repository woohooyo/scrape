import { FilterQuery } from 'mongodb';
import { jwtConfig, mongoConfig } from '../config';
import { IUserAuth, UserAuth } from '../mongo/models/user-auth';

import { badRequest, notFound, unauthorized } from 'boom';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';

export class UserAuthService {
  private userAuthModel = new UserAuth(mongoConfig);

  public async addUser(user: IUserAuth) {
    const existingUser = await this.getUser({ username: user.username });
    if (existingUser) {
      badRequest(`Username[${user.username}] already exist.`);
    }
    await this.userAuthModel.insertOne({
      username: user.username,
      password: user.password,
      createdAt: new Date(),
      createdBy: 'Add User Api',
    });
    const insertedUser = await this.getUser({username: user.username});
    return {
      message: 'insert user auth success!',
      user: insertedUser,
    };
  }

  public async updateUser(user: IUserAuth) {
    const where: FilterQuery<IUserAuth> = {
      username: user.username,
      isDeleted: false,
    };
    const originUser = await this.getUser(where);
    if (!originUser) {
      throw notFound(`User whose username is [${user.username}] does not exist.`);
    }
    const updateContent: IUserAuth = {
      username: user.username,
      password: user.password,
      updatedBy: `User[${originUser._id}]`,
      updatedAt: new Date(),
    };
    await this.userAuthModel.updateOne(updateContent, where);
    const updatedUser = await this.getUser(where);
    return {
      message: 'Update user successs!',
      originUser,
      updatedUser,
    };
  }

  public async getUser(where: FilterQuery<IUserAuth>) {
    return (await this.userAuthModel.get(where))[0];
  }

  public async getToken(user: IUserAuth) {
    const DbUser = await this.getUser({ username: user.username });
    this.verifyUser(DbUser, user.password);
    return this.signToken(user);
  }

  private verifyUser(user: IUserAuth, inputPassword: string) {
    if (user.password !== inputPassword) {
      throw unauthorized('User password is invalid.');
    }
  }

  private signToken(user: IUserAuth) {
    return jwt.sign(
      Object.assign({}, user, {password: undefined}),
      user.password + jwtConfig.key,
      {
        algorithm: 'HS256',
        expiresIn: jwtConfig.expire,
      },
    );
  }
}
