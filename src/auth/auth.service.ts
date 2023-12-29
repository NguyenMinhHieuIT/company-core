import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../app/user/user.service';
import { LoginDto } from './dto';
import { Constants } from '../constant';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  /**
   * payload
   * @param userData
   */
  createPayload(userData) {
    const payload = {
      id: userData.id,
    };
    const accessToken = this.jwtService.sign(payload);

    return {
      success: true,
      expires_in: 420 * 60 * 60,
      access_token: accessToken,
      user: payload,
    };
  }

  showError() {
    return {
      success: false,
      error: 'Dữ liệu không hợp lệ, bạn vui lòng kiểm tra lại!',
    };
  }

  decodePayload(token) {
    return this.jwtService.decode(token);
  }

  /**
   * Login service
   * @param user
   */
  public async adminLogin(user: LoginDto): Promise<any | { status: number }> {
    return this.validateUser(user.email, user.password).then(
      async (userData) => {
        const $error = AuthService._loginError(userData);
        if ($error) {
          return {
            success: false,
            error: $error,
          };
        }

        return await this.adminCreatePayload(userData);
      },
    );
  }

  async validateUser(email: string, password: string): Promise<any> {
    const md5Password: string = UserService.md5(password);
    const user = await this.userService.findByEmail(email);
    if (user && user.password === md5Password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  /**
   * payload
   * @param userData
   */
  async adminCreatePayload(userData) {
    const permissions = [];
    const payload = {
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      age: userData.age,
      gender: userData.gender,
      code: permissions,
      id: userData.id,
    };
    const accessToken = this.jwtService.sign(payload);

    return {
      success: true,
      expires_in: 160 * 60 * 60,
      access_token: accessToken,
      user: payload,
    };
  }

  /**
   * Login error MSG
   * @param userData
   * @private
   */
  private static _loginError(userData) {
    let $error = null;
    if (!userData) {
      $error = 'Tài khoản đăng nhập của bạn không hợp lệ!';
    } else {
      switch (userData.status) {
        case Constants.status.REGISTER_STATUS:
          $error =
            'Tài khoản này chưa được kích hoạt, vui lòng liên hệ với quản trị viên để kích hoạt!';
          break;
        case Constants.status.DISABLED:
          $error =
            'Xin lỗi. Tài khoản của bạn đã bị khóa. Vui lòng liên hệ với quản trị viên để mở lại!';
          break;
        case Constants.status.DELETED:
          $error =
            'Xin lỗi. Tài khoản của bạn đã bị xóa. Vui lòng liên hệ với quản trị viên để mở lại!';
          break;
      }
    }

    return $error;
  }

  /**
   * Get profile
   * @param data
   */
  public async getProfile(data, params): Promise<any> {
    const user = await this.userService.findOneById(data, data['id'], {
      ...params,
      onlyData: true,
    });
    if (!user) {
      return this.showError();
    }
    if (user['password']) {
      delete user['password'];
    }
    return {
      success: true,
      data: user,
    };
  }
}
