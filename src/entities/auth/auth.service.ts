import { Repository} from "typeorm"
import { InjectRepository } from '@nestjs/typeorm';
import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { User } from '@entities/users/users.entity';
import { RegisterUserDto } from "./dto/create-user.dto";

@Injectable()
export class AuthService {
  
  
  private readonly userService: any;
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async checkPhone(phone: string) {
    const user = await this.userService.getUser(phone);
    if (user) {
      throw new ConflictException('Phone number already exists');
    }
    return 'OK';
  }

  async registerUser (registerUserDto: RegisterUserDto): Promise<User> {
    const { email, password} = registerUserDto;
    const user = await this.userRepository.findOne({ where: { email } });
    
    if(user){
        throw new ConflictException('User is already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const avatar = "Avatar URL";
    const currentThread = "Current Thread";

    const newUser =  this.userRepository.create({
        ...registerUserDto, avatar,currentThread,  password: hashedPassword
    })
    const { accessToken , refreshToken} = createToken(newUser.id)
    newUser.accessToken = accessToken;
  newUser.refreshToken = refreshToken;
    await this.userRepository.save(newUser)
    return newUser;
}
}
