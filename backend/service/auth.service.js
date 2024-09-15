const UserDto = require("../dtos/user.dtos");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const tokenService = require("./token.service");
const mailService = require("./mail.service");
const BaseError = require("../errors/base.error");

class AuthService {
  async register(email, password) {
    const existUser = await userModel.findOne({ email });

    if (existUser) {
      throw BaseError.BadRequest(
        `User with existing email ${email} already registered`
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({ email, password: hashPassword });
    const userDto = new UserDto(user);
    // email service
    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/auth/activation/${userDto.id}`
    );

    // jwt generation

    const tokens = tokenService.generateTokens({ ...userDto });
    //token
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { user: userDto, ...tokens };
  }

  async activation(userId) {
    const user = await userModel.findById(userId);

    if (!user) {
      throw BaseError.BadRequest("User is not defined");
    }

    user.isActivated = true;

    await user.save();
  }

  async login(email, password) {
    const user = await userModel.findOne({ email });

    if (!user) throw BaseError.BadRequest("User is not defined");

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) throw BaseError.BadRequest("Password is incorrect!");

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { user: userDto, ...tokens };
  }
  async removeToken(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new BaseError.UnauthorizedError("Bad authorization!");
    }
    const userPayload = tokenService.validationRefreshToken(refreshToken);
    const tokenDb = await tokenService.findToken(refreshToken);
    if (!userPayload || !tokenDb) {
      throw BaseError.UnauthorizedError("Bad authorization!");
    }

    const user = await userModel.findById(userPayload.id);
    const userDto = new UserDto(user);

    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { user: userDto, ...tokens };
  }
  async getUsers() {
    const users = await userModel.find();
    return users;
  }

  async forgotPassword(email) {
    if (!email) {
      throw new BaseError.BadRequest("Email is required!");
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new BaseError.BadRequest("User with existing email is not found! ");
    }

    const userDto = new UserDto(user);

    const tokens = tokenService.generateTokens({ ...userDto });

    await mailService.sendForgotPasswordMail(
      email,
      `${process.env.CLIENT_URL}/recovery-account/${tokens.accessToken}`
    );
    return 200;
  }
  async recoveryAccount(token, password) {
    if (!token) {
      throw BaseError.BadRequest("Semething went wrong with token");
    }

    const userData = tokenService.validationAccessToken(token);

    if (!userData) {
      throw BaseError.BadRequest("Expired access to your account!");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    await userModel.findByIdAndUpdate(userData.id, { password: hashPassword });
    return 200;
  }
}

module.exports = new AuthService();
