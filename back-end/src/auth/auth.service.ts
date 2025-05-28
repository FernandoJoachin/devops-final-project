import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces';
import { ExceptionService } from 'src/common/exception.service';
import { Invitation } from './entities';
import { winstonLogger } from 'src/common/utils/loggers';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Invitation)
    private invitationsRepository: Repository<Invitation>,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly exceptionService: ExceptionService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, invitationCode, ...userData } = createUserDto;

    winstonLogger.info(`[AuthService] Attempting to register new user with email: ${userData.email}`);

    const invitation = await this.validateInvitation(invitationCode);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await queryRunner.manager.save(user);
      await queryRunner.manager.delete(Invitation, { id: invitation.id });

      await queryRunner.commitTransaction();
      await queryRunner.release();

      delete user.password;

      winstonLogger.info(`[AuthService] User registered successfully with ID: ${user.id}`);

      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      winstonLogger.error(`[AuthService] Error during user registration: ${error.message}`);
      this.exceptionService.handleDBExceptions(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    winstonLogger.debug(`[AuthService] Login attempt for email: ${email}`);

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });

    if (!user) {
      winstonLogger.warn(`[AuthService] Login failed - user not found: ${email}`);
      throw new UnauthorizedException('Credentials are not valid (email)');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      winstonLogger.warn(`[AuthService] Login failed - invalid password for user: ${email}`);
      throw new UnauthorizedException('Credentials are not valid (password)');
    }

    winstonLogger.info(`[AuthService] Login successful for user ID: ${user.id}`);

    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async createInvitation(user: User) {
    const code = this.generateRandomCode(8);
    const createInvitationDto = {
      code,
      creator: { id: user.id },
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };

    winstonLogger.info(`[AuthService] Generating invitation code for user ID: ${user.id}`);

    try {
      const invitation = this.invitationsRepository.create(createInvitationDto);
      const saved = await this.invitationsRepository.save(invitation);
      winstonLogger.info(`[AuthService] Invitation created with code: ${saved.code}`);
      return saved;
    } catch (error) {
      winstonLogger.error(`[AuthService] Error creating invitation: ${error.message}`);
      this.exceptionService.handleDBExceptions(error);
    }
  }

  private async validateInvitation(code: string) {
    winstonLogger.debug(`[AuthService] Validating invitation code: ${code}`);

    if (!code) {
      winstonLogger.warn(`[AuthService] Invitation code is missing`);
      throw new BadRequestException('Invitation code is required');
    }

    const invitation = await this.invitationsRepository.findOne({
      where: { code },
    });

    if (!invitation) {
      winstonLogger.warn(`[AuthService] Invalid or used invitation code: ${code}`);
      throw new NotFoundException('Invalid or already used invitation code');
    }

    if (invitation.expiresAt && invitation.expiresAt < new Date()) {
      winstonLogger.warn(`[AuthService] Invitation code expired: ${code}`);
      throw new UnauthorizedException('Invitation code has expired');
    }

    return invitation;
  }

  private generateRandomCode(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    winstonLogger.debug(`[AuthService] Generated JWT for payload: ${JSON.stringify(payload)}`);
    return token;
  }
}