import path from 'path';
import fs from 'fs';
import {getRepository} from 'typeorm';
import uploadConfig from '../config/upload';
import User from '../models/User';
import AppError from '../errors/AppError';

interface Request {
  user_id: string;
  avatarFileName: string;
}

class UpdateUserAvatarService {
  public async execute({user_id, avatarFileName}: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(user_id);

    if(!user){
      throw new AppError('Only authenticated user can change avatar', 401);
    }

    if(user.avatar) {
      // Delete old avatar
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar)
      // Use fs.promises to verify if file exist. The stat method return the status of the file in the system.
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);
      // If exist, delete the file on the system using method unlink
      if(userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFileName;

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;